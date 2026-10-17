"use client";

import { useEffect, useState } from "react";
import Photo from "./Photo";

const INTERVAL = 5000; // ms em cada foto
const FADE = 1200; // ms de transição

/**
 * Alterna fotos no mesmo lugar, com cruzamento suave. Todas ficam no DOM,
 * empilhadas; só a opacidade muda, então a troca não mexe no layout.
 * Sob prefers-reduced-motion fica só a primeira foto. (Do site do Silvério.)
 */
export default function PhotoRotator({
  photos,
  alt,
  sizes,
  objectPosition = "50% 20%",
}: {
  photos: string[];
  alt: string;
  sizes: string;
  objectPosition?: string;
}) {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(id);
  }, [count]);

  return (
    <>
      {photos.map((src, i) => (
        <Photo
          key={src}
          src={src}
          alt={i === index % count ? alt : ""}
          sizes={sizes}
          priority={i === 0}
          style={{ objectPosition, transitionDuration: `${FADE}ms` }}
          className={`transition-opacity ease-[cubic-bezier(0.16,1,0.3,1)] ${
            i === index % count ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
