'use client';

import { Check, Contrast, Type, ZapOff } from 'lucide-react';

import { useAccessibility } from '@/features/accessibility/accessibility-provider';
import { useTranslations } from '@/features/i18n/i18n-provider';

const optionClassName = 'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border-soft px-4 py-3 transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary-soft';

export function AccessibilitySettings() {
  const { t } = useTranslations('accessibility');
  const { fontSize, contrast, reducedMotion, setFontSize, setContrast, setReducedMotion } = useAccessibility();

  return (
    <div className="space-y-8">
      <fieldset className="space-y-3">
        <legend className="flex items-center gap-2 text-base font-semibold"><Type className="size-5 text-primary" aria-hidden="true" />{t('fontSize.title')}</legend>
        <p className="text-sm text-muted-foreground">{t('fontSize.description')}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {(['default', 'large', 'x-large'] as const).map((value) => (
            <label key={value} className={optionClassName}>
              <input type="radio" name="font-size" value={value} checked={fontSize === value} onChange={() => setFontSize(value)} className="size-4 accent-primary" />
              <span className="flex flex-1 items-center gap-3">
                <span className="text-lg leading-none" aria-hidden="true">Aa</span>
                <span>{t(`fontSize.options.${value}`)}</span>
              </span>
              {fontSize === value ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="flex items-center gap-2 text-base font-semibold"><Contrast className="size-5 text-primary" aria-hidden="true" />{t('contrast.title')}</legend>
        <p className="text-sm text-muted-foreground">{t('contrast.description')}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(['default', 'high'] as const).map((value) => (
            <label key={value} className={optionClassName}>
              <input type="radio" name="contrast" value={value} checked={contrast === value} onChange={() => setContrast(value)} className="size-4 accent-primary" />
              <span className="flex flex-1 items-center gap-3">
                <span className="rounded border border-current px-2 py-0.5 text-sm font-semibold" aria-hidden="true">Aa</span>
                <span>{t(`contrast.options.${value}`)}</span>
              </span>
              {contrast === value ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border-soft px-4 py-4 hover:border-primary">
        <input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} className="mt-1 size-4 accent-primary" />
        <span className="flex-1"><span className="flex items-center gap-2 font-semibold"><ZapOff className="size-5 text-primary" aria-hidden="true" />{t('motion.title')}</span><span className="mt-1 block text-sm text-muted-foreground">{t('motion.description')}</span></span>
      </label>
      <p className="text-sm text-muted-foreground" role="status" aria-live="polite">{t('saved')}</p>
    </div>
  );
}
