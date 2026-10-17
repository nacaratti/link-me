"use client";

import { useEffect } from "react";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

const HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

function rpc(fn: string, body: Record<string, unknown>) {
  // keepalive: o clique abre outra aba/app e a requisição não pode morrer junto
  fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

function context() {
  const ua = navigator.userAgent;
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android/i.test(ua) ? "mobile" : "desktop";
  let referrer: string | null = null;
  if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      referrer = host === location.hostname ? null : host;
    } catch {
      referrer = null;
    }
  }
  return { p_device: device, p_referrer: referrer };
}

/**
 * Conta a visita e os cliques da página pública. Os modelos continuam
 * Server Components: os links só marcam data-block (ou data-track="whatsapp")
 * e um único listener aqui faz o resto.
 */
export default function Tracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    rpc("track_view", { p_profile: profileId, ...context() });

    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.("a[data-block], a[data-track='whatsapp']");
      if (!a) return;
      const block = a.getAttribute("data-block");
      rpc("track_click", { p_profile: profileId, p_block: block, ...context() });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [profileId]);

  return null;
}
