import type { Block, PageProfile } from "@/lib/types";
import { getPalette, paletteVars } from "@/lib/palettes";
import { getTemplate, type TemplateId } from "@/lib/templates";
import { cn } from "@/lib/utils";
import Editorial from "@/components/templates/Editorial";
import Cartao from "@/components/templates/Cartao";
import Vitrine from "@/components/templates/Vitrine";
import Minimo from "@/components/templates/Minimo";
import { splitBlocks, type TemplateProps } from "@/components/templates/types";
import WhatsAppFab from "./WhatsAppFab";

const COMPONENTS: Record<TemplateId, (p: TemplateProps) => React.ReactNode> = {
  editorial: Editorial,
  cartao: Cartao,
  vitrine: Vitrine,
  minimo: Minimo,
};

/**
 * A página de uma pessoa: modelo + paleta + blocos. É o mesmo componente na
 * página pública, na prévia do painel e no questionário.
 */
export default function PageView({
  profile,
  blocks,
  preview,
  className,
}: {
  profile: PageProfile;
  blocks: Block[];
  preview?: boolean;
  className?: string;
}) {
  const template = getTemplate(profile.template_id);
  const palette = getPalette(profile.palette_id);
  const Template = COMPONENTS[template.id];
  const { links, featured } = splitBlocks(blocks);

  return (
    <div
      className={cn(`tpl-${template.id} relative min-h-full bg-bg font-sans text-ink`, className)}
      style={paletteVars(palette)}
    >
      <Template profile={profile} links={links} featured={featured} palette={palette} preview={preview} />
      {profile.whatsapp_enabled && profile.whatsapp_number && (
        <WhatsAppFab number={profile.whatsapp_number} preview={preview} />
      )}
    </div>
  );
}
