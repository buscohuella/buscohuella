import { ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
  mobileBack,
}: {
  items: BreadcrumbItem[];
  label?: string;
  mobileBack?: BreadcrumbItem;
}) {
  const backItem = mobileBack ?? [...items].reverse().find((item) => item.href);

  return (
    <div className="text-sm">
      {backItem ? (
        <Link
          href={backItem.href!}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-soft bg-surface px-3.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft md:hidden"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>{backItem.label}</span>
        </Link>
      ) : null}
      <nav aria-label={label} className={backItem ? 'hidden md:block' : undefined}>
        <ol className="flex min-h-10 items-center gap-1 overflow-x-auto whitespace-nowrap text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.href ?? 'current'}-${item.label}`} className="flex shrink-0 items-center gap-1">
                {index > 0 ? <ChevronRight className="size-4" aria-hidden="true" /> : null}
                {isLast || !item.href ? (
                  <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-semibold text-foreground' : undefined}>{item.label}</span>
                ) : (
                  <Link href={item.href} className="rounded-sm font-semibold hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{item.label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
