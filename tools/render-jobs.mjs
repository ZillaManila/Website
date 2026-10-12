// Placeholder product renders. Replace with real photography when ready.
const products = {
  'keychain-gummikins': { kind: 'keychain', colors: ['cherry', 'honey', 'bluebell', 'moss', 'rosebud'] },
  'small-gummikins': { kind: 'gummikin', colors: ['cherry', 'honey', 'bluebell', 'oatmeal', 'lavender'] },
  'medium-gummikins': { kind: 'gummikin', colors: ['cherry', 'bluebell', 'moss', 'cocoa'] },
  'large-gummikins': { kind: 'gummikin', colors: ['cherry', 'bluebell', 'honey'] },
  'giant-gummikins': { kind: 'gummikin', colors: ['cherry'] },
  'nest-blanket': { kind: 'nest', colors: ['oatmeal', 'moss', 'rosebud'], pitch: 2.2 },
  'texture-square': { kind: 'blanket', colors: ['bluebell', 'honey', 'lavender'], pitch: 1.8 },
};

const jobs = [];
for (const [slug, p] of Object.entries(products)) {
  for (const color of p.colors) {
    jobs.push({ name: `${slug}-${color}`, kind: p.kind, color, yaw: -0.18, pitch: p.pitch || 0 });
  }
  const first = p.colors[0];
  jobs.push({ name: `${slug}-side`, kind: p.kind, color: first, yaw: 0.85, pitch: p.pitch || 0 });
  jobs.push({ name: `${slug}-top`, kind: p.kind, color: first, yaw: -0.55, pitch: (p.pitch || 0) + 1.3, zoom: 1.15 });
}

// Scene shots for the home page and size guide.
jobs.push({
  name: 'family',
  kind: 'gummikin',
  color: 'cherry',
  yaw: 0.15,
  zoom: 0.62,
  x: -0.75,
  extras: [
    { kind: 'gummikin', color: 'honey', x: 0.6, z: 0.6, s: 0.6, yaw: -0.15 },
    { kind: 'gummikin', color: 'bluebell', x: 1.95, z: -0.2, s: 0.92, yaw: -0.35 },
    { kind: 'gummikin', color: 'moss', x: -2.25, z: 0.5, s: 0.5, yaw: 0.35 },
  ],
});
jobs.push({ name: 'little-drop', kind: 'drop', color: 'rosebud', yaw: -0.2, zoom: 1 });
for (const c of ['cherry', 'honey', 'bluebell', 'moss', 'rosebud', 'oatmeal', 'cocoa', 'lavender']) {
  jobs.push({ name: `hero-${c}`, kind: 'gummikin', color: c, yaw: -0.12 });
}
export default jobs;
