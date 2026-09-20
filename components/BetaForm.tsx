"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CONSENT_TEXT, CONSENT_VERSION, RECEIVED_MESSAGE, UNAVAILABLE_MESSAGE, validateSignup, type FieldErrors } from "../lib/beta/validation";

export function BetaForm() {
  const id = useId();
  const summary = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [received, setReceived] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  function showErrors(next: FieldErrors, text: string) {
    setErrors(next);
    setMessage(text);
    requestAnimationFrame(() => summary.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const payload = { name: data.get("name"), email: data.get("email"), consent: data.get("consent") === "on", consentVersion: CONSENT_VERSION, website: data.get("website") || "" };
    const validation = validateSignup(payload);
    if (!validation.ok) { showErrors(validation.errors, "Please check the details below."); return; }
    setPending(true); setErrors({}); setMessage("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch("/api/beta-signups", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), signal: controller.signal,
      });
      const body = await response.json();
      if (response.status === 200 && body.message === RECEIVED_MESSAGE) {
        setReceived(true);
        requestAnimationFrame(() => summary.current?.focus());
      } else {
        showErrors(body.errors || {}, body.message || UNAVAILABLE_MESSAGE);
      }
    } catch { showErrors({}, UNAVAILABLE_MESSAGE); }
    finally { window.clearTimeout(timeout); setPending(false); }
  }

  if (received) return (
    <div className="beta-form beta-success" ref={summary} tabIndex={-1} role="status">
      <span className="success-orbit" aria-hidden="true">↗</span>
      <h3>Your request has arrived.</h3>
      <p>{RECEIVED_MESSAGE}</p>
      <p className="form-note">This is a request for updates. It does not grant beta access.</p>
    </div>
  );

  return (
    <form className="beta-form" action="/api/beta-signups" method="post" onSubmit={submit} noValidate aria-busy={pending}>
      <div ref={summary} tabIndex={-1} role={message ? "alert" : undefined} className={message ? "form-error form-summary" : "form-summary"}>
        {message && <p>{message}</p>}
        {errors.form && <p>{errors.form}</p>}
        {errors.consentVersion && <p>{errors.consentVersion}</p>}
      </div>
      <div className="form-fields">
        <div className="form-field">
          <label className="field-label" htmlFor={`${id}-name`}>Your name</label>
          <input className="field-input" id={`${id}-name`} name="name" autoComplete="name" placeholder="What should we call you?" maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} />
          {errors.name && <p id={`${id}-name-error`} className="form-error">{errors.name}</p>}
        </div>
        <div className="form-field">
          <label className="field-label" htmlFor={`${id}-email`}>Email address</label>
          <input className="field-input" id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@yourcompany.com" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${id}-email-error` : undefined} />
          {errors.email && <p id={`${id}-email-error`} className="form-error">{errors.email}</p>}
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent" htmlFor={`${id}-consent`}>
        <input id={`${id}-consent`} name="consent" type="checkbox" required aria-invalid={Boolean(errors.consent)} aria-describedby={`${id}-privacy${errors.consent ? ` ${id}-consent-error` : ""}`} />
        <span>{CONSENT_TEXT}</span>
      </label>
      {errors.consent && <p id={`${id}-consent-error`} className="form-error">{errors.consent}</p>}
      <button type="submit" className="button button-primary beta-submit" disabled={pending}>
        {pending ? "Sending your request…" : "Keep me in the loop"}<span aria-hidden="true">↗</span>
      </button>
      <p id={`${id}-privacy`} className="form-note">Future emails will include an unsubscribe link. Your details are used for updates, never model training. <a href="/privacy">Privacy notice</a></p>
      <noscript><p className="form-note">JavaScript is needed to send this form. You can still explore every project and publication.</p></noscript>
    </form>
  );
}
