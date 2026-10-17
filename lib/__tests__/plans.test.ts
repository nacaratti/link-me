import { describe, expect, it } from "vitest";
import { canUsePalette, canUseTemplate, linkLimitReached, planErrorMessage, FREE_LINK_LIMIT } from "../plans";
import { PALETTES } from "../palettes";
import { TEMPLATES } from "../templates";
import { effectiveStyle } from "../profile";
import { SAMPLES } from "../samples";

describe("planos", () => {
  it("limita links só no grátis", () => {
    expect(linkLimitReached(FREE_LINK_LIMIT, "free")).toBe(true);
    expect(linkLimitReached(FREE_LINK_LIMIT - 1, "free")).toBe(false);
    expect(linkLimitReached(FREE_LINK_LIMIT, "pro")).toBe(false);
  });

  it("libera modelos e paletas conforme o plano", () => {
    expect(canUseTemplate("vitrine", "free")).toBe(false);
    expect(canUseTemplate("vitrine", "pro")).toBe(true);
    expect(canUsePalette("latao", "free")).toBe(false);
    expect(canUsePalette("papel", "free")).toBe(true);
  });

  it("tem 4 paletas e 3 modelos livres (iguais aos da migração 100)", () => {
    expect(PALETTES.filter((p) => p.free).map((p) => p.id).sort()).toEqual(["grafite", "oceano", "papel", "terracota"]);
    expect(TEMPLATES.filter((t) => t.free).map((t) => t.id).sort()).toEqual(["cartao", "editorial", "minimo"]);
  });

  it("traduz erros dos triggers", () => {
    expect(planErrorMessage('ERROR: LINK_LIMIT')).toMatch(/até 5 links/);
    expect(planErrorMessage("outro erro")).toBeNull();
  });

  it("página de quem voltou ao grátis cai para estilo livre", () => {
    const pro = SAMPLES.find((s) => s.profile.template_id === "vitrine")!.profile;
    const after = effectiveStyle({ ...pro, plan: "free", palette_id: "noite" });
    expect(after.template_id).toBe("cartao");
    expect(after.palette_id).toBe("papel");
  });
});
