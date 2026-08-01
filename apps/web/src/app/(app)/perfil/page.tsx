import { CircleUserRound } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <PageContainer>
      <Card elevated>
        <CardHeader>
          <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <CircleUserRound className="size-7" aria-hidden="true" />
          </span>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            La configuración de la cuenta llegará junto con autenticación y perfiles.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
