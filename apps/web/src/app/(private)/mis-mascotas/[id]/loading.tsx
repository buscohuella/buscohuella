import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function PetDetailLoading() {
  return (
    <PageContainer className="space-y-6" aria-busy="true">
      <div className="h-11 w-36 animate-pulse rounded-lg bg-surface" />

      <Card elevated>
        <CardHeader className="flex-row items-center gap-4">
          <div className="size-16 animate-pulse rounded-2xl bg-surface" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-surface" />
            <div className="h-8 w-48 animate-pulse rounded bg-surface" />
            <div className="h-4 w-32 animate-pulse rounded bg-surface" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-surface"
            />
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
