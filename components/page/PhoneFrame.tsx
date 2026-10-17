import { cn } from "@/lib/utils";

/** Moldura de celular para as prévias; o conteúdo rola por dentro */
export default function PhoneFrame({
  children,
  className,
  scale = 1,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <div className={cn("shrink-0", className)} style={{ width: 390 * scale, height: 780 * scale }}>
      <div
        className="origin-top-left overflow-hidden rounded-[2.75rem] border-[10px] border-[#1a1814] bg-[#1a1814] shadow-2xl shadow-black/25"
        style={{ width: 390, height: 780, transform: scale === 1 ? undefined : `scale(${scale})` }}
      >
        <div className="relative h-full w-full overflow-y-auto overflow-x-hidden rounded-[2rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
