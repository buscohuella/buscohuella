import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

import { getServerTranslator } from '@/features/i18n/server';

export default async function NotFound() {
  const { translate } = await getServerTranslator();

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <section className="max-w-lg text-center" aria-labelledby="not-found-title">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">
          <FileQuestion className="size-8" aria-hidden="true" />
        </span>
        <h1 id="not-found-title" className="mt-6 text-3xl font-bold tracking-tight">
          {translate('common.notFound.title')}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {translate('common.notFound.description')}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 font-semibold text-primary-foreground">
            {translate('common.notFound.backHome')}
          </Link>
          <Link href="/mapa" className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 font-semibold text-foreground">
            {translate('common.notFound.goMap')}
          </Link>
        </div>
      </section>
    </main>
  );
}
