'use client';

import type { Map as MapboxMap, Marker } from 'mapbox-gl';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarClock, List, Map as MapIcon, MapPin } from 'lucide-react';

export type PublicMapReport = {
  id: string;
  reportType: 'LOST_PET' | 'FOUND_ANIMAL';
  title: string;
  description: string;
  municipalityName: string | null;
  publicLocationPrecision: string;
  latitude: number | null;
  longitude: number | null;
  incidentAt: string | null;
};

type PublicMapLabels = {
  active: string;
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  found: string;
  lost: string;
  title: string;
  unknownLocation: string;
};

type PublicMapProps = {
  labels: PublicMapLabels;
  reports: PublicMapReport[];
};

const DEFAULT_CENTER: [number, number] = [2.108, 41.548];

function publicRadiusMeters(precision: string) {
  const match = precision.match(/(\d+)/);
  const value = match?.[1] ? Number(match[1]) : 500;
  return Number.isFinite(value) && value > 0 ? value : 500;
}

function createApproximationCircle(
  longitude: number,
  latitude: number,
  radiusMeters: number,
) {
  const earthRadius = 6_378_137;
  const latitudeDelta = (radiusMeters / earthRadius) * (180 / Math.PI);
  const longitudeDelta =
    (radiusMeters / (earthRadius * Math.cos((latitude * Math.PI) / 180))) *
    (180 / Math.PI);
  const coordinates: [number, number][] = [];

  for (let index = 0; index <= 64; index += 1) {
    const angle = (index / 64) * Math.PI * 2;
    coordinates.push([
      longitude + Math.cos(angle) * longitudeDelta,
      latitude + Math.sin(angle) * latitudeDelta,
    ]);
  }

  return coordinates;
}

export function PublicMap({ labels, reports }: PublicMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const locatedReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          typeof report.latitude === 'number' &&
          typeof report.longitude === 'number',
      ),
    [reports],
  );

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainerRef.current) {
      return;
    }

    let cancelled = false;
    const markers = new Map<string, Marker>();

    void import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (cancelled || !mapContainerRef.current) {
        return;
      }

      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: DEFAULT_CENTER,
        zoom: 11,
        attributionControl: true,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mapRef.current = map;

      map.once('load', () => {
        if (cancelled) {
          return;
        }

        const bounds = new mapboxgl.LngLatBounds();
        const approximateReports = locatedReports.filter(
          (report) => report.publicLocationPrecision !== 'EXACT',
        );

        map.addSource('public-report-areas', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: approximateReports.map((report) => ({
              type: 'Feature' as const,
              properties: { reportId: report.id },
              geometry: {
                type: 'Polygon' as const,
                coordinates: [
                  createApproximationCircle(
                    report.longitude as number,
                    report.latitude as number,
                    publicRadiusMeters(report.publicLocationPrecision),
                  ),
                ],
              },
            })),
          },
        });
        map.addLayer({
          id: 'public-report-areas-fill',
          type: 'fill',
          source: 'public-report-areas',
          paint: {
            'fill-color': '#b91c1c',
            'fill-opacity': 0.16,
          },
        });
        map.addLayer({
          id: 'public-report-areas-line',
          type: 'line',
          source: 'public-report-areas',
          paint: {
            'line-color': '#b91c1c',
            'line-width': 2,
            'line-opacity': 0.55,
          },
        });
        map.on('click', 'public-report-areas-fill', (event) => {
          const feature = event.features?.[0] as
            | { properties?: { reportId?: unknown } }
            | undefined;
          const reportId = feature?.properties?.reportId;
          if (typeof reportId === 'string') setSelectedId(reportId);
        });
        map.on('mouseenter', 'public-report-areas-fill', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'public-report-areas-fill', () => {
          map.getCanvas().style.cursor = '';
        });

        locatedReports.forEach((report) => {
          const longitude = report.longitude as number;
          const latitude = report.latitude as number;
          if (report.publicLocationPrecision !== 'EXACT') {
            bounds.extend([longitude, latitude]);
            return;
          }
          const marker = new mapboxgl.Marker({
            color: report.reportType === 'LOST_PET' ? '#b91c1c' : '#047857',
          })
            .setLngLat([longitude, latitude])
            .addTo(map);

          marker.getElement().setAttribute('aria-hidden', 'true');
          marker.getElement().setAttribute('tabindex', '-1');
          marker.getElement().addEventListener('click', () => {
            setSelectedId(report.id);
          });
          markers.set(report.id, marker);
          bounds.extend([longitude, latitude]);
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 64, maxZoom: 13, duration: 0 });
        }
        setMapReady(true);
      });
    });

    return () => {
      cancelled = true;
      markers.forEach((marker) => marker.remove());
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [locatedReports]);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const report = locatedReports.find((item) => item.id === selectedId);
    if (!report || !mapRef.current) {
      return;
    }

    mapRef.current.flyTo({
      center: [report.longitude as number, report.latitude as number],
      zoom: Math.max(mapRef.current.getZoom(), 13),
      essential: true,
    });
  }, [locatedReports, selectedId]);

  return (
    <section aria-labelledby="public-map-heading" className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border-soft px-4 py-3">
            <div className="flex items-center gap-2">
              <MapIcon className="size-5 text-primary" aria-hidden="true" />
              <h2 id="public-map-heading" className="font-semibold">
                {labels.title}
              </h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {reports.length} {labels.active.toLowerCase()}
            </span>
          </div>
          <div className="relative min-h-[28rem] bg-surface-sunken">
            <div
              ref={mapContainerRef}
              className="min-h-[28rem]"
              aria-label={labels.description}
              role="region"
            />
            {!mapReady && locatedReports.length === 0 ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
                {labels.description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-elevated shadow-sm">
          <div className="flex items-center gap-2 border-b border-border-soft px-4 py-3">
            <List className="size-5 text-primary" aria-hidden="true" />
            <h2 className="font-semibold">{labels.title}</h2>
          </div>
          <div className="max-h-[28rem] space-y-3 overflow-y-auto p-3">
            {reports.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <p className="font-semibold">{labels.emptyTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {labels.emptyDescription}
                </p>
              </div>
            ) : (
              reports.map((report) => {
                const isSelected = report.id === selectedId;
                const reportType =
                  report.reportType === 'LOST_PET'
                    ? labels.lost
                    : labels.found;

                return (
                  <article
                    key={report.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary-soft'
                        : 'border-border-soft'
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full text-left focus-visible:outline-none"
                      onClick={() => setSelectedId(report.id)}
                      aria-pressed={isSelected}
                    >
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-danger-soft px-2.5 py-1 text-danger">
                          {reportType}
                        </span>
                        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-primary">
                          {labels.active}
                        </span>
                      </div>
                      <h3 className="mt-3 font-semibold">{report.title}</h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-start gap-2">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>
                            {report.municipalityName ?? labels.unknownLocation}
                          </span>
                        </p>
                        {report.incidentAt ? (
                          <p className="flex items-start gap-2">
                            <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                            <span>
                              {new Intl.DateTimeFormat('es-ES', {
                                dateStyle: 'medium',
                              }).format(new Date(report.incidentAt))}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    </button>
                    <Link
                      href={`/reportes/${report.id}`}
                      className="mt-3 inline-flex rounded-md text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none"
                    >
                      {report.title}
                    </Link>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
