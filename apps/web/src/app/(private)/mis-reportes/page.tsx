import { ScrollText } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <PageContainer>
      <Card elevated>
        <CardHeader>
          <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <ScrollText className="size-7" aria-hidden="true" />
          </span>
          <CardTitle>Reportes</CardTitle>
          <CardDescription>
            Aquí se gestionarán mascotas perdidas, encontradas y avistamientos.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
