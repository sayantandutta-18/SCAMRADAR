import * as THREE from 'three';

// Accurate equirectangular polygon boundaries for major world landmasses
export const CONTINENT_POLYGONS = [
  // North America
  [
    [-168, 65], [-160, 71], [-140, 70], [-130, 69], [-110, 72], [-90, 70], [-80, 73],
    [-65, 60], [-55, 52], [-60, 44], [-70, 42], [-75, 35], [-80, 25], [-82, 23],
    [-88, 16], [-92, 16], [-97, 16], [-105, 20], [-110, 23], [-115, 30], [-117, 32],
    [-124, 38], [-124, 48], [-130, 54], [-145, 60], [-165, 60], [-168, 65]
  ],
  // Greenland
  [
    [-44, 60], [-20, 70], [-18, 77], [-28, 83], [-50, 83], [-60, 76], [-50, 65], [-44, 60]
  ],
  // South America
  [
    [-76, 9], [-60, 10], [-50, 0], [-35, -5], [-35, -10], [-40, -22], [-50, -30],
    [-58, -38], [-65, -45], [-68, -55], [-75, -50], [-73, -40], [-72, -30], [-70, -18],
    [-80, -5], [-80, 2], [-76, 9]
  ],
  // Europe
  [
    [-9, 36], [-9, 43], [-1, 44], [-4, 48], [3, 51], [10, 54], [14, 54], [24, 55],
    [30, 60], [40, 60], [40, 45], [30, 46], [26, 40], [20, 38], [15, 40], [10, 44],
    [0, 40], [-5, 36], [-9, 36]
  ],
  // Scandinavia
  [
    [5, 58], [12, 56], [18, 60], [28, 70], [24, 71], [15, 68], [10, 64], [5, 58]
  ],
  // Great Britain & Ireland
  [
    [-10, 51], [-6, 51], [-1, 51], [1, 54], [0, 58], [-4, 59], [-6, 55], [-10, 54], [-10, 51]
  ],
  // Africa
  [
    [-17, 15], [-17, 21], [-6, 36], [10, 37], [25, 32], [32, 31], [35, 27], [43, 12],
    [51, 11], [42, -2], [40, -11], [35, -25], [30, -32], [26, -34], [18, -34], [12, -18],
    [9, 0], [4, 6], [-10, 5], [-17, 15]
  ],
  // Madagascar
  [
    [44, -12], [50, -13], [50, -24], [44, -25], [44, -12]
  ],
  // Arabian Peninsula
  [
    [35, 30], [44, 30], [55, 26], [60, 22], [55, 16], [45, 13], [35, 27], [35, 30]
  ],
  // Indian Subcontinent
  [
    [68, 24], [72, 30], [75, 35], [80, 35], [88, 28], [92, 24], [88, 22], [80, 13],
    [77, 8], [76, 12], [72, 19], [68, 24]
  ],
  // Sri Lanka
  [
    [80, 6], [82, 7], [82, 9], [80, 9], [80, 6]
  ],
  // Russia & Northern Eurasia
  [
    [30, 60], [40, 67], [60, 70], [80, 73], [100, 76], [125, 74], [140, 72], [170, 67],
    [180, 65], [170, 60], [160, 55], [140, 50], [120, 52], [90, 50], [60, 55], [40, 55],
    [30, 60]
  ],
  // East Asia & SE Asia
  [
    [92, 24], [100, 20], [105, 10], [108, 12], [108, 22], [118, 24], [122, 30], [121, 38],
    [128, 40], [130, 43], [140, 50], [120, 52], [92, 45], [80, 35], [92, 24]
  ],
  // Japan
  [
    [130, 31], [133, 34], [140, 36], [142, 43], [141, 45], [138, 38], [131, 32], [130, 31]
  ],
  // Indonesia
  [
    [95, 5], [105, -5], [115, -8], [125, -8], [130, -3], [125, 2], [115, 0], [105, 3], [95, 5]
  ],
  // Australia
  [
    [114, -22], [122, -16], [130, -12], [136, -12], [142, -10], [148, -20], [153, -28],
    [150, -36], [142, -38], [130, -32], [116, -34], [114, -26], [114, -22]
  ],
  // New Zealand
  [
    [172, -35], [176, -38], [178, -42], [174, -46], [168, -46], [172, -35]
  ],
  // Antarctica
  [
    [-180, -75], [180, -75], [180, -88], [-180, -88], [-180, -75]
  ]
];

// Coordinate conversion: converts (lat, lng) to 3D Cartesian coordinates on a sphere of radius R
export function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export const getRiskColorHex = (level) => {
  switch (level) {
    case 'HIGH':
      return '#ef4444';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
      return '#10b981';
    default:
      return '#06b6d4';
  }
};

export function formatScamType(type) {
  if (!type) return 'Cyber Threat';
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

let cachedWorldTexture = null;

// Procedural high-performance cyber earth texture
export function getCyberWorldTexture() {
  if (cachedWorldTexture) return cachedWorldTexture;
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Deep space background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#030814');
    bgGrad.addColorStop(0.5, '#050f22');
    bgGrad.addColorStop(1, '#030814');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Latitude & Longitude grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    // Parallels (latitude)
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = ((90 - lat) / 180) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Meridians (longitude)
    for (let lng = -150; lng <= 150; lng += 30) {
      const x = ((lng + 180) / 360) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Equator & Prime Meridian highlighted
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
    const eqY = height / 2;
    ctx.beginPath();
    ctx.moveTo(0, eqY);
    ctx.lineTo(width, eqY);
    ctx.stroke();

    const pmX = width / 2;
    ctx.beginPath();
    ctx.moveTo(pmX, 0);
    ctx.lineTo(pmX, height);
    ctx.stroke();

    // 3. Render Continents
    CONTINENT_POLYGONS.forEach((poly) => {
      if (poly.length < 3) return;

      ctx.save();
      ctx.beginPath();
      let minX = width;
      let maxX = 0;
      let minY = height;
      let maxY = 0;

      poly.forEach(([lng, lat], i) => {
        const x = ((lng + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Clip to continent shape to draw land fill and subtle dot matrix
      ctx.save();
      ctx.clip();

      // Land base fill
      ctx.fillStyle = '#081e33';
      ctx.fill();

      // Digital cyber dots pattern on land
      ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
      const step = 14;
      const startX = Math.floor(minX / step) * step;
      const startY = Math.floor(minY / step) * step;
      for (let px = startX; px <= maxX; px += step) {
        for (let py = startY; py <= maxY; py += step) {
          ctx.beginPath();
          ctx.arc(px, py, 1.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Glowing coastline stroke
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.restore();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    cachedWorldTexture = texture;
    return texture;
  } catch (err) {
    console.error('Failed to create cyber world texture:', err);
    return null;
  }
}
