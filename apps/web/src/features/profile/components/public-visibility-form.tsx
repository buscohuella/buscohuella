'use client';

import { ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

import { Alert } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { updatePublicVisibilityAction } from '../actions/update-public-visibility';

export function PublicVisibilityForm({
  isPublic,
  publicAlias,
  publicShowAvatar,
  publicShowMunicipality,
}: {
  isPublic: boolean;
  publicAlias: string;
  publicShowAvatar: boolean;
  publicShowMunicipality: boolean;
}) {
  const { t } = useTranslations('profile');
  const [checked, setChecked] = useState(isPublic);
  const [showAvatar, setShowAvatar] = useState(publicShowAvatar);
  const [showMunicipality, setShowMunicipality] = useState(publicShowMunicipality);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(nextValue: boolean, nextAvatar = showAvatar, nextMunicipality = showMunicipality) {
    const previousValue = checked;
    const previousAvatar = showAvatar;
    const previousMunicipality = showMunicipality;
    setChecked(nextValue);
    setShowAvatar(nextAvatar);
    setShowMunicipality(nextMunicipality);
    setMessage(null);
    startTransition(async () => {
      const result = await updatePublicVisibilityAction({
        isPublic: nextValue,
        showAvatar: nextAvatar,
        showMunicipality: nextMunicipality,
      });
      if (!result.ok) {
        setChecked(previousValue);
        setShowAvatar(previousAvatar);
        setShowMunicipality(previousMunicipality);
        setMessage(
          result.reason === 'ALIAS_REQUIRED'
            ? t('privacy.visibility.aliasRequired')
            : t('privacy.visibility.error'),
        );
        return;
      }
      setMessage(t('privacy.visibility.saved'));
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <ShieldCheck className="size-6" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{t('privacy.visibility.title')}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {t('privacy.visibility.description')}
        </p>
      </div>
      <Checkbox
        id="profile-public-visibility"
        checked={checked}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.checked)}
        label={t('privacy.visibility.label')}
        description={t('privacy.visibility.help')}
      />
      <div className="space-y-3 rounded-xl border border-border-soft bg-surface p-4">
        <h3 className="font-semibold">{t('privacy.visibility.sharedTitle')}</h3>
        <p className="text-sm text-muted-foreground">{t('privacy.visibility.sharedDescription')}</p>
        <Checkbox
          id="profile-public-avatar"
          checked={showAvatar}
          disabled={isPending}
          onChange={(event) => handleChange(checked, event.target.checked, showMunicipality)}
          label={t('privacy.visibility.avatarLabel')}
        />
        <Checkbox
          id="profile-public-municipality"
          checked={showMunicipality}
          disabled={isPending}
          onChange={(event) => handleChange(checked, showAvatar, event.target.checked)}
          label={t('privacy.visibility.municipalityLabel')}
        />
      </div>
      {checked && publicAlias ? (
        <Link
          href={`/u/${publicAlias}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          {t('privacy.visibility.view')}
          <ExternalLink className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
      {message ? (
        <Alert variant={message === t('privacy.visibility.saved') ? 'success' : 'danger'}>
          {message}
        </Alert>
      ) : null}
    </div>
  );
}
