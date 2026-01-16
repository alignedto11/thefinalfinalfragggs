
import * as THREE from 'three';
export function makeMandalaShaderMaterial() {
  const uniforms = { u_time: { value: 0 }, u_coherence: { value: 0.55 }, u_tensionN: { value: 0.2 }, u_noiseAmp: { value: 0.3 }, u_cyanIntensity: { value: 0.45 }, u_phase: { value: 0 }, u_iridescence: { value: 0 }, u_snap: { value: 0 }, u_parked: { value: 0 } };
  const vertexShader = `varying vec2 vUv; void main(){ vUv=uv*2.0-1.0; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `;
  const fragmentShader = `precision highp float; varying vec2 vUv; uniform float u_time,u_coherence,u_tensionN,u_noiseAmp,u_cyanIntensity,u_phase,u_iridescence,u_snap,u_parked;
    // Simple hash for noise
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main(){ 
      vec2 p=vUv; float r=length(p); float ang=atan(p.y,p.x);
      
      // PRE-SNAP INSTABILITY -> LOCK
      float snapProgress = smoothstep(0.0, 1.0, u_snap);
      
      // Jitter peaks right before the snap completes (0.7 to 0.95 range)
      float preSnapJitter = smoothstep(0.6, 0.9, u_snap) * (1.0 - smoothstep(0.95, 1.0, u_snap));
      float angleJitter = (hash(p + u_time) - 0.5) * 0.2 * preSnapJitter;
      
      // Order calculation
      float baseOrder = 6.0 + 6.0*u_coherence;
      // Target order is an integer (e.g. 12)
      float targetOrder = 12.0; 
      
      // Interpolate order, but snap cleanly at the end
      float order = mix(baseOrder, targetOrder, snapProgress) + preSnapJitter * 5.0; // Crazy mode before snap
      
      // Clean up the order when effectively snapped for perfectly standing waves
      if(u_snap > 0.98) order = targetOrder;

      float activeAng = ang + angleJitter;

      float h=0.0; 
      h+=sin(order*activeAng+u_phase); 
      h+=sin(12.0*activeAng-u_phase*0.7); 
      h+=sin(3.0*activeAng+u_phase*0.35+u_snap*1.2);

      float gate=smoothstep(1.05,0.0,r); float v=(0.5+0.5*h)*gate;
      
      float nAmp=u_noiseAmp*(1.0-0.65*u_snap)*(1.0-u_parked); 
      v += (nAmp*0.15)*sin(r*40.0+u_time*0.6);
      
      // Sharpen lines as we snap
      float lineEdge = mix(0.55, 0.45, u_snap); // Thinner, sharper lines
      float lineSmooth = mix(0.92, 0.55, u_snap); // Less blur
      
      float lines=smoothstep(lineEdge, lineSmooth, v)*smoothstep(1.05,0.0,r);
      
      float base=lines*(1.0-0.35*u_parked); vec3 col=vec3(base)*0.95;
      vec3 cyan=vec3(0.235,0.984,1.0); 
      
      float accentMask=smoothstep(0.35,0.95,v); 
      float cyanAmt=u_cyanIntensity*accentMask*(1.0-u_parked); 
      
      // Intense flash at key snap moment
      float flash = smoothstep(0.9, 1.0, u_snap) * (1.0 - smoothstep(0.98, 1.0, u_snap)) * 0.5;
      
      col=mix(col,cyan,cyanAmt + flash);
      col += vec3(0.12*u_snap);
      
      if(u_iridescence>0.0){ float sh=u_iridescence*0.14; col=vec3(col.r+sh,col.g,col.b-sh); }
      float alpha=smoothstep(1.05,0.85,r); gl_FragColor=vec4(col,alpha);
    }`;
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true });
  return { material, uniforms };
}
