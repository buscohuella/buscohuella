import { PawPrint } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PetsPage() {
  return (
    <PageContainer>
      <Card elevated>
        <CardHeader>
          <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <PawPrint className="size-7" aria-hidden="true" />
          </span>
          <CardTitle>Mis mascotas</CardTitle>
          <CardDescription>
            Aquí podrás registrar y gestionar la información de tus mascotas.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
