import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const QDRANT_PURPLE = 0xb478ff;
const CYAN_LIGHT = 0xafd8f0;
const BLUE_BRIGHT = 0x3878ff;
const TEAL = 0x64aaaa;
const TEAL_DARK = 0x468c8c;

// === WEB AUDIO: Ambient hum + interaction sounds ===
function createAudioEngine() {
  let ctx: AudioContext | null = null;
  let humOsc: OscillatorNode | null = null;
  let humGain: GainNode | null = null;
  let started = false;

  function init() {
    if (started) return;
    try {
      ctx = new AudioContext();
      humGain = ctx.createGain();
      humGain.gain.value = 0;
      humGain.connect(ctx.destination);

      // Deep ambient hum (layered oscillators)
      humOsc = ctx.createOscillator();
      humOsc.type = 'sine';
      humOsc.frequency.value = 55; // Low A
      humOsc.connect(humGain);
      humOsc.start();

      const hum2 = ctx.createOscillator();
      hum2.type = 'sine';
      hum2.frequency.value = 82.5; // Fifth above
      const g2 = ctx.createGain();
      g2.gain.value = 0.3;
      hum2.connect(g2);
      g2.connect(humGain);
      hum2.start();

      // Fade in
      humGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3);
      started = true;
    } catch {}
  }

  function bleep() {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800 + Math.random() * 1200;
    g.gain.value = 0.08;
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  function destroy() {
    humOsc?.stop();
    ctx?.close();
    started = false;
  }

  return { init, bleep, destroy };
}

