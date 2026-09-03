'use client';

import { Bug, Flag, Lightbulb, Mail, MessageCircle, Send, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';

export function SupportForm() {
  const { t } = useTranslations();
  const [category, setCategory] = useState('bug');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const categoryOptions: Array<{ value: string; label: string; description: string; icon: LucideIcon }> = [
    { value: 'bug', label: t('common.support.categories.bug'), description: t('common.support.categoryDescriptions.bug'), icon: Bug },
    { value: 'suggestion', label: t('common.support.categories.suggestion'), description: t('common.support.categoryDescriptions.suggestion'), icon: Lightbulb },
    { value: 'content', label: t('common.support.categories.content'), description: t('common.support.categoryDescriptions.content'), icon: Flag },
    { value: 'account', label: t('common.support.categories.account'), description: t('common.support.categoryDescriptions.account'), icon: UserRound },
    { value: 'other', label: t('common.support.categories.other'), description: t('common.support.categoryDescriptions.other'), icon: MessageCircle },
  ];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `${t('common.support.subjectPrefix')}: ${t(`common.support.categories.${category}`)}`;
    const body = [
      `${t('common.support.categoryLabel')}: ${t(`common.support.categories.${category}`)}`,
      `${t('common.support.descriptionLabel')}: ${description}`,
      email ? `${t('common.support.emailLabel')}: ${email}` : '',
      `${t('common.support.pageLabel')}: ${window.location.href}`,
    ].filter(Boolean).join('\n\n');
    window.location.href = `mailto:info@buscohuella.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-3xl border border-border-soft bg-surface-elevated p-5 shadow-[var(--shadow-sm)] sm:p-7">
      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary-soft p-4"><Bug className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-6 text-muted-foreground">{t('common.support.privacyNote')}</p></div>
      <fieldset><legend className="text-sm font-semibold">{t('common.support.categoryLabel')}</legend><div role="radiogroup" aria-label={t('common.support.categoryLabel')} className="mt-2 grid gap-2 sm:grid-cols-2">{categoryOptions.map((option) => { const Icon = option.icon; const selected = category === option.value; return <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => setCategory(option.value)} className={`flex min-h-16 items-start gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${selected ? 'border-primary bg-primary-soft text-primary' : 'border-border-soft bg-surface text-foreground hover:border-primary/50 hover:bg-primary-soft/50'} ${option.value === 'other' ? 'sm:col-span-2' : ''}`}><span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-primary text-primary-foreground' : 'bg-surface-sunken text-muted-foreground'}`}><Icon className="size-4" aria-hidden="true" /></span><span className="min-w-0"><span className="block text-sm font-semibold">{option.label}</span><span className="mt-0.5 block text-xs leading-4 text-muted-foreground">{option.description}</span></span></button>; })}</div></fieldset>
      <div><label htmlFor="support-description" className="block text-sm font-semibold">{t('common.support.descriptionLabel')}</label><textarea id="support-description" required minLength={10} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t('common.support.descriptionPlaceholder')} className="mt-2 min-h-32 w-full rounded-xl border border-border bg-surface-elevated px-3 py-3 text-base text-foreground placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft" /></div>
      <div><label htmlFor="support-email" className="block text-sm font-semibold">{t('common.support.emailLabel')} <span className="font-normal text-muted-foreground">({t('common.support.optional')})</span></label><input id="support-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('common.support.emailPlaceholder')} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-surface-elevated px-3 text-base text-foreground placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft" /></div>
      <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-public-action px-5 font-semibold !text-white transition-colors hover:bg-public-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft sm:w-auto"><Send className="size-4" aria-hidden="true" />{t('common.support.submit')}</button>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="size-4 shrink-0" aria-hidden="true" />info@buscohuella.com</p>
    </form>
  );
}
