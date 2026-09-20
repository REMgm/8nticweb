"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { SpeakerHighIcon, SpeakerSlashIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";

type ExperienceValue = { sound: boolean; motion: boolean; toggleSound: () => void; toggleMotion: () => void; cue: () => void };
const ExperienceContext = createContext<ExperienceValue>({ sound:false, motion:true, toggleSound:()=>{}, toggleMotion:()=>{}, cue:()=>{} });
export const useExperience = () => useContext(ExperienceContext);

export function Experience({ children }: { children: ReactNode }) {
  const [sound, setSound] = useState(false);
  const [motion, setMotion] = useState(true);
  const audio = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { let saved = ""; try { saved=localStorage.getItem("8ntic-motion") || ""; } catch {} setMotion(!media.matches && saved !== "off"); };
    sync(); media.addEventListener("change",sync);
    return () => { media.removeEventListener("change",sync); void audio.current?.close(); };
  }, []);
  useEffect(() => { document.documentElement.dataset.motion = motion ? "on" : "off"; },[motion]);
  useEffect(() => {
    const sync = () => {
      document.documentElement.dataset.visible = document.hidden ? "no" : "yes";
      if (!audio.current) return;
      if (document.hidden || !sound) void audio.current.suspend();
      else void audio.current.resume();
    };
    document.addEventListener("visibilitychange",sync); sync();
    return () => document.removeEventListener("visibilitychange",sync);
  },[sound]);
  const cue = () => {
    const ctx = audio.current;
    if (!sound || !ctx || ctx.state !== "running") return;
    const oscillator = ctx.createOscillator(), envelope = ctx.createGain();
    oscillator.type="sine"; oscillator.frequency.setValueAtTime(660,ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440,ctx.currentTime+.32);
    envelope.gain.setValueAtTime(.0001,ctx.currentTime);
    envelope.gain.exponentialRampToValueAtTime(.022,ctx.currentTime+.02);
    envelope.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.5);
    oscillator.connect(envelope).connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime+.55);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  };
  useEffect(() => {
    const onDisclosure=(event:Event)=>{if(event.target instanceof HTMLDetailsElement && event.target.open)cue();};
    document.addEventListener("toggle",onDisclosure,true);
    return()=>document.removeEventListener("toggle",onDisclosure,true);
  });
  const toggleSound = async () => {
    if (sound) { setSound(false); await audio.current?.suspend(); return; }
    try {
      if (!audio.current) {
        const Audio = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
        const ctx = new Audio(); audio.current=ctx;
        const master = ctx.createGain(); master.gain.value=.009; master.connect(ctx.destination); gain.current=master;
        [110,164.81,220.2].forEach((frequency,i) => { const osc=ctx.createOscillator(); osc.type="sine"; osc.frequency.value=frequency; const g=ctx.createGain();g.gain.value=i===0?.6:.25;osc.connect(g).connect(master);osc.start(); });
      }
      await audio.current.resume(); setSound(true); setAudioUnavailable(false);
    } catch { setAudioUnavailable(true); setSound(false); }
  };
  const toggleMotion = () => setMotion(current => { try { localStorage.setItem("8ntic-motion",current?"off":"on"); } catch {} return !current; });
  return <ExperienceContext value={{sound,motion,toggleSound,toggleMotion,cue}}>{children}<span className="sr-only" role="status">{audioUnavailable ? "Sound is unavailable in this browser." : ""}</span></ExperienceContext>;
}

export function ExperienceControls() {
  const { sound,motion,toggleSound,toggleMotion } = useExperience();
  return <div className="experience-controls">
    <button className="icon-button sound-toggle" onClick={toggleSound} aria-label={sound?"Turn sound off":"Turn subtle sound on"} aria-pressed={sound} title={sound?"Sound on":"Sound off"}>{sound?<SpeakerHighIcon size={19}/>:<SpeakerSlashIcon size={19}/>}<span className="desktop-control-label">Sound {sound?"on":"off"}</span></button>
    <button className="icon-button" onClick={toggleMotion} aria-label={motion?"Pause ambient motion":"Enable ambient motion"} aria-pressed={!motion} title={motion?"Pause motion":"Enable motion"}>{motion?<PauseIcon size={17}/>:<PlayIcon size={17}/>}</button>
  </div>;
}
