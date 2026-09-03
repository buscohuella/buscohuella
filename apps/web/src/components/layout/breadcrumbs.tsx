import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
}: {
  items: BreadcrumbItem[];
  label?: string;
}) {
  return (
    <nav aria-label={label} className="text-sm">
      <ol className="flex min-h-8 items-center gap-1 overflow-x-auto whitespace-nowrap text-xs text-primary sm:min-h-10 sm:text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.href ?? 'current'}-${item.label}`} className="flex shrink-0 items-center gap-1">
                {index > 0 ? <ChevronRight className="size-4" aria-hidden="true" /> : null}
                {isLast || !item.href ? (
                  <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-semibold text-foreground' : undefined}>{item.label}</span>
                ) : (
                  <Link href={item.href} className="rounded-sm font-semibold hover:text-[#075e59] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{item.label}</Link>
                )}
              </li>
            );
          })}
      </ol>
    </nav>
  );
}
