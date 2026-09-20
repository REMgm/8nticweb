"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { SpeakerHighIcon, SpeakerSlashIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";

type ExperienceValue = {
  sound: boolean;
  soundPending: boolean;
  motion: boolean;
  reducedMotion: boolean;
  toggleSound: () => void;
  toggleMotion: () => void;
  cue: () => void;
};
const ExperienceContext = createContext<ExperienceValue>({ sound:false, soundPending:false, motion:true, reducedMotion:false, toggleSound:()=>{}, toggleMotion:()=>{}, cue:()=>{} });
export const useExperience = () => useContext(ExperienceContext);

export function Experience({ children }: { children: ReactNode }) {
  const [sound, setSound] = useState(false);
  const [soundPending, setSoundPending] = useState(false);
  const [motionPreference, setMotionPreference] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const soundRequested = useRef(false);
  const audioBusy = useRef(false);
  const motion = motionPreference && !reducedMotion;

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const syncSystem = () => setReducedMotion(media.matches);
    const syncSaved = () => {
      try { setMotionPreference(localStorage.getItem("8ntic-motion") !== "off"); } catch { /* Storage may be unavailable in private browsing. */ }
    };
    const storageChanged = (event: StorageEvent) => { if (event.key === "8ntic-motion" || event.key === null) syncSaved(); };
    syncSystem(); syncSaved();
    media.addEventListener("change", syncSystem);
    window.addEventListener("storage", storageChanged);
    return () => {
      media.removeEventListener("change", syncSystem);
      window.removeEventListener("storage", storageChanged);
      const context = audio.current;
      audio.current = null;
      masterGain.current = null;
      if (context && context.state !== "closed") void context.close().catch(() => {});
    };
  }, []);

  useEffect(() => { document.documentElement.dataset.motion = motion ? "on" : "off"; }, [motion]);

  const audioFailed = useCallback((context: AudioContext) => {
    if (audio.current !== context) return;
    if (masterGain.current) masterGain.current.gain.value = 0;
    soundRequested.current = false;
    setSound(false);
    setAudioUnavailable(true);
  }, []);

  useEffect(() => {
    const sync = () => {
      document.documentElement.dataset.visible = document.hidden ? "no" : "yes";
      const context = audio.current;
      if (!context || context.state === "closed") return;
      const operation = document.hidden || !soundRequested.current ? context.suspend() : context.resume();
      void operation.catch(() => audioFailed(context));
    };
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => document.removeEventListener("visibilitychange", sync);
  }, [sound, audioFailed]);

  const cue = useCallback(() => {
    const context = audio.current, master = masterGain.current;
    if (!sound || !context || !master || context.state !== "running" || document.hidden) return;
    const oscillator = context.createOscillator(), envelope = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + .32);
    envelope.gain.setValueAtTime(.0001, context.currentTime);
    envelope.gain.exponentialRampToValueAtTime(.022, context.currentTime + .02);
    envelope.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .5);
    oscillator.connect(envelope).connect(master);
    oscillator.start(); oscillator.stop(context.currentTime + .55);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }, [sound]);

  useEffect(() => {
    const onDisclosure = (event: Event) => { if (event.target instanceof HTMLDetailsElement && event.target.open) cue(); };
    document.addEventListener("toggle", onDisclosure, true);
    return () => document.removeEventListener("toggle", onDisclosure, true);
  }, [cue]);

  const toggleSound = async () => {
    if (audioBusy.current) return;
    audioBusy.current = true;
    setSoundPending(true);
    try {
      if (soundRequested.current) {
        soundRequested.current = false;
        setSound(false);
        // Mute both the ambience and any unfinished cue immediately.
        if (masterGain.current) masterGain.current.gain.value = 0;
        await audio.current?.suspend();
        return;
      }
      if (!audio.current || audio.current.state === "closed") {
        const Audio = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const context = new Audio();
        audio.current = context;
        const master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
        masterGain.current = master;
        [110, 164.81, 220.2].forEach((frequency, index) => {
          const oscillator = context.createOscillator(), level = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          level.gain.value = .009 * (index === 0 ? .6 : .25);
          oscillator.connect(level).connect(master);
          oscillator.start();
        });
      }
      const context = audio.current;
      await context.resume();
      if (audio.current !== context) return;
      if (masterGain.current) masterGain.current.gain.value = 1;
      soundRequested.current = true;
      setSound(true);
      setAudioUnavailable(false);
      if (document.hidden) await context.suspend();
    } catch {
      if (masterGain.current) masterGain.current.gain.value = 0;
      soundRequested.current = false;
      setAudioUnavailable(true);
      setSound(false);
    } finally {
      audioBusy.current = false;
      setSoundPending(false);
    }
  };

  const toggleMotion = () => {
    if (reducedMotion) return;
    setMotionPreference(current => {
      try { localStorage.setItem("8ntic-motion", current ? "off" : "on"); } catch { /* The current page can still honor the choice. */ }
      return !current;
    });
  };

  return <ExperienceContext value={{ sound, soundPending, motion, reducedMotion, toggleSound, toggleMotion, cue }}>{children}<span className="sr-only" role="status">{audioUnavailable ? "Sound is unavailable in this browser." : ""}</span><span id="motion-preference-note" className="sr-only">{reducedMotion ? "Motion is disabled by your device’s reduced-motion preference." : ""}</span></ExperienceContext>;
}

export function ExperienceControls() {
  const { sound, soundPending, motion, reducedMotion, toggleSound, toggleMotion } = useExperience();
  return <div className="experience-controls">
    <button type="button" className="icon-button sound-toggle" onClick={toggleSound} disabled={soundPending} aria-busy={soundPending} aria-label={sound ? "Turn sound off" : "Turn subtle sound on"} aria-pressed={sound} title={sound ? "Sound on" : "Sound off"}>{sound ? <SpeakerHighIcon size={19}/> : <SpeakerSlashIcon size={19}/>}<span className="desktop-control-label">Sound {sound ? "on" : "off"}</span></button>
    <button type="button" className="icon-button" onClick={toggleMotion} disabled={reducedMotion} aria-describedby={reducedMotion ? "motion-preference-note" : undefined} aria-label={motion ? "Pause ambient motion" : "Enable ambient motion"} aria-pressed={!motion} title={reducedMotion ? "Motion is disabled by your device’s reduced-motion preference." : motion ? "Pause motion" : "Enable motion"}>{motion ? <PauseIcon size={17}/> : <PlayIcon size={17}/>}</button>
  </div>;
}
