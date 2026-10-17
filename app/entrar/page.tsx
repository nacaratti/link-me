import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import AuthForm from "./AuthForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const { next, erro } = await searchParams;
  const safe = next?.startsWith("/") && !next.startsWith("//") ? next : "/painel";

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" aria-label="linqu.es" className="text-ink">
          <Logo />
        </Link>
        <div className="flex flex-1 flex-col justify-center py-12">
          <p className="t-label">Sua página em minutos</p>
          <h1 className="t-chapter mt-4 max-w-md">Responda algumas perguntas. A gente monta o resto.</h1>
          <div className="mt-10">
            {erro && (
              <p className="mb-6 max-w-sm rounded-xl bg-[#b42318]/10 px-4 py-3 text-sm text-[#b42318]">
                Não conseguimos concluir o login. Tente de novo; se continuar, use outro navegador ou entre com e-mail.
              </p>
            )}
            <AuthForm next={safe} />
          </div>
        </div>
        <p className="t-caption">
          Ao continuar você aceita os <Link href="/termos" className="underline">termos</Link> e a{" "}
          <Link href="/privacidade" className="underline">política de privacidade</Link>.
        </p>
      </section>
      <aside className="relative hidden overflow-hidden bg-[#12100e] lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <p className="max-w-sm font-display text-4xl leading-tight text-[#faf7f2]">
            &ldquo;Quatro modelos, dez paletas. <span className="text-[#c9a961]">Nenhuma decisão difícil.</span>&rdquo;
          </p>
        </div>
      </aside>
    </main>
  );
}
