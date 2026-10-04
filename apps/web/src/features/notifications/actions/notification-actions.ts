'use server';

import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/services/supabase/server';

function text(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function safeInternalHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//') ? href : '/notificaciones';
}

export async function openNotificationAction(formData: FormData) {
  const notificationId = text(formData, 'notificationId');
  const href = safeInternalHref(text(formData, 'href'));

  if (!notificationId) {
    redirect(href);
  }

  const supabase = await createClient();

  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  await client.rpc('mark_notification_read', {
    target_notification_id: notificationId,
  });

  revalidatePath('/notificaciones');
  redirect(href);
}

export async function markAllNotificationsReadAction() {
  const supabase = await createClient();

  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  await client.rpc('mark_all_notifications_read');

  revalidatePath('/', 'layout');

  revalidatePath('/notificaciones');
  revalidatePath('/', 'layout');
}
