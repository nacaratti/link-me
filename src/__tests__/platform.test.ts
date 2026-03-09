import { describe, it, expect } from 'vitest';
import { FREE_LINK_LIMIT, linkLimitReached, canUseTheme } from '../lib/plans';
import { isThemePro } from '../lib/themeConfig';

/**
 * Testes de regressão — garantem que as regras principais da plataforma
 * não são alteradas acidentalmente por mudanças futuras.
 */

describe('REGRESSÃO — constantes da plataforma', () => {
  it('limite de links gratuitos é 5', () => {
    expect(FREE_LINK_LIMIT).toBe(5);
  });
});

describe('REGRESSÃO — fluxo completo de restrição de links', () => {
  it('usuário free com 4 links pode adicionar mais', () => {
    expect(linkLimitReached(4, 'free')).toBe(false);
  });

  it('usuário free com 5 links NÃO pode adicionar mais', () => {
    expect(linkLimitReached(5, 'free')).toBe(true);
  });

  it('usuário pro com 100 links ainda pode adicionar', () => {
    expect(linkLimitReached(100, 'pro')).toBe(false);
  });
});

describe('REGRESSÃO — tema "default" é sempre gratuito', () => {
  it('tema default nunca é pro, mesmo se configs estiver vazio', () => {
    // sem config no banco → fallback false → tema é gratuito
    expect(isThemePro({}, 'default')).toBe(false);
  });

  it('usuário free sempre pode usar tema default', () => {
    const isPro = isThemePro({ default: { id: 'default', is_pro: false } }, 'default');
    expect(canUseTheme(isPro, 'free')).toBe(true);
  });
});

describe('REGRESSÃO — upgrade para pro libera tudo', () => {
  const proThemes = ['mercury', 'aurora', 'laser', 'void', 'quantum', 'sunset', 'neon', 'blob', 'constellation', 'ripple', 'flow', 'fireflies'];

  it.each(proThemes)('usuário pro pode usar tema %s', (themeId) => {
    // Simula configuração pro vindas do banco
    const configs = Object.fromEntries(proThemes.map(id => [id, { id, is_pro: true }]));
    const isPro = isThemePro(configs, themeId);
    expect(canUseTheme(isPro, 'pro')).toBe(true);
  });
});

describe('REGRESSÃO — downgrade para free bloqueia temas pro', () => {
  it('ao fazer downgrade, temas pro ficam inacessíveis', () => {
    const configs = { aurora: { id: 'aurora', is_pro: true } };
    expect(canUseTheme(isThemePro(configs, 'aurora'), 'free')).toBe(false);
  });

  it('ao fazer downgrade, tema default continua acessível', () => {
    const configs = { default: { id: 'default', is_pro: false } };
    expect(canUseTheme(isThemePro(configs, 'default'), 'free')).toBe(true);
  });
});
