import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@17';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
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

    // ── 2. Buscar subscription ID do perfil ───────────────────────────────────
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('plan, stripe_subscription_id, pro_expires_at')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return json({ error: 'Perfil não encontrado' }, 404);
    if (profile.plan !== 'pro') return json({ error: 'Você não possui um plano PRO ativo' }, 400);

    const subscriptionId = profile.stripe_subscription_id as string | null;
    if (!subscriptionId) return json({ error: 'Assinatura não encontrada' }, 404);

    // ── 3. Cancelar no Stripe (ao fim do período) ─────────────────────────────
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();

    // Salva a data de expiração para exibir no dashboard
    await admin.from('profiles').update({ pro_expires_at: expiresAt }).eq('id', user.id);

    console.log(`Cancelamento agendado: user_id=${user.id} expira=${expiresAt}`);
    return json({ expires_at: expiresAt }, 200);

  } catch (err) {
    console.error('Erro ao cancelar assinatura:', err);
    return json({ error: 'Erro interno', detail: String(err) }, 500);
  }
});

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
