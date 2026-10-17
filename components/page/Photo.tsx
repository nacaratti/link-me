import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Imagem enviada pelo usuário. Fotos já salvas passam pelo otimizador do Next;
 * prévias locais (blob:/data:, durante o questionário) vão direto.
 */
export default function Photo({
  src,
  alt,
  sizes,
  priority,
  className,
  style,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const local = /^(blob:|data:)/.test(src);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={local}
      className={cn("object-cover", className)}
      style={style}
    />
  );
}
