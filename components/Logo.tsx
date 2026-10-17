import { cn } from "@/lib/utils";

/**
 * Símbolo da marca: dois meio-elos ligados por uma barra (⊂—⊃), a 45°,
 * num quadrado escuro — o mesmo desenho do favicon (app/icon.svg).
 * As cores são fixas: o símbolo não muda com a paleta da página.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="32" height="32" rx="8" fill="#12100e" />
      <g
        transform="translate(16 16) scale(0.85) translate(-16 -16) rotate(-45 16 16)"
        fill="none"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 10.5H9.5a5.5 5.5 0 0 0 0 11H13" stroke="#faf7f2" />
        <path d="M11 16h10" stroke="#faf7f2" />
        <path d="M19 10.5h3.5a5.5 5.5 0 0 1 0 11H19" stroke="#c9a961" />
      </g>
    </svg>
  );
}

/** Símbolo, com ou sem o nome ao lado (o nome aparece só no rodapé) */
export default function Logo({ className, withName = false }: { className?: string; withName?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark title={withName ? undefined : "linqu.es"} />
      {withName && <span className="font-display text-xl leading-none tracking-tight">linqu.es</span>}
    </span>
  );
}
