export function trackEvent(name: string, label?: string) {
  if (typeof window === "undefined") return;

  try {
    // GA4
    if (typeof window.gtag === "function") {
      window.gtag("event", name, { event_label: label });
    }
  } catch {
    /* ga4 not configured */
  }

  try {
    // Log to our own analytics API
    const body: Record<string, string> = { event: name };
    if (label) body.label = label;
    navigator.sendBeacon("/api/track", new Blob([JSON.stringify(body)], { type: "application/json" }));
  } catch {
    /* offline */
  }
}
