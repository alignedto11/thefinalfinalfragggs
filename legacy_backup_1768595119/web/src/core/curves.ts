const clamp01=(x:number)=>Math.max(0,Math.min(1,x));
export const curves={ noiseAmp:(c:number,tn:number)=>clamp01((1-c)*0.85+tn*0.25), cyanIntensity:(c:number)=>clamp01(Math.pow(c,1.8))*0.75+0.10 };
export const ease={ clamp01, cubicInOut:(t:number)=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2, cubicOut:(t:number)=>1-Math.pow(1-t,3), lerp:(a:number,b:number,t:number)=>a+(b-a)*t };