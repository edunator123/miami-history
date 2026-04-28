"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { mapEvents, categoryColors, categoryLabels, type MapEvent } from "@/data/mapEvents";
import { PageWrapper, SectionHeading, SectionLabel } from "@/components/prose";

// GIS data imports
import boundariesData from "@/data/gis/boundaries.json";
import landmarksData from "@/data/gis/landmarks.json";
import fecStationsData from "@/data/gis/fec_stations.json";
import causewaysData from "@/data/gis/causeways_and_islands.json";
import hurricanesData from "@/data/gis/hurricanes.json";

const MIN_YEAR = 1836;
const MAX_YEAR = 1940;
const PLAY_INTERVAL = 120;

// Municipality data (from CSV)
const municipalities = [
  { id: "miami", name: "Miami", year: 1896, lat: 25.774, lng: -80.192, notes: "502 voters at incorporation; ~100 Black voters registered" },
  { id: "homestead", name: "Homestead", year: 1913, lat: 25.469, lng: -80.478, notes: "2nd city in Dade County; agricultural hub" },
  { id: "florida_city", name: "Florida City", year: 1914, lat: 25.448, lng: -80.479, notes: "Originally named Detroit" },
  { id: "miami_beach", name: "Miami Beach", year: 1915, lat: 25.791, lng: -80.135, notes: "33 voters at incorporation; developed by Carl Fisher and John Collins" },
  { id: "coral_gables", name: "Coral Gables", year: 1925, lat: 25.750, lng: -80.260, notes: "George Merrick's Mediterranean Revival community; racially restricted" },
  { id: "hialeah", name: "Hialeah", year: 1925, lat: 25.858, lng: -80.278, notes: "Curtiss & Bright development; racetrack built 1922" },
  { id: "north_miami", name: "North Miami", year: 1926, lat: 25.890, lng: -80.187, notes: "Different from earlier 'North Miami' annexed into Miami 1913" },
  { id: "opa_locka", name: "Opa-locka", year: 1926, lat: 25.902, lng: -80.250, notes: "Glenn Curtiss's Moorish Revival themed community" },
  { id: "miami_springs", name: "Miami Springs", year: 1926, lat: 25.822, lng: -80.289, notes: "Curtiss development adjacent to Hialeah" },
  { id: "south_miami", name: "South Miami", year: 1927, lat: 25.706, lng: -80.293, notes: "Originally the FEC Railway stop 'Larkin'" },
  { id: "golden_beach", name: "Golden Beach", year: 1929, lat: 25.963, lng: -80.122, notes: "Oceanfront community on barrier island" },
  { id: "north_miami_beach", name: "North Miami Beach", year: 1931, lat: 25.933, lng: -80.162, notes: "Originally 'Fulford-by-the-Sea'" },
  { id: "miami_shores", name: "Miami Shores", year: 1932, lat: 25.863, lng: -80.177, notes: "Planned residential community" },
];

// Landmark category colors
const landmarkCatColors: Record<string, string> = {
  religious: "#c0392b",
  entertainment: "#8e44ad",
  transportation: "#2c3e50",
  cemetery: "#7f8c8d",
  hotel: "#f39c12",
  school: "#27ae60",
  residence: "#e67e22",
  commercial: "#d35400",
  civic: "#2980b9",
  architectural: "#c4963a",
  recreation: "#16a085",
  historical: "#8b6b6b",
  archaeological: "#7b4a8e",
  geographic: "#3498db",
};

// Layer definitions
type LayerKey = "events" | "boundaries" | "landmarks" | "fec" | "causeways" | "hurricane" | "municipalities";

