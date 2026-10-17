import Link from "next/link";
import Logo from "@/components/Logo";

/** Moldura das páginas de termos e privacidade */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" aria-label="linqu.es" className="text-ink">
          <Logo />
        </Link>
      <h1 className="t-chapter mt-12">{title}</h1>
      {updated && <p className="t-caption mt-3">Última atualização: {updated}</p>}
      <article className="legal mt-10">{children}</article>
      <p className="mt-12 border-t border-rule pt-6 text-sm text-muted">
        Dúvidas? Escreva para{" "}
        <a href="mailto:contato@linqu.es" className="underline">
          contato@linqu.es
        </a>
        .
      </p>
    </main>
  );
}
