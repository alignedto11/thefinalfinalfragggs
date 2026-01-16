
import * as THREE from 'three';
import { makeFloorGrid } from './renderer/floorGrid';
import { TileField } from './renderer/tileField';
import { curves } from './core/curves';
import { CameraController } from './renderer/cameraController';
import { RenderConfig } from './core/types';
import { EntryChoreography } from './sequence/entryChoreography';
import { makeOnionWheel, makeSpiralSpring, makeAxisMundi } from './renderer/entryObjects';

const btn = document.getElementById('enter') as HTMLButtonElement;
const modeEl = document.getElementById('mode')!;
const fadeEl = document.getElementById('fade') as HTMLDivElement;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 260);
const clock = new THREE.Clock();
const camCtl = new CameraController();

const choreo = new EntryChoreography();

// Interaction & Overlays
import { InteractionController } from './renderer/interactionController';
import { OverlaySystem } from './renderer/overlaySystem';

const overlaySys = new OverlaySystem();
scene.add(overlaySys.group);

scene.add(makeFloorGrid());
const field = new TileField();

scene.add(field.group);

const interaction = new InteractionController(camera, field, renderer.domElement);

let cubeMix = 0;

interaction.onSelect = (id) => {
  if (id === null) {
    overlaySys.hide();
  } else {
    cubeMix = 0; // Reset state
    const pos = field.getTilePosition(id);
    const state = field.getTileState(id);

    // Simulate data-driven diversity
    const famCount = 2 + Math.floor(Math.random() * 4);
    overlaySys.generateFamilyRings(famCount);

    overlaySys.show(pos, state);
  }
};

interaction.onDrag = (delta) => {
  // Map horizontal drag to morph ratio
  cubeMix += delta * 2.5;
  cubeMix = Math.max(0, Math.min(1, cubeMix));
  overlaySys.setGiftShadowRatio(cubeMix);
};

const onion = makeOnionWheel();
const spring = makeSpiralSpring();
const axis = makeAxisMundi();
scene.add(onion, spring, axis);

let cfg: RenderConfig = { version: 'v1', state: { mode: 'FORMATION', coherence: 0.55, tension: 0.2, phase: 0, velocity: 0 }, camera: { mode: 'FLOOR' }, lod: { nearRadius: 2, midRadius: 5, farRadius: 12, tileBudget: 900 }, timeline: { enabled: false }, familyCount: 6 };

let running = false;
btn.addEventListener('click', () => { running = true; btn.classList.add('hidden'); field.seedFamily(cfg.familyCount); });
renderer.domElement.addEventListener('pointerdown', () => field.userInputPulse());

window.addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

let entryComplete = false;
// Key controls for modes
window.addEventListener('keydown', (e) => {
  if (!entryComplete) return;

  // Reset visuals
  spiralView.group.visible = false;
  field.group.visible = true;

  if (e.key === '1') {
    cfg.camera.mode = 'FLOOR';
    camCtl.setMode('FLOOR');
  }
  if (e.key === '2') {
    cfg.camera.mode = 'VORTEX';
    camCtl.setMode('VORTEX');
  }
  if (e.key === '3') {
    cfg.camera.mode = 'AXIS';
    camCtl.setMode('AXIS');
  }
  if (e.key === '4') {
    cfg.camera.mode = 'SPIRAL_TIME';
    camCtl.setMode('SPIRAL_TIME');
    spiralView.group.visible = true;
    field.group.visible = false; // Hide floor in spiral mode? Or keep it? Let's hide for clarity.
    interaction.onSelect(null); // Deselect floor items
  }
});

function animate() {
  const dt = clock.getDelta();
  const t = clock.elapsedTime;

  if (running) {
    const phase = choreo.update(dt);
    modeEl.textContent = `MODE: ${phase}`;
    fadeEl.style.opacity = String(phase === 'BLACK' ? 1 : choreo.fade01);
    choreo.applyCamera(camera);
    choreo.applyEntryObjects(onion, spring, axis);

    if (phase === 'FLOOR_A') field.setStage('A');
    else if (phase === 'FLOOR_B') field.setStage('B');
    else if (phase === 'FLOOR_C') field.setStage('C');
    else field.setStage('A');

    entryComplete = (phase === 'FLOOR_C' && choreo.t >= 48);
    if (entryComplete) camCtl.setMode(cfg.camera.mode);
  } else {
    modeEl.textContent = 'MODE: ENTRY (paused)';
    fadeEl.style.opacity = '0';
    onion.visible = false; spring.visible = false; axis.visible = false;
    field.setStage('A');
    camera.position.set(0, 1.4, 8.5);
    camera.lookAt(0, 0, 0);
  }

  // Demo engine feed (replace with DEFRAG engine output)
  const entryBias = running ? choreo.snap01 : 0;
  const baseC = 0.52 + 0.12 * Math.sin(t * 0.35);
  cfg.state.coherence = Math.max(0, Math.min(1, baseC + 0.35 * entryBias));
  cfg.state.phase = t;
  cfg.state.tension = 0.22 + 0.15 * (1 - cfg.state.coherence);


  if (entryComplete) {
    camCtl.update(camera, dt);
    overlaySys.update(dt);
  }

  const c = Math.max(0, Math.min(1, cfg.state.coherence));
  const tn = Math.max(0, Math.min(1, cfg.state.tension));

  field.update({ time: t, coherence: c, tensionN: tn, noiseAmp: curves.noiseAmp(c, tn), cyanIntensity: curves.cyanIntensity(c), phase: cfg.state.phase, parked01: 0, snap01: choreo.snap01 }, dt);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
