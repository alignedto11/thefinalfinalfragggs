import * as THREE from 'three';
import { TOKENS } from '../core/tokens';

export class SpiralView {
    group = new THREE.Group();
    helix: THREE.Line;
    nodes: THREE.InstancedMesh;

    constructor() {
        this.group.visible = false;

        // 1. Double Helix Spine (Time Axis)
        const pts = [];
        const R = 3.0; // Radius
        const H = 40.0; // Height/Depth
        const turns = 4;
        for (let i = 0; i <= 200; i++) {
            const u = i / 200;
            const a = u * Math.PI * 2 * turns;
            const y = -10 + u * H;
            pts.push(new THREE.Vector3(Math.cos(a) * R, y, Math.sin(a) * R));
        }
        const spineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        this.helix = new THREE.Line(spineGeo, new THREE.LineBasicMaterial({ color: TOKENS.colors.accentCyan, opacity: 0.3, transparent: true }));
        this.group.add(this.helix);

        // 2. Contextual Nodes (Events in time)
        const nodeGeo = new THREE.IcosahedronGeometry(0.2, 0);
        const nodeMat = new THREE.MeshBasicMaterial({ color: TOKENS.colors.stroke });
        this.nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, 12);

        const m = new THREE.Matrix4();
        for (let i = 0; i < 12; i++) {
            const u = i / 12;
            const a = u * Math.PI * 2 * (turns + 1); // Offset
            const y = -8 + u * 30;
            const r = R + (Math.random() - 0.5) * 1.0;
            m.makeTranslation(Math.cos(a) * r, y, Math.sin(a) * r);
            this.nodes.setMatrixAt(i, m);
        }
        this.group.add(this.nodes);
    }

    update(dt: number) {
        if (!this.group.visible) return;
        this.group.rotation.y += dt * 0.1; // Slowly rotate the whole time structure
    }
}
