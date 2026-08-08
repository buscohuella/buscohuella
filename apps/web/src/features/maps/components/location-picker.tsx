'use client';

import type { Map as MapboxMap, Marker } from 'mapbox-gl';
import { Check, LoaderCircle, MapPin, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Coordinates = { latitude: number; longitude: number };
type Suggestion = { id: string; label: string; municipalityName?: string; coordinates: [number, number] };

export function LocationPicker({ value, onChange, label, onLabelChange, onMunicipalityChange }: { value: Coordinates | null; onChange: (value: Coordinates) => void; label?: string; onLabelChange?: (value: string) => void; onMunicipalityChange?: (value: string | undefined) => void }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(value);
  const selectedQueryRef = useRef<string | null>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(() => process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? null : 'No se ha configurado el mapa. Puedes continuar con la referencia escrita.');

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    if (!mapContainerRef.current || mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;
    void import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (cancelled || !mapContainerRef.current) return;
      mapboxgl.accessToken = token;
      const initialValue = initialValueRef.current;
      const map = new mapboxgl.Map({ container: mapContainerRef.current, style: 'mapbox://styles/mapbox/streets-v12', center: initialValue ? [initialValue.longitude, initialValue.latitude] : [-2.2, 41.55], zoom: initialValue ? 14 : 5 });
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.on('click', (event) => onChangeRef.current({ latitude: event.lngLat.lat, longitude: event.lngLat.lng }));
      mapRef.current = map;
    });
    return () => { cancelled = true; markerRef.current?.remove(); markerRef.current = null; mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !value) return;
    void import('mapbox-gl').then(({ default: mapboxgl }) => {
      markerRef.current?.remove();
      const marker = new mapboxgl.Marker({ color: '#12b886', draggable: true }).setLngLat([value.longitude, value.latitude]).addTo(map);
      marker.on('dragend', () => { const position = marker.getLngLat(); onChangeRef.current({ latitude: position.lat, longitude: position.lng }); });
      markerRef.current = marker;
      map.flyTo({ center: [value.longitude, value.latitude], zoom: Math.max(map.getZoom(), 14) });
    });
  }, [onChange, value]);

  useEffect(() => {
    const normalized = (label ?? query).trim();
    if (normalized.length < 3) return;
    if (selectedQueryRef.current === normalized) return;
    const timer = window.setTimeout(() => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) return;
      setIsSearching(true);
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(normalized)}.json?autocomplete=true&limit=5&language=es&country=es&access_token=${token}`)
        .then(async (response) => { if (!response.ok) throw new Error('geocoding-failed'); return response.json() as Promise<{ features?: Array<{ id: string; place_name?: string; text?: string; center?: [number, number]; context?: Array<{ id: string; text?: string }> }> }>; })
        .then((data) => setSuggestions((data.features ?? []).flatMap((feature) => { const municipality = feature.context?.find((item) => item.id.startsWith('place.') || item.id.startsWith('locality.'))?.text; return feature.center ? [{ id: feature.id, label: feature.place_name ?? feature.text ?? normalized, municipalityName: municipality, coordinates: feature.center }] : []; })))
        .catch(() => setError('No hemos podido buscar ese lugar. Puedes marcarlo directamente en el mapa.'))
        .finally(() => setIsSearching(false));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [label, query]);

  function selectSuggestion(suggestion: Suggestion) { selectedQueryRef.current = suggestion.label; setQuery(suggestion.label); onLabelChange?.(suggestion.label); onMunicipalityChange?.(suggestion.municipalityName); setSuggestions([]); setError(null); onChange({ latitude: suggestion.coordinates[1], longitude: suggestion.coordinates[0] }); }

  return <div className="space-y-3">
    <label htmlFor="location-search" className="block font-semibold">Buscar una dirección o lugar</label>
    <p className="text-sm text-muted-foreground">Elige una sugerencia o pulsa el mapa para colocar el pin. Después podrás moverlo.</p>
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input id="location-search" value={label ?? query} onChange={(event) => { selectedQueryRef.current = null; setQuery(event.target.value); onLabelChange?.(event.target.value); }} placeholder="Ejemplo: Plaza Montella, Sabadell" className="min-h-12 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft" autoComplete="off" />
      {isSearching ? <LoaderCircle className="absolute right-3 top-1/2 size-5 -translate-y-1/2 animate-spin text-primary" aria-label="Buscando" /> : null}
      {(label ?? query).trim().length >= 3 && suggestions.length > 0 ? <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg" role="listbox" aria-label="Sugerencias de ubicación">{suggestions.map((suggestion) => <li key={suggestion.id}><button type="button" onClick={() => selectSuggestion(suggestion)} className="flex min-h-12 w-full items-center gap-3 px-3 text-left hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"><MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" /><span>{suggestion.label}</span></button></li>)}</ul> : null}
    </div>
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface"><div ref={mapContainerRef} className="h-72 w-full" aria-label="Mapa para seleccionar la ubicación" />{!value ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/20"><span className="rounded-full bg-surface/90 px-3 py-2 text-sm font-semibold shadow">Pulsa el mapa para colocar el pin</span></div> : null}</div>
    {value ? <p className="flex items-center gap-2 text-sm text-primary" role="status"><Check className="size-4" aria-hidden="true" />Ubicación seleccionada. Puedes mover el pin.</p> : null}
    {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
  </div>;
}
