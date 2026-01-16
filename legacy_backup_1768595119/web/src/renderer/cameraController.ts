import * as THREE from 'three';
import { CameraMode } from '../core/types';

export class CameraController {
    mode: CameraMode = 'FLOOR';
    private t = 0;

    // Interactive State
    private target = { x: 0, z: 0, pitch: 0, zoom: 0 };
    private current = { x: 0, z: 0, pitch: 0, zoom: 0 };
    private drag = { active: false, startX: 0, startY: 0 };

    constructor() {
        this.addListeners();
    }

    private addListeners() {
        window.addEventListener('mousedown', (e) => {
            this.drag.active = true;
            this.drag.startX = e.clientX;
            this.drag.startY = e.clientY;
        });
        window.addEventListener('mouseup', () => this.drag.active = false);
        window.addEventListener('mousemove', (e) => {
            if (!this.drag.active) return;
            const dx = (e.clientX - this.drag.startX) * 0.01;
            const dy = (e.clientY - this.drag.startY) * 0.005;

            this.target.x -= dx; // Pan X
            this.target.z -= dy; // Pan Z (drag up goes forward)

            // Clamp Floor Bounds
            this.target.x = Math.max(-10, Math.min(10, this.target.x));
            this.target.z = Math.max(-10, Math.min(10, this.target.z));

            this.drag.startX = e.clientX;
            this.drag.startY = e.clientY;
        });

        window.addEventListener('wheel', (e) => {
            this.target.zoom += e.deltaY * 0.005;
            this.target.zoom = Math.max(-2, Math.min(8, this.target.zoom)); // Zoom Limits
        }, { passive: false });
    }

    setMode(m: CameraMode) { this.mode = m; }

    update(camera: THREE.PerspectiveCamera, dt: number) {
        this.t += dt;
        const t = this.t;

        // Damping (Smooth Interaction)
        const damp = 1 - Math.exp(-dt * 5);
        this.current.x += (this.target.x - this.current.x) * damp;
        this.current.z += (this.target.z - this.current.z) * damp;
        this.current.zoom += (this.target.zoom - this.current.zoom) * damp;

        // Tilt based on mouse Y position (for subtle parallax even without drag)
        // Removed to keep it simple and stable as per instructions "no parking on dance floor"

        if (this.mode === 'FLOOR') {
            const baseY = 2.2;
            const baseZ = 6.5;

            camera.position.set(
                this.current.x,
                baseY + this.current.zoom * 0.5,
                baseZ + this.current.z + this.current.zoom
            );
            camera.lookAt(this.current.x, 0, this.current.z);
            camera.rotation.z = 0;
            return;
        }

        if (this.mode === 'VORTEX') {
            const r = 9.0 + 1.2 * Math.sin(t * 0.1);
            const y = 2.6 + 0.4 * Math.sin(t * 0.07);
            camera.position.set(r * Math.cos(t * 0.06), y, r * Math.sin(t * 0.06));
            camera.lookAt(0, 0, 0);
            camera.rotation.z = THREE.MathUtils.degToRad(3 * Math.sin(t * 0.05));
            return;
        }

        if (this.mode === 'AXIS') {
            camera.position.set(0, 6.0, 0.1);
            camera.lookAt(0, 0, 0);
            camera.rotation.z = 0;
            return;
        }

        camera.position.set(0, 3.0, 10.5);
        camera.lookAt(0, 0, 0);
        camera.rotation.z = 0;
    }
}