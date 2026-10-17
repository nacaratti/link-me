import Photo from "@/components/page/Photo";
import Mark from "@/components/page/Mark";
import { defaultNote } from "@/lib/links";
import { cn } from "@/lib/utils";
import { blockLinkProps, type TemplateProps } from "./types";

/**
 * Mínimo — só tipografia. Nome, uma linha de profissão e links em texto,
 * com a legenda em mono à direita. Carrega instantâneo.
 */
export default function Minimo({ profile, links, featured, preview }: TemplateProps) {
  const avatar = profile.avatar_url || profile.photos[0];

  return (
    <div className="relative min-h-full bg-bg text-ink">
      <div className={cn("mx-auto max-w-lg px-6 pb-20", preview ? "pt-16" : "pt-20 sm:pt-32")}>
        <header className="rise flex items-center gap-4">
          {avatar && (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Photo src={avatar} alt={profile.display_name} sizes="48px" priority />
            </div>
          )}
          <div>
            <h1 className="text-xl font-medium tracking-tight">{profile.display_name}</h1>
            {profile.headline && <p className="font-label text-[0.8rem] text-muted">{profile.headline}</p>}
          </div>
        </header>

        {profile.bio && <p className="mt-8 leading-relaxed text-muted">{profile.bio}</p>}

        {featured.length > 0 && (
          <section className="mt-12">
            {featured.map((d) => (
              <a key={d.id} {...blockLinkProps(d.id, d.url)} className="group mb-6 block">
                {d.badge && <p className="font-label text-[0.7rem] uppercase tracking-[0.18em] text-accent">{d.badge}</p>}
                <p className="mt-1 text-lg font-medium underline decoration-rule decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-accent">
                  {d.title}
                </p>
                {d.subtitle && <p className="mt-1 text-sm text-muted">{d.subtitle}</p>}
              </a>
            ))}
          </section>
        )}

        <ul className="mt-12">
          {links.map((item) => {
            const note = item.note ?? defaultNote(item.url);
            return (
              <li key={item.id}>
                <a
                  {...blockLinkProps(item.id, item.url)}
                  className="group flex items-baseline justify-between gap-4 py-2.5"
                >
                  <span className="text-lg underline decoration-rule decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-accent">
                    {item.title}
                    <span aria-hidden="true" className="ml-1.5 text-sm text-accent">↗</span>
                  </span>
                  {note && <span className="truncate font-label text-xs text-muted">{note}</span>}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-20">
          <Mark show={profile.plan !== "pro"} />
        </div>
      </div>
    </div>
  );
}
