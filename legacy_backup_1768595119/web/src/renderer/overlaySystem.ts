import * as THREE from 'three';
import { TOKENS } from '../core/tokens';

export class OverlaySystem {
    group = new THREE.Group();

    // Overlays
    private natal: THREE.Group;
    private cube: THREE.Group;
    private cubeWire: THREE.Mesh;
    private cubeShadow: THREE.Mesh;
    private familyRings: THREE.Group;

    // State
    private cubeMorph = 0; // 0 = Gift (Cube), 1 = Shadow (Twisted)

    constructor() {
        this.group.visible = false;

        // 1. Natal Overlay (Geometric Identity)
        this.natal = new THREE.Group();

        // Outer Shell (Icosahedron)
        const geoIso = new THREE.IcosahedronGeometry(0.5, 0);
        const edgesIso = new THREE.EdgesGeometry(geoIso);
        const outer = new THREE.LineSegments(edgesIso, new THREE.LineBasicMaterial({
            color: TOKENS.colors.accentCyan,
            transparent: true,
            opacity: 0.9
        }));
        this.natal.add(outer);

        // Inner Core (Dodecahedron - Dual)
        const geoDod = new THREE.DodecahedronGeometry(0.35, 0);
        const edgesDod = new THREE.EdgesGeometry(geoDod);
        const inner = new THREE.LineSegments(edgesDod, new THREE.LineBasicMaterial({
            color: TOKENS.colors.stroke,
            transparent: true,
            opacity: 0.5
        }));
        this.natal.add(inner);

        this.group.add(this.natal);

        // 2. Gift-Shadow Cube
        this.cube = new THREE.Group();
        this.cube.position.y = 0.8;

        // State A: Gift (Clean Cube)
        const box = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const boxEdges = new THREE.EdgesGeometry(box);
        this.cubeWire = new THREE.LineSegments(boxEdges, new THREE.LineBasicMaterial({
            color: TOKENS.colors.stroke,
            transparent: true,
            opacity: 0.8
        }));
        this.cube.add(this.cubeWire);

        // State B: Shadow (Twisted/Jagged form) - represented as a second mesh that blends in
        // or we transform the cube. Let's just transform the cube for purity.
        // We'll add a second "Shadow" mesh that is visible when morph > 0.5?
        // Actually, let's use a second geometry for the shadow state and crossfade visibility/scale.
        const shadowGeo = new THREE.IcosahedronGeometry(0.4, 0); // "Spiky" feel compared to box
        const shadowEdges = new THREE.EdgesGeometry(shadowGeo);
        this.cubeShadow = new THREE.LineSegments(shadowEdges, new THREE.LineBasicMaterial({
            color: TOKENS.colors.accentCyan, // Intense
            transparent: true,
            opacity: 0.0
        }));
        this.cube.add(this.cubeShadow);

        this.group.add(this.cube);

        // 3. Family Rings
        this.familyRings = new THREE.Group();
        // Will be populated dynamically
        this.group.add(this.familyRings);
    }

    show(position: THREE.Vector3, state: number) {
        this.group.visible = true;
        this.group.position.copy(position);

        // Reset
        this.natal.rotation.set(0, 0, 0);
        this.cubeMorph = 0;
        this.updateCubeVisuals();

        // Mock Family Data if empty
        if (this.familyRings.children.length === 0) {
            this.generateFamilyRings(3);
        }
    }

    hide() {
        this.group.visible = false;
    }

    setGiftShadowRatio(t: number) {
        this.cubeMorph = Math.max(0, Math.min(1, t));
        this.updateCubeVisuals();
    }

    private updateCubeVisuals() {
        const t = this.cubeMorph;
        // Morph: Cube scales down, Shadow scales up + rotates
        this.cubeWire.scale.setScalar(1.0 - t * 0.5);
        this.cubeWire.rotation.y = t * Math.PI;
        (this.cubeWire.material as THREE.LineBasicMaterial).opacity = 0.8 * (1 - t);

        this.cubeShadow.scale.setScalar(0.5 + t * 0.7);
        this.cubeShadow.rotation.z = -t * Math.PI * 0.5;
        (this.cubeShadow.material as THREE.LineBasicMaterial).opacity = 0.9 * t;
    }

    generateFamilyRings(count: number) {
        this.familyRings.clear();
        const mat = new THREE.LineBasicMaterial({ color: TOKENS.colors.stroke, transparent: true, opacity: 0.3 });

        for (let i = 0; i < count; i++) {
            const r = 1.3 + i * 0.6;
            // Create a dashed ring effect? For now simple rings
            const geo = new THREE.RingGeometry(r, r + 0.015, 64);
            geo.rotateX(-Math.PI / 2);
            const mesh = new THREE.Mesh(geo, mat);
            // Offset y slightly to avoid z-fight
            mesh.position.y = 0.02 + i * 0.01;
            this.familyRings.add(mesh);
        }
    }

    update(dt: number) {
        if (!this.group.visible) return;

        // 1. Rotate Natal (Slow, majestic)
        this.natal.rotation.y += dt * 0.15;
        this.natal.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;

        // 2. Pulse Family Rings
        this.familyRings.children.forEach((child, i) => {
            const s = 1.0 + 0.02 * Math.sin(Date.now() * 0.001 + i);
            child.scale.setScalar(s);
            (child.material as THREE.LineBasicMaterial).opacity = 0.3 + 0.1 * Math.sin(Date.now() * 0.002 + i);
        });

        // Cube animation handled by drag state mostly, but add idle float
        this.cube.position.y = 0.8 + 0.05 * Math.sin(Date.now() * 0.0015);
    }
}
