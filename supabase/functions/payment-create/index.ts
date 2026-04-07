import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ABACATE_API  = 'https://api.abacatepay.com/v1';
const ABACATE_KEY  = Deno.env.get('ABACATEPAY_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    if (authError || !user) {
      console.error('Auth error:', authError?.message);
      return json({ error: 'Não autorizado' }, 401);
    }

    console.log('Auth OK, user_id:', user.id);

    // ── 2. Body ───────────────────────────────────────────────────────────────
    let taxId = '';
    let cellphoneBody = '';
    try {
      const t = await req.text();
      if (t && t.trim() !== '{}' && t.trim() !== '') {
        const b = JSON.parse(t);
        taxId         = String(b.taxId        ?? '').replace(/\D/g, '');
        cellphoneBody = String(b.cellphone    ?? '').replace(/\D/g, '');
      }
    } catch { /* sem body */ }

    if (!taxId) return json({ error: 'CPF/CNPJ obrigatório', code: 'MISSING_TAXID' }, 400);

    // ── 3. Admin client ───────────────────────────────────────────────────────
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    // ── 4. Buscar perfil ──────────────────────────────────────────────────────
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('username, display_name, plan, whatsapp_number')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return json({ error: 'Perfil não encontrado' }, 404);
    if (profile.plan === 'pro') return json({ error: 'Você já é PRO!' }, 400);

    // Cellphone: prioridade body > whatsapp_number do perfil
    const cellphone =
      cellphoneBody ||
      ((profile.whatsapp_number as string | null)?.replace(/\D/g, '') ?? '');

    if (!cellphone) return json({ error: 'Telefone obrigatório', code: 'MISSING_PHONE' }, 400);

    // ── 5. Criar billing ──────────────────────────────────────────────────────
    console.log('Criando billing na AbacatePay...');
    const billingRes = await fetch(`${ABACATE_API}/billing/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods:   ['PIX'],
        products:  [{
          externalId:  'linques-pro',
          name:        'linqu.es PRO',
          description: 'Plano PRO mensal — temas exclusivos e recursos avançados',
          quantity:    1,
          price:       990,
        }],
        returnUrl:     'https://linqu.es/dashboard?upgrade=success',
        completionUrl: 'https://linqu.es/dashboard?upgrade=success',
        customer: {
          name:      profile.display_name || profile.username,
          email:     user.email ?? '',
          cellphone,
          taxId,
        },
        metadata: { user_id: user.id },
      }),
    });

    const billingBody = await billingRes.text();
    console.log('Billing response status:', billingRes.status);
    console.log('Billing response body:', billingBody);

    let billing: any;
    try { billing = JSON.parse(billingBody); } catch { billing = {}; }

    if (!billingRes.ok || !billing.data?.id) {
      return json({ error: 'Erro ao criar cobrança no AbacatePay', detail: billingBody }, 500);
    }

    // Salva o customer_id para futuras cobranças (sem precisar de CPF de novo)
    const custId = billing.data.customer?.id as string | undefined;
    await admin.from('profiles').update({
      abacate_billing_id: billing.data.id,
      ...(custId ? { abacate_customer_id: custId } : {}),
    }).eq('id', user.id);

    return json({ checkout_url: billing.data.url }, 200);

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
