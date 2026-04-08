import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@17';

const STRIPE_SECRET_KEY     = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY           = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature') ?? '';
  const rawBody   = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.warn('Assinatura inválida no webhook Stripe:', err);
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // ── Assinatura ativada (checkout concluído) ───────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId  = session.client_reference_id ?? (session.metadata?.user_id);

    if (!userId) {
      console.error('Webhook checkout.session.completed sem user_id:', event.id);
      return new Response('Bad Request', { status: 400 });
    }

    const customerId      = typeof session.customer     === 'string' ? session.customer     : session.customer?.id;
    const subscriptionId  = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    // Busca data de renovação da assinatura para exibir no dashboard
    let proExpiresAt: string | null = null;
    if (subscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        proExpiresAt = new Date(sub.current_period_end * 1000).toISOString();
      } catch (e) {
        console.warn('Não foi possível buscar current_period_end:', e);
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        plan:                   'pro',
        stripe_customer_id:     customerId     ?? null,
        stripe_subscription_id: subscriptionId ?? null,
        pro_expires_at:         proExpiresAt,
      })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao ativar PRO:', error);
      return new Response('Internal Server Error', { status: 500 });
    }

    console.log(`PRO ativado: user_id=${userId} subscription=${subscriptionId}`);
  }

  // ── Assinatura cancelada / expirada ───────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const userId       = subscription.metadata?.user_id;
    const customerId   = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

    if (userId) {
      await supabase
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('id', userId);
      console.log(`PRO cancelado: user_id=${userId}`);
    } else {
      // fallback via customer_id caso metadata não esteja preenchido
      await supabase
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('stripe_customer_id', customerId);
      console.log(`PRO cancelado via stripe_customer_id=${customerId}`);
    }
  }

  return new Response('ok', { status: 200 });
});
