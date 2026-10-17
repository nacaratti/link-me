import Link from "next/link";
import PageView from "@/components/page/PageView";
import PhoneFrame from "@/components/page/PhoneFrame";
import { PaletteSwatch } from "@/components/ui";
import { PALETTES } from "@/lib/palettes";
import { FREE_LINK_LIMIT, PRO_LINK_LIMIT } from "@/lib/plans";
import { SAMPLES } from "@/lib/samples";
import { TEMPLATES } from "@/lib/templates";

const sample = (template: string) => SAMPLES.find((s) => s.profile.template_id === template)!;

function Cta({ children = "Criar minha página" }: { children?: React.ReactNode }) {
  return (
    <Link
      href="/entrar"
      className="inline-flex h-13 items-center rounded-full bg-ink px-7 py-3.5 font-medium text-bg transition-opacity hover:opacity-85"
    >
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <header className="mx-auto flex max-w-6xl items-center px-5 py-5 sm:px-8">
        <Link href="/" className="font-display text-2xl">
          linqu.es
        </Link>
        <nav className="ml-auto flex items-center gap-2 text-sm">
          <Link href="/entrar" className="px-3 py-2 text-muted hover:text-ink">
            Entrar
          </Link>
          <Link href="/entrar" className="rounded-full border border-ink px-4 py-2 font-medium transition-colors hover:bg-ink hover:text-bg">
            Começar grátis
          </Link>
        </nav>
      </header>

      {/* Abertura */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
        <div>
          <p className="t-label rise">Página de links para quem trabalha</p>
          <h1 className="t-display rise mt-5">
            Sua página pronta em <em className="text-accent">três minutos</em>.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
            Responda algumas perguntas. A gente escolhe o modelo, as cores e organiza seus links. Você só ajusta se
            quiser.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Cta />
            <span className="t-caption">Grátis para começar · sem cartão</span>
          </div>
        </div>

        <div className="relative mx-auto h-[540px] w-full max-w-[520px]" aria-hidden="true">
          <div className="absolute left-0 top-10 -rotate-6">
            <PhoneFrame scale={0.58}>
              <PageView preview {...sample("cartao")} />
            </PhoneFrame>
          </div>
          <div className="absolute right-0 top-14 rotate-6">
            <PhoneFrame scale={0.58}>
              <PageView preview {...sample("minimo")} />
            </PhoneFrame>
          </div>
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <PhoneFrame scale={0.66}>
              <PageView preview profile={{ ...sample("editorial").profile, plan: "pro" }} blocks={sample("editorial").blocks} />
            </PhoneFrame>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-rule bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-3">
          {[
            ["01", "Conte o que você faz", "Música, saúde, direito, negócio local… Cada área tem modelo e cores que funcionam."],
            ["02", "Cole seus links", "Instagram, YouTube, site, e-mail. Os ícones e os títulos aparecem sozinhos."],
            ["03", "Publique", "Seu endereço linqu.es/você fica no ar na hora, com prévia bonita no WhatsApp."],
          ].map(([n, title, text]) => (
            <div key={n}>
              <p className="font-display text-5xl text-accent">{n}</p>
              <h2 className="t-title mt-4">{title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modelos */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="t-label">Sem painel de mil opções</p>
        <h2 className="t-chapter mt-4 max-w-2xl">Quatro modelos. Dez paletas. Nenhuma decisão difícil.</h2>
        <p className="mt-4 max-w-[52ch] text-muted">
          Em vez de escolher a cor de cada botão, você escolhe uma paleta inteira, desenhada para combinar. Troque de
          modelo quando quiser: seus links continuam lá.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const s = sample(t.id);
            return (
              <div key={t.id}>
                <div className="mx-auto w-fit">
                  <PhoneFrame scale={0.6}>
                    <PageView preview profile={{ ...s.profile, plan: "pro" }} blocks={s.blocks} />
                  </PhoneFrame>
                </div>
                <h3 className="t-title mt-5">{t.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          {PALETTES.map((p) => (
            <span key={p.id} className="inline-flex items-center gap-2 rounded-full border border-rule py-1 pl-1 pr-3 text-sm">
              <PaletteSwatch id={p.id} />
              {p.name}
            </span>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="bg-[#12100e] text-[#faf7f2]">
        <div className="tpl-editorial mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <p className="t-label !text-[#c9a961]">Planos</p>
          <h2 className="t-chapter mt-4">Comece grátis. Cresça quando precisar.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-white/15 p-8">
              <h3 className="font-display text-3xl">Grátis</h3>
              <ul className="mt-6 space-y-2.5 opacity-80">
                <li>· Até {FREE_LINK_LIMIT} links e um destaque com imagem</li>
                <li>· Modelos Editorial, Cartão e Mínimo</li>
                <li>· 4 paletas</li>
                <li>· Botão do WhatsApp e visitas/cliques do mês</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-[#c9a961] p-8 text-[#12100e]">
              <h3 className="font-display text-3xl">PRO</h3>
              <ul className="mt-6 space-y-2.5">
                <li>· Até {PRO_LINK_LIMIT} links e 6 destaques</li>
                <li>· Todos os modelos, incluindo Vitrine</li>
                <li>· As 10 paletas</li>
                <li>· Estatísticas completas: dias, aparelhos, origem</li>
                <li>· Sem &ldquo;feito com linqu.es&rdquo;</li>
              </ul>
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/entrar"
              className="inline-flex items-center rounded-full bg-[#faf7f2] px-7 py-3.5 font-medium text-[#12100e] transition-opacity hover:opacity-85"
            >
              Criar minha página
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-5 py-10 text-sm text-muted sm:px-8">
        <span className="font-display text-lg text-ink">linqu.es</span>
        <Link href="/termos" className="hover:text-ink">
          Termos
        </Link>
        <Link href="/privacidade" className="hover:text-ink">
          Privacidade
        </Link>
        <span className="ml-auto">© {new Date().getFullYear()} Linques</span>
      </footer>
    </div>
  );
}
