"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { mapEvents, categoryColors, categoryLabels, type MapEvent } from "@/data/mapEvents";
import { PageWrapper, SectionHeading, SectionLabel } from "@/components/prose";

const MIN_YEAR = 1836;
const MAX_YEAR = 1940;
const PLAY_INTERVAL = 120; // ms per year tick when playing

// Approximate historical neighborhood boundaries (simplified polygons)
const neighborhoods: {
  name: string;
  yearAppears: number;
  color: string;
  coords: [number, number][];
  label: string;
}[] = [
  {
    name: "Colored Town / Overtown",
    yearAppears: 1896,
    color: "#1c2d5a",
    label: "Segregated Black district, est. 1896",
    coords: [
      [25.7795, -80.2080],
      [25.7795, -80.1955],
      [25.7880, -80.1955],
      [25.7880, -80.2080],
    ],
  },
  {
    name: "Downtown Miami",
    yearAppears: 1896,
    color: "#c4963a",
    label: "Commercial center, est. 1896",
    coords: [
      [25.7630, -80.1960],
      [25.7630, -80.1870],
      [25.7790, -80.1870],
      [25.7790, -80.1960],
    ],
  },
  {
    name: "Coconut Grove",
    yearAppears: 1882,
    color: "#2d6b5e",
    label: "Earliest mainland settlement, 1880s",
    coords: [
      [25.7200, -80.2470],
      [25.7200, -80.2300],
      [25.7310, -80.2300],
      [25.7310, -80.2470],
    ],
  },
  {
    name: "Lemon City",
    yearAppears: 1873,
    color: "#2d6b5e",
    label: "Oldest continuously settled community, 1870s",
    coords: [
      [25.8240, -80.1910],
      [25.8240, -80.1830],
      [25.8310, -80.1830],
      [25.8310, -80.1910],
    ],
  },
  {
    name: "Coral Gables",
    yearAppears: 1924,
    color: "#c4963a",
    label: "George Merrick's 'City Beautiful', 1924",
    coords: [
      [25.7380, -80.2810],
      [25.7380, -80.2650],
      [25.7530, -80.2650],
      [25.7530, -80.2810],
    ],
  },
  {
    name: "Miami Beach",
    yearAppears: 1912,
    color: "#c4963a",
    label: "Resort development, 1910s",
    coords: [
      [25.7700, -80.1370],
      [25.7700, -80.1260],
      [25.8000, -80.1260],
      [25.8000, -80.1370],
    ],
  },
  {
    name: "Liberty City",
    yearAppears: 1937,
    color: "#1c2d5a",
    label: "Black housing project, 1937",
    coords: [
      [25.8300, -80.2260],
      [25.8300, -80.2150],
      [25.8400, -80.2150],
      [25.8400, -80.2260],
    ],
  },
];

