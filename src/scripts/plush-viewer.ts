// Mounts live 3D Gummikins into any element with [data-plush3d].
//   data-kind   gummikin | keychain | nest | blanket
//   data-color  hex color
//   data-mode   hero | viewer | sizes
// Listens for `plush:color` (detail: hex) and `plush:scale` (detail: number).
// The static <img> inside stays visible until WebGL is ready, and remains
// the fallback when WebGL is unavailable.

type Mode = 'hero' | 'viewer' | 'sizes';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function burstHearts(host: HTMLElement, x: number, y: number) {
  if (reduceMotion) return;
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span');
    h.className = 'plush-heart';
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const d = 60 + Math.random() * 60;
    h.style.left = `${x}px`;
    h.style.top = `${y}px`;
    h.style.setProperty('--dx', `${Math.cos(a) * d}px`);
    h.style.setProperty('--dy', `${Math.sin(a) * d}px`);
    h.style.setProperty('--r', `${(Math.random() - 0.5) * 50}deg`);
    h.style.color = ['#d68c87', '#d4a64f', '#8c9f7a', '#9db7c6'][i % 4];
    h.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-7.5-10.4A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.5 2.6C19.5 16.4 12 21 12 21Z"/></svg>';
    host.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

async function mount(host: HTMLElement) {
  const { createPlush, createStage } = await import('./gummikin3d.js');
  const mode = (host.dataset.mode || 'viewer') as Mode;
  const kind = host.dataset.kind || 'gummikin';
  const canvas = document.createElement('canvas');
  canvas.className = 'plush3d__canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', host.dataset.label || 'A 3D Gummikins you can spin and squish');
  host.appendChild(canvas);

  const { renderer, scene, camera, resize } = createStage(canvas);
  const plush = createPlush(kind, host.dataset.color || '#9b2a2d');
  const pivot = new (await import('three')).Group();
  pivot.add(plush.group);
  scene.add(pivot);

  const framing = kind === 'keychain' ? { y: 0.45, z: 7.2 } : kind === 'nest' ? { y: 0.6, z: 7.4 } : kind === 'blanket' ? { y: 1.2, z: 7.6 } : { y: 0.15, z: 6 };
  camera.position.set(0, framing.y + 0.4, framing.z);
  camera.lookAt(0, framing.y * 0.4, 0);

  // State
  let yaw = mode === 'hero' ? -0.5 : -0.2;
  let yawVel = 0;
  let tiltX = 0;
  let tiltTarget = 0;
  let leanTarget = 0;
  let lean = 0;
  let squish = 0;
  let squishVel = 0;
  let scale = Number(host.dataset.scale || 1);
  let scaleTarget = scale;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let downX = 0;
  let downY = 0;
  let visible = true;
  let t = 0;

  const onResize = () => resize();
  new ResizeObserver(onResize).observe(host);

  host.addEventListener('plush:color', ((e: CustomEvent<string>) => {
    plush.setColor(e.detail);
    squishVel += 3;
  }) as EventListener);
  host.addEventListener('plush:scale', ((e: CustomEvent<number>) => {
    scaleTarget = e.detail;
  }) as EventListener);

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = downX = e.clientX;
    lastY = downY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    host.classList.add('is-grabbing');
  });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    if (dragging) {
      const dx = e.clientX - lastX;
      yawVel = dx * 0.012;
      yaw += dx * 0.012;
      tiltTarget = Math.max(-0.4, Math.min(0.4, tiltTarget + (e.clientY - lastY) * 0.004));
      lastX = e.clientX;
      lastY = e.clientY;
    } else if (e.pointerType === 'mouse') {
      leanTarget = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
      tiltTarget = ((e.clientY - r.top) / r.height - 0.5) * 0.18;
    }
  });
  const endDrag = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    host.classList.remove('is-grabbing');
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (moved < 6) {
      // A tap: squish!
      squishVel += 9;
      const r = host.getBoundingClientRect();
      burstHearts(host, e.clientX - r.left, e.clientY - r.top);
      host.dispatchEvent(new CustomEvent('plush:squished', { bubbles: true }));
    }
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => {
    leanTarget = 0;
    if (!dragging) tiltTarget = 0;
  });
  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') yawVel -= 0.15;
    if (e.key === 'ArrowRight') yawVel += 0.15;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      squishVel += 9;
    }
  });
  canvas.tabIndex = 0;

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestAnimationFrame(loop);
  }).observe(host);

  let prev = performance.now();
  function loop(now: number) {
    if (!visible) return;
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    t += dt;

    if (!dragging) {
      yaw += yawVel;
      yawVel *= 0.92;
      if (!reduceMotion && Math.abs(yawVel) < 0.002) yaw += dt * (mode === 'sizes' ? 0.25 : 0.18);
    }
    tiltX += (tiltTarget - tiltX) * 0.08;
    lean += (leanTarget - lean) * 0.06;
    if (!dragging) tiltTarget *= 0.98;

    // Spring squish: stiff enough to bounce, damped enough to settle softly.
    const k = 140;
    const c = 9;
    squishVel += (-k * squish - c * squishVel) * dt;
    squish += squishVel * dt;
    squish = Math.max(-0.25, Math.min(0.35, squish));

    scale += (scaleTarget - scale) * 0.1;

    const breathe = reduceMotion ? 0 : Math.sin(t * 2.1) * 0.012;
    const bob = reduceMotion ? 0 : Math.sin(t * 1.4) * 0.04;
    plush.group.rotation.y = yaw;
    pivot.rotation.x = tiltX;
    pivot.rotation.z = -lean * 0.4;
    const sy = 1 - squish * 0.55 + breathe;
    const sxz = 1 + squish * 0.35 - breathe * 0.5;
    pivot.scale.set(sxz * scale, sy * scale, sxz * scale);
    pivot.position.y = -0.62 * (1 - sy * scale) + bob * (mode === 'hero' ? 1 : 0.4);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame((n) => {
    prev = n;
    host.classList.add('is-live');
    loop(n);
  });
}

export function initPlushViewers() {
  if (!webglOK()) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        mount(e.target as HTMLElement).catch((err) => console.warn('3D viewer unavailable', err));
      }
    },
    { rootMargin: '200px' }
  );
  document.querySelectorAll<HTMLElement>('[data-plush3d]').forEach((el) => io.observe(el));
}

initPlushViewers();
