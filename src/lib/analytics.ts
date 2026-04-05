import { supabase } from './supabase';

// Generate a simple session ID for anonymous tracking
function getSessionId(): string {
  const key = '8ntic_session_id';
  let sessionId = window.sessionStorage?.getItem(key) ?? null;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    try { window.sessionStorage.setItem(key, sessionId); } catch {}
  }
  return sessionId;
}

interface TrackEventParams {
  event_type: string;
  event_data?: Record<string, unknown>;
  page?: string;
}

export async function trackEvent({ event_type, event_data, page }: TrackEventParams) {
  if (!supabase) return;
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('analytics_events').insert({
      event_type,
      event_data: event_data || {},
      page: page || window.location.pathname + window.location.hash,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: getSessionId(),
      user_id: user?.id || null,
    });
  } catch (err) {
    // Silent fail - analytics should never break the app
    console.debug('[analytics]', err);
  }
}

// Convenience wrappers
export const trackPageView = (page?: string) =>
  trackEvent({ event_type: 'page_view', page });

export const trackClick = (element: string, extra?: Record<string, unknown>) =>
  trackEvent({ event_type: 'click', event_data: { element, ...extra } });

export const trackSectionView = (section: string) =>
  trackEvent({ event_type: 'section_view', event_data: { section } });

export const trackFormSubmit = (form: string, extra?: Record<string, unknown>) =>
  trackEvent({ event_type: 'form_submit', event_data: { form, ...extra } });
