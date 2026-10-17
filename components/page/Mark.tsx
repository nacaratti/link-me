import Link from "next/link";
import { cn } from "@/lib/utils";

/** Assinatura discreta no pé das páginas do plano gratuito */
export default function Mark({ show, className }: { show: boolean; className?: string }) {
  if (!show) return null;
  return (
    <Link
      href="/"
      className={cn("t-caption inline-block opacity-70 transition-opacity hover:opacity-100", className)}
    >
      feito com linqu.es
    </Link>
  );
}
