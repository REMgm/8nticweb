"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, Pause, Play, Plus } from "@phosphor-icons/react";
import { tokenRaceDuration, tokenRaceProgress, tokenRaceRunners, tokenRaceTarget } from "@/lib/publications";
import { useExperience } from "@/components/Experience";

export function TokenRace() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [pauseReason, setPauseReason] = useState<"hidden" | "offscreen" | null>(null);
  const { motion, cue } = useExperience();
  const motionOff = reducedMotion || !motion;
  const elapsedRef = useRef(0);
  const figureRef = useRef<HTMLElement>(null);

  function updateTime(seconds: number) {
    elapsedRef.current = seconds;
    setElapsed(seconds);
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(media.matches);
      if (media.matches) {
        setRunning(false);
        elapsedRef.current = tokenRaceDuration;
        setElapsed(tokenRaceDuration);
        setAnnouncement("Reduced motion is on. The static comparison shows the result after 22 seconds.");
      }
    };
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!motion) setRunning(false);
  }, [motion]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) {
        setRunning(false);
        if (elapsedRef.current > 0 && elapsedRef.current < tokenRaceDuration) setPauseReason("hidden");
      }
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setRunning(false);
        if (elapsedRef.current > 0 && elapsedRef.current < tokenRaceDuration) setPauseReason("offscreen");
      }
    });
    if (figureRef.current) observer.observe(figureRef.current);
    return () => {
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running || motionOff) return;
    const start = performance.now() - elapsedRef.current * 1000;
    const tick = () => {
      const nextTime = Math.min(tokenRaceDuration, (performance.now() - start) / 1000);
      elapsedRef.current = nextTime;
      setElapsed(nextTime);
      if (nextTime >= tokenRaceDuration) {
        window.clearInterval(timer);
        setRunning(false);
        setAnnouncement("Comparison complete. After 22 seconds, all four model lanes have reached 1,000 tokens. The human thinking assumption reaches 220 tokens, and speaking reaches 88.");
      }
    };
    const timer = window.setInterval(tick, 80);
    return () => window.clearInterval(timer);
  }, [running, motionOff]);

  function togglePlayback() {
    setPauseReason(null);
    if (motionOff) {
      cue();
      updateTime(tokenRaceDuration);
      setAnnouncement("Static result: all model lanes finish within 16.7 seconds. After 22 seconds the human thinking assumption is at 22 percent and speaking at 8.8 percent.");
      return;
    }
    if (running) {
      setRunning(false);
      setAnnouncement(`Paused at ${elapsedRef.current.toFixed(1)} seconds.`);
      return;
    }
    if (elapsedRef.current >= tokenRaceDuration) updateTime(0);
    cue();
    setRunning(true);
    setAnnouncement("Playing a 22-second illustration at real elapsed time, using the author's historical assumptions.");
  }

  function restart() {
    setRunning(false);
    setPauseReason(null);
    updateTime(0);
    setAnnouncement("Comparison reset. All lanes are at zero. Choose play to start again.");
  }

  return (
    <figure className={`token-race${running ? " token-race-running" : ""}`} ref={figureRef} aria-labelledby="token-race-title" aria-describedby="token-race-context">
      <div className="token-race-head">
        <div>
          <p className="pub-eyebrow">AN ILLUSTRATION IN REAL TIME</p>
          <h2 id="token-race-title" tabIndex={-1}>One thousand tokens.<br />The same finish line.</h2>
        </div>
        <div className="token-clock"><span aria-hidden="true">{elapsed.toFixed(1)}<small>s</small></span><span className="token-sr-only">{elapsed.toFixed(1)} seconds elapsed</span><small>of 22 seconds</small></div>
      </div>
      <p id="token-race-context" className="token-context">Historical, illustrative author assumptions, not live benchmarks. Model output and human token equivalents are different measures. This race compares their assumed pace, not intelligence.</p>
      <noscript><style>{`.token-controls { display: none !important; }`}</style><p className="token-no-script">The animation needs JavaScript. You can read every rate and finish time in “Read the numbers without the animation” below.</p></noscript>
      <div className="token-controls">
        <button type="button" className="token-play" onClick={togglePlayback} aria-controls="token-lanes">
          {running ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
          {motionOff ? "Show 22-second result" : running ? "Pause" : elapsed >= tokenRaceDuration ? "Play again" : elapsed > 0 ? "Resume" : "Play the comparison"}
        </button>
        <button type="button" className="token-restart" onClick={restart} aria-controls="token-lanes"><ArrowCounterClockwise size={17} aria-hidden="true" />Restart</button>
        <span className="token-control-note">{motionOff ? "Motion off. A static result." : pauseReason === "hidden" ? "Paused while this tab was hidden. Resume when you’re ready." : pauseReason === "offscreen" ? "Paused while you were reading elsewhere. Resume when you’re ready." : running ? "Playing at real elapsed time. Pause whenever you like." : elapsed > 0 && elapsed < tokenRaceDuration ? "Paused. Your place in the comparison is kept." : "You set the pace. Pause whenever you like."}</span>
      </div>
      <div id="token-lanes" className="token-lanes">
        {tokenRaceRunners.map((runner) => {
          const progress = tokenRaceProgress(runner.rate, elapsed);
          return (
            <div key={runner.id} className={`token-lane token-lane-${runner.kind}${progress.finished ? " token-finished" : ""}`}>
              <div className="token-lane-name">{runner.name}<small>{runner.rate} tokens / second</small></div>
              <div className="token-rail" aria-hidden="true"><div className="token-fill" style={{ transform: `scaleX(${progress.percent / 100})` }} /><span className="token-finish-line" /></div>
              <div className="token-lane-value" aria-label={`${runner.name}: ${Math.round(progress.tokens)} of ${tokenRaceTarget} tokens`}>
                <span>{progress.finished ? "1,000" : Math.floor(progress.tokens).toLocaleString("en-US")}<small> tokens</small></span>
                <small>{progress.finished ? `Finished in ${progress.finishSeconds.toFixed(1)}s` : `${progress.percent.toFixed(1)}% of the way`}</small>
              </div>
            </div>
          );
        })}
      </div>
      <p className="token-verdict">{elapsed >= tokenRaceDuration ? "Twenty-two seconds later: every model has finished. The speaking lane has reached 88 tokens." : "The first lane finishes in about two seconds. At the assumed speaking pace, the same distance takes 250."}</p>
      <div className="token-sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      <details className="token-static-data">
        <summary><span>Read the numbers without the animation</span><Plus size={18} aria-hidden="true" /></summary>
        <div className="token-data-rows">
          {tokenRaceRunners.map((runner) => <p key={runner.id}><strong>{runner.name}</strong><span>{runner.rate} tokens/s · 1,000 tokens in {(tokenRaceTarget / runner.rate).toFixed(1)} seconds</span></p>)}
        </div>
        <p>The illustration runs for 22 seconds. At that point the thinking assumption reaches 220 tokens and the speaking assumption reaches 88. It excludes first-token latency and changes in throughput.</p>
      </details>
      <figcaption><strong>A thousand tokens, everybody off the line together</strong>Nobody draws this race honestly, because the honest version is embarrassing. Gemini is done before you have cleared your throat. Your lane is still moving at the end of the article.<span className="token-source-note">Author’s caption. Draft attribution: Artificial Analysis model leaderboards and published Groq and Gemini Flash benchmarks. Sources retrieved 15 September 2026. <a href="#token-sources">Read source context</a>.</span></figcaption>
    </figure>
  );
}
