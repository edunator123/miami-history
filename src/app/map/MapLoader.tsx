"use client";

import dynamic from "next/dynamic";

const MapExplorer = dynamic(() => import("@/components/MapExplorer"), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p className="font-ui" style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--faded)" }}>
        Loading map...
      </p>
    </div>
  ),
});

export default function MapLoader() {
  return <MapExplorer />;
}