const layerDefs: { key: LayerKey; label: string; color: string; description: string }[] = [
  { key: "events", label: "Timeline Events", color: "#b07040", description: "44 historical events" },
  { key: "boundaries", label: "Boundaries", color: "#1c2d5a", description: "Districts & racial lines" },
  { key: "landmarks", label: "Landmarks", color: "#c0392b", description: "33 buildings & sites" },
  { key: "fec", label: "FEC Railway", color: "#2c3e50", description: "14 stations & tracks" },
  { key: "causeways", label: "Causeways & Islands", color: "#3498db", description: "Bridges & dredged land" },
  { key: "hurricane", label: "Hurricanes", color: "#8b6b6b", description: "1926 & 1928 storms" },
  { key: "municipalities", label: "Municipalities", color: "#c4963a", description: "13 incorporations" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJSON = any;

export default function MapExplorer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  // Layer group refs
  const eventMarkersRef = useRef<L.LayerGroup | null>(null);
  const boundaryLayerRef = useRef<L.LayerGroup | null>(null);
  const landmarkLayerRef = useRef<L.LayerGroup | null>(null);
  const fecLayerRef = useRef<L.LayerGroup | null>(null);
  const causewayLayerRef = useRef<L.LayerGroup | null>(null);
  const hurricaneLayerRef = useRef<L.LayerGroup | null>(null);
  const municipalityLayerRef = useRef<L.LayerGroup | null>(null);

  const [ready, setReady] = useState(false);
  const [currentYear, setCurrentYear] = useState(MIN_YEAR);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [playing, setPlaying] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    events: true,
    boundaries: true,
    landmarks: true,
    fec: true,
    causeways: true,
    hurricane: true,
    municipalities: true,
  });
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);

  // Load Leaflet
  useEffect(() => {
    import("leaflet").then((mod) => setL(mod.default || mod));
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25.78, -80.20],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      minZoom: 10,
      maxZoom: 18,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Create layer groups
    eventMarkersRef.current = L.layerGroup().addTo(map);
    boundaryLayerRef.current = L.layerGroup().addTo(map);
    landmarkLayerRef.current = L.layerGroup().addTo(map);
    fecLayerRef.current = L.layerGroup().addTo(map);
    causewayLayerRef.current = L.layerGroup().addTo(map);
    hurricaneLayerRef.current = L.layerGroup().addTo(map);
    municipalityLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [L]);

  // Filter timeline events
  const visibleEvents = useMemo(() => {
    return mapEvents.filter((e) => {
      if (e.year > currentYear) return false;
      if (activeCategory && e.category !== activeCategory) return false;
      return true;
    });
  }, [currentYear, activeCategory]);

  const recentEvents = useMemo(() => {
    return visibleEvents.filter((e) => currentYear - e.year <= 5);
  }, [visibleEvents, currentYear]);

  // Popup helper
  const showPopup = useCallback((lat: number, lng: number, html: string) => {
    if (!mapRef.current || !L) return;
    if (popupRef.current) popupRef.current.remove();
    popupRef.current = L.popup({ closeButton: true, maxWidth: 340, className: "miami-popup", offset: [0, -8] })
      .setLatLng([lat, lng])
      .setContent(html)
      .openOn(mapRef.current);
  }, [L]);

  // Select event handler
  const handleSelectEvent = useCallback((event: MapEvent | null) => {
    setSelectedEvent((prev) => {
      const next = prev === event ? null : event;
      if (next && mapRef.current && L) {
        mapRef.current.setView([next.lat, next.lng], 14, { animate: true, duration: 0.5 });
        showPopup(next.lat, next.lng,
          `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="width:8px;height:8px;border-radius:50%;background:${categoryColors[next.category]};display:inline-block;"></span>
              <span style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${categoryColors[next.category]};font-weight:700;">${next.yearLabel}</span>
              <span style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8077;">${categoryLabels[next.category]}</span>
            </div>
            <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 6px;">${next.title}</p>
            <p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0 0 8px;">${next.description}</p>
            <p style="font-size:10px;color:#8a8077;margin:0;letter-spacing:0.08em;">${next.location}</p>
          </div>`
        );
      } else if (!next && popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      return next;
    });
  }, [L, showPopup]);

  // ── RENDER: Timeline event markers ──────────────────────────────
  useEffect(() => {
    if (!ready || !L || !eventMarkersRef.current) return;
    eventMarkersRef.current.clearLayers();
    if (!layers.events) return;

    visibleEvents.forEach((event) => {
      const color = categoryColors[event.category];
      const isRecent = currentYear - event.year <= 5;
      const isSelected = selectedEvent === event;
      const size = isSelected ? 20 : isRecent ? 14 : 10;

      const icon = L.divIcon({
        className: "",
        html: `<div class="map-marker ${isRecent ? "map-marker-pulse" : ""}" style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${color};border:2px solid rgba(255,255,255,0.9);
          box-shadow:0 2px 8px rgba(0,0,0,0.3)${isRecent ? `,0 0 12px ${color}80` : ""};
          cursor:pointer;transition:all 0.3s;opacity:${isRecent ? 1 : 0.75};
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([event.lat, event.lng], { icon });
      marker.on("click", () => handleSelectEvent(event));
      eventMarkersRef.current!.addLayer(marker);
    });
  }, [visibleEvents, ready, L, selectedEvent, currentYear, handleSelectEvent, layers.events]);

  // ── RENDER: Boundaries (polygons + lines from GeoJSON) ─────────
  useEffect(() => {
    if (!ready || !L || !boundaryLayerRef.current) return;
    boundaryLayerRef.current.clearLayers();
    if (!layers.boundaries) return;

    const geo = boundariesData as GeoJSON;
    geo.features.forEach((feature: GeoJSON) => {
      const props = feature.properties;
      const type = feature.geometry.type;

      // Parse year from era field
      const eraYear = parseInt(props.era) || (props.date_range?.includes("1896") ? 1896 : props.date_range?.includes("1880") ? 1880 : 1930);
      if (eraYear > currentYear) return;

      const isSegreg = props.type === "segregated_district" || props.type === "segregation_infrastructure" || props.type === "transportation_boundary";
      const color = isSegreg ? "#1c2d5a" : props.type === "immigrant_settlement" ? "#b07040" : "#2d6b5e";

      if (type === "Polygon") {
        const coords = feature.geometry.coordinates[0].map((c: number[]) => [c[1], c[0]]);
        const polygon = L.polygon(coords, {
          color,
          weight: 1.5,
          opacity: 0.7,
          fillColor: color,
          fillOpacity: 0.1,
          dashArray: "6 4",
        });
        polygon.bindTooltip(
          `<div style="font-family:var(--font-ui),system-ui,sans-serif;text-align:center;max-width:200px;">
            <strong style="font-size:12px;display:block;margin-bottom:2px;">${props.name}</strong>
            <span style="font-size:10px;color:#666;">${props.significance?.substring(0, 100) || ""}...</span>
          </div>`,
          { sticky: true, direction: "top", opacity: 0.95 }
        );
        polygon.on("click", () => {
          const bounds = polygon.getBounds();
          showPopup(bounds.getCenter().lat, bounds.getCenter().lng,
            `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
              <p style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${color};font-weight:700;margin:0 0 4px;">Boundary</p>
              <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 6px;">${props.name}</p>
              <p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0 0 6px;">${props.significance || ""}</p>
              ${props.north_boundary ? `<p style="font-size:10px;color:#8a8077;margin:0;">N: ${props.north_boundary} · S: ${props.south_boundary}</p>` : ""}
              ${props.source ? `<p style="font-size:9px;color:#aaa;margin:4px 0 0;font-style:italic;">${props.source}</p>` : ""}
            </div>`
          );
        });
        boundaryLayerRef.current!.addLayer(polygon);
      } else if (type === "LineString") {
        const coords = feature.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
        const isWall = props.type === "segregation_infrastructure";
        const line = L.polyline(coords, {
          color: isWall ? "#8b0000" : color,
          weight: isWall ? 4 : 2.5,
          opacity: 0.7,
          dashArray: isWall ? "8 4" : "10 6",
        });
        line.bindTooltip(
          `<div style="font-family:var(--font-ui),system-ui,sans-serif;text-align:center;">
            <strong style="font-size:11px;">${props.name}</strong>
          </div>`,
          { sticky: true, direction: "top", opacity: 0.95 }
        );
        line.on("click", () => {
          const center = line.getBounds().getCenter();
          showPopup(center.lat, center.lng,
            `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
              <p style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${isWall ? "#8b0000" : color};font-weight:700;margin:0 0 4px;">${isWall ? "Segregation Infrastructure" : "Boundary"}</p>
              <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 6px;">${props.name}</p>
              <p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0;">${props.significance || ""}</p>
              ${props.source ? `<p style="font-size:9px;color:#aaa;margin:6px 0 0;font-style:italic;">${props.source}</p>` : ""}
            </div>`
          );
        });
        boundaryLayerRef.current!.addLayer(line);
      }
    });
  }, [currentYear, ready, L, layers.boundaries, showPopup]);

  // ── RENDER: Landmarks ──────────────────────────────────────────
  useEffect(() => {
    if (!ready || !L || !landmarkLayerRef.current) return;
    landmarkLayerRef.current.clearLayers();
    if (!layers.landmarks) return;

    const geo = landmarksData as GeoJSON;
    geo.features.forEach((feature: GeoJSON) => {
      const props = feature.properties;
      const [lng, lat] = feature.geometry.coordinates;
      const dateYear = parseInt(props.date_built) || 1900;
      if (dateYear > currentYear) return;

      const cat = props.category || "civic";
      const color = landmarkCatColors[cat] || "#3498db";
      const extant = props.extant;

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:8px;height:8px;
          ${extant === false ? "border:2px solid " + color + ";background:transparent;" : "background:" + color + ";border:1px solid rgba(255,255,255,0.8);"}
          border-radius:2px;transform:rotate(45deg);
          box-shadow:0 1px 4px rgba(0,0,0,0.25);cursor:pointer;
        "></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4],
      });

      const marker = L.marker([lat, lng], { icon });
      marker.on("click", () => {
        mapRef.current?.setView([lat, lng], 15, { animate: true, duration: 0.5 });
        showPopup(lat, lng,
          `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="width:8px;height:8px;border-radius:2px;transform:rotate(45deg);background:${color};display:inline-block;"></span>
              <span style="font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:${color};font-weight:700;">${cat}</span>
              ${extant === false ? '<span style="font-size:9px;color:#c0392b;font-style:italic;">Demolished</span>' : ""}
              ${props.nrhp_number ? '<span style="font-size:8px;color:#8a8077;">NRHP</span>' : ""}
            </div>
            <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 4px;">${props.name}</p>
            <p style="font-size:11px;color:#8a8077;margin:0 0 6px;">${props.historical_address || ""} · Built ${props.date_built || "unknown"}</p>
            <p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0 0 6px;">${props.significance || ""}</p>
            <p style="font-size:10px;color:#aaa;margin:0;">${props.neighborhood || ""}</p>
          </div>`
        );
      });
      landmarkLayerRef.current!.addLayer(marker);
    });
  }, [currentYear, ready, L, layers.landmarks, showPopup]);

  // ── RENDER: FEC Railway stations + line ─────────────────────────
  useEffect(() => {
    if (!ready || !L || !fecLayerRef.current) return;
    fecLayerRef.current.clearLayers();
    if (!layers.fec || currentYear < 1896) return;

    const geo = fecStationsData as GeoJSON;
    const stationCoords: [number, number][] = [];

    // Sort south to north for the connecting line
    const sorted = [...geo.features].sort(
      (a: GeoJSON, b: GeoJSON) => a.properties.order_south_to_north - b.properties.order_south_to_north
    );

    sorted.forEach((feature: GeoJSON) => {
      const props = feature.properties;
      const [lng, lat] = feature.geometry.coordinates;
      stationCoords.push([lat, lng]);

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:7px;height:7px;background:#2c3e50;
          border:2px solid #fff;border-radius:50%;
          box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer;
        "></div>`,
        iconSize: [7, 7],
        iconAnchor: [3.5, 3.5],
      });

      const marker = L.marker([lat, lng], { icon });
      marker.bindTooltip(
        `<div style="font-family:var(--font-ui),system-ui,sans-serif;text-align:center;">
          <strong style="font-size:11px;">${props.station_name}</strong>
          <span style="font-size:9px;display:block;color:#666;">${props.modern_location || ""}</span>
        </div>`,
        { direction: "top", opacity: 0.95 }
      );
      marker.on("click", () => {
        showPopup(lat, lng,
          `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
            <p style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#2c3e50;font-weight:700;margin:0 0 4px;">FEC Railway Station</p>
            <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 4px;">${props.station_name}</p>
            <p style="font-size:12px;color:#8a8077;margin:0 0 4px;">Est. ${props.established || "c. 1896"} · ${props.modern_location || ""}</p>
            ${props.notes ? `<p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0;">${props.notes}</p>` : ""}
          </div>`
        );
      });
      fecLayerRef.current!.addLayer(marker);
    });

    // Draw connecting rail line
    if (stationCoords.length > 1) {
      const line = L.polyline(stationCoords, {
        color: "#2c3e50",
        weight: 2,
        opacity: 0.4,
        dashArray: "4 6",
      });
      fecLayerRef.current!.addLayer(line);
    }
  }, [currentYear, ready, L, layers.fec, showPopup]);

  // ── RENDER: Causeways & Islands ─────────────────────────────────
  useEffect(() => {
    if (!ready || !L || !causewayLayerRef.current) return;
    causewayLayerRef.current.clearLayers();
    if (!layers.causeways) return;

    const geo = causewaysData as GeoJSON;
    geo.features.forEach((feature: GeoJSON) => {
      const props = feature.properties;
      const type = feature.geometry.type;

      // Parse year
      const yearStr = props.created || props.opened || "";
      const yearNum = parseInt(yearStr) || 1920;
      if (yearNum > currentYear) return;

      // Check if demolished/closed before current year
      const closedStr = props.closed || "";
      const closedYear = parseInt(closedStr) || 9999;

      if (type === "Point") {
        const [lng, lat] = feature.geometry.coordinates;
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:7px;height:7px;background:#3498db;
            border:1px solid rgba(255,255,255,0.8);border-radius:50%;
            box-shadow:0 1px 3px rgba(0,0,0,0.2);cursor:pointer;opacity:0.8;
          "></div>`,
          iconSize: [7, 7],
          iconAnchor: [3.5, 3.5],
        });

        const marker = L.marker([lat, lng], { icon });
        marker.on("click", () => {
          showPopup(lat, lng,
            `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
              <p style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#3498db;font-weight:700;margin:0 0 4px;">${props.type?.replace(/_/g, " ") || "Island"}</p>
              <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 4px;">${props.name}</p>
              <p style="font-size:12px;color:#8a8077;margin:0 0 4px;">Created ${props.created || "unknown"} · ${props.method || ""}</p>
              ${props.notes ? `<p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0;">${props.notes}</p>` : ""}
            </div>`
          );
        });
        causewayLayerRef.current!.addLayer(marker);
      } else if (type === "LineString") {
        const coords = feature.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
        const isDemolished = closedYear <= currentYear;
        const line = L.polyline(coords, {
          color: "#3498db",
          weight: isDemolished ? 1.5 : 3,
          opacity: isDemolished ? 0.3 : 0.6,
          dashArray: isDemolished ? "4 8" : undefined,
        });
        line.bindTooltip(
          `<div style="font-family:var(--font-ui),system-ui,sans-serif;text-align:center;">
            <strong style="font-size:11px;">${props.name}</strong>
            ${isDemolished ? '<span style="font-size:9px;display:block;color:#c0392b;">No longer extant</span>' : ""}
          </div>`,
          { sticky: true, direction: "top", opacity: 0.95 }
        );
        line.on("click", () => {
          const center = line.getBounds().getCenter();
          showPopup(center.lat, center.lng,
            `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
              <p style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#3498db;font-weight:700;margin:0 0 4px;">${props.type?.replace(/_/g, " ") || "Causeway"}</p>
              <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 4px;">${props.name}</p>
              <p style="font-size:12px;color:#8a8077;margin:0 0 4px;">Opened ${props.opened || props.created || "unknown"}${props.length_miles ? ` · ${props.length_miles} miles` : ""}</p>
              ${props.notes ? `<p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0;">${props.notes}</p>` : ""}
              ${props.nrhp_number ? `<p style="font-size:9px;color:#8a8077;margin:4px 0 0;">NRHP #${props.nrhp_number}</p>` : ""}
            </div>`
          );
        });
        causewayLayerRef.current!.addLayer(line);
      }
    });
  }, [currentYear, ready, L, layers.causeways, showPopup]);

  // ── RENDER: Hurricane tracks ────────────────────────────────────
  useEffect(() => {
    if (!ready || !L || !hurricaneLayerRef.current) return;
    hurricaneLayerRef.current.clearLayers();
    if (!layers.hurricane) return;

    const geo = hurricanesData as GeoJSON;
    geo.features.forEach((feature: GeoJSON) => {
      const props = feature.properties;
      const type = feature.geometry.type;

      // Only show if year reached
      const dateStr = props.date || "";
      const yearNum = parseInt(dateStr) || 1926;
      if (yearNum > currentYear) return;

      const is1926 = props.id?.includes("1926");

      if (type === "Point") {
        const [lng, lat] = feature.geometry.coordinates;
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:16px;height:16px;border-radius:50%;
            background:rgba(139,0,0,0.3);border:2px solid #8b0000;
            box-shadow:0 0 12px rgba(139,0,0,0.4);cursor:pointer;
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([lat, lng], { icon });
        marker.on("click", () => {
          showPopup(lat, lng,
            `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
              <p style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#8b0000;font-weight:700;margin:0 0 4px;">Hurricane Landfall</p>
              <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 4px;">${props.name}</p>
              <p style="font-size:12px;color:#8a8077;margin:0 0 6px;">${props.date} · Category ${props.category || props.category_at_landfall || "4"} · ${props.wind_speed_mph || "145"}+ mph</p>
              <p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0 0 6px;">${props.significance || props.miami_impact || ""}</p>
              ${props.deaths ? `<p style="font-size:12px;color:#8b0000;font-weight:600;margin:0;">${props.deaths.toLocaleString()} deaths · $${(props.damage_adjusted_billions_usd || 0)}B adjusted damage</p>` : ""}
              ${props.deaths_estimated ? `<p style="font-size:12px;color:#8b0000;font-weight:600;margin:0;">~${props.deaths_estimated.toLocaleString()} deaths (mostly Black migrant farmworkers)</p>` : ""}
            </div>`
          );
        });
        hurricaneLayerRef.current!.addLayer(marker);
      } else if (type === "LineString") {
        const coords = feature.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
        const line = L.polyline(coords, {
          color: is1926 ? "#8b0000" : "#b22222",
          weight: 2.5,
          opacity: 0.5,
          dashArray: "8 6",
        });
        line.bindTooltip(
          `<div style="font-family:var(--font-ui),system-ui,sans-serif;text-align:center;">
            <strong style="font-size:11px;">${props.name}</strong>
          </div>`,
          { sticky: true, direction: "top", opacity: 0.95 }
        );
        hurricaneLayerRef.current!.addLayer(line);
      }
    });
  }, [currentYear, ready, L, layers.hurricane, showPopup]);

  // ── RENDER: Municipalities ──────────────────────────────────────
  useEffect(() => {
    if (!ready || !L || !municipalityLayerRef.current) return;
    municipalityLayerRef.current.clearLayers();
    if (!layers.municipalities) return;

    municipalities.forEach((m) => {
      if (m.year > currentYear) return;
      const isRecent = currentYear - m.year <= 5;

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:${isRecent ? 10 : 8}px;height:${isRecent ? 10 : 8}px;
          background:#c4963a;border:1.5px solid #fff;
          border-radius:1px;transform:rotate(45deg);
          box-shadow:0 1px 4px rgba(0,0,0,0.25);cursor:pointer;
          opacity:${isRecent ? 1 : 0.7};
        "></div>`,
        iconSize: [isRecent ? 10 : 8, isRecent ? 10 : 8],
        iconAnchor: [isRecent ? 5 : 4, isRecent ? 5 : 4],
      });

      const marker = L.marker([m.lat, m.lng], { icon });
      marker.bindTooltip(
        `<div style="font-family:var(--font-ui),system-ui,sans-serif;text-align:center;">
          <strong style="font-size:11px;">${m.name}</strong>
          <span style="font-size:9px;display:block;color:#666;">Inc. ${m.year}</span>
        </div>`,
        { direction: "top", opacity: 0.95 }
      );
      marker.on("click", () => {
        mapRef.current?.setView([m.lat, m.lng], 14, { animate: true, duration: 0.5 });
        showPopup(m.lat, m.lng,
          `<div style="font-family:var(--font-ui),system-ui,sans-serif;">
            <p style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#c4963a;font-weight:700;margin:0 0 4px;">Municipality</p>
            <p style="font-family:var(--font-display),Georgia,serif;font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 4px;">${m.name}</p>
            <p style="font-size:12px;color:#8a8077;margin:0 0 6px;">Incorporated ${m.year}</p>
            <p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0;">${m.notes}</p>
          </div>`
        );
      });
      municipalityLayerRef.current!.addLayer(marker);
    });
  }, [currentYear, ready, L, layers.municipalities, showPopup]);

  // ── Play/pause ──────────────────────────────────────────────────
  useEffect(() => {
    if (playing) {
      playTimerRef.current = setInterval(() => {
        setCurrentYear((prev) => {
          if (prev >= MAX_YEAR) { setPlaying(false); return MAX_YEAR; }
          return prev + 1;
        });
      }, PLAY_INTERVAL);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    return () => { if (playTimerRef.current) clearInterval(playTimerRef.current); };
  }, [playing]);

  const togglePlay = () => {
    if (currentYear >= MAX_YEAR) { setCurrentYear(MIN_YEAR); setSelectedEvent(null); setPlaying(true); }
    else setPlaying((p) => !p);
  };

  const toggleLayer = (key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = Object.keys(categoryColors);
  const eraLabel =
    currentYear < 1873 ? "Seminole Era"
    : currentYear < 1896 ? "Pre-Incorporation"
    : currentYear < 1910 ? "Early Settlement"
    : currentYear < 1920 ? "The Magic City"
    : currentYear < 1926 ? "The Land Boom"
    : currentYear < 1930 ? "Hurricane & Aftermath"
    : "Depression & Reinvention";

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) counts[cat] = visibleEvents.filter((e) => e.category === cat).length;
    return counts;
  }, [visibleEvents, categories]);

  // Count active GIS features
  const activeLayerCount = Object.values(layers).filter(Boolean).length;

  return (
    <>
      <PageWrapper wide>
        <SectionLabel>Interactive GIS Map</SectionLabel>
        <SectionHeading>Explore Miami Through Time</SectionHeading>
        <p className="font-body" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--faded)", marginBottom: 12, maxWidth: 640 }}>
          Travel through a century of Miami history. Seven data layers — from timeline events and neighborhood boundaries
          to the FEC Railway, causeways, landmarks, hurricane tracks, and municipal incorporations — reveal how the city was built.
        </p>
        <p className="font-ui" style={{ fontSize: 11, color: "var(--faded)", marginBottom: 32, letterSpacing: "0.05em" }}>
          {mapEvents.length} events &middot; 33 landmarks &middot; 14 railway stations &middot; 6 boundaries &middot; 11 causeways &amp; islands &middot; 2 hurricanes &middot; 13 municipalities
        </p>
      </PageWrapper>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
        {/* ── Time slider & controls ──────────────────────────────── */}
        <div style={{
          backgroundColor: "rgba(26,23,20,0.95)", backdropFilter: "blur(12px)",
          borderRadius: "8px 8px 0 0", padding: "16px 24px 20px",
          border: "1px solid rgba(176,112,64,0.15)", borderBottom: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={togglePlay} style={{
                width: 40, height: 40, borderRadius: "50%",
                background: playing ? "var(--copper)" : "rgba(176,112,64,0.2)",
                border: "1px solid var(--copper)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
              }} aria-label={playing ? "Pause" : "Play"}>
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="1" width="3.5" height="12" rx="1" fill="var(--cream)" />
                    <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="var(--cream)" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 1.5L12 7L3 12.5V1.5Z" fill="var(--cream)" />
                  </svg>
                )}
              </button>
              <div>
                <p className="font-mono-dm" style={{ fontSize: 32, fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>{currentYear}</p>
                <p className="font-ui" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--copper)", marginTop: 2 }}>{eraLabel}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <span className="font-ui" style={{ fontSize: 11, color: "rgba(245,240,232,0.5)" }}>
                {visibleEvents.length} of {mapEvents.length} events
              </span>
              <button onClick={() => setLayerPanelOpen((o) => !o)} className="font-ui" style={{
                fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "5px 12px", borderRadius: 20,
                border: layerPanelOpen ? "1px solid var(--copper)" : "1px solid rgba(245,240,232,0.2)",
                background: layerPanelOpen ? "rgba(176,112,64,0.2)" : "transparent",
                color: layerPanelOpen ? "var(--copper)" : "rgba(245,240,232,0.4)",
                cursor: "pointer", fontWeight: 500, transition: "all 0.2s",
              }}>
                Layers ({activeLayerCount}/7)
              </button>
            </div>
          </div>

          {/* Slider */}
          <input type="range" min={MIN_YEAR} max={MAX_YEAR} step={1} value={currentYear}
            onChange={(e) => { setCurrentYear(Number(e.target.value)); setSelectedEvent(null); setPlaying(false); }}
            className="map-slider" style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {[{ year: 1836, label: "1836" }, { year: 1896, label: "1896" }, { year: 1910, label: "1910" }, { year: 1920, label: "1920" }, { year: 1926, label: "1926" }, { year: 1940, label: "1940" }].map((mark) => (
              <button key={mark.year} onClick={() => { setCurrentYear(mark.year); setSelectedEvent(null); setPlaying(false); }}
                className="font-mono-dm" style={{
                  fontSize: 10, color: currentYear >= mark.year ? "var(--copper)" : "rgba(245,240,232,0.25)",
                  background: "none", border: "none", cursor: "pointer", padding: "2px 4px", transition: "color 0.2s",
                }}>{mark.label}</button>
            ))}
          </div>
        </div>

        {/* ── Layer panel (collapsible) ─────────────────────────── */}
        {layerPanelOpen && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1,
            backgroundColor: "var(--divider)", borderLeft: "1px solid var(--divider)", borderRight: "1px solid var(--divider)",
          }}>
            {layerDefs.map((ld) => (
              <button key={ld.key} onClick={() => toggleLayer(ld.key)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                backgroundColor: layers[ld.key] ? "var(--warm-white)" : "var(--parchment)",
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                opacity: layers[ld.key] ? 1 : 0.5,
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: 3, flexShrink: 0,
                  background: layers[ld.key] ? ld.color : "transparent",
                  border: `2px solid ${ld.color}`, transition: "all 0.15s",
                }} />
                <div>
                  <p className="font-ui" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "var(--ink)", margin: 0 }}>{ld.label}</p>
                  <p className="font-ui" style={{ fontSize: 9, color: "var(--faded)", margin: 0 }}>{ld.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Category filters (timeline events) ────────────────── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 24px",
          backgroundColor: "var(--parchment)", borderLeft: "1px solid var(--divider)", borderRight: "1px solid var(--divider)",
        }}>
          <button onClick={() => { setActiveCategory(null); setSelectedEvent(null); }} className="font-ui" style={{
            padding: "5px 14px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 20,
            border: activeCategory === null ? "1px solid var(--ink)" : "1px solid var(--divider)",
            background: activeCategory === null ? "var(--ink)" : "transparent",
            color: activeCategory === null ? "var(--cream)" : "var(--faded)", cursor: "pointer", fontWeight: 500,
          }}>All ({visibleEvents.length})</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => { setActiveCategory(cat === activeCategory ? null : cat); setSelectedEvent(null); }}
              className="font-ui" style={{
                padding: "5px 14px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 20,
                border: `1px solid ${activeCategory === cat ? categoryColors[cat] : "var(--divider)"}`,
                background: activeCategory === cat ? categoryColors[cat] : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--faded)", cursor: "pointer", fontWeight: 500,
                transition: "all 0.15s", opacity: categoryCounts[cat] === 0 ? 0.4 : 1,
              }}>{categoryLabels[cat]} ({categoryCounts[cat]})</button>
          ))}
        </div>

        {/* ── Map + sidebar ─────────────────────────────────────── */}
        <div className="map-layout" style={{ display: "grid", gridTemplateColumns: "1fr 360px", minHeight: 620 }}>
          {/* Map container */}
          <div style={{ position: "relative", overflow: "hidden", borderLeft: "1px solid var(--divider)", borderBottom: "1px solid var(--divider)" }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%", minHeight: 620, background: "#e8e4dc" }} />

            {/* Recent events toast */}
            {recentEvents.length > 0 && !selectedEvent && layers.events && (
              <div style={{
                position: "absolute", top: 16, left: 16, zIndex: 1000,
                backgroundColor: "rgba(26,23,20,0.9)", backdropFilter: "blur(8px)",
                borderRadius: 6, padding: "10px 16px", maxWidth: 280, pointerEvents: "none",
              }}>
                <p className="font-ui" style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 4 }}>Recent</p>
                {recentEvents.slice(0, 3).map((e, i) => (
                  <p key={i} className="font-body" style={{ fontSize: 12, color: "var(--cream)", lineHeight: 1.4, margin: "2px 0" }}>
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: categoryColors[e.category], marginRight: 6 }} />
                    {e.title}
                  </p>
                ))}
                {recentEvents.length > 3 && (
                  <p className="font-ui" style={{ fontSize: 10, color: "rgba(245,240,232,0.4)", marginTop: 4 }}>+{recentEvents.length - 3} more</p>
                )}
              </div>
            )}

            {/* Layer legend (bottom-left, inside map) */}
            <div style={{
              position: "absolute", bottom: 36, left: 12, zIndex: 1000,
              backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
              borderRadius: 6, padding: "8px 10px", fontSize: 9, lineHeight: 1.6,
              border: "1px solid var(--divider)", pointerEvents: "none",
            }}>
              <p className="font-ui" style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--faded)", fontWeight: 700, marginBottom: 3 }}>Legend</p>
              {layers.events && <p style={{ margin: 0 }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#b07040", marginRight: 4, verticalAlign: "middle" }} />Timeline Events</p>}
              {layers.landmarks && <p style={{ margin: 0 }}><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 1, background: "#c0392b", transform: "rotate(45deg)", marginRight: 5, verticalAlign: "middle" }} />Landmarks</p>}
              {layers.fec && <p style={{ margin: 0 }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#2c3e50", marginRight: 4, verticalAlign: "middle" }} />FEC Stations</p>}
              {layers.causeways && <p style={{ margin: 0 }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#3498db", marginRight: 4, verticalAlign: "middle" }} />Islands &amp; Causeways</p>}
              {layers.municipalities && <p style={{ margin: 0 }}><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 1, background: "#c4963a", transform: "rotate(45deg)", marginRight: 5, verticalAlign: "middle" }} />Municipalities</p>}
              {layers.hurricane && currentYear >= 1926 && <p style={{ margin: 0 }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "rgba(139,0,0,0.4)", border: "1.5px solid #8b0000", marginRight: 4, verticalAlign: "middle" }} />Hurricanes</p>}
              {layers.boundaries && <p style={{ margin: 0 }}><span style={{ display: "inline-block", width: 10, height: 6, border: "1.5px dashed #1c2d5a", marginRight: 4, verticalAlign: "middle" }} />Boundaries</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{
            backgroundColor: "var(--parchment)", overflowY: "auto", maxHeight: 620,
            border: "1px solid var(--divider)", borderLeft: "none",
          }}>
            <div style={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "var(--parchment)", padding: "16px 16px 12px", borderBottom: "1px solid var(--divider)" }}>
              <p className="font-ui" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--faded)", fontWeight: 600 }}>
                {visibleEvents.length} event{visibleEvents.length !== 1 ? "s" : ""} up to {currentYear}
              </p>
            </div>

            <div style={{ padding: "12px 12px 16px" }}>
              {visibleEvents.length === 0 ? (
                <p className="font-body" style={{ fontSize: 14, color: "var(--faded)", fontStyle: "italic", padding: "24px 8px", textAlign: "center" }}>
                  No events yet. Move the slider forward to see history unfold.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {visibleEvents.map((event, i) => {
                    const isSelected = selectedEvent === event;
                    const isRecent = currentYear - event.year <= 5;
                    return (
                      <button key={`${event.yearLabel}-${event.title}-${i}`} onClick={() => handleSelectEvent(event)} style={{
                        textAlign: "left", width: "100%",
                        background: isSelected ? "rgba(176,112,64,0.12)" : isRecent ? "rgba(176,112,64,0.04)" : "var(--warm-white)",
                        border: isSelected ? "1px solid var(--copper)" : isRecent ? "1px solid rgba(176,112,64,0.2)" : "1px solid var(--divider)",
                        borderRadius: 6, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s ease",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: categoryColors[event.category], flexShrink: 0 }} />
                          <span className="font-mono-dm" style={{ fontSize: 10, color: categoryColors[event.category], fontWeight: 700 }}>{event.yearLabel}</span>
                          <span className="font-ui" style={{ fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--faded)" }}>{categoryLabels[event.category]}</span>
                          {isRecent && !isSelected && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "var(--copper)" }} />}
                        </div>
                        <p className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>{event.title}</p>
                        {isSelected && (
                          <>
                            <p className="font-body" style={{ fontSize: 12, lineHeight: 1.65, color: "var(--storm)", marginTop: 8 }}>{event.description}</p>
                            <p className="font-ui" style={{ fontSize: 9, color: "var(--faded)", marginTop: 8, letterSpacing: "0.08em" }}>{event.location}</p>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats bar ─────────────────────────────────────────── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 1,
          backgroundColor: "var(--divider)", borderRadius: "0 0 8px 8px", overflow: "hidden",
        }}>
          {categories.map((cat) => (
            <div key={cat} style={{ backgroundColor: "var(--warm-white)", padding: "12px 16px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: categoryColors[cat] }} />
                <span className="font-ui" style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--faded)", fontWeight: 600 }}>{categoryLabels[cat]}</span>
              </div>
              <p className="font-mono-dm" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>{categoryCounts[cat]}</p>
            </div>
          ))}
        </div>

        {/* Styles */}
        <style>{`
          .map-layout { grid-template-columns: 1fr 360px; }
          @media (max-width: 900px) {
            .map-layout { grid-template-columns: 1fr !important; }
            .map-layout > div:last-child { max-height: 350px !important; }
          }
          .map-slider {
            -webkit-appearance: none; appearance: none; height: 4px;
            background: linear-gradient(to right,
              var(--copper) 0%, var(--copper) ${((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
              rgba(245,240,232,0.15) ${((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%, rgba(245,240,232,0.15) 100%
            );
            border-radius: 2px; outline: none; cursor: pointer;
          }
          .map-slider::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
            border-radius: 50%; background: var(--copper); border: 3px solid var(--cream);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: grab; transition: transform 0.15s ease;
          }
          .map-slider::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.15); }
          .map-slider::-moz-range-thumb {
            width: 18px; height: 18px; border-radius: 50%; background: var(--copper);
            border: 3px solid var(--cream); box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: grab;
          }
          .map-slider::-moz-range-track {
            height: 4px; border: none; border-radius: 2px;
            background: linear-gradient(to right,
              var(--copper) 0%, var(--copper) ${((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
              rgba(245,240,232,0.15) ${((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%, rgba(245,240,232,0.15) 100%
            );
          }
          @keyframes markerPulse {
            0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
            50% { box-shadow: 0 2px 12px rgba(176,112,64,0.5); }
          }
          .map-marker-pulse { animation: markerPulse 2s ease-in-out infinite; }
          .miami-popup .leaflet-popup-content-wrapper {
            border-radius: 8px; padding: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.18); border: 1px solid var(--divider);
          }
          .miami-popup .leaflet-popup-content { margin: 14px 16px; font-size: 13px; line-height: 1.6; }
          .miami-popup .leaflet-popup-tip { box-shadow: none; border: 1px solid var(--divider); }
          .miami-popup .leaflet-popup-close-button { color: var(--faded) !important; font-size: 18px !important; top: 6px !important; right: 8px !important; }
        `}</style>
      </div>
    </>
  );
}
