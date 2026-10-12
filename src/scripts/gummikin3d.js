// Procedural crochet Gummikins built with three.js.
// Used live on the site (hero + product viewer) and offline to render
// placeholder product images until real photography is ready.
import * as THREE from 'three';

export const YARN = {
  cherry: '#9b2a2d',
  honey: '#d19a2e',
  bluebell: '#6684a6',
  moss: '#7d9466',
  rosebud: '#d88a86',
  oatmeal: '#e9dccb',
  cocoa: '#6b4a3a',
  lavender: '#a596b8',
};

const CREAM_YARN = '#f4eadb';

// Height of a single-crochet "V" stitch inside one grid cell (0..1, 0..1).
function stitch(fu, fv) {
  const lobe = (cx, angle) => {
    const dx = fu - cx;
    const dy = fv - 0.5;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const x = (dx * c - dy * s) / 0.2;
    const y = (dx * s + dy * c) / 0.46;
    const d = x * x + y * y;
    if (d >= 1) return 0;
    const t = 1 - d;
    return t * t * (3 - 2 * t);
  };
  return Math.max(lobe(0.29, 0.42), lobe(0.71, -0.42));
}

function hash(a, b) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// Displace a UV-mapped geometry along its normals with a crochet stitch pattern.
function crochet(geometry, { rows, perRow, depth, shade = 0.12, capsOnly = false }) {
  const pos = geometry.attributes.position;
  const nor = geometry.attributes.normal;
  const uv = geometry.attributes.uv;
  const colors = new Float32Array(pos.count * 3);
  const v3 = new THREE.Vector3();
  const n3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const r = uv.getY(i) * rows;
    const row = Math.floor(r);
    const fv = r - row;
    const c = uv.getX(i) * perRow + (row % 2 ? 0.5 : 0);
    const col = Math.floor(c);
    const fu = c - col;
    const h = stitch(fu, fv);
    v3.fromBufferAttribute(pos, i);
    n3.fromBufferAttribute(nor, i);
    if (!capsOnly || Math.abs(n3.y) > 0.5) v3.addScaledVector(n3, (h - 0.5) * depth);
    pos.setXYZ(i, v3.x, v3.y, v3.z);
    // Grooves between stitches read darker, like real yarn.
    const tone = 1 - shade + shade * (0.35 + 0.65 * h) + (hash(row, col % perRow) - 0.5) * 0.06;
    colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = tone;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

// Fine ply texture so the yarn catches light up close.
let plyTexture;
function getPlyTexture() {
  if (plyTexture) return plyTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = Math.random() * Math.PI;
    ctx.strokeStyle = `rgba(${100 + Math.random() * 60},${100 + Math.random() * 60},255,0.5)`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9);
    ctx.stroke();
  }
  plyTexture = new THREE.CanvasTexture(canvas);
  plyTexture.wrapS = plyTexture.wrapT = THREE.RepeatWrapping;
  plyTexture.repeat.set(10, 6);
  return plyTexture;
}

function yarnMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    vertexColors: true,
    roughness: 0.92,
    sheen: 0.45,
    sheenRoughness: 0.7,
    sheenColor: new THREE.Color('#f3e6d6'),
    normalMap: getPlyTexture(),
    normalScale: new THREE.Vector2(0.35, 0.35),
  });
}

// Gumdrop silhouette: wide soft base, round dome, gentle top.
function bodyGeometry({ squat = 1, pointy = 0 } = {}) {
  const g = new THREE.SphereGeometry(1, 220, 160);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    let y = v.y;
    // Flatten the bottom so it sits.
    if (y < -0.72) y = -0.72 - (y + 0.72) * 0.3;
    // Widen the lower half a little.
    const widen = 1 + 0.08 * Math.max(0, 0.2 - y) - pointy * Math.max(0, y) * 0.55;
    v.x *= widen;
    v.z *= widen * 0.96;
    v.y = y * 0.92 * squat + pointy * Math.max(0, y) ** 3 * 0.45;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function surfacePoint(mesh, x, y) {
  const ray = new THREE.Raycaster(new THREE.Vector3(x, y, 5), new THREE.Vector3(0, 0, -1));
  const hit = ray.intersectObject(mesh, false)[0];
  return hit ? hit.point : new THREE.Vector3(x, y, 0.9);
}

function smileColorFor(color) {
  const c = new THREE.Color(color);
  const l = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  return l > 0.55 ? '#5b4032' : CREAM_YARN;
}

function addFace(group, body, { eyeY = 0.12, eyeX = 0.36, smileY = -0.12, scale = 1, color } = {}) {
  body.updateMatrixWorld(true);
  const eyeMat = new THREE.MeshPhysicalMaterial({
    color: '#141010',
    roughness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  });
  const eyeGeo = new THREE.SphereGeometry(0.075 * scale, 32, 24);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    const pnt = surfacePoint(body, side * eyeX, eyeY);
    eye.position.copy(pnt).multiplyScalar(1.005);
    eye.scale.set(1, 1.05, 0.7);
    eye.castShadow = true;
    group.add(eye);
  }
  // Embroidered smile in cream yarn.
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const x = (t - 0.5) * 0.62;
    const y = smileY - Math.sin(t * Math.PI) * 0.1;
    const s = surfacePoint(body, x, y);
    pts.push(s.multiplyScalar(1.012));
  }
  const smile = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.026 * scale, 10, false),
    new THREE.MeshPhysicalMaterial({ color: smileColorFor(color), roughness: 0.85, sheen: 1, sheenColor: new THREE.Color('#ffffff') })
  );
  group.add(smile);
  return smile.material;
}

