import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const QDRANT_PURPLE = 0xb478ff;
const CYAN_LIGHT = 0xafd8f0;
const BLUE_BRIGHT = 0x3878ff;
const TEAL = 0x64aaaa;
const TEAL_DARK = 0x468c8c;

function createAudioEngine() {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let started = false;
  let muted = false;

  function init() {
    if (started) return;
    try {
      ctx = new AudioContext();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0;
      masterGain.connect(ctx.destination);

      // Underwater ambience: deep filtered noise + slow modulated tones
      const bufSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer; noise.loop = true;

      // Heavy lowpass for muffled underwater character
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass'; lpf.frequency.value = 120; lpf.Q.value = 8;

      // Slow LFO breathing on filter
      const lfo = ctx.createOscillator();
      lfo.type = 'sine'; lfo.frequency.value = 0.06;
      const lfoG = ctx.createGain(); lfoG.gain.value = 60;
      lfo.connect(lfoG); lfoG.connect(lpf.frequency); lfo.start();

      const noiseGain = ctx.createGain(); noiseGain.gain.value = 0.5;
      noise.connect(lpf); lpf.connect(noiseGain); noiseGain.connect(masterGain);
      noise.start();

      // Deep resonant tone
      const tone1 = ctx.createOscillator();
      tone1.type = 'sine'; tone1.frequency.value = 48;
      const t1g = ctx.createGain(); t1g.gain.value = 0.25;
      tone1.connect(t1g); t1g.connect(masterGain); tone1.start();

      // Gentle fifth shimmer
      const tone2 = ctx.createOscillator();
      tone2.type = 'sine'; tone2.frequency.value = 72;
      const t2g = ctx.createGain(); t2g.gain.value = 0.1;
      const t2lfo = ctx.createOscillator(); t2lfo.frequency.value = 0.03;
      const t2lfoG = ctx.createGain(); t2lfoG.gain.value = 0.08;
      t2lfo.connect(t2lfoG); t2lfoG.connect(t2g.gain);
      tone2.connect(t2g); t2g.connect(masterGain);
      tone2.start(); t2lfo.start();

      masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 5);
      started = true;
    } catch {}
  }
  // Water drop with underwater echo
  function drop() {
    if (!ctx || muted) return;
    const now = ctx.currentTime;
    const baseFreq = 1200 + Math.random() * 800;

    // Primary drop
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.25, now + 0.4);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.08, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    // Soft reverb via feedback delay
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.12 + Math.random() * 0.08;
    const fb = ctx.createGain();
    fb.gain.value = 0.35;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1500;

    osc.connect(env);
    env.connect(ctx.destination);
    env.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(fb);
    fb.connect(delay);
    delay.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);

    // Quieter echo ghost
    const ghost = ctx.createOscillator();
    ghost.type = 'sine';
    ghost.frequency.setValueAtTime(baseFreq * 0.8, now + 0.15);
    ghost.frequency.exponentialRampToValueAtTime(baseFreq * 0.15, now + 0.7);
    const gEnv = ctx.createGain();
    gEnv.gain.setValueAtTime(0.03, now + 0.15);
    gEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    ghost.connect(gEnv); gEnv.connect(ctx.destination);
    ghost.start(now + 0.15); ghost.stop(now + 0.9);
  }

  function toggleMute() {
    muted = !muted;
    if (masterGain && ctx) {
      masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.13, ctx.currentTime + 0.4);
    }
    return muted;
  }
  function destroy() { try { ctx?.close(); } catch {} started = false; }
  return { init, drop, toggleMute, destroy };
}

