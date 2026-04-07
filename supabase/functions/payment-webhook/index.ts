import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/** Chave usada no HMAC do header X-Webhook-Signature (na doc: "public HMAC key" do painel). */
const WEBHOOK_HMAC_KEY = Deno.env.get('ABACATEPAY_WEBHOOK_SECRET')!;
const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY      = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const PRO_DURATION_DAYS = 32;

async function hmacSha256Base64(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const bytes = new Uint8Array(sig);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Compat: doc antiga mostrava digest hex em alguns exemplos; mantém verificação opcional. */
async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  const signature = req.headers.get('x-webhook-signature') ?? '';
  const rawBody   = await req.text();

  const expectedB64 = await hmacSha256Base64(WEBHOOK_HMAC_KEY, rawBody);
  const expectedHex = await hmacSha256Hex(WEBHOOK_HMAC_KEY, rawBody);
  const ok =
    (signature.length > 0 && timingSafeEqualStrings(signature, expectedB64)) ||
    (signature.length > 0 && timingSafeEqualStrings(signature, expectedHex));

  if (!ok) {
    console.warn('Assinatura inválida no webhook AbacatePay (esperado base64 ou hex HMAC-SHA256)');
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const event = payload?.event as string | undefined;
  if (!event) {
    return new Response('ok', { status: 200 });
  }

  // v2: checkout.completed | v1: billing.paid (não existe billing.charged na doc)
  const paidEvents = new Set(['checkout.completed', 'billing.paid', 'billing.charged']);
  if (!paidEvents.has(event)) {
    return new Response('ok', { status: 200 });
  }

  const data = payload?.data as Record<string, unknown> | undefined;
  if (!data || typeof data !== 'object') {
    return new Response('ok', { status: 200 });
  }

  let billingId: string | undefined;
  let userId: string | undefined;

  // Webhook v2 — checkout
  const checkout = data.checkout as Record<string, unknown> | undefined;
  if (checkout && typeof checkout === 'object') {
    billingId = checkout.id as string | undefined;
    userId =
      (checkout.externalId as string | undefined) ||
      (checkout.metadata as Record<string, unknown> | undefined)?.user_id as string | undefined;
  }

  // Webhook v1 — cobrança no root de data
  if (!billingId) {
    billingId = data.id as string | undefined;
  }
  if (!userId) {
    userId =
      (data.externalId as string | undefined) ||
      (data.metadata as Record<string, unknown> | undefined)?.user_id as string | undefined;
  }

  // Fallback: billing aninhado (se a API enviar esse formato)
  const billing = data.billing as Record<string, unknown> | undefined;
  if (billing && typeof billing === 'object') {
    billingId = billingId ?? (billing.id as string | undefined);
    userId =
      userId ||
      (billing.externalId as string | undefined) ||
      (billing.metadata as Record<string, unknown> | undefined)?.user_id as string | undefined;
  }

  if (!billingId || !userId) {
    console.error('Webhook pago sem id de cobrança ou user (externalId/metadata):', event, JSON.stringify(data));
    return new Response('Bad Request', { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + PRO_DURATION_DAYS);

  const { error } = await supabase
    .from('profiles')
    .update({
      plan:               'pro',
      pro_expires_at:     expiresAt.toISOString(),
      abacate_billing_id: billingId,
    })
    .eq('id', userId);

  if (error) {
    console.error('Erro ao atualizar perfil para PRO:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

  console.log(`PRO ativado: user_id=${userId} até ${expiresAt.toISOString()} (event=${event})`);
  return new Response('ok', { status: 200 });
});