export default function MapExplorer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const neighborhoodLayersRef = useRef<L.Polygon[]>([]);
  const popupRef = useRef<L.Popup | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [ready, setReady] = useState(false);
  const [currentYear, setCurrentYear] = useState(MIN_YEAR);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showNeighborhoods, setShowNeighborhoods] = useState(true);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    import("leaflet").then((mod) => {
      setL(mod.default || mod);
    });
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

    // Stamen-style toner-lite for historical feel
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [L]);

  // Filter events
  const visibleEvents = useMemo(() => {
    return mapEvents.filter((e) => {
      if (e.year > currentYear) return false;
      if (activeCategory && e.category !== activeCategory) return false;
      return true;
    });
  }, [currentYear, activeCategory]);

  // Events that just appeared (within 5 years of slider)
  const recentEvents = useMemo(() => {
    return visibleEvents.filter((e) => currentYear - e.year <= 5);
  }, [visibleEvents, currentYear]);

  // Select event handler
  const handleSelectEvent = useCallback(
    (event: MapEvent | null) => {
      setSelectedEvent((prev) => {
        const next = prev === event ? null : event;

        if (next && mapRef.current && L) {
          mapRef.current.setView([next.lat, next.lng], 14, {
            animate: true,
            duration: 0.5,
          });

          // Show popup on map
          if (popupRef.current) popupRef.current.remove();
          popupRef.current = L.popup({
            closeButton: true,
            maxWidth: 320,
            className: "miami-popup",
            offset: [0, -8],
          })
            .setLatLng([next.lat, next.lng])
            .setContent(
              `<div style="font-family: var(--font-ui), system-ui, sans-serif;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                  <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${categoryColors[next.category]};flex-shrink:0;"></span>
                  <span style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${categoryColors[next.category]};font-weight:700;">${next.yearLabel}</span>
                  <span style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8077;">
                    ${categoryLabels[next.category]}
                  </span>
                </div>
                <p style="font-family: var(--font-display), Georgia, serif; font-size:15px;font-weight:700;color:#1a1714;line-height:1.3;margin:0 0 6px;">${next.title}</p>
                <p style="font-size:13px;line-height:1.6;color:#3a3530;margin:0 0 8px;">${next.description}</p>
                <p style="font-size:10px;color:#8a8077;margin:0;letter-spacing:0.08em;">${next.location}</p>
              </div>`
            )
            .openOn(mapRef.current);
        } else if (!next && popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }

        return next;
      });
    },
    [L]
  );

  // Update markers
  useEffect(() => {
    if (!ready || !mapRef.current || !L) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    visibleEvents.forEach((event) => {
      const color = categoryColors[event.category];
      const isRecent = currentYear - event.year <= 5;
      const isSelected = selectedEvent === event;
      const size = isSelected ? 20 : isRecent ? 14 : 10;

      const icon = L.divIcon({
        className: "",
        html: `<div class="map-marker ${isRecent ? "map-marker-pulse" : ""}" style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background-color: ${color};
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3)${isRecent ? `, 0 0 12px ${color}80` : ""};
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: ${isRecent ? 1 : 0.75};
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([event.lat, event.lng], { icon }).addTo(
        mapRef.current!
      );
      marker.on("click", () => handleSelectEvent(event));
      markersRef.current.push(marker);
    });
  }, [visibleEvents, ready, L, selectedEvent, currentYear, handleSelectEvent]);

  // Update neighborhood overlays
  useEffect(() => {
    if (!ready || !mapRef.current || !L) return;

    neighborhoodLayersRef.current.forEach((l) => l.remove());
    neighborhoodLayersRef.current = [];

    if (!showNeighborhoods) return;

    neighborhoods.forEach((n) => {
      if (n.yearAppears > currentYear) return;

      const polygon = L.polygon(n.coords, {
        color: n.color,
        weight: 1.5,
        opacity: 0.6,
        fillColor: n.color,
        fillOpacity: 0.08,
        dashArray: "6 4",
      }).addTo(mapRef.current!);

      polygon.bindTooltip(
        `<div style="font-family:var(--font-ui),system-ui,sans-serif;text-align:center;">
          <strong style="font-size:12px;display:block;margin-bottom:2px;">${n.name}</strong>
          <span style="font-size:10px;color:#666;">${n.label}</span>
        </div>`,
        { sticky: true, direction: "top", opacity: 0.95 }
      );

      neighborhoodLayersRef.current.push(polygon);
    });
  }, [currentYear, showNeighborhoods, ready, L]);

  // Play/pause logic
  useEffect(() => {
    if (playing) {
      playTimerRef.current = setInterval(() => {
        setCurrentYear((prev) => {
          if (prev >= MAX_YEAR) {
            setPlaying(false);
            return MAX_YEAR;
          }
          return prev + 1;
        });
      }, PLAY_INTERVAL);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [playing]);

  const togglePlay = () => {
    if (currentYear >= MAX_YEAR) {
      setCurrentYear(MIN_YEAR);
      setSelectedEvent(null);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const categories = Object.keys(categoryColors);

  const eraLabel =
    currentYear < 1873
      ? "Seminole Era"
      : currentYear < 1896
        ? "Pre-Incorporation"
        : currentYear < 1910
          ? "Early Settlement"
          : currentYear < 1920
            ? "The Magic City"
            : currentYear < 1926
              ? "The Land Boom"
              : currentYear < 1930
                ? "Hurricane & Aftermath"
                : "Depression & Reinvention";

  // Count events by category for the legend
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat] = visibleEvents.filter((e) => e.category === cat).length;
    }
    return counts;
  }, [visibleEvents, categories]);

  return (
    <>
      <PageWrapper wide>
        <SectionLabel>Interactive Map</SectionLabel>
        <SectionHeading>Explore Miami Through Time</SectionHeading>
        <p
          className="font-body"
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--faded)",
            marginBottom: 12,
            maxWidth: 640,
          }}
        >
          Travel through a century of Miami history. Drag the timeline or press
          play to watch the city grow — from frontier outpost to metropolis.
          Click any marker or event to learn its story.
        </p>
        <p
          className="font-ui"
          style={{
            fontSize: 11,
            color: "var(--faded)",
            marginBottom: 32,
            letterSpacing: "0.05em",
          }}
        >
          {mapEvents.length} events mapped across {categories.length} categories
          &middot; {neighborhoods.length} neighborhood boundaries
        </p>
      </PageWrapper>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
        {/* ── Time slider & play controls ────────────────────────────── */}
        <div
          style={{
            backgroundColor: "rgba(26,23,20,0.95)",
            backdropFilter: "blur(12px)",
            borderRadius: "8px 8px 0 0",
            padding: "16px 24px 20px",
            border: "1px solid rgba(176,112,64,0.15)",
            borderBottom: "none",
          }}
        >
          {/* Year display + play button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={togglePlay}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: playing
                    ? "var(--copper)"
                    : "rgba(176,112,64,0.2)",
                  border: "1px solid var(--copper)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect
                      x="2"
                      y="1"
                      width="3.5"
                      height="12"
                      rx="1"
                      fill="var(--cream)"
                    />
                    <rect
                      x="8.5"
                      y="1"
                      width="3.5"
                      height="12"
                      rx="1"
                      fill="var(--cream)"
                    />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path d="M3 1.5L12 7L3 12.5V1.5Z" fill="var(--cream)" />
                  </svg>
                )}
              </button>
              <div>
                <p
                  className="font-mono-dm"
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "var(--cream)",
                    lineHeight: 1,
                  }}
                >
                  {currentYear}
                </p>
                <p
                  className="font-ui"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--copper)",
                    marginTop: 2,
                  }}
                >
                  {eraLabel}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <span
                className="font-ui"
                style={{ fontSize: 11, color: "rgba(245,240,232,0.5)" }}
              >
                {visibleEvents.length} of {mapEvents.length} events
              </span>
              <button
                onClick={() => setShowNeighborhoods((s) => !s)}
                className="font-ui"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: showNeighborhoods
                    ? "1px solid var(--copper)"
                    : "1px solid rgba(245,240,232,0.2)",
                  background: showNeighborhoods
                    ? "rgba(176,112,64,0.2)"
                    : "transparent",
                  color: showNeighborhoods
                    ? "var(--copper)"
                    : "rgba(245,240,232,0.4)",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                Neighborhoods
              </button>
            </div>
          </div>

          {/* Slider */}
          <div style={{ position: "relative" }}>
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              value={currentYear}
              onChange={(e) => {
                setCurrentYear(Number(e.target.value));
                setSelectedEvent(null);
                setPlaying(false);
              }}
              className="map-slider"
              style={{ width: "100%" }}
            />
            {/* Era tick marks */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              {[
                { year: 1836, label: "1836" },
                { year: 1896, label: "1896" },
                { year: 1910, label: "1910" },
                { year: 1920, label: "1920" },
                { year: 1926, label: "1926" },
                { year: 1940, label: "1940" },
              ].map((mark) => (
                <button
                  key={mark.year}
                  onClick={() => {
                    setCurrentYear(mark.year);
                    setSelectedEvent(null);
                    setPlaying(false);
                  }}
                  className="font-mono-dm"
                  style={{
                    fontSize: 10,
                    color:
                      currentYear >= mark.year
                        ? "var(--copper)"
                        : "rgba(245,240,232,0.25)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                    transition: "color 0.2s",
                  }}
                >
                  {mark.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category filters ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            padding: "12px 24px",
            backgroundColor: "var(--parchment)",
            borderLeft: "1px solid var(--divider)",
            borderRight: "1px solid var(--divider)",
          }}
        >
          <button
            onClick={() => {
              setActiveCategory(null);
              setSelectedEvent(null);
            }}
            className="font-ui"
            style={{
              padding: "5px 14px",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              borderRadius: 20,
              border:
                activeCategory === null
                  ? "1px solid var(--ink)"
                  : "1px solid var(--divider)",
              background: activeCategory === null ? "var(--ink)" : "transparent",
              color: activeCategory === null ? "var(--cream)" : "var(--faded)",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            All ({visibleEvents.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat === activeCategory ? null : cat);
                setSelectedEvent(null);
              }}
              className="font-ui"
              style={{
                padding: "5px 14px",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                borderRadius: 20,
                border: `1px solid ${activeCategory === cat ? categoryColors[cat] : "var(--divider)"}`,
                background:
                  activeCategory === cat ? categoryColors[cat] : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--faded)",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.15s",
                opacity: categoryCounts[cat] === 0 ? 0.4 : 1,
              }}
            >
              {categoryLabels[cat]} ({categoryCounts[cat]})
            </button>
          ))}
        </div>

        {/* ── Map + sidebar ─────────────────────────────────────────── */}
        <div
          className="map-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            minHeight: 600,
          }}
        >
          {/* Map */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderLeft: "1px solid var(--divider)",
              borderBottom: "1px solid var(--divider)",
            }}
          >
            <link
              rel="stylesheet"
              href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />
            <div
              ref={mapContainerRef}
              style={{
                width: "100%",
                height: "100%",
                minHeight: 600,
                background: "#e8e4dc",
              }}
            />

            {/* Newly appeared events toast */}
            {recentEvents.length > 0 && !selectedEvent && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  zIndex: 1000,
                  backgroundColor: "rgba(26,23,20,0.9)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 6,
                  padding: "10px 16px",
                  maxWidth: 280,
                  pointerEvents: "none",
                }}
              >
                <p
                  className="font-ui"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--copper)",
                    marginBottom: 4,
                  }}
                >
                  Recent
                </p>
                {recentEvents.slice(0, 3).map((e, i) => (
                  <p
                    key={i}
                    className="font-body"
                    style={{
                      fontSize: 12,
                      color: "var(--cream)",
                      lineHeight: 1.4,
                      margin: "2px 0",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: categoryColors[e.category],
                        marginRight: 6,
                      }}
                    />
                    {e.title}
                  </p>
                ))}
                {recentEvents.length > 3 && (
                  <p
                    className="font-ui"
                    style={{
                      fontSize: 10,
                      color: "rgba(245,240,232,0.4)",
                      marginTop: 4,
                    }}
                  >
                    +{recentEvents.length - 3} more
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div
            style={{
              backgroundColor: "var(--parchment)",
              overflowY: "auto",
              maxHeight: 600,
              border: "1px solid var(--divider)",
              borderLeft: "none",
            }}
          >
            {/* Sidebar header */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                backgroundColor: "var(--parchment)",
                padding: "16px 16px 12px",
                borderBottom: "1px solid var(--divider)",
              }}
            >
              <p
                className="font-ui"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--faded)",
                  fontWeight: 600,
                }}
              >
                {visibleEvents.length} event
                {visibleEvents.length !== 1 ? "s" : ""} up to {currentYear}
              </p>
            </div>

            <div style={{ padding: "12px 12px 16px" }}>
              {visibleEvents.length === 0 ? (
                <p
                  className="font-body"
                  style={{
                    fontSize: 14,
                    color: "var(--faded)",
                    fontStyle: "italic",
                    padding: "24px 8px",
                    textAlign: "center",
                  }}
                >
                  No events yet. Move the slider forward to see history unfold.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {visibleEvents.map((event, i) => {
                    const isSelected = selectedEvent === event;
                    const isRecent = currentYear - event.year <= 5;
                    return (
                      <button
                        key={`${event.yearLabel}-${event.title}-${i}`}
                        onClick={() => handleSelectEvent(event)}
                        style={{
                          textAlign: "left",
                          background: isSelected
                            ? "rgba(176,112,64,0.12)"
                            : isRecent
                              ? "rgba(176,112,64,0.04)"
                              : "var(--warm-white)",
                          border: isSelected
                            ? "1px solid var(--copper)"
                            : isRecent
                              ? "1px solid rgba(176,112,64,0.2)"
                              : "1px solid var(--divider)",
                          borderRadius: 6,
                          padding: "10px 12px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 4,
                          }}
                        >
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              backgroundColor: categoryColors[event.category],
                              flexShrink: 0,
                            }}
                          />
                          <span
                            className="font-mono-dm"
                            style={{
                              fontSize: 10,
                              color: categoryColors[event.category],
                              fontWeight: 700,
                            }}
                          >
                            {event.yearLabel}
                          </span>
                          <span
                            className="font-ui"
                            style={{
                              fontSize: 8,
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: "var(--faded)",
                            }}
                          >
                            {categoryLabels[event.category]}
                          </span>
                          {isRecent && !isSelected && (
                            <span
                              style={{
                                marginLeft: "auto",
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: "var(--copper)",
                              }}
                            />
                          )}
                        </div>
                        <p
                          className="font-display"
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--ink)",
                            lineHeight: 1.3,
                          }}
                        >
                          {event.title}
                        </p>
                        {isSelected && (
                          <>
                            <p
                              className="font-body"
                              style={{
                                fontSize: 12,
                                lineHeight: 1.65,
                                color: "var(--storm)",
                                marginTop: 8,
                              }}
                            >
                              {event.description}
                            </p>
                            <p
                              className="font-ui"
                              style={{
                                fontSize: 9,
                                color: "var(--faded)",
                                marginTop: 8,
                                letterSpacing: "0.08em",
                              }}
                            >
                              {event.location}
                            </p>
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

        {/* ── Stats bar ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 1,
            backgroundColor: "var(--divider)",
            borderRadius: "0 0 8px 8px",
            overflow: "hidden",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                backgroundColor: "var(--warm-white)",
                padding: "12px 16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: categoryColors[cat],
                  }}
                />
                <span
                  className="font-ui"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--faded)",
                    fontWeight: 600,
                  }}
                >
                  {categoryLabels[cat]}
                </span>
              </div>
              <p
                className="font-mono-dm"
                style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}
              >
                {categoryCounts[cat]}
              </p>
            </div>
          ))}
        </div>

        {/* Styles */}
        <style>{`
          .map-layout {
            grid-template-columns: 1fr 360px;
          }
          @media (max-width: 900px) {
            .map-layout {
              grid-template-columns: 1fr !important;
            }
            .map-layout > div:last-child {
              max-height: 350px !important;
            }
          }

          .map-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: linear-gradient(
              to right,
              var(--copper) 0%,
              var(--copper) ${((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
              rgba(245,240,232,0.15) ${((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
              rgba(245,240,232,0.15) 100%
            );
            border-radius: 2px;
            outline: none;
            cursor: pointer;
          }
          .map-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--copper);
            border: 3px solid var(--cream);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: grab;
            transition: transform 0.15s ease;
          }
          .map-slider::-webkit-slider-thumb:active {
            cursor: grabbing;
            transform: scale(1.15);
          }
          .map-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--copper);
            border: 3px solid var(--cream);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: grab;
          }
          .map-slider::-moz-range-track {
            height: 4px;
            background: linear-gradient(
              to right,
              var(--copper) 0%,
              var(--copper) ${((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
              rgba(245,240,232,0.15) ${((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
              rgba(245,240,232,0.15) 100%
            );
            border: none;
            border-radius: 2px;
          }

          @keyframes markerPulse {
            0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
            50% { box-shadow: 0 2px 12px rgba(176,112,64,0.5); }
          }
          .map-marker-pulse {
            animation: markerPulse 2s ease-in-out infinite;
          }

          .miami-popup .leaflet-popup-content-wrapper {
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            border: 1px solid var(--divider);
          }
          .miami-popup .leaflet-popup-content {
            margin: 14px 16px;
            font-size: 13px;
            line-height: 1.6;
          }
          .miami-popup .leaflet-popup-tip {
            box-shadow: none;
            border: 1px solid var(--divider);
          }
          .miami-popup .leaflet-popup-close-button {
            color: var(--faded) !important;
            font-size: 18px !important;
            top: 6px !important;
            right: 8px !important;
          }
        `}</style>
      </div>
    </>
  );
}
