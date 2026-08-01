import { ScrollText } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PublicReportsPage() {
  return (
    <PageContainer>
      <Card elevated>
        <CardHeader>
          <ScrollText className="mb-4 size-10 text-primary" aria-hidden="true" />
          <CardTitle>Reportes públicos</CardTitle>
          <CardDescription>
            Aquí se mostrarán pérdidas, hallazgos y avistamientos públicos.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
