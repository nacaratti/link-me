import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@17';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_PRICE_ID   = Deno.env.get('STRIPE_PRICE_ID')!;
const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY          = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_KEY       = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ── 1. Autenticar usuário ─────────────────────────────────────────────────
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
      auth:   { persistSession: false },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return json({ error: 'Não autorizado' }, 401);

    // ── 2. Buscar perfil ──────────────────────────────────────────────────────
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('plan, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return json({ error: 'Perfil não encontrado' }, 404);
    if (profile.plan === 'pro') return json({ error: 'Você já é PRO!' }, 400);

    // ── 3. Criar Stripe Checkout Session ──────────────────────────────────────
    let existingCustomer = profile.stripe_customer_id as string | null;

    const buildParams = (customerId: string | null) => ({
      mode:        'subscription' as const,
      line_items:  [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: 'https://linqu.es/dashboard?upgrade=success',
      cancel_url:  'https://linqu.es/upgrade',
      client_reference_id: user.id,
      ...(customerId
        ? { customer: customerId }
        : { customer_email: user.email ?? undefined }
      ),
      subscription_data: { metadata: { user_id: user.id } },
      metadata: { user_id: user.id },
    });

    let session;
    try {
      session = await stripe.checkout.sessions.create(buildParams(existingCustomer));
    } catch (err: any) {
      // Customer ID inválido ou de outro ambiente (test/live) — limpa e recria sem ele
      if (err?.code === 'resource_missing' && err?.param === 'customer') {
        console.warn('stripe_customer_id inválido, limpando e recriando sem customer:', existingCustomer);
        await admin.from('profiles').update({ stripe_customer_id: null }).eq('id', user.id);
        existingCustomer = null;
        session = await stripe.checkout.sessions.create(buildParams(null));
      } else {
        throw err;
      }
    }

    return json({ checkout_url: session.url }, 200);

  } catch (err) {
    console.error('Erro inesperado:', err);
    return json({ error: 'Erro interno', detail: String(err) }, 500);
  }
});

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
