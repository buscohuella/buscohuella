import { Map } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PublicMapPage() {
  return (
    <PageContainer>
      <Card elevated>
        <CardHeader>
          <Map className="mb-4 size-10 text-primary" aria-hidden="true" />
          <CardTitle>Mapa público</CardTitle>
          <CardDescription>
            Los casos y avistamientos públicos podrán consultarse sin iniciar sesión.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
