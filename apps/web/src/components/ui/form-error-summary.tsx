import { Alert } from '@/components/ui/alert';

export interface FormErrorItem {
  id: string;
  message: string;
  fieldId?: string;
}

export interface FormErrorSummaryProps {
  errors: readonly FormErrorItem[];
  title?: string;
}

export function FormErrorSummary({
  errors,
  title = 'Revisa los campos indicados',
}: FormErrorSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <Alert variant="danger" title={title}>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {errors.map((error) => (
          <li key={error.id}>
            {error.fieldId ? (
              <a
                href={`#${error.fieldId}`}
                className="font-medium underline underline-offset-2 hover:no-underline"
              >
                {error.message}
              </a>
            ) : (
              error.message
            )}
          </li>
        ))}
      </ul>
    </Alert>
  );
}