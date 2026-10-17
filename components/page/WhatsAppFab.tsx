import BrandIcon from "@/components/BrandIcon";
import { whatsappUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

/** Botão flutuante do WhatsApp; a cor vem do accent da paleta */
export default function WhatsAppFab({ number, preview }: { number: string; preview?: boolean }) {
  return (
    <a
      href={whatsappUrl(number)}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp"
      aria-label="Conversar no WhatsApp"
      className={cn(
        "z-20 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-105",
        preview ? "absolute bottom-4 right-4" : "fixed bottom-5 right-5",
      )}
      style={preview ? undefined : { marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <BrandIcon name="whatsapp" className="h-6 w-6" />
    </a>
  );
}
