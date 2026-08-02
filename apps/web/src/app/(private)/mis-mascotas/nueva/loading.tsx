import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function NewPetLoading() {
  return (
    <PageContainer className="space-y-6" aria-busy="true">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-surface" />
        <div className="h-9 w-64 animate-pulse rounded bg-surface" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-surface" />
      </div>

      <Card elevated>
        <CardHeader className="space-y-3">
          <div className="size-12 animate-pulse rounded-xl bg-surface" />
          <div className="h-6 w-48 animate-pulse rounded bg-surface" />
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-surface" />
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-surface" />
              <div className="h-12 animate-pulse rounded-lg bg-surface" />
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
