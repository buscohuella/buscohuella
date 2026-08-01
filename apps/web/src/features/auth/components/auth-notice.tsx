export interface AuthNoticeProps {
  message?: string;
  tone?: 'success' | 'error' | 'info';
}

const toneClasses = {
  success:
    'border-success/30 bg-primary-soft text-success',
  error:
    'border-danger/30 bg-danger/5 text-danger',
  info:
    'border-info/30 bg-info/5 text-info',
} as const;

export function AuthNotice({
  message,
  tone = 'success',
}: AuthNoticeProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`mb-5 rounded-lg border p-4 text-sm font-medium ${toneClasses[tone]}`}
    >
      {message}
    </div>
  );
}
