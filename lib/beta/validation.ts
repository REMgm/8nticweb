export const CONSENT_VERSION = "beta-research-updates-v1";
export const CONSENT_TEXT = "Email me about 8NTIC beta news and research updates.";
export const CONSENT_SCOPE = "8ntic_beta_news_and_research_updates";
export const SIGNUP_SOURCE = "8ntic_web_beta";
export const RECEIVED_MESSAGE = "Thanks. Your request has been received. We’ll respect your existing email preferences.";
export const UNAVAILABLE_MESSAGE = "We couldn’t confirm your request. Please try again.";

export type BetaSignup = { name: string; email: string; consent: true; consentVersion: string };
export type FieldErrors = Partial<Record<"name" | "email" | "consent" | "consentVersion" | "form", string>>;
export type ValidationResult = { ok: true; value: BetaSignup } | { ok: false; errors: FieldErrors };

export function validateSignup(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: { form: "Please check your details and try again." } };
  }
  const data = input as Record<string, unknown>;
  const allowed = ["name", "email", "consent", "consentVersion", "website"];
  if (Object.keys(data).some((key) => !allowed.includes(key)) ||
      (data.website !== undefined && data.website !== "")) {
    return { ok: false, errors: { form: "We couldn’t accept this request. Please try again." } };
  }
  const errors: FieldErrors = {};
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (!name || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name)) errors.name = "Enter your name, up to 100 characters.";
  if (!email || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || /[\u0000-\u001f\u007f]/.test(email)) errors.email = "Enter a valid email address.";
  if (data.consent !== true) errors.consent = "Please choose whether to receive beta news and research updates.";
  if (data.consentVersion !== CONSENT_VERSION) errors.consentVersion = "This form has changed. Refresh the page and review the email preference again.";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, email, consent: true, consentVersion: CONSENT_VERSION } };
}
