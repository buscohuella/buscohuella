'use client';

import type { Map as MapboxMap, Marker } from 'mapbox-gl';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CalendarClock, Cat, ChevronDown, Dog, Eye, List, LocateFixed, Map as MapIcon, MapPin, PawPrint, Search, SlidersHorizontal, X } from 'lucide-react';

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
  speciesId: number;
};

type PublicMapLabels = {
  active: string;
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  found: string;
  lost: string;
  locationError: string;
  locationSecureError: string;
  locationTitle: string;
  markOnMap: string;
  markingOnMap: string;
  addressPlaceholder: string;
  chooseOnMap: string;
  clearLocation: string;
  mapUnavailable: string;
  listTitle: string;
  petLabel: string;
  recent: string;
  radiusAll: string;
  radiusUnit: string;
  sortTitle: string;
  sortRecent: string;
  sortNearest: string;
  title: string;
  useLocation: string;
  useLocationShort: string;
  recenterLocation: string;
  moreFilters: string;
  closeFilters: string;
  usingLocation: string;
  searching: string;
  unknownLocation: string;
  viewNotice: string;
  sightingCtaTitle: string;
  sightingCtaDescription: string;
  sightingCtaAction: string;
  sightingCtaActionSelected: string;
  sightingCtaSelectNotice: string;
};

export type PublicMapSpeciesFilter = {
  key: 'all' | 'dog' | 'cat' | 'other';
  label: string;
  ids: number[];
};

type PublicMapProps = {
  labels: PublicMapLabels;
  reports: PublicMapReport[];
  speciesFilters: PublicMapSpeciesFilter[];
};

