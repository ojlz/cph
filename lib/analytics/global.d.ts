interface Gtag {
  (command: "config", targetId: string, config?: Record<string, unknown>): void;
  (command: "event", eventName: string, eventParams?: Record<string, unknown>): void;
  (command: "js", date: Date): void;
  (command: "set", targetId: string, config: Record<string, unknown>): void;
}

interface Window {
  gtag?: Gtag;
  dataLayer?: unknown[];
}
