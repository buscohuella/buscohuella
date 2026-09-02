import type { AppLocale } from './config';
import type { TranslationDictionary } from './types';

import caAuth from './locales/ca/auth.json';
import caAccessibility from './locales/ca/accessibility.json';
import caCommon from './locales/ca/common.json';
import caHome from './locales/ca/home.json';
import caMySightings from './locales/ca/my-sightings.json';
import caNotifications from './locales/ca/notifications.json';
import caNoticesHub from './locales/ca/notices-hub.json';
import caOwnerSightings from './locales/ca/owner-sightings.json';
import caPets from './locales/ca/pets.json';
import caProfile from './locales/ca/profile.json';
import caPublicReport from './locales/ca/public-report.json';
import caReportEdit from './locales/ca/report-edit.json';
import caReports from './locales/ca/reports.json';
import caSightingCreate from './locales/ca/sighting-create.json';
import caSightingPhotos from './locales/ca/sighting-photos.json';
import caReportVisual from './locales/ca/report-visual.json';
import esAuth from './locales/es/auth.json';
import esAccessibility from './locales/es/accessibility.json';
import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esMySightings from './locales/es/my-sightings.json';
import esNotifications from './locales/es/notifications.json';
import esNoticesHub from './locales/es/notices-hub.json';
import esOwnerSightings from './locales/es/owner-sightings.json';
import esPets from './locales/es/pets.json';
import esProfile from './locales/es/profile.json';
import esPublicReport from './locales/es/public-report.json';
import esReportEdit from './locales/es/report-edit.json';
import esReports from './locales/es/reports.json';
import esSightingCreate from './locales/es/sighting-create.json';
import esSightingPhotos from './locales/es/sighting-photos.json';
import esReportVisual from './locales/es/report-visual.json';

const dictionaries = {
  es: {
    common: esCommon,
    auth: esAuth,
    accessibility: esAccessibility,
    home: esHome,
    pets: esPets,
    profile: esProfile,
    reports: esReports,
    reportEdit: esReportEdit,
    reportVisual: esReportVisual,
    publicReport: esPublicReport,
    sightingCreate: esSightingCreate,
    sightingPhotos: esSightingPhotos,
    ownerSightings: esOwnerSightings,
    mySightings: esMySightings,
    notifications: esNotifications,
    noticesHub: esNoticesHub,
  },
  ca: {
    common: caCommon,
    auth: caAuth,
    accessibility: caAccessibility,
    home: caHome,
    pets: caPets,
    profile: caProfile,
    reports: caReports,
    reportEdit: caReportEdit,
    reportVisual: caReportVisual,
    publicReport: caPublicReport,
    sightingCreate: caSightingCreate,
    sightingPhotos: caSightingPhotos,
    ownerSightings: caOwnerSightings,
    mySightings: caMySightings,
    notifications: caNotifications,
    noticesHub: caNoticesHub,
  },
} satisfies Record<
  AppLocale,
  TranslationDictionary
>;

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


