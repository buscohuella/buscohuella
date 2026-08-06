'use server';

import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import type {
  ReportLifecycleState,
} from '../types/report-lifecycle-state';

type ReportRow =
  ReportDatabase['public']['Tables']['reports']['Row'];

type LifecycleAction =
  | 'PAUSE'
  | 'REACTIVATE'
  | 'RESOLVE'
  | 'CLOSE'
  | 'ARCHIVE';

type LifecycleRpcResult = {
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

function isLifecycleAction(
  value: string,
): value is LifecycleAction {
  return [
    'PAUSE',
    'REACTIVATE',
    'RESOLVE',
    'CLOSE',
    'ARCHIVE',
  ].includes(value);
}

function getReportClient(
  client: Awaited<
    ReturnType<typeof createClient>
  >,
) {
  return client as unknown as
    SupabaseClient<ReportDatabase>;
}

function getLifecycleRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName:
      'manage_report_lifecycle',
    args: {
      target_report_id: string;
      target_action: LifecycleAction;
      target_resolution_type:
        | string
        | null;
      target_notes: string | null;
    },
  ) => Promise<LifecycleRpcResult>;
}

function translateError(
  message: string | undefined,
  translate: (key: string) => string,
) {
  if (
    message?.includes(
      'REPORT_RESOLUTION_REQUIRED',
    )
  ) {
    return translate(
      'reports.detail.errors.resolutionRequired',
    );
  }

  if (
    message?.includes(
      'REPORT_CLOSURE_REASON_REQUIRED',
    )
  ) {
    return translate(
      'reports.detail.errors.closureRequired',
    );
  }

  if (
    message?.includes(
      'REPORT_ACTION_INVALID',
    )
  ) {
    return translate(
      'reports.detail.errors.invalidAction',
    );
  }

  if (
    message?.includes(
      'REPORT_NOT_FOUND',
    )
  ) {
    return translate(
      'reports.detail.errors.notFound',
    );
  }

  return translate(
    'reports.detail.errors.generic',
  );
}

export async function manageReportLifecycleAction(
  _previousState: ReportLifecycleState,
  formData: FormData,
): Promise<ReportLifecycleState> {
  const { translate } =
    await getServerTranslator();

  const reportId = getString(
    formData,
    'reportId',
  );
  const requestedAction = getString(
    formData,
    'action',
  );
  const resolutionType =
    getString(
      formData,
      'resolutionType',
    ) || null;
  const notes =
    getString(formData, 'notes') ||
    null;

  if (
    !reportId ||
    !isLifecycleAction(
      requestedAction,
    )
  ) {
    return {
      status: 'error',
      message: translate(
        'reports.detail.errors.invalidAction',
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
        'reports.detail.errors.session',
      ),
    };
  }

  const reportClient =
    getReportClient(supabase);
  const rpc = getLifecycleRpc(
    reportClient,
  );

  const { data, error } = await rpc(
    'manage_report_lifecycle',
    {
      target_report_id: reportId,
      target_action:
        requestedAction,
      target_resolution_type:
        resolutionType,
      target_notes: notes,
    },
  );

  if (error || !data) {
    logServerError(
      'report.lifecycle.failed',
      error ??
        new Error(
          'Lifecycle RPC returned no report',
        ),
      {
        userId: user.id,
        reportId,
        requestedAction,
        errorCode: error?.code,
        errorMessage: error?.message,
      },
    );

    return {
      status: 'error',
      message: translateError(
        error?.message,
        translate,
      ),
    };
  }

  revalidatePath('/mis-reportes');
  revalidatePath('/reportes');
  revalidatePath(
    `/mis-reportes/${reportId}`,
  );

  return {
    status: 'success',
    message: translate(
      `reports.detail.success.${requestedAction}`,
    ),
  };
}
