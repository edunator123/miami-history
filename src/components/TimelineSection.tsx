"use client";

import { useState } from "react";
import { timelineEvents } from "@/data/timeline";
import { PageWrapper, SectionHeading, SectionLabel } from "@/components/prose";
import Reveal from "@/components/Reveal";

const categoryColors: Record<string, string> = {
  founding: "#2d6b5e",
  labor: "#b07040",
  segregation: "#1c2d5a",
  development: "#c4963a",
  crisis: "#8b6b6b",
};

const categoryLabels: Record<string, string> = {
  founding: "Founding",
  labor: "Labor",
  segregation: "Segregation",
  development: "Development",
  crisis: "Crisis",
};

export default function TimelineSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = Object.keys(categoryColors);
  const filtered = activeCategory
    ? timelineEvents.filter((e) => e.category === activeCategory)
    : timelineEvents;

  return (
    <PageWrapper>
      <SectionLabel>Chronology</SectionLabel>
      <SectionHeading>Timeline</SectionHeading>

      {/* Sticky filter pills */}
      <div style={{ position: "sticky", top: 56, zIndex: 10, backgroundColor: "var(--warm-white)", padding: "12px 0 16px", marginBottom: 32 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            onClick={() => setActiveCategory(null)}
            className="font-ui"
            style={{
              padding: "6px 16px",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              borderRadius: 20,
              border: activeCategory === null ? "1px solid var(--ink)" : "1px solid var(--divider)",
              background: activeCategory === null ? "var(--ink)" : "transparent",
              color: activeCategory === null ? "var(--cream)" : "var(--faded)",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className="font-ui"
              style={{
                padding: "6px 16px",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                borderRadius: 20,
                border: `1px solid ${activeCategory === cat ? categoryColors[cat] : "var(--divider)"}`,
                background: activeCategory === cat ? categoryColors[cat] : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--faded)",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline with center line */}
      <div style={{ position: "relative" }}>
        {/* Center line — desktop only */}
        <div className="hidden md:block" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, backgroundColor: "var(--divider)" }} />

        {filtered.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <Reveal key={`${event.year}-${i}`} delay={i * 0.05}>
              <div
                className="md:grid"
                style={{
                  gridTemplateColumns: "1fr 1fr",
                  gap: 48,
                  marginBottom: 48,
                  position: "relative",
                }}
              >
                {/* Dot on center line — desktop */}
                <div
                  className="hidden md:block"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 6,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: categoryColors[event.category],
                    transform: "translateX(-50%)",
                    zIndex: 2,
                  }}
                />

                {/* Content — alternates sides on desktop */}
                <div style={{ gridColumn: isLeft ? 1 : 2, textAlign: isLeft ? "right" : "left" }}>
                  <p className="font-mono-dm" style={{ fontSize: 12, fontWeight: 700, color: categoryColors[event.category], marginBottom: 4, letterSpacing: "0.05em" }}>
                    {event.year}
                  </p>
                  <p className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 8, lineHeight: 1.3 }}>
                    {event.title}
                  </p>
                  <p className="font-body" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--faded)" }}>
                    {event.description}
                  </p>
                </div>

                {/* Empty spacer for the other side */}
                <div style={{ gridColumn: isLeft ? 2 : 1 }} />
              </div>
            </Reveal>
          );
        })}
      </div>
    </PageWrapper>
  );
}