type AddressSuggestion = {
  id: string;
  label: string;
  center: [number, number];
  zoom: number;
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

function distanceInKm(
  first: [number, number],
  second: [number, number],
) {
  const earthRadiusKm = 6371;
  const latitudeDelta = ((second[1] - first[1]) * Math.PI) / 180;
  const longitudeDelta = ((second[0] - first[0]) * Math.PI) / 180;
  const latitudeOne = (first[1] * Math.PI) / 180;
  const latitudeTwo = (second[1] * Math.PI) / 180;
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.sin(longitudeDelta / 2) ** 2 *
      Math.cos(latitudeOne) *
      Math.cos(latitudeTwo);
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createOriginMarkerElement() {
  const originElement = document.createElement('div');
  originElement.setAttribute('aria-hidden', 'true');
  originElement.className = 'pointer-events-none relative flex items-center justify-center';
  const originAccuracy = document.createElement('span');
  originAccuracy.className = 'absolute inset-0 rounded-full';
  originAccuracy.style.border = '1px solid rgba(15, 118, 110, 0.3)';
  originAccuracy.style.backgroundColor = 'rgba(15, 118, 110, 0.08)';
  const originDot = document.createElement('span');
  originDot.className = 'relative z-10 block size-4 rounded-full';
  originDot.style.border = '2px solid #ffffff';
  originDot.style.backgroundColor = '#0f766e';
  originElement.append(originAccuracy, originDot);
  return originElement;
}

export function PublicMap({ labels, reports, speciesFilters }: PublicMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const originMarkerRef = useRef<Marker | null>(null);
  const selectingLocationRef = useRef(false);
  const mapScrollPositionRef = useRef<number | null>(null);
  const skipAddressSearchRef = useRef(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [sortMode, setSortMode] = useState<'recent' | 'nearest'>('recent');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [speciesFilter, setSpeciesFilter] = useState<PublicMapSpeciesFilter['key']>('all');
  const [radiusKm, setRadiusKm] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userAccuracy, setUserAccuracy] = useState<number | null>(null);
  const [locationMode, setLocationMode] = useState<'gps' | 'address' | 'map' | null>(null);
  const [locationZoom, setLocationZoom] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<'secure-context' | 'unavailable' | null>(null);
  const [addressQuery, setAddressQuery] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [selectingLocation, setSelectingLocation] = useState(false);

  const visibleReports = useMemo(() => {
    const selectedSpecies = speciesFilters.find((filter) => filter.key === speciesFilter);
    const speciesFiltered = selectedSpecies && selectedSpecies.key !== 'all'
      ? reports.filter((report) => selectedSpecies.ids.includes(report.speciesId))
      : reports;
    const filtered = userLocation && radiusKm
      ? speciesFiltered.filter((report) => {
          if (typeof report.latitude !== 'number' || typeof report.longitude !== 'number') {
            return false;
          }
          return distanceInKm(userLocation, [report.longitude, report.latitude]) <= radiusKm;
        })
      : speciesFiltered;

    return sortMode === 'recent'
      ? [...filtered].sort((first, second) => {
          const firstTime = first.incidentAt ? Date.parse(first.incidentAt) : 0;
          const secondTime = second.incidentAt ? Date.parse(second.incidentAt) : 0;
          return secondTime - firstTime;
        })
      : userLocation
        ? [...filtered].sort((first, second) => {
            const firstDistance =
              typeof first.latitude === 'number' && typeof first.longitude === 'number'
                ? distanceInKm(userLocation, [first.longitude, first.latitude])
                : Number.POSITIVE_INFINITY;
            const secondDistance =
              typeof second.latitude === 'number' && typeof second.longitude === 'number'
                ? distanceInKm(userLocation, [second.longitude, second.latitude])
                : Number.POSITIVE_INFINITY;
            return firstDistance - secondDistance;
          })
        : filtered;
  }, [radiusKm, reports, sortMode, speciesFilter, speciesFilters, userLocation]);

  const locatedReports = useMemo(
    () =>
      visibleReports.filter(
        (report) =>
          typeof report.latitude === 'number' &&
          typeof report.longitude === 'number',
      ),
    [visibleReports],
  );

  useEffect(() => {
    if (!locationError) {
      return;
    }

    const timeout = window.setTimeout(() => setLocationError(null), 8000);
    return () => window.clearTimeout(timeout);
  }, [locationError]);

  useEffect(() => {
    if (!sortMenuOpen) {
      return;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setSortMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [sortMenuOpen]);

  async function reverseGeocode(coordinates: [number, number]) {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?limit=1&language=es&country=es&access_token=${token}`,
      );
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as {
        features?: Array<{ place_name?: string }>;
      };
      const placeName = data.features?.[0]?.place_name;
      if (placeName) {
        skipAddressSearchRef.current = true;
        setAddressQuery(placeName);
      }
    } catch {
      // Las coordenadas mostradas en el campo siguen siendo un origen válido.
    }
  }

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainerRef.current) {
      queueMicrotask(() => setMapError(true));
      return;
    }

    let cancelled = false;
    const markers = new Map<string, Marker>();
    const scrollPosition = mapScrollPositionRef.current;
    mapScrollPositionRef.current = null;
    setMapReady(false);

    void import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (cancelled || !mapContainerRef.current) {
        return;
      }

      if (!mapboxgl.supported()) {
        setMapError(true);
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

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
      mapRef.current = map;
      map.on('error', () => setMapError(true));

      map.once('load', () => {
        if (cancelled) {
          return;
        }

        window.requestAnimationFrame(() => map.resize());

        // Limpia capas de precisión de versiones anteriores que pueden quedar
        // vivas durante una actualización en caliente del mapa.
        for (const layerId of [
          'user-location-accuracy-fill',
          'user-location-accuracy-line',
        ]) {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
        }
        if (map.getSource('user-location-accuracy')) {
          map.removeSource('user-location-accuracy');
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
        map.on('click', (event) => {
          if (!selectingLocationRef.current) {
            return;
          }
          const nextLocation: [number, number] = [event.lngLat.lng, event.lngLat.lat];
          setUserLocation(nextLocation);
          setUserAccuracy(null);
          setLocationMode('map');
          setLocationZoom(14);
          setRadiusKm(null);
          setLocationError(null);
          selectingLocationRef.current = false;
          setSelectingLocation(false);
          map.getCanvas().style.cursor = '';
          map.flyTo({ center: nextLocation, zoom: Math.max(map.getZoom(), 12), essential: true });
          setAddressQuery(`${nextLocation[1].toFixed(5)}, ${nextLocation[0].toFixed(5)}`);
          void reverseGeocode(nextLocation);
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
        setMapError(false);
        if (scrollPosition !== null) {
          requestAnimationFrame(() => {
            window.scrollTo(0, scrollPosition);
          });
        }
      });
    });

    return () => {
      cancelled = true;
      mapScrollPositionRef.current = window.scrollY;
      markers.forEach((marker) => marker.remove());
      markers.clear();
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [locatedReports]);

  useEffect(() => {
    let cancelled = false;

    if (!mapReady || !userLocation || !mapRef.current) {
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      return;
    }

    const map = mapRef.current;
    const originElement = createOriginMarkerElement();
    const updateOriginMarkerSize = () => {
      const center = map.project(userLocation);
      const radiusMeters = Math.max(userAccuracy ?? 80, 40);
      const latitudeDelta = (radiusMeters / 6_378_137) * (180 / Math.PI);
      const edge = map.project([userLocation[0], userLocation[1] + latitudeDelta]);
      const radiusPixels = Math.max(Math.abs(edge.y - center.y), 10);
      originElement.style.width = `${radiusPixels * 2}px`;
      originElement.style.height = `${radiusPixels * 2}px`;
    };

    void import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (cancelled || !mapRef.current) {
        return;
      }

      originMarkerRef.current?.remove();
      originMarkerRef.current = new mapboxgl.Marker({
        element: originElement,
        anchor: 'center',
      })
        .setLngLat(userLocation)
        .addTo(map);
      updateOriginMarkerSize();
      map.on('move', updateOriginMarkerSize);
      map.on('zoom', updateOriginMarkerSize);
      map.on('resize', updateOriginMarkerSize);

      originMarkerRef.current.once('remove', () => {
        map.off('move', updateOriginMarkerSize);
        map.off('zoom', updateOriginMarkerSize);
        map.off('resize', updateOriginMarkerSize);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [mapReady, userAccuracy, userLocation]);

  useEffect(() => {
    if (!mapReady || !userLocation || locationZoom === null || !mapRef.current) {
      return;
    }

    mapRef.current.flyTo({ center: userLocation, zoom: locationZoom, essential: true });
  }, [locationZoom, mapReady, userLocation]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !mapContainerRef.current) {
      return;
    }

    const map = mapRef.current;
    const resizeMap = () => map.resize();
    resizeMap();
    const observer = new ResizeObserver(resizeMap);
    observer.observe(mapContainerRef.current);

    return () => observer.disconnect();
  }, [mapReady]);

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

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const query = addressQuery.trim();
    if (skipAddressSearchRef.current) {
      skipAddressSearchRef.current = false;
      return;
    }
    if (!token || query.length < 3) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setSearchingAddress(true);
      void fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&limit=5&language=es&country=es&access_token=${token}`,
        { signal: controller.signal },
      )
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Geocoding request failed');
          }
          return (await response.json()) as {
            features?: Array<{
              id: string;
              place_name: string;
              center: [number, number];
              place_type?: string[];
            }>;
          };
        })
        .then((data) => {
          setAddressSuggestions(
            (data.features ?? []).map((feature) => ({
              id: feature.id,
              label: feature.place_name,
              center: feature.center,
              zoom: feature.place_type?.some((type) => type === 'address' || type === 'poi')
                ? 15
                : feature.place_type?.includes('neighborhood')
                  ? 14
                  : feature.place_type?.includes('place')
                    ? 13
                    : 14,
            })),
          );
        })
        .catch((error: unknown) => {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            setAddressSuggestions([]);
          }
        })
        .finally(() => setSearchingAddress(false));
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [addressQuery]);

  function requestUserLocation() {
    if (!window.isSecureContext) {
      setLocationError('secure-context');
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('unavailable');
      return;
    }

    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextLocation: [number, number] = [coords.longitude, coords.latitude];
        setUserLocation(nextLocation);
        setUserAccuracy(coords.accuracy);
        setLocationMode('gps');
        setLocationZoom(14);
        setAddressQuery('');
        setAddressSuggestions([]);
        setLocating(false);
        originMarkerRef.current?.remove();
        mapRef.current?.flyTo({ center: nextLocation, zoom: 12, essential: true });
      },
      () => {
        setLocating(false);
        setLocationError('unavailable');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  }

  function enableMapSelection() {
    selectingLocationRef.current = true;
    setSelectingLocation(true);
    setLocationError(null);
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = 'crosshair';
    }
  }

  function recenterOnLocation() {
    if (!userLocation || !mapRef.current) {
      return;
    }

    mapRef.current.flyTo({
      center: userLocation,
      zoom: Math.max(mapRef.current.getZoom(), 14),
      essential: true,
    });
  }

  function selectAddress(suggestion: AddressSuggestion) {
    setUserLocation(suggestion.center);
    setUserAccuracy(null);
    setLocationMode('address');
    setLocationZoom(Math.max(suggestion.zoom, 14));
    skipAddressSearchRef.current = true;
    setAddressQuery(suggestion.label);
    setAddressSuggestions([]);
    setLocationError(null);
  }

  const sightingHref = selectedId
    ? `/reportes/${selectedId}`
    : '/reportes';

  return (
    <section aria-labelledby="public-map-heading" className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
      <div className="order-first flex flex-wrap items-center gap-2 rounded-2xl border border-border-soft bg-surface-elevated p-2 sm:p-3 lg:col-span-2 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-6 lg:gap-y-2">
        <div className="contents lg:flex lg:items-center lg:gap-2">
          <label htmlFor="map-sort" className="mr-1 hidden text-sm font-semibold sm:inline">
            {labels.sortTitle}
          </label>
          <div ref={sortMenuRef} className="order-2 relative sm:order-none">
            <button
              id="map-sort"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={sortMenuOpen}
              aria-controls="map-sort-options"
              onClick={() => setSortMenuOpen((open) => !open)}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary-soft px-3 text-sm font-semibold text-primary outline-none transition-colors hover:bg-primary/10 focus-visible:ring-4 focus-visible:ring-focus-soft"
            >
              {sortMode === 'recent' ? labels.sortRecent : labels.sortNearest}
              <ChevronDown className={`size-4 transition-transform ${sortMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {sortMenuOpen ? (
              <div
                id="map-sort-options"
                role="listbox"
                aria-label={labels.sortTitle}
                className="absolute left-0 top-full z-30 mt-2 min-w-52 rounded-2xl border border-border-soft bg-surface-elevated p-1.5 shadow-lg"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={sortMode === 'recent'}
                  onClick={() => {
                    setSortMode('recent');
                    setSortMenuOpen(false);
                  }}
                  className={`flex min-h-10 w-full items-center rounded-xl px-3 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${sortMode === 'recent' ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface-sunken'}`}
                >
                  {labels.sortRecent}
                </button>
                <button
                  type="button"
                  role="option"
                  aria-selected={sortMode === 'nearest'}
                  disabled={!userLocation}
                  onClick={() => {
                    setSortMode('nearest');
                    setSortMenuOpen(false);
                  }}
                  className={`flex min-h-10 w-full items-center rounded-xl px-3 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${sortMode === 'nearest' ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface-sunken'} disabled:cursor-not-allowed disabled:opacity-45`}
                >
                  {labels.sortNearest}
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="contents lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:gap-2">
          <span className="ml-2 hidden text-sm font-semibold sm:inline">{labels.locationTitle}</span>
          <button
            type="button"
            onClick={requestUserLocation}
            disabled={locating}
            aria-label={labels.useLocation}
            title={labels.useLocation}
            className={`order-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft sm:order-none ${locationMode === 'gps' ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            <MapPin className="size-4" aria-hidden="true" />
            <span className="sm:hidden">{labels.useLocationShort}</span>
            <span className="hidden sm:inline">{locating ? labels.usingLocation : labels.useLocation}</span>
          </button>
          <button
            type="button"
            aria-expanded={mobileFiltersOpen}
            aria-controls="map-mobile-filters"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className={`order-2 inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft lg:hidden ${mobileFiltersOpen ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            <span>{mobileFiltersOpen ? labels.closeFilters : labels.moreFilters}</span>
          </button>
          <button
            type="button"
            onClick={enableMapSelection}
            aria-pressed={selectingLocation}
            className={`order-2 inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft sm:order-none ${
              selectingLocation || locationMode === 'map'
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapIcon className="size-4" aria-hidden="true" />
            <span>{selectingLocation ? labels.markingOnMap : labels.markOnMap}</span>
          </button>
          <div className="relative order-1 min-w-60 flex-1 basis-full sm:order-none sm:basis-72 lg:order-none lg:basis-0 lg:min-w-64">
            <label htmlFor="map-location-search" className="sr-only">
              {labels.locationTitle}
            </label>
            <div className={`flex min-h-10 items-center gap-2 rounded-full border px-3 ${locationMode === 'address' ? 'border-primary bg-primary-soft/40' : 'border-border'}`}>
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                id="map-location-search"
                value={addressQuery}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  skipAddressSearchRef.current = false;
                  setAddressQuery(nextQuery);
                  if (nextQuery.trim().length < 3) {
                    setAddressSuggestions([]);
                    setSearchingAddress(false);
                  }
                }}
                placeholder={labels.addressPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {addressQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setAddressQuery('');
                    setAddressSuggestions([]);
                    setUserLocation(null);
                    setUserAccuracy(null);
                    setLocationMode(null);
                    setLocationZoom(null);
                    setRadiusKm(null);
                    setSortMode('recent');
                    setSortMenuOpen(false);
                    setLocationError(null);
                    originMarkerRef.current?.remove();
                    originMarkerRef.current = null;
                  }}
                  className="rounded-full p-1 text-muted-foreground hover:bg-surface-sunken hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
                  aria-label={labels.clearLocation}
                  title={labels.clearLocation}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            {addressSuggestions.length > 0 ? (
              <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-lg" aria-label={labels.locationTitle}>
                {addressSuggestions.map((suggestion) => (
                  <li key={suggestion.id}>
                    <button
                      type="button"
                      onClick={() => selectAddress(suggestion)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
                    >
                      {suggestion.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : searchingAddress ? (
              <p className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm text-muted-foreground shadow-lg">
                {labels.searching}
              </p>
            ) : null}
          </div>
        </div>
          <span className="w-full text-xs text-muted-foreground">{labels.chooseOnMap}</span>
        <div className="contents lg:col-span-2 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-4">
          <div
            id="map-mobile-filters"
            className={`${mobileFiltersOpen ? 'flex' : 'hidden'} order-3 min-w-0 w-full flex-wrap items-center gap-2 overflow-visible pb-1 lg:order-none lg:col-start-1 lg:flex`}
            style={{ order: 4 }}
            aria-label={labels.locationTitle}
          >
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {speciesFilters.map((filter) => (
              (() => {
                const SpeciesIcon = filter.key === 'all' ? null : filter.key === 'dog' ? Dog : filter.key === 'cat' ? Cat : PawPrint;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    aria-pressed={speciesFilter === filter.key}
                    onClick={() => setSpeciesFilter(filter.key)}
                    style={speciesFilter === filter.key ? {
                      backgroundColor: '#e6f7f3',
                      borderColor: '#0f766e',
                      color: '#0f766e',
                    } : undefined}
                    className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${
                      speciesFilter === filter.key
                        ? 'border-primary bg-primary-soft text-primary'
                        : 'border-border-soft bg-surface-sunken text-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {SpeciesIcon ? <SpeciesIcon className="size-3.5" aria-hidden="true" /> : null}
                    {filter.label}
                  </button>
                );
              })()
            ))}
          </div>
          <div className={`${mobileFiltersOpen ? 'flex' : 'hidden'} order-3 w-full flex-wrap gap-2 lg:order-none lg:col-start-2 lg:justify-end lg:flex`} style={{ order: 5 }}>
          {[1, 5, 10, 20].map((value) => (
            <button
              key={value}
              type="button"
              disabled={!userLocation}
              aria-pressed={radiusKm === value}
              onClick={() => setRadiusKm(value)}
              className={`min-h-10 rounded-full border px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:cursor-not-allowed disabled:opacity-40 ${
                radiusKm === value
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {value} {labels.radiusUnit}
            </button>
          ))}
          <button
            type="button"
            disabled={!userLocation}
            aria-pressed={radiusKm === null}
            onClick={() => setRadiusKm(null)}
            className="min-h-10 rounded-full border border-border px-3 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            {labels.radiusAll}
          </button>
          </div>
        </div>
          {locationError ? (
            <span role="alert" className="w-full text-sm text-danger lg:col-span-2">
              {locationError === 'secure-context' ? labels.locationSecureError : labels.locationError}
            </span>
          ) : null}
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border-soft px-4 py-3">
            <div className="flex items-center gap-2">
              <MapIcon className="size-5 text-primary" aria-hidden="true" />
              <h2 id="public-map-heading" className="font-semibold">
                {labels.title}
              </h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {visibleReports.length} {labels.active.toLowerCase()}
            </span>
          </div>
          <div className="relative h-[24rem] bg-surface-sunken sm:h-[28rem]" style={{ height: '24rem' }}>
            <div
              ref={mapContainerRef}
              className="h-[24rem] w-full sm:h-[28rem]"
              style={{ height: '24rem', width: '100%' }}
              aria-label={labels.description}
              role="region"
            />
            {mapError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-elevated/90 px-6 text-center text-sm text-muted-foreground" role="alert">
                {labels.mapUnavailable}
              </div>
            ) : null}
            {!mapReady && locatedReports.length === 0 ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
                {labels.description}
              </div>
            ) : null}
            <button
              type="button"
              onClick={recenterOnLocation}
              disabled={!userLocation}
              aria-label={labels.recenterLocation}
              title={labels.recenterLocation}
              className="absolute right-3 top-3 z-10 flex size-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-primary shadow-sm transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:cursor-not-allowed disabled:opacity-45"
            >
              <LocateFixed className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-elevated shadow-sm lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2 border-b border-border-soft px-4 py-3">
            <List className="size-5 text-primary" aria-hidden="true" />
            <h2 className="font-semibold">{labels.listTitle}</h2>
          </div>
          <div className="max-h-[24rem] space-y-3 overflow-y-auto p-2 sm:max-h-[28rem] sm:p-3">
            {visibleReports.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <p className="font-semibold">{labels.emptyTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {labels.emptyDescription}
                </p>
              </div>
            ) : (
              visibleReports.map((report) => {
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
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {labels.petLabel}
                      </p>
                      <h3 className="mt-1 font-semibold">{report.title}</h3>
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
                      href={`/avisos/${report.id}?origen=mapa`}
                      className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
                    >
                      {labels.viewNotice}
                    </Link>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
      <aside
        aria-labelledby="map-sighting-cta-title"
        className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary-soft/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-public-action !text-white">
            <Eye className="size-5 !text-white" aria-hidden="true" />
          </span>
          <div>
            <h2 id="map-sighting-cta-title" className="font-semibold">
              {labels.sightingCtaTitle}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {selectedId
                ? labels.sightingCtaDescription
                : labels.sightingCtaSelectNotice}
            </p>
          </div>
        </div>
        <Link
          href={sightingHref}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-public-action px-5 text-sm font-semibold !text-white transition-colors hover:bg-public-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          style={{ color: '#ffffff' }}
        >
          {selectedId
            ? labels.sightingCtaActionSelected
            : labels.sightingCtaAction}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </aside>
    </section>
  );
}
