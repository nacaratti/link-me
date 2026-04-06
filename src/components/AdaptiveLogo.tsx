interface Props {
  alt?: string;
  className?: string;
}

export default function AdaptiveLogo({ alt = 'linqu.es', className }: Props) {
  return (
    <picture>
      <source srcSet="/logo_white.png" media="(prefers-color-scheme: dark)" />
      <img src="/logo_black.png" alt={alt} className={className} />
    </picture>
  );
}
