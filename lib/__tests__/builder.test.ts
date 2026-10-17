import { describe, expect, it } from "vitest";
import { buildPage, type Answers } from "../builder";
import { PROFESSIONS } from "../presets";
import { PALETTES } from "../palettes";
import { TEMPLATES } from "../templates";
import { FREE_LINK_LIMIT } from "../plans";

const base: Answers = {
  profession: "musica",
  goal: "divulgar",
  display_name: "  Marina Alves ",
  headline: "Saxofonista",
  bio: "Choro e samba.",
  links: [{ url: "instagram.com/marina" }, { url: "https://open.spotify.com/artist/1" }],
};

describe("buildPage", () => {
  it("toda profissão gera modelo e paleta válidos nos dois planos", () => {
    for (const p of PROFESSIONS) {
      for (const plan of ["free", "pro"] as const) {
        const { profile } = buildPage({ ...base, profession: p.id }, plan);
        const t = TEMPLATES.find((x) => x.id === profile.template_id);
        const pal = PALETTES.find((x) => x.id === profile.palette_id);
        expect(t, `${p.id}/${plan}`).toBeDefined();
        expect(pal, `${p.id}/${plan}`).toBeDefined();
        if (plan === "free") {
          expect(t!.free).toBe(true);
          expect(pal!.free).toBe(true);
        }
      }
    }
  });

  it("respeita a escolha da pessoa quando o plano permite", () => {
    const { profile } = buildPage({ ...base, template_id: "minimo", palette_id: "oceano" }, "free");
    expect(profile.template_id).toBe("minimo");
    expect(profile.palette_id).toBe("oceano");
  });

  it("troca modelo e paleta PRO por livres no plano grátis", () => {
    const { profile } = buildPage({ ...base, profession: "negocio", template_id: "vitrine", palette_id: "noite" }, "free");
    expect(profile.template_id).not.toBe("vitrine");
    expect(PALETTES.find((p) => p.id === profile.palette_id)!.free).toBe(true);
  });

  it("normaliza URLs, completa títulos e tira espaços", () => {
    const { profile, blocks } = buildPage(base, "free");
    expect(profile.display_name).toBe("Marina Alves");
    const links = blocks.filter((b) => b.type === "link").map((b) => b.data);
    expect(links).toContainEqual({ url: "https://instagram.com/marina", title: "Instagram" });
  });

  it("ordena os links pelo objetivo sem perder a ordem do resto", () => {
    const { blocks } = buildPage(base, "free");
    const urls = blocks.map((b) => b.data.url);
    expect(urls[0]).toContain("spotify");
    expect(urls[1]).toContain("instagram");
  });

  it("remove repetidos e corta no limite do plano", () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ url: `site${i}.com` }));
    const free = buildPage({ ...base, links: [...many, { url: "site0.com" }] }, "free");
    expect(free.blocks.filter((b) => b.type === "link")).toHaveLength(FREE_LINK_LIMIT);
    const pro = buildPage({ ...base, links: [...many, { url: "site0.com" }] }, "pro");
    expect(pro.blocks.filter((b) => b.type === "link")).toHaveLength(9);
  });

  it("monta o destaque com selo do tipo e CTA da plataforma", () => {
    const { blocks } = buildPage(
      { ...base, featured: { kind: "lancamento", title: " Rua das Flores ", url: "open.spotify.com/album/x" } },
      "free",
    );
    expect(blocks[0]).toMatchObject({
      type: "featured",
      sort_order: 0,
      data: { badge: "Lançamento", title: "Rua das Flores", cta: "Ouvir no Spotify", url: "https://open.spotify.com/album/x" },
    });
    expect(blocks.map((b) => b.sort_order)).toEqual([0, 1, 2]);
  });

  it("ignora destaque incompleto", () => {
    const { blocks } = buildPage({ ...base, featured: { kind: "servico", title: "", url: "x.com" } }, "free");
    expect(blocks.every((b) => b.type === "link")).toBe(true);
  });

  it("liga o WhatsApp só com número completo", () => {
    expect(buildPage({ ...base, whatsapp: "(21) 99999-0000" }, "free").profile).toMatchObject({
      whatsapp_number: "21999990000",
      whatsapp_enabled: true,
    });
    expect(buildPage({ ...base, whatsapp: "9999" }, "free").profile.whatsapp_enabled).toBe(false);
  });
});