export default function QIP3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef(createAudioEngine());
  const [showOverlay] = useState(true);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Hide scroll hint on scroll
  useEffect(() => {
    const onScroll = () => setShowScrollHint(false);
    window.addEventListener('scroll', onScroll, { once: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = () => { audioRef.current.init(); window.removeEventListener('click', handler); window.removeEventListener('touchstart', handler); };
    window.addEventListener('click', handler); window.addEventListener('touchstart', handler);
    return () => { window.removeEventListener('click', handler); window.removeEventListener('touchstart', handler); audioRef.current.destroy(); };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const w = container.clientWidth, h = container.clientHeight;
    const isMobile = w < 768;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030306);
    scene.fog = new THREE.FogExp2(0x030306, isMobile ? 0.018 : 0.012);
    const camera = new THREE.PerspectiveCamera(isMobile ? 60 : 50, w / h, 0.1, 1000);
    camera.position.set(0, isMobile ? 12 : 10, isMobile ? 22 : 28);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x111122, 0.4));
    const pLight = new THREE.PointLight(QDRANT_PURPLE, 2.5, 60);
    scene.add(pLight);
    scene.add(new THREE.DirectionalLight(0xffffff, 0.2).translateX(10).translateY(20));
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastDrop = 0;
    const allInteractive: THREE.Mesh[] = [];

    // === QDRANT BRAIN ===
    const brainGroup = new THREE.Group();
    const brainMat = new THREE.MeshPhongMaterial({ color: QDRANT_PURPLE, emissive: QDRANT_PURPLE, emissiveIntensity: 0.7, shininess: 120, transparent: true, opacity: 0.92 });
    const brainMesh = new THREE.Mesh(new THREE.SphereGeometry(isMobile ? 1.1 : 1.4, 32, 32), brainMat);
    brainGroup.add(brainMesh);
    for (let i = 0; i < 6; i++) { const a = (Math.PI * 2 * i) / 6; const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); d.position.set(Math.cos(a)*0.55, Math.sin(a)*0.55, 1.1); brainGroup.add(d); }
    const cDot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); cDot.position.set(0, 0, 1.2); brainGroup.add(cDot);
    for (let r = 0; r < (isMobile ? 2 : 4); r++) { const ring = new THREE.Mesh(new THREE.RingGeometry(2+r*0.8, 2.06+r*0.8, 64), new THREE.MeshBasicMaterial({ color: QDRANT_PURPLE, transparent: true, opacity: 0.15-r*0.03, side: THREE.DoubleSide })); ring.rotation.x = Math.PI/2; brainGroup.add(ring); }
    scene.add(brainGroup);

    // === MEMORY TIER NODES ===
    const triR = isMobile ? 4.5 : 5.5; const triNodes: THREE.Mesh[] = []; const origin = new THREE.Vector3(0,0,0);
    const brainLine = new THREE.LineBasicMaterial({ color: QDRANT_PURPLE, transparent: true, opacity: 0.2 });
    const triLineMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.35 });
    for (let i = 0; i < 3; i++) { const a = (Math.PI*2*i)/3 - Math.PI/2; const m = new THREE.Mesh(new THREE.SphereGeometry(isMobile?0.4:0.55, 16, 16), new THREE.MeshPhongMaterial({ color: CYAN_LIGHT, emissive: CYAN_LIGHT, emissiveIntensity: 0.35, transparent: true, opacity: 0.88 })); m.position.set(Math.cos(a)*triR, 0, Math.sin(a)*triR); scene.add(m); triNodes.push(m); allInteractive.push(m); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([m.position, origin]), brainLine)); }
    for (let i = 0; i < 3; i++) { const j=(i+1)%3; scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([triNodes[i].position, triNodes[j].position]), triLineMat)); const mid = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), new THREE.MeshPhongMaterial({ color: CYAN_LIGHT, emissive: CYAN_LIGHT, emissiveIntensity: 0.2, transparent: true, opacity: 0.7 })); mid.position.set((triNodes[i].position.x+triNodes[j].position.x)/2, 0, (triNodes[i].position.z+triNodes[j].position.z)/2); scene.add(mid); allInteractive.push(mid); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([mid.position, origin]), brainLine)); }

    // === AGENT SWARM ===
    const swarmR = isMobile ? 7.5 : 10; const agentCount = isMobile ? 10 : 14; const agents: THREE.Mesh[] = [];
    const aColors = [BLUE_BRIGHT, TEAL, CYAN_LIGHT, BLUE_BRIGHT, TEAL_DARK, BLUE_BRIGHT, TEAL, CYAN_LIGHT, BLUE_BRIGHT, TEAL_DARK, BLUE_BRIGHT, TEAL, CYAN_LIGHT, TEAL_DARK];
    const aSizes = [0.38, 0.22, 0.32, 0.42, 0.2, 0.35, 0.25, 0.3, 0.4, 0.18, 0.32, 0.24, 0.28, 0.2];
    const meshLine = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.06 });
    const aBrainLine = new THREE.LineBasicMaterial({ color: QDRANT_PURPLE, transparent: true, opacity: 0.08 });
    for (let i = 0; i < agentCount; i++) { const a=(Math.PI*2*i)/agentCount; const yOff=Math.sin(a*2.5)*(isMobile?1.5:2); const sz=isMobile?aSizes[i]*0.8:aSizes[i]; const m=new THREE.Mesh(new THREE.SphereGeometry(sz,12,12), new THREE.MeshPhongMaterial({ color: aColors[i], emissive: aColors[i], emissiveIntensity: 0.2, transparent: true, opacity: 0.8 })); m.position.set(Math.cos(a)*swarmR, yOff, Math.sin(a)*swarmR); m.userData={baseY:yOff,idx:i}; scene.add(m); agents.push(m); allInteractive.push(m); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([m.position, origin]), aBrainLine)); }
    for (let i=0;i<agentCount;i++) { scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([agents[i].position, agents[(i+1)%agentCount].position]), meshLine)); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([agents[i].position, agents[(i+4)%agentCount].position]), meshLine)); }

    // Orbits + particles
    const oMat = (c:number,o:number) => new THREE.MeshBasicMaterial({ color:c, transparent:true, opacity:o, side:THREE.DoubleSide });
    const outerOrbit = new THREE.Mesh(new THREE.RingGeometry(swarmR-0.04,swarmR+0.04,96), oMat(TEAL_DARK,0.06));
    outerOrbit.rotation.x = Math.PI/2; scene.add(outerOrbit);
    const innerOrbit = new THREE.Mesh(new THREE.RingGeometry(triR-0.03,triR+0.03,64), oMat(TEAL,0.04));
    innerOrbit.rotation.x = Math.PI/2; scene.add(innerOrbit);
    const pCount=isMobile?150:350; const pGeo=new THREE.BufferGeometry(); const pPos=new Float32Array(pCount*3);
    for(let i=0;i<pCount;i++){pPos[i*3]=(Math.random()-0.5)*50;pPos[i*3+1]=(Math.random()-0.5)*25;pPos[i*3+2]=(Math.random()-0.5)*50;}
    pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
    scene.add(new THREE.Points(pGeo,new THREE.PointsMaterial({color:QDRANT_PURPLE,size:0.05,transparent:true,opacity:0.35})));

    // Flow particles
    const flowCount=isMobile?15:30; const flowParticles:THREE.Mesh[]=[]; const flowData:{progress:number;speed:number;srcIdx:number;type:string}[]=[];
    for(let i=0;i<flowCount;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,6),new THREE.MeshBasicMaterial({color:QDRANT_PURPLE,transparent:true,opacity:0.6}));scene.add(p);flowParticles.push(p);flowData.push({progress:Math.random(),speed:0.002+Math.random()*0.004,srcIdx:Math.floor(Math.random()*agentCount),type:Math.random()>0.5?'a':'t'});}

    // Interaction: water drop on hover
    const onMouseMove=(e:MouseEvent)=>{mouse.x=(e.clientX/w)*2-1;mouse.y=-(e.clientY/h)*2+1;raycaster.setFromCamera(mouse,camera);if(raycaster.intersectObjects(allInteractive).length>0&&Date.now()-lastDrop>350){lastDrop=Date.now();audioRef.current.drop();}};
    const onTouch=(e:TouchEvent)=>{const t=e.touches[0];if(!t)return;mouse.x=(t.clientX/w)*2-1;mouse.y=-(t.clientY/h)*2+1;raycaster.setFromCamera(mouse,camera);if(raycaster.intersectObjects(allInteractive).length>0&&Date.now()-lastDrop>400){lastDrop=Date.now();audioRef.current.drop();}};
    container.addEventListener('mousemove',onMouseMove);
    container.addEventListener('touchmove',onTouch,{passive:true});
    container.addEventListener('click',()=>{audioRef.current.init();audioRef.current.drop();});

    const clock=new THREE.Clock(); let mouseX=0,mouseY=0;
    const onM=(e:MouseEvent)=>{mouseX=(e.clientX/w-0.5)*2;mouseY=(e.clientY/h-0.5)*2;};
    container.addEventListener('mousemove',onM);

    let animId:number;
    function animate(){
      animId=requestAnimationFrame(animate);
      const t=clock.getElapsedTime();
      const camAngle=t*0.06+(isMobile?0:mouseX*0.3);
      const camDist=isMobile?20:26;
      camera.position.set(Math.sin(camAngle)*camDist,(isMobile?6:8)+Math.sin(t*0.12)*2-(isMobile?0:mouseY*3),Math.cos(camAngle)*camDist);
      camera.lookAt(0,0,0);
      const pulse=1+Math.sin(t*2)*0.04;
      brainMesh.scale.set(pulse,pulse,pulse);
      brainMat.emissiveIntensity=0.6+Math.sin(t*1.5)*0.15;
      pLight.intensity=2+Math.sin(t*1.5)*0.8;
      brainGroup.rotation.y=t*0.25;
      agents.forEach(a=>{a.position.y=(a.userData.baseY as number)+Math.sin(t*0.4+(a.userData.idx as number))*0.35;});
      triNodes.forEach((n,i)=>{const s=1+Math.sin(t*0.8+i*2.1)*0.06;n.scale.set(s,s,s);});
      flowParticles.forEach((p,i)=>{const d=flowData[i];d.progress+=d.speed;if(d.progress>1){d.progress=0;d.srcIdx=Math.floor(Math.random()*agentCount);d.type=Math.random()>0.5?'a':'t';}const src=d.type==='a'?agents[d.srcIdx%agents.length].position:triNodes[d.srcIdx%3].position;p.position.lerpVectors(src,origin,d.progress);(p.material as THREE.MeshBasicMaterial).opacity=Math.sin(d.progress*Math.PI)*0.6;});
      renderer.render(scene,camera);
    }
    animate();

    const onResize=()=>{const nw=container.clientWidth,nh=container.clientHeight;camera.aspect=nw/nh;camera.updateProjectionMatrix();renderer.setSize(nw,nh);};
    window.addEventListener('resize',onResize);
    return ()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',onResize);if(container.contains(renderer.domElement))container.removeChild(renderer.domElement);renderer.dispose();};
  }, []);

  const handleMute=()=>{audioRef.current.init();const m=audioRef.current.toggleMute();setIsMuted(m);};

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ zIndex: 10 }}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Title under nav */}
      <div className="absolute pointer-events-none px-6 sm:px-10" style={{ top: 'clamp(80px, 12vh, 120px)', left: 0 }}>
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#b478ff] opacity-70 mb-2 sm:mb-3">
          Quantum Intelligence Protocol
        </p>
        <h1 className="font-heading text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1] tracking-tight">
          Compounding Intelligence<br />& Autonomy
        </h1>
        <p className="text-xs sm:text-sm text-white/30 mt-3 sm:mt-4 max-w-xs sm:max-w-sm leading-relaxed">
          From linear to superposition. Persistent identity, reflective learning, compound intelligence.
        </p>
      </div>

      {/* Mute button */}
      <button onClick={handleMute}
        className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}>
        {isMuted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(180,120,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        )}
      </button>

      {/* Auto-reveal overlay */}
      <div className="absolute inset-0 flex items-end justify-center" style={{ pointerEvents: showOverlay ? 'auto' : 'none', transition: 'transform 1.8s cubic-bezier(0.25,0.46,0.45,0.94), opacity 1.5s ease', transform: showOverlay ? 'translateY(0)' : 'translateY(100%)', opacity: showOverlay ? 1 : 0 }}>
        <div className="w-full px-6 sm:px-10 pb-12 sm:pb-16 pt-24 sm:pt-32"
          style={{ background: 'linear-gradient(to top, rgba(5,6,11,0.98) 40%, rgba(5,6,11,0.7) 75%, transparent 100%)' }}>
          <div className="max-w-xl">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.14em] text-[#b478ff] mb-2 sm:mb-3 block">Research by Remco Vroom</span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.08] tracking-tight mb-3 sm:mb-4">Quantum Intelligence</h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/50 max-w-md leading-relaxed">
              A unified theory for autonomous agent governance. From quantum mechanics to cognitive architecture, the missing intelligence layer in AI infrastructure.
            </p>
          </div>

          {/* READ THE THESIS - clickable, appears after overlay */}
          <div className="flex justify-center mt-8 sm:mt-10"
            style={{ opacity: showScrollHint ? 1 : 0, transition: 'opacity 1.2s ease', transitionDelay: '0.3s' }}>
            <a href="#thesis" className="group flex flex-col items-center gap-2 no-underline">
              <span className="text-[11px] sm:text-[13px] font-mono uppercase tracking-[0.3em] text-[#b478ff] group-hover:text-white transition-colors duration-300">
                Read the Thesis
              </span>
              <svg width="14" height="20" viewBox="0 0 16 24" fill="none" className="animate-bounce">
                <path d="M8 4v12M3 12l5 5 5-5" stroke="rgba(180,120,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
