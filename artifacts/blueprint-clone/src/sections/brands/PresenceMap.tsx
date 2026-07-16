import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { LOCATIONS, LOCATION_TYPE_LABELS, CompanyLocation } from '../../data/locations';
import { APPLICATIONS, getApplication } from '../../data/applications';

interface PresenceMapProps {
  onSelectLocation: (loc: CompanyLocation | null) => void;
}

const INITIAL_CENTER: [number, number] = [55.5, 50.0];
const INITIAL_ZOOM = 4;

const markerIcon = (active: boolean) =>
  L.divIcon({
    className: '',
    html: `<span class="map-marker ${active ? 'active' : ''}"><span class="map-marker-dot"></span></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

/**
 * Карта присутствия: Leaflet + тёмные растровые тайлы CARTO (без токена),
 * кластеризация, фильтрация по направлениям, карточка выбранной точки.
 */
export default function PresenceMap({ onSelectLocation }: PresenceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [filter, setFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<CompanyLocation | null>(null);

  const visible = useMemo(
    () => (filter ? LOCATIONS.filter((l) => l.applicationIds.includes(filter)) : LOCATIONS),
    [filter],
  );

  // ── Инициализация карты (один раз) ────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false, // не перехватываем прокрутку страницы
    });
    map.attributionControl.setPrefix(false);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap · © CARTO',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Колесо мыши масштабирует только с зажатым Ctrl/Cmd — страница скроллится свободно
    map.getContainer().addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        map.scrollWheelZoom.enable();
      } else {
        map.scrollWheelZoom.disable();
      }
    }, { passive: false });

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 44,
      iconCreateFunction: (c) =>
        L.divIcon({
          className: '',
          html: `<span class="map-cluster">${c.getChildCount()}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
    });
    map.addLayer(cluster);

    mapRef.current = map;
    clusterRef.current = cluster;

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // ── Маркеры по текущему фильтру ───────────────────────────────────
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();
    markersRef.current.clear();

    visible.forEach((loc) => {
      const marker = L.marker(loc.coordinates, {
        icon: markerIcon(selected?.id === loc.id),
        keyboard: false,
      });
      marker.on('click', () => {
        setSelected(loc);
      });
      markersRef.current.set(loc.id, marker);
      cluster.addLayer(marker);
    });
    // выбранная точка исчезла из фильтра — снимаем выбор
    if (selected && !visible.some((l) => l.id === selected.id)) {
      setSelected(null);
    }
  }, [visible, selected]);

  // ── Реакция на выбор точки ────────────────────────────────────────
  useEffect(() => {
    onSelectLocation(selected);
    if (!selected || !mapRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapRef.current.flyTo(selected.coordinates, Math.max(mapRef.current.getZoom(), 9), {
      duration: reduced ? 0 : 1.1,
    });
  }, [selected, onSelectLocation]);

  const resetView = () => {
    setSelected(null);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapRef.current?.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { duration: reduced ? 0 : 1.1 });
  };

  return (
    <section className="map-section" id="map">
      <div className="map-head">
        <div className="small-title">Карта присутствия</div>
        <h2 className="h2 map-title">Филиалы, дилеры и партнёры</h2>

        <div className="map-filters" role="group" aria-label="Фильтр по направлениям">
          <button
            className={`map-filter ${filter === null ? 'active' : ''}`}
            onClick={() => setFilter(null)}
          >
            Все направления
          </button>
          {APPLICATIONS.map((app) => (
            <button
              key={app.id}
              className={`map-filter ${filter === app.id ? 'active' : ''}`}
              onClick={() => setFilter(filter === app.id ? null : app.id)}
            >
              {app.name}
            </button>
          ))}
        </div>
      </div>

      <div className="map-wrap">
        <div ref={containerRef} className="map-container" aria-label="Интерактивная карта присутствия" />

        <button className="map-reset btn-primary dark" onClick={resetView}>
          Общий масштаб
        </button>

        {selected && (
          <aside className="map-card" aria-live="polite">
            <button className="map-card-close" onClick={() => setSelected(null)} aria-label="Закрыть карточку">
              ×
            </button>
            <span className="map-card-type">{LOCATION_TYPE_LABELS[selected.type]}</span>
            <h3 className="h4 map-card-name">{selected.name}</h3>
            <p className="map-card-line">{selected.city} · {selected.address}</p>
            <div className="brand-stage-tags map-card-tags">
              {selected.applicationIds.map((id) => {
                const app = getApplication(id);
                return app ? <span key={id} className="brand-tag dim">{app.name}</span> : null;
              })}
            </div>
            <a className="map-card-line map-card-contact" href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`}>{selected.phone}</a>
            <a className="map-card-line map-card-contact" href={`mailto:${selected.email}`}>{selected.email}</a>
          </aside>
        )}
      </div>
    </section>
  );
}