function contactShadow(radius = 1.5, opacity = 0.32) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(60,38,28,${opacity})`);
  grad.addColorStop(0.55, `rgba(60,38,28,${opacity * 0.35})`);
  grad.addColorStop(1, 'rgba(60,38,28,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

// Build one plush. Returns { group, setColor, body }.
export function createPlush(kind = 'gummikin', color = YARN.cherry) {
  const group = new THREE.Group();
  const materials = [];
  let smileMat;
  const mat = () => {
    const m = yarnMaterial(color);
    materials.push(m);
    return m;
  };

  if (kind === 'nest') {
    // A cosy crocheted nest blanket with a little Gummikins tucked inside.
    const ring = crochet(new THREE.TorusGeometry(1.15, 0.4, 90, 240), { rows: 22, perRow: 110, depth: 0.035 });
    const nest = new THREE.Mesh(ring, mat());
    nest.rotation.x = Math.PI / 2;
    nest.scale.set(1, 1, 0.72);
    nest.position.y = -0.3;
    const base = crochet(new THREE.CircleGeometry(1.2, 160), { rows: 30, perRow: 90, depth: 0.03 });
    const floor = new THREE.Mesh(base, mat());
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.58;
    group.add(nest, floor);
    const tiny = createPlush('gummikin', YARN.cherry);
    tiny.group.scale.setScalar(0.66);
    tiny.group.position.set(0, 0.02, 0.1);
    tiny.group.children[tiny.group.children.length - 1].visible = false;
    group.add(tiny.group);
  } else if (kind === 'blanket') {
    // A folded square of chunky texture.
    const geo = crochet(new THREE.BoxGeometry(2.4, 0.22, 2.4, 160, 4, 160), { rows: 40, perRow: 40, depth: 0.05, capsOnly: true });
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      p.setY(i, p.getY(i) + Math.sin(x * 1.6) * 0.06 + Math.cos(z * 1.3) * 0.05);
    }
    geo.computeVertexNormals();
    for (let k = 0; k < 3; k++) {
      const layer = new THREE.Mesh(geo, mat());
      layer.position.y = -0.55 + k * 0.24;
      layer.rotation.y = k * 0.06 - 0.06;
      layer.scale.setScalar(1 - k * 0.04);
      group.add(layer);
    }
  } else {
    const pointy = kind === 'drop' ? 0.5 : 0;
    const geo = crochet(bodyGeometry({ pointy }), { rows: 34, perRow: 72, depth: 0.028 });
    const body = new THREE.Mesh(geo, mat());
    body.castShadow = true;
    group.add(body);
    smileMat = addFace(group, body, kind === 'drop' ? { eyeY: -0.12, eyeX: 0.3, smileY: -0.3, scale: 0.9, color } : { color });
    if (kind === 'keychain') {
      const metal = new THREE.MeshStandardMaterial({ color: '#c9a86a', metalness: 1, roughness: 0.28 });
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 16, 48), metal);
      loop.position.y = 0.92;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 16, 96), metal);
      ring.position.set(0, 1.45, 0);
      ring.rotation.y = Math.PI / 2;
      const links = [];
      for (let i = 0; i < 2; i++) {
        const link = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.022, 12, 32), metal);
        link.position.y = 1.0 + i * 0.12;
        link.rotation.y = i % 2 ? Math.PI / 2 : 0;
        links.push(link);
      }
      group.add(loop, ring, ...links);
    }
  }

  const shadow = contactShadow(kind === 'nest' || kind === 'blanket' ? 2.2 : 1.45);
  shadow.position.y = kind === 'nest' ? -0.6 : kind === 'blanket' ? -0.68 : -0.68;
  group.add(shadow);

  return {
    group,
    setColor(c) {
      for (const m of materials) m.color.set(c);
      if (smileMat) smileMat.color.set(smileColorFor(c));
    },
  };
}

export function createStage(canvas, { transparent = true, fov = 30, preserve = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: transparent,
    preserveDrawingBuffer: preserve,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 50);
  camera.position.set(0, 0.35, 6);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight('#fff6ea', '#8c9f7a', 1.35));
  const key = new THREE.DirectionalLight('#fff1dc', 2.4);
  key.position.set(2.5, 4, 3.5);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#ffd9b8', 1.4);
  rim.position.set(-3, 2, -3);
  scene.add(rim);
  const fill = new THREE.DirectionalLight('#dfeaf2', 0.5);
  fill.position.set(-2, 0, 4);
  scene.add(fill);

  const resize = () => {
    const w = canvas.clientWidth || canvas.width;
    const h = canvas.clientHeight || canvas.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  return { renderer, scene, camera, resize };
}
