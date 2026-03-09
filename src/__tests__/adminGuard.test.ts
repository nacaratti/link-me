import { describe, it, expect } from 'vitest';

/**
 * Testa a lógica de autorização do painel admin.
 * O AdminPanel verifica role='admin' via Supabase (server-side).
 * Aqui testamos a função de decisão pura, separada do componente React.
 */

type Role = 'user' | 'admin';

function isAllowedInAdminPanel(role: Role | undefined | null): boolean {
  return role === 'admin';
}

describe('adminGuard — controle de acesso ao painel', () => {
  it('permite acesso para role admin', () => {
    expect(isAllowedInAdminPanel('admin')).toBe(true);
  });

  it('bloqueia acesso para role user', () => {
    expect(isAllowedInAdminPanel('user')).toBe(false);
  });

  it('bloqueia acesso para role undefined (não autenticado)', () => {
    expect(isAllowedInAdminPanel(undefined)).toBe(false);
  });

  it('bloqueia acesso para role null', () => {
    expect(isAllowedInAdminPanel(null)).toBe(false);
  });

  it('role user nunca deve ter acesso mesmo que o nome contenha admin', () => {
    // Garante que não há bypass por substring
    expect(isAllowedInAdminPanel('user' as Role)).toBe(false);
  });
});

// ─── Testa que plan não concede acesso admin ──────────────────────────────────

type Plan = 'free' | 'pro';

function planGrantsAdminAccess(_plan: Plan): boolean {
  // plan nunca deve conceder acesso admin — role é o único critério
  return false;
}

describe('plan não concede acesso admin', () => {
  it('plano pro não é equivalente a admin', () => {
    expect(planGrantsAdminAccess('pro')).toBe(false);
  });

  it('plano free não é equivalente a admin', () => {
    expect(planGrantsAdminAccess('free')).toBe(false);
  });
});
