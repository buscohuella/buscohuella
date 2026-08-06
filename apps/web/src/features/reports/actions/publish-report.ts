'use server';

import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type {
  PublishReportState,
} from '../types/publish-report-state';

type ReportRow =
  ReportDatabase['public']['Tables']['reports']['Row'];

type PublishRpcResult = {
  data: ReportRow | null;
  error: {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  } | null;
};

function getString(
  formData: FormData,
  name: string,
) {
  const value = formData.get(name);

  return typeof value === 'string'
    ? value.trim()
    : '';
}

function getReportClient(
  client: Awaited<
    ReturnType<typeof createClient>
  >,
) {
  return client as unknown as
    SupabaseClient<ReportDatabase>;
}

function getPublishRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName: 'publish_report_draft',
    args: {
      target_report_id: string;
    },
  ) => Promise<PublishRpcResult>;
}

function translateRpcError(
  message: string | undefined,
  translate: (key: string) => string,
) {
  const knownErrors: Record<
    string,
    string
  > = {
    REPORT_NOT_FOUND:
      'reports.publish.errors.notFound',
    REPORT_NOT_DRAFT:
      'reports.publish.errors.notDraft',
    REPORT_TITLE_REQUIRED:
      'reports.publish.errors.title',
    REPORT_DESCRIPTION_REQUIRED:
      'reports.publish.errors.description',
    REPORT_PET_REQUIRED:
      'reports.publish.errors.pet',
    REPORT_LOCATION_REQUIRED:
      'reports.publish.errors.location',
    REPORT_PUBLISH_CONFLICT:
      'reports.publish.errors.conflict',
  };

  const entry = Object.entries(
    knownErrors,
  ).find(([code]) =>
    message?.includes(code),
  );

  return translate(
    entry?.[1] ??
      'reports.publish.errors.generic',
  );
}

export async function publishReportAction(
  _previousState: PublishReportState,
  formData: FormData,
): Promise<PublishReportState> {
  const { translate } =
    await getServerTranslator();
  const reportId = getString(
    formData,
    'reportId',
  );
  const confirmation =
    getString(
      formData,
      'confirmation',
    ) === 'on';

  if (!reportId) {
    return {
      status: 'error',
      message: translate(
        'reports.publish.errors.notFound',
      ),
    };
  }

  if (!confirmation) {
    return {
      status: 'error',
      message: translate(
        'reports.publish.errors.confirmation',
      ),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: translate(
        'reports.publish.errors.session',
      ),
    };
  }

  const reportClient =
    getReportClient(supabase);
  const rpc = getPublishRpc(
    reportClient,
  );

  const { data, error } = await rpc(
    'publish_report_draft',
    {
      target_report_id: reportId,
    },
  );

  if (error || !data) {
    logServerError(
      'report.publish.failed',
      error ?? new Error(
        'Publish RPC returned no report',
      ),
      {
        userId: user.id,
        reportId,
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails: error?.details,
      },
    );

    return {
      status: 'error',
      message: translateRpcError(
        error?.message,
        translate,
      ),
    };
  }

  revalidatePath('/mis-reportes');
  revalidatePath('/reportes');
  revalidatePath(
    `/mis-reportes/${reportId}/publicar`,
  );

  redirect(
    '/mis-reportes?publicado=1',
  );
}
