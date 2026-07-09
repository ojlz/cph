"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { trackEvent } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const SESSION_KEY = "analytics_session";
    const SESSION_TTL = 30 * 60 * 1000; // 30 min
    const last = localStorage.getItem(SESSION_KEY);
    const now = Date.now();
    const isNewSession = !last || now - Number(last) > SESSION_TTL;

    if (isNewSession) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([JSON.stringify({ event: "session" })], { type: "application/json" }),
      );
    }
    localStorage.setItem(SESSION_KEY, String(now));

    if (typeof window.gtag === "function" && GA_ID) {
      window.gtag("config", GA_ID, { page_path: pathname });
    }
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-track]") as HTMLElement | null;
      if (!el) return;
      const event = el.getAttribute("data-track")!;
      const label = el.getAttribute("data-track-label");
      trackEvent(event, label || undefined);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <Analytics />
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: location.pathname });
            `}
          </Script>
        </>
      )}
    </>
  );
}
