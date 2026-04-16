"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  const fadeUp = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
  });

  const fadeIn = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transition: `opacity 0.9s ease ${delay}s`,
  });

  return (
    <section
      className="grain"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--ink)",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Radial color washes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 20% 60%, rgba(176,112,64,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 40%, rgba(28,45,90,0.1) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Vertical guide lines */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[8, 25, 50, 75, 92].map((pos) => (
          <div
            key={pos}
            style={{
              position: "absolute",
              left: `${pos}%`,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: "rgba(176,112,64,0.07)",
            }}
          />
        ))}
      </div>

      {/* Main content — bottom left */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 8vw 8vh", maxWidth: 800 }}>
        <p
          className="font-ui"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--copper)",
            fontWeight: 600,
            marginBottom: 24,
            ...fadeIn(0.3),
          }}
        >
          A Digital Research Exhibit
        </p>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(3rem, 8vw, 7.5rem)",
            lineHeight: 0.92,
            fontWeight: 900,
            color: "var(--cream)",
            marginBottom: 8,
            ...fadeUp(0.4),
          }}
        >
          Built by Labor,
        </h1>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(3rem, 8vw, 7.5rem)",
            lineHeight: 0.92,
            fontWeight: 900,
            color: "var(--cream)",
            marginBottom: 32,
            ...fadeUp(0.55),
          }}
        >
          Divided by Design
        </h1>

        <p
          className="font-display"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            fontStyle: "italic",
            color: "var(--copper-light)",
            fontWeight: 400,
            marginBottom: 24,
            maxWidth: 520,
            lineHeight: 1.5,
            ...fadeUp(0.75),
          }}
        >
          How immigrant labor, racialized planning, and real estate speculation shaped the Magic City
        </p>

        <p
          className="font-body"
          style={{
            fontSize: 14,
            color: "rgba(245,240,232,0.5)",
            maxWidth: 480,
            lineHeight: 1.7,
            marginBottom: 32,
            ...fadeIn(1.0),
          }}
        >
          A research study examining Miami’s development from 1896 to 1940, told through census data and historical scholarship.
        </p>

        <Link
          href="/research"
          className="font-ui"
          style={{
            fontSize: 14,
            color: "var(--copper)",
            letterSpacing: "0.1em",
            fontWeight: 500,
            textDecoration: "none",
            borderBottom: "1px solid var(--copper)",
            paddingBottom: 2,
            ...fadeIn(1.2),
          }}
        >
          Begin the Exhibit →
        </Link>
      </div>

      {/* Right side metadata */}
      <div
        className="font-mono-dm"
        style={{
          position: "absolute",
          bottom: "8vh",
          right: "4vw",
          writingMode: "vertical-rl",
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "rgba(245,240,232,0.25)",
          ...fadeIn(1.4),
        }}
      >
        Miami, FL · 1896–1940
      </div>
    </section>
  );
}