export default function QIP3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef(createAudioEngine());
  const [showOverlay, setShowOverlay] = useState(false);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-reveal overlay after 2s if no scroll
  useEffect(() => {
    scrollTimerRef.current = setTimeout(() => setShowOverlay(true), 2000);
    const onScroll = () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      setScrollHintVisible(false);
    };
    window.addEventListener('scroll', onScroll, { once: true });
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Init audio on first interaction
  useEffect(() => {
    const handler = () => { audioRef.current.init(); window.removeEventListener('click', handler); };
    window.addEventListener('click', handler);
    return () => { window.removeEventListener('click', handler); audioRef.current.destroy(); };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030306);
    scene.fog = new THREE.FogExp2(0x030306, 0.012);
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.set(0, 10, 28);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x111122, 0.4));
    const pLight = new THREE.PointLight(QDRANT_PURPLE, 2.5, 60);
    scene.add(pLight);
    scene.add(new THREE.DirectionalLight(0xffffff, 0.2).translateX(10).translateY(20));
    scene.add(new THREE.PointLight(CYAN_LIGHT, 0.5, 40).translateX(5).translateY(-3).translateZ(5));

    // Raycaster for interaction sounds
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastBleep = 0;

    // === QDRANT BRAIN ===
    const brainGroup = new THREE.Group();
    const brainMat = new THREE.MeshPhongMaterial({
      color: QDRANT_PURPLE, emissive: QDRANT_PURPLE,
      emissiveIntensity: 0.7, shininess: 120, transparent: true, opacity: 0.92,
    });
    const brainMesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 48, 48), brainMat);
    brainGroup.add(brainMesh);
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      dot.position.set(Math.cos(a) * 0.55, Math.sin(a) * 0.55, 1.1);
      brainGroup.add(dot);
    }
    const cDot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    cDot.position.set(0, 0, 1.2); brainGroup.add(cDot);
    for (let r = 0; r < 4; r++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.0 + r * 0.8, 2.06 + r * 0.8, 80),
        new THREE.MeshBasicMaterial({ color: QDRANT_PURPLE, transparent: true, opacity: 0.15 - r * 0.03, side: THREE.DoubleSide })
      );
      ring.rotation.x = Math.PI / 2; brainGroup.add(ring);
    }
    scene.add(brainGroup);

    // === MEMORY TIER NODES ===
    const triR = 5.5;
    const triNodes: THREE.Mesh[] = [];
    const origin = new THREE.Vector3(0, 0, 0);
    const brainLine = new THREE.LineBasicMaterial({ color: QDRANT_PURPLE, transparent: true, opacity: 0.2 });
    const triLineMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.35 });
    const allInteractive: THREE.Mesh[] = [];

    for (let i = 0; i < 3; i++) {
      const a = (Math.PI * 2 * i) / 3 - Math.PI / 2;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20),
        new THREE.MeshPhongMaterial({ color: CYAN_LIGHT, emissive: CYAN_LIGHT, emissiveIntensity: 0.35, transparent: true, opacity: 0.88 }));
      m.position.set(Math.cos(a) * triR, 0, Math.sin(a) * triR);
      scene.add(m); triNodes.push(m); allInteractive.push(m);
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([m.position, origin]), brainLine));
    }
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3;
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([triNodes[i].position, triNodes[j].position]), triLineMat));
      const mid = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12),
        new THREE.MeshPhongMaterial({ color: CYAN_LIGHT, emissive: CYAN_LIGHT, emissiveIntensity: 0.2, transparent: true, opacity: 0.7 }));
      mid.position.set((triNodes[i].position.x + triNodes[j].position.x) / 2, 0, (triNodes[i].position.z + triNodes[j].position.z) / 2);
      scene.add(mid); allInteractive.push(mid);
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([mid.position, origin]), brainLine));
    }

    // === AGENT SWARM ===
    const swarmR = 10;
    const agentCount = 14;
    const agents: THREE.Mesh[] = [];
    const aColors = [BLUE_BRIGHT, TEAL, CYAN_LIGHT, BLUE_BRIGHT, TEAL_DARK, BLUE_BRIGHT, TEAL, CYAN_LIGHT, BLUE_BRIGHT, TEAL_DARK, BLUE_BRIGHT, TEAL, CYAN_LIGHT, TEAL_DARK];
    const aSizes = [0.38, 0.22, 0.32, 0.42, 0.2, 0.35, 0.25, 0.3, 0.4, 0.18, 0.32, 0.24, 0.28, 0.2];
    const meshLine = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.06 });
    const aBrainLine = new THREE.LineBasicMaterial({ color: QDRANT_PURPLE, transparent: true, opacity: 0.08 });

    for (let i = 0; i < agentCount; i++) {
      const a = (Math.PI * 2 * i) / agentCount;
      const yOff = Math.sin(a * 2.5) * 2;
      const m = new THREE.Mesh(new THREE.SphereGeometry(aSizes[i], 14, 14),
        new THREE.MeshPhongMaterial({ color: aColors[i], emissive: aColors[i], emissiveIntensity: 0.2, transparent: true, opacity: 0.8 }));
      m.position.set(Math.cos(a) * swarmR, yOff, Math.sin(a) * swarmR);
      m.userData = { baseY: yOff, idx: i };
      scene.add(m); agents.push(m); allInteractive.push(m);
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([m.position, origin]), aBrainLine));
    }
    for (let i = 0; i < agentCount; i++) {
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([agents[i].position, agents[(i + 1) % agentCount].position]), meshLine));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([agents[i].position, agents[(i + 5) % agentCount].position]), meshLine));
    }

    // Orbits
    const outerOrbit = new THREE.Mesh(new THREE.RingGeometry(swarmR - 0.04, swarmR + 0.04, 128),
      new THREE.MeshBasicMaterial({ color: TEAL_DARK, transparent: true, opacity: 0.06, side: THREE.DoubleSide }));
    outerOrbit.rotation.x = Math.PI / 2; scene.add(outerOrbit);
    const innerOrbit = new THREE.Mesh(new THREE.RingGeometry(triR - 0.03, triR + 0.03, 80),
      new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.04, side: THREE.DoubleSide }));
    innerOrbit.rotation.x = Math.PI / 2; scene.add(innerOrbit);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(350 * 3);
    for (let i = 0; i < 350; i++) { pPos[i*3]=(Math.random()-0.5)*50; pPos[i*3+1]=(Math.random()-0.5)*25; pPos[i*3+2]=(Math.random()-0.5)*50; }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: QDRANT_PURPLE, size: 0.05, transparent: true, opacity: 0.35 })));

    // Flow particles
    const flowParticles: THREE.Mesh[] = [];
    const flowData: { progress: number; speed: number; srcIdx: number; type: string }[] = [];
    for (let i = 0; i < 30; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshBasicMaterial({ color: QDRANT_PURPLE, transparent: true, opacity: 0.6 }));
      scene.add(p); flowParticles.push(p);
      flowData.push({ progress: Math.random(), speed: 0.002 + Math.random() * 0.004, srcIdx: Math.floor(Math.random() * agentCount), type: Math.random() > 0.5 ? 'a' : 't' });
    }

    // Interaction: bleep on hover
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / w) * 2 - 1;
      mouse.y = -(e.clientY / h) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(allInteractive);
      if (hits.length > 0 && Date.now() - lastBleep > 200) {
        lastBleep = Date.now();
        audioRef.current.bleep();
      }
    };
    container.addEventListener('mousemove', onMouseMove);

    // Click bleep
    const onClick = () => { audioRef.current.init(); audioRef.current.bleep(); };
    container.addEventListener('click', onClick);

    // Animation
    const clock = new THREE.Clock();
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => { mouseX = (e.clientX / w - 0.5) * 2; mouseY = (e.clientY / h - 0.5) * 2; };
    container.addEventListener('mousemove', onMouse);

    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const camAngle = t * 0.06 + mouseX * 0.3;
      camera.position.set(Math.sin(camAngle) * 26, 8 + Math.sin(t * 0.12) * 3 - mouseY * 3, Math.cos(camAngle) * 26);
      camera.lookAt(0, 0, 0);
      const pulse = 1 + Math.sin(t * 2) * 0.04;
      brainMesh.scale.set(pulse, pulse, pulse);
      brainMat.emissiveIntensity = 0.6 + Math.sin(t * 1.5) * 0.15;
      pLight.intensity = 2 + Math.sin(t * 1.5) * 0.8;
      brainGroup.rotation.y = t * 0.25;
      agents.forEach(a => { a.position.y = (a.userData.baseY as number) + Math.sin(t * 0.4 + (a.userData.idx as number)) * 0.35; });
      triNodes.forEach((n, i) => { const s = 1 + Math.sin(t * 0.8 + i * 2.1) * 0.06; n.scale.set(s, s, s); });
      flowParticles.forEach((p, i) => {
        const d = flowData[i]; d.progress += d.speed;
        if (d.progress > 1) { d.progress = 0; d.srcIdx = Math.floor(Math.random() * agentCount); d.type = Math.random() > 0.5 ? 'a' : 't'; }
        const src = d.type === 'a' ? agents[d.srcIdx % agents.length].position : triNodes[d.srcIdx % 3].position;
        p.position.lerpVectors(src, origin, d.progress);
        (p.material as THREE.MeshBasicMaterial).opacity = Math.sin(d.progress * Math.PI) * 0.6;
      });
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      const nw = container.clientWidth, nh = container.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousemove', onMouse);
      container.removeEventListener('click', onClick);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ zIndex: 10 }}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Title - lowered, left-aligned with 8NTIC logo position */}
      <div className="absolute pointer-events-none" style={{ top: '30%', left: 40, opacity: 0.9 }}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#b478ff] mb-3 opacity-70">
          Quantum Intelligence Protocol
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight">
          Compound Intelligence<br />& Autonomy
        </h1>
        <p className="text-sm text-white/35 mt-4 max-w-sm leading-relaxed">
          From linear to superposition. Persistent identity, reflective learning, compound intelligence.
        </p>
      </div>

      {/* Scroll down indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{
          opacity: scrollHintVisible ? 0.5 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/50">
          scroll down
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce">
          <path d="M8 4v12M3 12l5 5 5-5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Floating overlay - appears after 2s of no scroll */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{
          transition: 'transform 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.5s ease',
          transform: showOverlay ? 'translateY(0)' : 'translateY(100%)',
          opacity: showOverlay ? 1 : 0,
        }}
      >
        <div
          className="w-full px-10 pb-16 pt-32"
          style={{
            background: 'linear-gradient(to top, rgba(5,6,11,0.98) 40%, rgba(5,6,11,0.7) 75%, transparent 100%)',
          }}
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/40 mb-3 block">
              Research by Remco Vroom
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-[1.08] tracking-tight mb-4">
              Quantum Intelligence
            </h2>
            <p className="text-base lg:text-lg text-white/50 max-w-lg leading-relaxed">
              A unified theory for autonomous agent governance. From quantum mechanics
              to cognitive architecture, the missing intelligence layer in AI infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
