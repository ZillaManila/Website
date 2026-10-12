// Browser entry used by render-placeholders.mjs.
import { createPlush, createStage, YARN } from '../src/scripts/gummikin3d.js';

window.renderPlush = ({ kind, color, yaw = -0.35, pitch = 0, zoom = 1, x = 0, extras = [] }) => {
  const canvas = document.getElementById('c');
  const { renderer, scene, camera } = createStage(canvas, { preserve: true });
  renderer.setPixelRatio(1);
  renderer.setSize(canvas.width, canvas.height, false);
  const items = [{ kind, color, x, s: 1, yaw }, ...extras];
  for (const it of items) {
    const p = createPlush(it.kind, YARN[it.color] || it.color);
    p.group.position.set(it.x || 0, ((it.s || 1) - 1) * 0.5, it.z || 0);
    p.group.scale.setScalar(it.s || 1);
    p.group.rotation.y = it.yaw ?? yaw;
    scene.add(p.group);
  }
  camera.position.set(0, 0.6 + pitch, 6 / zoom);
  camera.lookAt(0, kind === 'keychain' ? 0.35 : 0, 0);
  renderer.render(scene, camera);
  return true;
};
