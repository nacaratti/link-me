import BrandIcon from "@/components/BrandIcon";
import Photo from "@/components/page/Photo";
import PhotoRotator from "@/components/page/PhotoRotator";
import Mark from "@/components/page/Mark";
import { defaultNote, detectBrand } from "@/lib/links";
import { cn } from "@/lib/utils";
import { blockLinkProps, type TemplateProps } from "./types";

/**
 * Vitrine — para quem tem trabalho para mostrar: capa larga, nome em serifa
 * e destaques em grade com imagem, antes da lista de links.
 */
export default function Vitrine({ profile, links, featured, preview }: TemplateProps) {
  const avatar = profile.avatar_url;
  const hasCover = profile.photos.length > 0;
  const single = featured.length === 1;

  return (
    <div className="relative min-h-full bg-bg text-ink">
      <div className={cn("mx-auto w-full", !preview && "sm:max-w-3xl sm:px-4 sm:pt-4")}>
        <div
          className={cn(
            "relative w-full overflow-hidden bg-surface",
            preview ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-[21/9] sm:rounded-[1.75rem]",
          )}
        >
          {hasCover && (
            <PhotoRotator
              photos={profile.photos}
              alt={profile.display_name}
              sizes={preview ? "380px" : "(max-width: 640px) 100vw, 48rem"}
              objectPosition="50% 35%"
            />
          )}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
      </div>

      <div className={cn("relative mx-auto max-w-xl px-5 pb-20", !preview && "sm:px-6")}>
        <div className="-mt-10 flex items-end gap-4">
          {avatar && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-4 ring-bg">
              <Photo src={avatar} alt={profile.display_name} sizes="80px" />
            </div>
          )}
        </div>

        <h1 className={cn("rise font-display font-semibold leading-[1.02] tracking-tight", avatar ? "mt-4" : "mt-14", preview ? "text-[2.1rem]" : "text-4xl sm:text-5xl")}>
          {profile.display_name}
        </h1>
        {profile.headline && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{profile.headline}</p>
        )}
        {profile.bio && <p className="mt-4 leading-relaxed text-muted">{profile.bio}</p>}

        {featured.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3">
            {featured.map((d) => (
              <a
                key={d.id}
                {...blockLinkProps(d.id, d.url)}
                className={cn("group block", single && "col-span-2")}
              >
                <div className={cn("relative overflow-hidden rounded-2xl bg-surface", single ? "aspect-[16/9]" : "aspect-square")}>
                  {d.image && (
                    <Photo
                      src={d.image}
                      alt={d.title}
                      sizes={single ? "36rem" : "18rem"}
                      className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  )}
                  {d.badge && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-bg/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ink backdrop-blur">
                      {d.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 font-display text-lg font-semibold leading-snug">{d.title}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {d.subtitle ? `${d.subtitle} · ` : ""}
                  <span className="font-semibold text-accent">{d.cta} →</span>
                </p>
              </a>
            ))}
          </div>
        )}

        <nav className="mt-8 flex flex-col gap-2.5">
          {links.map((item) => {
            const note = item.note ?? defaultNote(item.url);
            return (
              <a
                key={item.id}
                {...blockLinkProps(item.id, item.url)}
                className="group flex items-center gap-4 rounded-2xl border border-rule px-4 py-3.5 transition-colors duration-300 hover:border-accent hover:bg-surface"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
                  <BrandIcon name={detectBrand(item.url)} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{item.title}</span>
                  {note && <span className="block truncate text-sm text-muted">{note}</span>}
                </span>
                <span aria-hidden="true" className="text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent">
                  →
                </span>
              </a>
            );
          })}
        </nav>

        <div className="mt-14 text-center">
          <Mark show={profile.plan !== "pro"} />
        </div>
      </div>
    </div>
  );
}
