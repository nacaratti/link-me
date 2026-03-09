import { describe, it, expect } from 'vitest';
import {
  linkLimitReached,
  canUseTheme,
  linkBlockMessage,
  themeBlockMessage,
  FREE_LINK_LIMIT,
} from '../lib/plans';

// ─── linkLimitReached ─────────────────────────────────────────────────────────

describe('linkLimitReached', () => {
  it('retorna false para usuário pro independente da quantidade', () => {
    expect(linkLimitReached(0,  'pro')).toBe(false);
    expect(linkLimitReached(5,  'pro')).toBe(false);
    expect(linkLimitReached(100,'pro')).toBe(false);
  });

  it('retorna false quando usuário free tem menos que o limite', () => {
    expect(linkLimitReached(0, 'free')).toBe(false);
    expect(linkLimitReached(FREE_LINK_LIMIT - 1, 'free')).toBe(false);
  });

  it('retorna true quando usuário free atinge exatamente o limite', () => {
    expect(linkLimitReached(FREE_LINK_LIMIT, 'free')).toBe(true);
  });

  it('retorna true quando usuário free excede o limite', () => {
    expect(linkLimitReached(FREE_LINK_LIMIT + 1, 'free')).toBe(true);
    expect(linkLimitReached(50, 'free')).toBe(true);
  });
});

// ─── canUseTheme ──────────────────────────────────────────────────────────────

describe('canUseTheme', () => {
  it('usuário pro pode usar qualquer tema', () => {
    expect(canUseTheme(false, 'pro')).toBe(true);
    expect(canUseTheme(true,  'pro')).toBe(true);
  });

  it('usuário free pode usar tema gratuito', () => {
    expect(canUseTheme(false, 'free')).toBe(true);
  });

  it('usuário free não pode usar tema pro', () => {
    expect(canUseTheme(true, 'free')).toBe(false);
  });
});

// ─── mensagens ────────────────────────────────────────────────────────────────

describe('linkBlockMessage', () => {
  it('retorna string vazia para usuário pro', () => {
    expect(linkBlockMessage('pro')).toBe('');
  });

  it('menciona o limite no texto para usuário free', () => {
    const msg = linkBlockMessage('free');
    expect(msg).toContain(String(FREE_LINK_LIMIT));
    expect(msg.length).toBeGreaterThan(10);
  });
});

describe('themeBlockMessage', () => {
  it('retorna mensagem não vazia', () => {
    expect(themeBlockMessage().length).toBeGreaterThan(10);
  });
});
