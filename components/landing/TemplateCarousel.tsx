"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const INTERVAL = 4500; // ms em cada modelo

/**
 * Mostra um modelo por vez e troca sozinho. Os slides chegam prontos do
 * servidor (cada um é uma PageView); aqui só alterna a opacidade.
 * Pausa com o mouse em cima e sob prefers-reduced-motion.
 */
export default function TemplateCarousel({
  slides,
}: {
  slides: { id: string; name: string; description: string; phone: React.ReactNode }[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(id);
  }, [paused, count]);

  const current = slides[index];

  return (
    <div
      className="mt-12 grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrossel"
    >
      {/* Os celulares ficam empilhados; só o atual aparece */}
      <div className="relative mx-auto grid w-fit">
        {slides.map((s, i) => (
          <div
            key={s.id}
            aria-hidden={i !== index}
            className={cn(
              "col-start-1 row-start-1 transition-[opacity,translate] ease-[cubic-bezier(0.16,1,0.3,1)]",
              // O atual some rápido; o próximo entra depois, sem os dois se misturarem
              i === index
                ? "translate-y-0 opacity-100 delay-200 duration-700"
                : "pointer-events-none translate-y-3 opacity-0 duration-200",
            )}
          >
            {s.phone}
          </div>
        ))}
      </div>

      <div className="text-center md:text-left" aria-live="polite">
        <p className="t-label">
          Modelo {index + 1} de {count}
        </p>
        <h3 key={current.id} className="rise t-chapter mt-3">
          {current.name}
        </h3>
        <p key={`${current.id}-d`} className="rise mx-auto mt-3 max-w-[38ch] leading-relaxed text-muted md:mx-0">
          {current.description}
        </p>

        <div className="mt-8 flex justify-center gap-2 md:justify-start">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver modelo ${s.name}`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full transition-[width,background-color] duration-500",
                i === index ? "w-8 bg-ink" : "w-2 bg-rule hover:bg-muted",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
