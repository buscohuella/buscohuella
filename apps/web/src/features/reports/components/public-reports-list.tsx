'use client';

import { CalendarClock, ImageOff, MapPin, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ReportType = 'LOST_PET' | 'FOUND_ANIMAL';

export type PublicReportListItem = {
  id: string;
  reportType: ReportType;
  title: string;
  municipalityName: string | null;
  incidentAt: string | null;
  latitude: number | null;
  longitude: number | null;
  photoUrl: string | null;
};

type Labels = {
  active: string;
  all: string;
  clearLocation: string;
  addressPlaceholder: string;
  found: string;
  lost: string;
  noPhoto: string;
  recent: string;
  filterTitle: string;
  sortTitle: string;
  locationTitle: string;
  useLocation: string;
  usingLocation: string;
  searching: string;
  radiusUnit: string;
  radiusAll: string;
  unknownLocation: string;
  approximateTime: string;
  resultOne: string;
  resultMany: string;
  viewNotice: string;
  emptyTitle: string;
  emptyDescription: string;
};

type Props = {
  labels: Labels;
  reports: PublicReportListItem[];
};

type Suggestion = { id: string; label: string; center: [number, number] };

function distanceInKm(first: [number, number], second: [number, number]) {
  const earthRadiusKm = 6371;
  const latDelta = ((second[1] - first[1]) * Math.PI) / 180;
  const lngDelta = ((second[0] - first[0]) * Math.PI) / 180;
  const firstLat = (first[1] * Math.PI) / 180;
  const secondLat = (second[1] * Math.PI) / 180;
  const a = Math.sin(latDelta / 2) ** 2
    + Math.sin(lngDelta / 2) ** 2 * Math.cos(firstLat) * Math.cos(secondLat);
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function PublicReportsList({ labels, reports }: Props) {
  const skipSearchRef = useRef(false);
  const [type, setType] = useState<'ALL' | ReportType>('ALL');
  const [recentFirst, setRecentFirst] = useState(true);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);

  const visibleReports = useMemo(() => {
    const filtered = reports.filter((report) => {
      if (type !== 'ALL' && report.reportType !== type) return false;
      if (location && radius !== null) {
        if (report.latitude === null || report.longitude === null) return false;
        return distanceInKm(location, [report.longitude, report.latitude]) <= radius;
      }
      return true;
    });
    return recentFirst
      ? [...filtered].sort((first, second) => Date.parse(second.incidentAt ?? '') - Date.parse(first.incidentAt ?? ''))
      : filtered;
  }, [location, radius, recentFirst, reports, type]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const trimmedQuery = query.trim();
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    if (!token || trimmedQuery.length < 3) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setSearching(true);
      void fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmedQuery)}.json?autocomplete=true&limit=5&language=es&country=es&access_token=${token}`, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error('Geocoding request failed');
          return (await response.json()) as { features?: Array<{ id: string; place_name: string; center: [number, number] }> };
        })
        .then((data) => setSuggestions((data.features ?? []).map((feature) => ({ id: feature.id, label: feature.place_name, center: feature.center }))))
        .catch(() => setSuggestions([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [query]);

  function useCurrentLocation() {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => { setLocation([coords.longitude, coords.latitude]); setRadius(null); },
      () => undefined,
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  function clearLocation() {
    setQuery(''); setSuggestions([]); setLocation(null); setRadius(null);
  }

  return (
    <>
      <div className="space-y-3 rounded-2xl border border-border-soft bg-surface-elevated p-4" aria-label={labels.filterTitle}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{labels.filterTitle}</span>
          {([['ALL', labels.all], ['LOST_PET', labels.lost], ['FOUND_ANIMAL', labels.found]] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={type === value} onClick={() => setType(value)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${type === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {label}
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold">{labels.sortTitle}</span>
          <button type="button" aria-pressed={recentFirst} onClick={() => setRecentFirst((current) => !current)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${recentFirst ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted-foreground'}`}>
            {labels.recent}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{labels.locationTitle}</span>
          <button type="button" onClick={useCurrentLocation} className="min-h-10 rounded-full border border-border px-3 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
            {labels.useLocation}
          </button>
          <div className="relative min-w-60 flex-1 basis-full sm:basis-80">
            <label htmlFor="public-reports-location" className="sr-only">{labels.locationTitle}</label>
            <div className="flex min-h-10 items-center gap-2 rounded-full border border-border px-3">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input id="public-reports-location" value={query} onChange={(event) => { skipSearchRef.current = false; setQuery(event.target.value); setSuggestions(event.target.value.trim().length < 3 ? [] : suggestions); }} placeholder={labels.addressPlaceholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              {query ? <button type="button" onClick={clearLocation} aria-label={labels.clearLocation} title={labels.clearLocation} className="rounded-full p-1 text-muted-foreground hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"><X className="size-4" aria-hidden="true" /></button> : null}
            </div>
            {suggestions.length > 0 ? <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-lg">{suggestions.map((suggestion) => <li key={suggestion.id}><button type="button" onClick={() => { skipSearchRef.current = true; setLocation(suggestion.center); setRadius(null); setQuery(suggestion.label); setSuggestions([]); }} className="w-full px-3 py-2 text-left text-sm hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{suggestion.label}</button></li>)}</ul> : searching ? <p className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm text-muted-foreground shadow-lg">{labels.searching}</p> : null}
          </div>
          {[1, 5, 10, 20].map((value) => <button key={value} type="button" disabled={!location} aria-pressed={radius === value} onClick={() => setRadius(value)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${radius === value ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted-foreground'}`}>{value} {labels.radiusUnit}</button>)}
          <button type="button" disabled={!location} aria-pressed={radius === null} onClick={() => setRadius(null)} className="min-h-10 rounded-full border border-border px-3 text-sm font-semibold text-muted-foreground disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{labels.radiusAll}</button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">{visibleReports.length} {visibleReports.length === 1 ? labels.resultOne : labels.resultMany}</p>
      {visibleReports.length === 0 ? <div className="rounded-2xl border border-border-soft bg-surface-elevated"><div className="p-8 text-center"><p className="font-semibold">{labels.emptyTitle}</p><p className="mt-2 text-sm text-muted-foreground">{labels.emptyDescription}</p></div></div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleReports.map((report) => <Link key={report.id} href={`/avisos/${report.id}`} className="group rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"><Card className="h-full overflow-hidden transition-transform group-hover:-translate-y-0.5"><div className="relative aspect-[16/9] border-b border-border bg-surface-elevated">{report.photoUrl ? <Image src={report.photoUrl} alt={report.title} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"><ImageOff className="size-8" aria-hidden="true" /><span className="text-sm">{labels.noPhoto}</span></div>}</div><CardHeader><div className="flex flex-wrap gap-2"><span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">{report.reportType === 'LOST_PET' ? labels.lost : labels.found}</span><span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{labels.active}</span></div><CardTitle className="pt-2">{report.title}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{report.municipalityName ?? labels.unknownLocation}</span></div><div className="flex items-start gap-2 text-muted-foreground"><CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{report.incidentAt ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(report.incidentAt)) : labels.approximateTime}</span></div><span className="inline-flex min-h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">{labels.viewNotice}</span></CardContent></Card></Link>)}</div>}
    </>
  );
}
