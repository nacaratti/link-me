import { describe, expect, it } from "vitest";
import { defaultNote, defaultTitle, detectBrand, normalizeUrl, whatsappUrl } from "../links";
import { normalizeUsername, usernameError } from "../reserved";

describe("normalizeUrl", () => {
  it("completa o que a pessoa cola", () => {
    expect(normalizeUrl("instagram.com/ana")).toBe("https://instagram.com/ana");
    expect(normalizeUrl(" ana@mail.com ")).toBe("mailto:ana@mail.com");
    expect(normalizeUrl("http://x.com")).toBe("http://x.com");
    expect(normalizeUrl("+55 (21) 99999-0000")).toBe("tel:+5521999990000");
    expect(normalizeUrl("")).toBe("");
  });
});

describe("detectBrand / defaultTitle / defaultNote", () => {
  it("reconhece marcas, subdomínios e www", () => {
    expect(detectBrand("https://www.instagram.com/ana")).toBe("instagram");
    expect(detectBrand("https://open.spotify.com/artist/1")).toBe("spotify");
    expect(detectBrand("https://youtu.be/abc")).toBe("youtube");
    expect(detectBrand("https://br.linkedin.com/in/ana")).toBe("linkedin");
    expect(detectBrand("https://ana.com.br")).toBe("website");
    expect(detectBrand("mailto:a@b.com")).toBe("email");
  });

  it("não confunde domínios parecidos", () => {
    expect(detectBrand("https://notinstagram.com")).toBe("website");
  });

  it("dá títulos e legendas razoáveis", () => {
    expect(defaultTitle("https://x.com/ana")).toBe("X");
    expect(defaultTitle("https://anaprado.com.br")).toBe("Anaprado");
    expect(defaultNote("https://instagram.com/ana.prado")).toBe("@ana.prado");
    expect(defaultNote("https://youtube.com/@ana")).toBe("@ana");
    expect(defaultNote("https://open.spotify.com/artist/1")).toBe("");
    expect(defaultNote("https://ana.com.br/agenda")).toBe("ana.com.br");
  });
});

describe("whatsappUrl", () => {
  it("põe o 55 quando falta", () => {
    expect(whatsappUrl("(21) 99999-0000")).toBe("https://wa.me/5521999990000");
    expect(whatsappUrl("5521999990000")).toBe("https://wa.me/5521999990000");
  });
});

describe("username", () => {
  it("normaliza e valida", () => {
    expect(normalizeUsername("  @João Silva ")).toBe("joaosilva");
    expect(usernameError("ab")).not.toBeNull();
    expect(usernameError("painel")).not.toBeNull();
    expect(usernameError(".ana")).not.toBeNull();
    expect(usernameError("ana.prado")).toBeNull();
  });
});
