import type { Metadata } from "next";
import PageView from "@/components/page/PageView";
import PhoneFrame from "@/components/page/PhoneFrame";
import { PALETTES } from "@/lib/palettes";
import { SAMPLES } from "@/lib/samples";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = { title: "Prévia dos modelos", robots: { index: false } };

/** Bancada de testes: cada modelo com sua página de exemplo, em todas as paletas */
export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t: only } = await searchParams;
  return (
    <main className="space-y-16 p-8">
      {TEMPLATES.filter((t) => !only || t.id === only).map((t) => {
        const sample = SAMPLES.find((s) => s.profile.template_id === t.id)!;
        return (
          <section key={t.id}>
            <h2 className="t-chapter">{t.name}</h2>
            <div className="mt-6 flex gap-6 overflow-x-auto pb-4">
              {PALETTES.map((p) => (
                <div key={p.id}>
                  <p className="t-label mb-2">{p.name}</p>
                  <PhoneFrame scale={0.6}>
                    <PageView preview profile={{ ...sample.profile, palette_id: p.id }} blocks={sample.blocks} />
                  </PhoneFrame>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
