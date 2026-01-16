
import * as THREE from 'three';
import { TOKENS } from '../core/tokens';
function lineMat(alpha: number) { return new THREE.LineBasicMaterial({ color: TOKENS.colors.stroke, transparent: true, opacity: alpha }); }
export function makeOnionWheel() {
  const g = new THREE.Group(); const rings = 12;
  for (let i = 0; i < rings; i++) {
    // Spherical distribution: rings get closer together at the edge (like a sphere viewed from top)
    // t goes from 0 to PI/2
    const t = (i / (rings - 1)) * (Math.PI / 2);
    const r = Math.sin(t) * 2.5;

    // Alpha falls off at the edge to soften the "sphere" limit
    const alpha = 0.35 * Math.cos(t) + 0.05;

    const pts: THREE.Vector3[] = []; const seg = 180;
    for (let k = 0; k <= seg; k++) {
      const a = (k / seg) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(alpha)));
  }
  const spokes = 12;
  for (let s = 0; s < spokes; s++) {
    const a = (s / spokes) * Math.PI * 2;
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2)]), lineMat(0.10)));
  }
  g.rotation.x = -Math.PI / 2; g.position.y = 0.002; return g;
}
export function makeSpiralSpring() {
  const g = new THREE.Group(); const turns = 6, height = 2.6, radius = 1.1; const pts: THREE.Vector3[] = []; const seg = 360;
  for (let i = 0; i <= seg; i++) { const t = i / seg; const ang = t * Math.PI * 2 * turns; const y = (t - 0.5) * height; pts.push(new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const tube = new THREE.TubeGeometry(curve, 300, 0.02, 10, false);
  g.add(new THREE.Mesh(tube, new THREE.MeshBasicMaterial({ color: TOKENS.colors.stroke, transparent: true, opacity: 0.35 })));
  g.position.set(0, 1.6, 0); return g;
}
export function makeAxisMundi() {
  const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -18, 0), new THREE.Vector3(0, 18, 0)]);
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: TOKENS.colors.stroke, transparent: true, opacity: 0.18 }));
}
