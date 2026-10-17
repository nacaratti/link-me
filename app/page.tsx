import Link from "next/link";
import Logo from "@/components/Logo";
import PageView from "@/components/page/PageView";
import PhoneFrame from "@/components/page/PhoneFrame";
import Hero from "@/components/landing/Hero";
import TemplateCarousel from "@/components/landing/TemplateCarousel";
import { FREE_LINK_LIMIT, PRO_LINK_LIMIT } from "@/lib/plans";
import { SAMPLES } from "@/lib/samples";
import { TEMPLATES } from "@/lib/templates";

const sample = (template: string) => SAMPLES.find((s) => s.profile.template_id === template)!;

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />

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
        <h2 className="t-chapter max-w-2xl">Quatro modelos, dez paletas, seis pares de fontes. Nada para configurar.</h2>
        <p className="mt-4 max-w-[52ch] text-muted">
          Em vez de escolher a cor de cada botão, você escolhe uma paleta inteira, desenhada para combinar. Troque de
          modelo quando quiser: seus links continuam lá.
        </p>

        <TemplateCarousel
          slides={TEMPLATES.map((t) => {
            const s = sample(t.id);
            return {
              id: t.id,
              name: t.name,
              description: t.description,
              phone: (
                <PhoneFrame scale={0.72}>
                  <PageView preview profile={{ ...s.profile, plan: "pro" }} blocks={s.blocks} />
                </PhoneFrame>
              ),
            };
          })}
        />
      </section>

      {/* Planos */}
      <section className="bg-[#12100e] text-[#faf7f2]">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <h2 className="t-chapter">Comece grátis. Cresça quando precisar.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-white/15 p-8">
              <h3 className="font-display text-3xl">Grátis</h3>
              <ul className="mt-6 list-disc space-y-2.5 pl-5 opacity-80">
                <li>Até {FREE_LINK_LIMIT} links e um destaque com imagem</li>
                <li>Modelos Editorial, Cartão e Mínimo</li>
                <li>4 paletas</li>
                <li>Botão do WhatsApp e visitas/cliques do mês</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-[#c9a961] p-8 text-[#12100e]">
              <h3 className="font-display text-3xl">PRO</h3>
              <ul className="mt-6 list-disc space-y-2.5 pl-5">
                <li>Até {PRO_LINK_LIMIT} links e 6 destaques</li>
                <li>Todos os modelos, incluindo Vitrine</li>
                <li>As 10 paletas</li>
                <li>Estatísticas completas: dias, aparelhos, origem</li>
                <li>Sem &ldquo;feito com linqu.es&rdquo;</li>
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
        <Logo withName className="text-ink" />
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
