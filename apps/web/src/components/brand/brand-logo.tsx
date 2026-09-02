import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  className = 'h-12 w-44',
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/brand/logobusco.png"
      alt=""
      width={1280}
      height={1280}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
