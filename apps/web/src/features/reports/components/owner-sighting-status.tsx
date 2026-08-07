import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

const config = {
  PENDING: {
    icon: Clock3,
    variant: 'warning' as const,
  },
  ACCEPTED: {
    icon: CheckCircle2,
    variant: 'success' as const,
  },
  REJECTED: {
    icon: XCircle,
    variant: 'neutral' as const,
  },
  FLAGGED: {
    icon: AlertTriangle,
    variant: 'danger' as const,
  },
};

export function OwnerSightingStatus({
  status,
  label,
}: {
  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'FLAGGED';
  label: string;
}) {
  const item = config[status];
  const Icon = item.icon;

  return (
    <Badge variant={item.variant}>
      <Icon
        className="mr-1 size-3.5"
        aria-hidden="true"
      />
      {label}
    </Badge>
  );
}
