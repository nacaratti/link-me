import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isThemePro } from '../lib/themeConfig';
import { canUseTheme } from '../lib/plans';

// ─── isThemePro ───────────────────────────────────────────────────────────────

describe('isThemePro', () => {
  const configs = {
    default:  { id: 'default',  is_pro: false },
    aurora:   { id: 'aurora',   is_pro: true  },
    mercury:  { id: 'mercury',  is_pro: true  },
  };

  it('retorna false para tema gratuito', () => {
    expect(isThemePro(configs, 'default')).toBe(false);
  });

  it('retorna true para tema pro', () => {
    expect(isThemePro(configs, 'aurora')).toBe(true);
    expect(isThemePro(configs, 'mercury')).toBe(true);
  });

  it('retorna false quando o tema não está no config (fallback seguro)', () => {
    expect(isThemePro(configs, 'tema-inexistente')).toBe(false);
  });

  it('retorna false para objeto de configs vazio', () => {
    expect(isThemePro({}, 'aurora')).toBe(false);
  });
});

// ─── Combinação isThemePro + canUseTheme ─────────────────────────────────────

describe('controle de acesso ao tema', () => {
  const configs = {
    default: { id: 'default', is_pro: false },
    aurora:  { id: 'aurora',  is_pro: true  },
  };

  it('usuário free pode usar tema default', () => {
    const isPro = isThemePro(configs, 'default');
    expect(canUseTheme(isPro, 'free')).toBe(true);
  });

  it('usuário free não pode usar aurora', () => {
    const isPro = isThemePro(configs, 'aurora');
    expect(canUseTheme(isPro, 'free')).toBe(false);
  });

  it('usuário pro pode usar aurora', () => {
    const isPro = isThemePro(configs, 'aurora');
    expect(canUseTheme(isPro, 'pro')).toBe(true);
  });
});
