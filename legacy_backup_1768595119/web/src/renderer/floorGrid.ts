
import * as THREE from 'three';
import { TOKENS } from '../core/tokens';
export function makeFloorGrid(){
  const grid=new THREE.GridHelper(140,140,TOKENS.colors.grid,TOKENS.colors.grid);
  (grid.material as THREE.Material).transparent=true;
  (grid.material as any).opacity=0.55;
  return grid;
}
