import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 whitespace-nowrap',
        className,
      )}
    >
      <Image
        src="/brand/mark.png"
        alt=""
        width={720}
        height={720}
        className="size-11 object-contain"
        priority={priority}
      />
      <span className="text-[1.05rem] font-extrabold tracking-[-0.04em]">
        <span className="text-primary">Busco</span>
        <span className="text-accent">Huella</span>
      </span>
    </span>
  );
}
