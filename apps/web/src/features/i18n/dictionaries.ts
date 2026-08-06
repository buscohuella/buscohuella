import type { AppLocale } from './config';
import type { TranslationDictionary } from './types';

import caAuth from './locales/ca/auth.json';
import caCommon from './locales/ca/common.json';
import caHome from './locales/ca/home.json';
import caPets from './locales/ca/pets.json';
import caProfile from './locales/ca/profile.json';
import caPublicReport from './locales/ca/public-report.json';
import caReportEdit from './locales/ca/report-edit.json';
import caReports from './locales/ca/reports.json';
import caReportVisual from './locales/ca/report-visual.json';
import esAuth from './locales/es/auth.json';
import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esPets from './locales/es/pets.json';
import esProfile from './locales/es/profile.json';
import esPublicReport from './locales/es/public-report.json';
import esReportEdit from './locales/es/report-edit.json';
import esReports from './locales/es/reports.json';
import esReportVisual from './locales/es/report-visual.json';

const dictionaries = {
  es: {
    common: esCommon,
    auth: esAuth,
    home: esHome,
    pets: esPets,
    profile: esProfile,
    reports: esReports,
    reportEdit: esReportEdit,
    reportVisual: esReportVisual,
    publicReport: esPublicReport,
  },
  ca: {
    common: caCommon,
    auth: caAuth,
    home: caHome,
    pets: caPets,
    profile: caProfile,
    reports: caReports,
    reportEdit: caReportEdit,
    reportVisual: caReportVisual,
    publicReport: caPublicReport,
  },
} satisfies Record<AppLocale, TranslationDictionary>;

export type TranslationNamespace =
  keyof (typeof dictionaries)['es'];

export function getDictionary(
  locale: AppLocale,
): TranslationDictionary {
  return dictionaries[locale];
}

export function getNamespaceDictionary(
  locale: AppLocale,
  namespace: TranslationNamespace,
): TranslationDictionary {
  return dictionaries[locale][namespace];
}
