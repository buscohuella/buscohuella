import { Alert } from '@/components/ui/alert';

export interface AuthNoticeProps {
  message?: string;
  tone?: 'success' | 'error' | 'info';
}

const toneVariants = {
  success: 'success',
  error: 'danger',
  info: 'info',
} as const;

export function AuthNotice({
  message,
  tone = 'success',
}: AuthNoticeProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert
      variant={toneVariants[tone]}
      className="mb-5"
    >
      {message}
    </Alert>
  );
}
