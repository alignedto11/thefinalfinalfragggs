
import * as THREE from 'three';
import { TOKENS } from '../core/tokens';
import { makeMandalaShaderMaterial } from './mandalaShader';

export type UniformPack = { time: number; coherence: number; tensionN: number; noiseAmp: number; cyanIntensity: number; phase: number; parked01: number; snap01: number; };

export class TileField {
  group = new THREE.Group();
  user: THREE.Mesh; userUniforms: any;
  family: THREE.Mesh[] = [];
  ghosts: THREE.InstancedMesh;
  private iride = 0; private irideT = 0;
  private stage: 'A' | 'B' | 'C' = 'A';

  constructor() {
    const plane = new THREE.PlaneGeometry(1, 1, 1, 1);
    const { material, uniforms } = makeMandalaShaderMaterial();
    this.userUniforms = uniforms;
    this.user = new THREE.Mesh(plane, material);
    this.user.rotation.x = -Math.PI / 2;
    this.group.add(this.user);


    // Custom Shader for Ghosts
    const ghostMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        u_time: { value: 0 },
        u_opacity: { value: 0 },
        u_coherence: { value: 0.5 },
        u_color: { value: new THREE.Color(TOKENS.colors.stroke) }
      },
      vertexShader: `
        attribute float a_state; // 0=Calm, 1=Erratic, 2=Parked
        attribute float a_phase;
        varying vec2 vUv;
        varying float vState;
        uniform float u_time;
        
        // Pseudo-random function
        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        void main() {
          vUv = uv;
          vState = a_state;
          
          vec3 pos = position;
          
          // Motion Logic
          if (a_state < 0.5) { // CALM
            // Gentle breathing
            float breathe = sin(u_time * 0.5 + a_phase) * 0.05;
            pos.y += breathe;
            // Slight scale pulse
            pos.x *= 1.0 + breathe * 0.5;
            pos.z *= 1.0 + breathe * 0.5;
          } 
          else if (a_state < 1.5) { // ERRATIC
            // Jitter
            float jitSpeed = 15.0;
            float jx = hash(u_time * jitSpeed + a_phase) - 0.5;
            float jy = hash(u_time * jitSpeed + a_phase + 12.34) - 0.5;
            pos.x += jx * 0.03;
            pos.z += jy * 0.03;
            pos.y += hash(u_time * 2.0 + a_phase) * 0.02;
          }
          else { // PARKED
            // Lower and static
            pos.y -= 0.15;
          }

          vec4 mvPosition = instanceMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        uniform float u_opacity;
        varying vec2 vUv;
        varying float vState;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          
          // Simple ring texture
          float ring = smoothstep(0.6, 0.65, r) * smoothstep(0.95, 0.9, r);
          
          // Inner dot for parked
          float dot = smoothstep(0.2, 0.15, r);
          
          float alpha = 0.0;
          
          if (vState > 1.5) { // PARKED
             // Dimmer, mostly dot
             alpha = (ring * 0.1 + dot * 0.2) * u_opacity * 0.5;
          } else {
             // Active (Calm/Erratic)
             alpha = ring * u_opacity;
             // Add inner ring for Erratic
             if (vState > 0.5 && vState < 1.5) {
                alpha += smoothstep(0.4, 0.35, r) * smoothstep(0.3, 0.35, r) * u_opacity;
             }
          }

          gl_FragColor = vec4(u_color, alpha);
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(0.9, 0.9);
    this.ghosts = new THREE.InstancedMesh(geometry, ghostMat, count);
    this.ghosts.rotation.x = -Math.PI / 2;
    this.ghosts.frustumCulled = false; // Important for shader displacement

    // Add Attributes
    const states = new Float32Array(count);
    const phases = new Float32Array(count);

    const m = new THREE.Matrix4(); let i = 0; const R = 20;
    for (let x = -R; x <= R; x++) {
      for (let z = -R; z <= R; z++) {
        if (i >= count) break; if (x === 0 && z === 0) continue;
        m.makeTranslation(x, 0.001, z);
        this.ghosts.setMatrixAt(i, m);

        // Assign states: 60% Calm, 25% Parked, 15% Erratic
        const r = Math.random();
        if (r < 0.60) states[i] = 0; // Calm
        else if (r < 0.85) states[i] = 2; // Parked
        else states[i] = 1; // Erratic

        phases[i] = Math.random() * Math.PI * 2;

        i++;
      }
    }

    this.ghosts.geometry.setAttribute('a_state', new THREE.InstancedBufferAttribute(states, 1));
    this.ghosts.geometry.setAttribute('a_phase', new THREE.InstancedBufferAttribute(phases, 1));

    this.ghosts.count = i;
    this.group.add(this.ghosts);
  }

  // Support for Interaction
  getTilePosition(id: number): THREE.Vector3 {
    if (id === -1) return this.user.position.clone();
    const m = new THREE.Matrix4();
    this.ghosts.getMatrixAt(id, m);
    return new THREE.Vector3().setFromMatrixPosition(m);
  }

  getTileState(id: number): number {
    if (id === -1) return 0; // User is calm/active
    return this.ghosts.geometry.getAttribute('a_state').getX(id);
  }

  setStage(stage: 'A' | 'B' | 'C') { this.stage = stage; }

  seedFamily(count: number) {
    for (const m of this.family) this.group.remove(m);
    this.family = [];
    if (count <= 0) return;
    const base = makeMandalaShaderMaterial().material;
    const geo = new THREE.PlaneGeometry(1, 1, 1, 1);
    const n = Math.min(count, 16);
    for (let i = 0; i < n; i++) {
      const mesh = new THREE.Mesh(geo, (base as THREE.ShaderMaterial).clone());
      mesh.rotation.x = -Math.PI / 2;
      const a = (i / n) * Math.PI * 2;
      const rr = 2.4 + (i % 4) * 0.55;
      mesh.position.set(Math.cos(a) * rr, 0.0008, Math.sin(a) * rr);
      (mesh.material as THREE.ShaderMaterial).transparent = true;
      (mesh.material as THREE.ShaderMaterial).opacity = 0.0;
      this.family.push(mesh); this.group.add(mesh);
    }
  }

  userInputPulse() { this.iride = 1; this.irideT = 0; }

  update(u: UniformPack, dt: number) {
    const ghostTarget = this.stage === 'C' ? TOKENS.opacity.ghost : 0.0;
    const gm = (this.ghosts.material as THREE.ShaderMaterial).uniforms;
    // Fade opacity uniform
    gm.u_opacity.value += (ghostTarget - gm.u_opacity.value) * (1 - Math.exp(-dt / 0.25));
    gm.u_time.value = u.time;
    gm.u_coherence.value = u.coherence;

    const famTarget = (this.stage === 'B' || this.stage === 'C') ? 1.0 : 0.0;
    for (const m of this.family) {
      const mat = (m.material as THREE.ShaderMaterial);
      mat.opacity += (famTarget - mat.opacity) * (1 - Math.exp(-dt / 0.35));
    }

    this.userUniforms.u_time.value = u.time;
    this.userUniforms.u_coherence.value = u.coherence;
    this.userUniforms.u_tensionN.value = u.tensionN;
    this.userUniforms.u_noiseAmp.value = u.noiseAmp;
    this.userUniforms.u_cyanIntensity.value = u.cyanIntensity;
    this.userUniforms.u_phase.value = u.phase;
    this.userUniforms.u_snap.value = u.snap01;
    this.userUniforms.u_parked.value = u.parked01;

    let ir = 0;
    if (this.iride > 0) {
      this.irideT += dt;
      const atk = TOKENS.iridescence.attack, hold = TOKENS.iridescence.hold, dec = TOKENS.iridescence.decay;
      if (this.irideT < atk) ir = this.irideT / atk;
      else if (this.irideT < atk + hold) ir = 1;
      else { const t = (this.irideT - (atk + hold)) / dec; ir = Math.max(0, 1 - t); }
      if (ir <= 0) { this.iride = 0; this.irideT = 0; }
    }
    this.userUniforms.u_iridescence.value = ir;

    const s = 1.0 + 0.06 * (u.coherence - 0.5);
    this.user.scale.setScalar(s);
    this.user.rotation.z = (1 - u.parked01) * 0.12 * Math.sin(u.phase * 0.6);

    for (const m of this.family) {
      const mu = (m.material as THREE.ShaderMaterial).uniforms as any;
      mu.u_time.value = u.time;
      mu.u_coherence.value = Math.max(0, Math.min(1, u.coherence * 0.92));
      mu.u_tensionN.value = u.tensionN;
      mu.u_noiseAmp.value = u.noiseAmp * 0.85;
      mu.u_cyanIntensity.value = u.cyanIntensity * 0.55;
      mu.u_phase.value = u.phase + 0.6;
      mu.u_iridescence.value = 0.0;
      mu.u_snap.value = u.snap01 * 0.7;
      mu.u_parked.value = u.parked01;
      m.scale.setScalar(0.82);
    }
  }
}
