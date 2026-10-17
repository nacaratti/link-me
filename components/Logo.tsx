import { cn } from "@/lib/utils";

/**
 * Símbolo da marca: dois meio-elos ligados por uma barra (⊂—⊃), a 45°.
 * O lado esquerdo e a barra usam a cor do texto; o lado direito, o accent.
 * É o desenho universal de "link", simples o bastante para o favicon.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g transform="rotate(-45 16 16)" fill="none" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10.5H9.5a5.5 5.5 0 0 0 0 11H13" stroke="currentColor" />
        <path d="M11 16h10" stroke="currentColor" />
        <path d="M19 10.5h3.5a5.5 5.5 0 0 1 0 11H19" stroke="var(--p-accent)" />
      </g>
    </svg>
  );
}

/** Símbolo + nome, para cabeçalhos e rodapé */
export default function Logo({ className, withName = true }: { className?: string; withName?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark title={withName ? undefined : "linqu.es"} />
      {withName && <span className="font-display text-xl leading-none tracking-tight">linqu.es</span>}
    </span>
  );
}
