import { Map } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function MapPage() {
  return (
    <PageContainer>
      <Card elevated>
        <CardHeader>
          <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Map className="size-7" aria-hidden="true" />
          </span>
          <CardTitle>Mapa</CardTitle>
          <CardDescription>
            El mapa interactivo se implementará en su Feature Pack específico.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
