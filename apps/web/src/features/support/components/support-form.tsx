'use client';

import { Bug, ChevronDown, Mail, Send } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';

export function SupportForm() {
  const { t } = useTranslations();
  const [category, setCategory] = useState('bug');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const categoryOptions = [
    { value: 'bug', label: t('common.support.categories.bug') },
    { value: 'account', label: t('common.support.categories.account') },
    { value: 'content', label: t('common.support.categories.content') },
    { value: 'other', label: t('common.support.categories.other') },
  ];

  useEffect(() => {
    if (!categoryOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCategoryOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [categoryOpen]);

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
      <div className="relative"><label id="support-category-label" className="block text-sm font-semibold">{t('common.support.categoryLabel')}</label><button id="support-category" type="button" aria-haspopup="listbox" aria-expanded={categoryOpen} aria-labelledby="support-category-label" onClick={() => setCategoryOpen((open) => !open)} className="mt-2 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface-elevated px-3 text-left text-base text-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"><span>{categoryOptions.find((option) => option.value === category)?.label}</span><ChevronDown className={`size-5 shrink-0 text-muted-foreground transition-transform ${categoryOpen ? 'rotate-180' : ''}`} aria-hidden="true" /></button>{categoryOpen ? <div role="listbox" aria-labelledby="support-category-label" className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-border-soft bg-surface-elevated p-1.5 shadow-[var(--shadow-lg)]">{categoryOptions.map((option) => <button key={option.value} type="button" role="option" aria-selected={category === option.value} onClick={() => { setCategory(option.value); setCategoryOpen(false); }} className={`flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-medium transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${category === option.value ? 'bg-primary-soft text-primary' : 'text-foreground'}`}>{option.label}</button>)}</div> : null}</div>
      <div><label htmlFor="support-description" className="block text-sm font-semibold">{t('common.support.descriptionLabel')}</label><textarea id="support-description" required minLength={10} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t('common.support.descriptionPlaceholder')} className="mt-2 min-h-32 w-full rounded-xl border border-border bg-surface-elevated px-3 py-3 text-base text-foreground placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft" /></div>
      <div><label htmlFor="support-email" className="block text-sm font-semibold">{t('common.support.emailLabel')} <span className="font-normal text-muted-foreground">({t('common.support.optional')})</span></label><input id="support-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('common.support.emailPlaceholder')} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-surface-elevated px-3 text-base text-foreground placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft" /></div>
      <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-public-action px-5 font-semibold !text-white transition-colors hover:bg-public-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft sm:w-auto"><Send className="size-4" aria-hidden="true" />{t('common.support.submit')}</button>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="size-4 shrink-0" aria-hidden="true" />info@buscohuella.com</p>
    </form>
  );
}
