import BrandIcon from "@/components/BrandIcon";
import Photo from "@/components/page/Photo";
import PhotoRotator from "@/components/page/PhotoRotator";
import Mark from "@/components/page/Mark";
import { defaultNote, detectBrand } from "@/lib/links";
import { cn } from "@/lib/utils";
import { blockLinkProps, type TemplateProps } from "./types";

/**
 * Editorial — a página /links do site do Silvério Pontes, generalizada.
 * Foto em sangria que se dissolve no fundo, rótulo em mono, nome em serifa
 * grande, destaques com capa e links em linhas com fio fino.
 */
export default function Editorial({ profile, links, featured, palette, preview }: TemplateProps) {
  const photos = profile.photos.length ? profile.photos : [];
  const hasPhoto = photos.length > 0;

  return (
    <div className="grain relative min-h-full bg-bg text-ink" data-dark={palette.dark}>
      {hasPhoto && (
        <div
          className={cn(
            "relative mx-auto w-full overflow-hidden",
            preview ? "h-80" : "h-[46svh] min-h-[18rem] sm:h-[34rem] sm:max-w-2xl",
          )}
        >
          <PhotoRotator
            photos={photos}
            alt={profile.display_name}
            sizes={preview ? "380px" : "(max-width: 640px) 100vw, 42rem"}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/10" />
        </div>
      )}

      <div
        className={cn(
          "relative mx-auto max-w-2xl px-5 pb-24",
          !preview && "sm:px-8",
          hasPhoto ? "-mt-24" : preview ? "pt-16" : "pt-20 sm:pt-28",
        )}
      >
        {!hasPhoto && profile.avatar_url && (
          <div className="relative mb-8 h-20 w-20 overflow-hidden rounded-full">
            <Photo src={profile.avatar_url} alt={profile.display_name} sizes="80px" />
          </div>
        )}

        {profile.headline && <p className="t-label rise">{profile.headline}</p>}
        <h1 className={cn("rise mt-4", preview ? "t-title !text-4xl" : "t-chapter")}>{profile.display_name}</h1>
        {profile.bio && <p className="mt-5 max-w-[38ch] leading-relaxed text-muted">{profile.bio}</p>}

        {featured.length > 0 && (
          <div className="mt-10 space-y-8 border-t border-rule pt-8">
            {featured.map((d) => (
              <div key={d.id} className="flex gap-5">
                {d.image && (
                  <div className={cn("relative aspect-square shrink-0", preview ? "w-28" : "w-32 sm:w-36")}>
                    <Photo src={d.image} alt={d.title} sizes="9rem" />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  {d.badge && <p className="t-label">{d.badge}</p>}
                  <p className="t-title mt-2">{d.title}</p>
                  {d.subtitle && <p className="t-caption mt-1">{d.subtitle}</p>}
                  <a
                    {...blockLinkProps(d.id, d.url)}
                    className="t-label link-rule mt-4 inline-flex w-fit items-center gap-2 pb-1"
                  >
                    <BrandIcon name={detectBrand(d.url)} className="h-4 w-4 shrink-0" />
                    {d.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <nav className="mt-12">
          {links.map((item) => {
            const note = item.note ?? defaultNote(item.url);
            return (
              <a
                key={item.id}
                {...blockLinkProps(item.id, item.url)}
                className="group flex items-baseline justify-between gap-6 border-t border-rule py-5 last:border-b"
              >
                <span className="flex items-baseline gap-4">
                  <BrandIcon name={detectBrand(item.url)} className="h-5 w-5 shrink-0 translate-y-1 text-accent" />
                  <span>
                    <span className="t-title block transition-colors duration-300 group-hover:text-accent">
                      {item.title}
                    </span>
                    {note && <span className="t-caption mt-1 block">{note}</span>}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-accent transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            );
          })}
        </nav>

        <div className="mt-16 text-center">
          <Mark show={profile.plan !== "pro"} />
        </div>
      </div>
    </div>
  );
}
