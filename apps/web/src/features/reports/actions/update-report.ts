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
  UpdateReportState,
} from '../types/update-report-state';

type ReportRow =
  ReportDatabase['public']['Tables']['reports']['Row'];

type UpdateRpcResult = {
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

function getUpdateRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName:
      'update_owned_report_content',
    args: {
      target_report_id: string;
      target_title: string;
      target_description: string;
      target_municipality_name: string;
      target_contact_mode: string;
      target_public_phone:
        | string
        | null;
      target_public_email:
        | string
        | null;
    },
  ) => Promise<UpdateRpcResult>;
}

function translateError(
  message: string | undefined,
  translate: (key: string) => string,
) {
  const mappings: Array<
    [string, string]
  > = [
    [
      'REPORT_NOT_FOUND',
      'reportEdit.errors.notFound',
    ],
    [
      'REPORT_EDIT_STATE_INVALID',
      'reportEdit.errors.state',
    ],
    [
      'REPORT_TITLE_INVALID',
      'reportEdit.errors.title',
    ],
    [
      'REPORT_DESCRIPTION_INVALID',
      'reportEdit.errors.description',
    ],
    [
      'REPORT_LOCATION_REQUIRED',
      'reportEdit.errors.location',
    ],
    [
      'REPORT_CONTACT_MODE_INVALID',
      'reportEdit.errors.contact',
    ],
    [
      'REPORT_PUBLIC_PHONE_REQUIRED',
      'reportEdit.errors.phone',
    ],
    [
      'REPORT_PUBLIC_EMAIL_REQUIRED',
      'reportEdit.errors.email',
    ],
  ];

  const mapping = mappings.find(
    ([code]) =>
      message?.includes(code),
  );

  return translate(
    mapping?.[1] ??
      'reportEdit.errors.generic',
  );
}

export async function updateReportAction(
  _previousState: UpdateReportState,
  formData: FormData,
): Promise<UpdateReportState> {
  const { translate } =
    await getServerTranslator();

  const reportId = getString(
    formData,
    'reportId',
  );
  const title = getString(
    formData,
    'title',
  );
  const description = getString(
    formData,
    'description',
  );
  const municipalityName = getString(
    formData,
    'municipalityName',
  );
  const contactMode = getString(
    formData,
    'contactMode',
  );
  const publicPhone =
    getString(
      formData,
      'publicPhone',
    ) || null;
  const publicEmail =
    getString(
      formData,
      'publicEmail',
    ) || null;

  if (!reportId) {
    return {
      status: 'error',
      message: translate(
        'reportEdit.errors.notFound',
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
        'reportEdit.errors.session',
      ),
    };
  }

  const client =
    getReportClient(supabase);
  const rpc = getUpdateRpc(client);

  const { data, error } = await rpc(
    'update_owned_report_content',
    {
      target_report_id: reportId,
      target_title: title,
      target_description:
        description,
      target_municipality_name:
        municipalityName,
      target_contact_mode:
        contactMode,
      target_public_phone:
        publicPhone,
      target_public_email:
        publicEmail,
    },
  );

  if (error || !data) {
    logServerError(
      'report.update.failed',
      error ??
        new Error(
          'Update RPC returned no report',
        ),
      {
        userId: user.id,
        reportId,
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
  revalidatePath(
    `/mis-reportes/${reportId}/editar`,
  );

  redirect(
    `/mis-reportes/${reportId}?actualizado=1`,
  );
}
