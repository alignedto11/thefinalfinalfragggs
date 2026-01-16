import * as THREE from 'three';
import { TileField } from './tileField';

export class InteractionController {
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();
    private selectedId: number | null = null;

    // Drag State
    private isDown = false;
    private startPos = new THREE.Vector2();
    private isDragging = false;
    private dragThreshold = 5; // pixels

    // Events
    onSelect: (id: number | null) => void = () => { };
    onDrag: (deltaX: number) => void = () => { };

    constructor(private camera: THREE.PerspectiveCamera, private tileField: TileField, canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', (e) => this.onDown(e));
        window.addEventListener('mousemove', (e) => this.onMove(e));
        window.addEventListener('mouseup', (e) => this.onUp(e));
    }

    private onDown(e: MouseEvent) {
        this.isDown = true;
        this.isDragging = false;
        this.startPos.set(e.clientX, e.clientY);
    }

    private onMove(e: MouseEvent) {
        if (!this.isDown) return;

        const dx = e.clientX - this.startPos.x;
        const dy = e.clientY - this.startPos.y;

        if (!this.isDragging && (Math.abs(dx) > this.dragThreshold || Math.abs(dy) > this.dragThreshold)) {
            this.isDragging = true;
        }

        if (this.isDragging) {
            // Normalize delta to screen width approx
            const normDelta = dx / window.innerWidth;
            this.onDrag(normDelta);
        }
    }

    private onUp(e: MouseEvent) {
        if (this.isDown && !this.isDragging) {
            this.onClick(e);
        }
        this.isDown = false;
        this.isDragging = false;
    }

    private onClick(e: MouseEvent) {
        // Normalize mouse
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Intersect ghosts and user
        const intersects = this.raycaster.intersectObjects([this.tileField.ghosts, this.tileField.user], false);

        if (intersects.length > 0) {
            const hit = intersects[0];
            let id = -1;

            if (hit.object === this.tileField.ghosts) {
                id = hit.instanceId !== undefined ? hit.instanceId : -1;
            } else if (hit.object === this.tileField.user) {
                id = -1; // User tile proper
            }

            if (id !== this.selectedId) {
                this.selectedId = id;
                this.onSelect(id);
            }
        } else {
            // Deselect if clicked Void (and not dragging)
            if (this.selectedId !== null) {
                this.selectedId = null;
                this.onSelect(null);
            }
        }
    }
}
