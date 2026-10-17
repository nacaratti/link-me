import BrandIcon from "@/components/BrandIcon";
import Photo from "@/components/page/Photo";
import Mark from "@/components/page/Mark";
import { detectBrand } from "@/lib/links";
import { cn } from "@/lib/utils";
import { blockLinkProps, type TemplateProps } from "./types";

/**
 * Cartão — o link na bio clássico, bem resolvido: foto redonda no centro,
 * nome forte, destaques em cartões e botões cheios em pílula.
 */
export default function Cartao({ profile, links, featured, preview }: TemplateProps) {
  const avatar = profile.avatar_url || profile.photos[0];
  const initials = profile.display_name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-full bg-bg text-ink">
      {/* Halo suave do accent atrás da foto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--p-accent)_22%,transparent),transparent)]"
      />

      <div className={cn("relative mx-auto flex max-w-md flex-col items-center px-5 pb-20 text-center", preview ? "pt-14" : "pt-16 sm:pt-24")}>
        <div className="rise relative h-28 w-28 overflow-hidden rounded-full bg-surface ring-4 ring-surface">
          {avatar ? (
            <Photo src={avatar} alt={profile.display_name} sizes="112px" priority />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-accent">
              {initials}
            </span>
          )}
        </div>

        <h1 className="rise mt-5 font-display text-2xl font-bold tracking-tight">{profile.display_name}</h1>
        {profile.headline && <p className="mt-1 text-sm font-semibold text-accent">{profile.headline}</p>}
        {profile.bio && <p className="mt-3 max-w-[34ch] text-[0.95rem] leading-relaxed text-muted">{profile.bio}</p>}

        {featured.length > 0 && (
          <div className="mt-8 w-full space-y-4">
            {featured.map((d) => (
              <a
                key={d.id}
                {...blockLinkProps(d.id, d.url)}
                className="group block overflow-hidden rounded-3xl bg-surface text-left transition-transform duration-300 hover:-translate-y-0.5"
              >
                {d.image && (
                  <div className="relative aspect-[16/9]">
                    <Photo src={d.image} alt={d.title} sizes="(max-width: 480px) 100vw, 28rem" />
                  </div>
                )}
                <div className="p-5">
                  {d.badge && (
                    <span className="inline-block rounded-full bg-accent/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-accent">
                      {d.badge}
                    </span>
                  )}
                  <p className="mt-2 text-lg font-bold leading-snug">{d.title}</p>
                  {d.subtitle && <p className="mt-0.5 text-sm text-muted">{d.subtitle}</p>}
                  <span className="mt-4 flex h-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent">
                    {d.cta}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        <nav className="mt-6 flex w-full flex-col gap-3">
          {links.map((item) => (
            <a
              key={item.id}
              {...blockLinkProps(item.id, item.url)}
              className="group relative flex min-h-14 items-center justify-center rounded-full bg-surface px-14 py-3 text-[0.95rem] font-semibold transition-colors duration-300 hover:bg-accent hover:text-on-accent"
            >
              <span className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-bg/60 text-accent transition-colors group-hover:bg-transparent group-hover:text-on-accent">
                <BrandIcon name={detectBrand(item.url)} className="h-[1.1rem] w-[1.1rem]" />
              </span>
              {item.title}
            </a>
          ))}
        </nav>

        <div className="mt-14">
          <Mark show={profile.plan !== "pro"} />
        </div>
      </div>
    </div>
  );
}
