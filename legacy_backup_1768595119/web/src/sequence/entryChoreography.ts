
import * as THREE from 'three';
import { ease } from '../core/curves';

export type EntryPhase = 'VOID' | 'WHEEL' | 'SPIRAL' | 'AXIS_FLY' | 'BLACK' | 'MANDALA' | 'FLOOR_A' | 'FLOOR_B' | 'FLOOR_C';

export class EntryChoreography {
  t = 0; phase: EntryPhase = 'VOID'; fade01 = 0; snap01 = 0;

  update(dt: number) {
    this.t += dt; const t = this.t;
    if (t < 6) this.phase = 'VOID';
    else if (t < 14) this.phase = 'WHEEL';
    else if (t < 22) this.phase = 'SPIRAL';
    else if (t < 28) this.phase = 'AXIS_FLY';
    else if (t < 30) this.phase = 'BLACK';
    else if (t < 36) this.phase = 'MANDALA';
    else if (t < 40) this.phase = 'FLOOR_A';
    else if (t < 44) this.phase = 'FLOOR_B';
    else if (t < 48) this.phase = 'FLOOR_C';
    else this.phase = 'FLOOR_C';

    this.fade01 = 0;
    if (this.phase === 'AXIS_FLY') { const u = (t - 22) / 6; this.fade01 = ease.cubicIn(Math.max(0, Math.min(1, u))) * 0.65; }
    if (this.phase === 'BLACK') this.fade01 = 1.0;
    if (this.phase === 'MANDALA') { const u = (t - 30) / 6; this.fade01 = 1.0 - ease.cubicOut(Math.max(0, Math.min(1, u))); }

    this.snap01 = 0;
    // Sharper snap: transition over 0.8s instead of 1.2s, and start slightly later for impact
    if (this.phase === 'MANDALA') { const u = (t - 34.4) / 0.8; this.snap01 = ease.quartOut(Math.max(0, Math.min(1, u))); }

    return this.phase;
  }

  applyCamera(camera: THREE.PerspectiveCamera) {
    const t = this.t;
    if (this.phase === 'VOID') { camera.position.set(0, 0.9, 8.5); camera.lookAt(0, 0, 0); camera.rotation.z = 0; return; }
    if (this.phase === 'WHEEL') { const e = ease.cubicInOut(Math.max(0, Math.min(1, (t - 6) / 8))); camera.position.set(0, 2.2, ease.lerp(10.0, 6.5, e)); camera.lookAt(0, 0, 0); camera.rotation.z = 0; return; }
    if (this.phase === 'SPIRAL') { const e = ease.cubicInOut(Math.max(0, Math.min(1, (t - 14) / 8))); camera.position.set(0, ease.lerp(2.2, 2.8, e), ease.lerp(6.5, 4.2, e)); camera.lookAt(0, 0, 0); camera.rotation.z = THREE.MathUtils.degToRad(ease.lerp(0, 4, e)); return; }
    // AXIS_FLY: Start closer, go deeper (-30), cubicIn for acceleration feeling
    if (this.phase === 'AXIS_FLY') { const e = ease.cubicIn(Math.max(0, Math.min(1, (t - 22) / 6))); camera.position.set(0, 0.6, ease.lerp(3.0, -30.0, e)); camera.lookAt(0, 0, 0); camera.rotation.z = 0; return; }
    if (this.phase === 'BLACK') { camera.position.set(0, 0.6, -30.0); camera.lookAt(0, 0, 0); camera.rotation.z = 0; return; }
    if (this.phase === 'MANDALA') { const e = ease.cubicOut(Math.max(0, Math.min(1, (t - 30) / 6))); camera.position.set(0, ease.lerp(1.2, 2.2, e), ease.lerp(7.2, 6.5, e)); camera.lookAt(0, 0, 0); camera.rotation.z = 0; return; }
    camera.position.set(0, 2.2, 6.5); camera.lookAt(0, 0, 0); camera.rotation.z = 0;
  }

  applyEntryObjects(onion: THREE.Group, spring: THREE.Group, axis: THREE.Line) {
    const t = this.t; onion.visible = false; spring.visible = false; axis.visible = false;
    if (this.phase === 'WHEEL') { onion.visible = true; onion.rotation.y = (t - 6) * 0.35; const s = 0.85 + 0.15 * ease.cubicOut(Math.min(1, (t - 6) / 1.2)); onion.scale.setScalar(s); onion.rotation.x = -Math.PI / 2; onion.position.y = 0.002; }
    if (this.phase === 'SPIRAL') {
      onion.visible = true; spring.visible = true;
      // Slower unwind for legibility: cubicOut instead of InOut
      const e = ease.cubicOut(Math.max(0, Math.min(1, (t - 14) / 8)));
      onion.rotation.y = (t - 6) * 0.35 + e * 1.2;
      onion.rotation.x = -Math.PI / 2 + e * (Math.PI / 2);
      onion.position.y = 0.002 + e * 0.8;
      spring.position.set(0, 1.6, 0);
      spring.rotation.y = e * 1.2;
      spring.scale.setScalar(0.85 + 0.25 * e);
      (spring.children[0] as any).material.opacity = 0.10 + 0.25 * e;
    }
    if (this.phase === 'AXIS_FLY') {
      axis.visible = true; spring.visible = true;
      const e = ease.cubicInOut(Math.max(0, Math.min(1, (t - 22) / 6)));
      spring.scale.setScalar(1.1);
      spring.rotation.y = 1.2 + e * 0.6;
      spring.position.y = 1.6 - e * 1.4;
      (spring.children[0] as any).material.opacity = 0.35 * (1.0 - e * 0.7);
    }
  }
}
