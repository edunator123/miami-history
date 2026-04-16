import React from "react";
import Link from "next/link";

export function PageWrapper({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ maxWidth: wide ? 1100 : 720, margin: "0 auto", padding: "48px 24px" }}>
      {children}
    </div>
  );
}

export function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-display"
      style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, marginBottom: 24, color: "var(--ink)", lineHeight: 1.15 }}
    >
      {children}
    </h2>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-display"
      style={{ fontSize: "clamp(1.3rem, 2vw, 1.6rem)", fontWeight: 700, marginTop: 40, marginBottom: 16, color: "var(--ink)", lineHeight: 1.2 }}
    >
      {children}
    </h3>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-ui"
      style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: "var(--copper)", marginBottom: 12 }}
    >
      {children}
    </p>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body" style={{ fontSize: 16, lineHeight: 1.75, color: "var(--storm)" }}>
      {children}
    </div>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: 20 }}>{children}</p>;
}

export function Blockquote({ children, attribution }: { children: React.ReactNode; attribution?: string }) {
  return (
    <blockquote
      className="font-display"
      style={{
        borderLeft: "3px solid var(--copper)",
        paddingLeft: 24,
        margin: "36px 0",
        padding: "20px 24px",
        backgroundColor: "var(--parchment)",
        fontStyle: "italic",
        color: "var(--ink)",
        fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
        lineHeight: 1.7,
      }}
    >
      {children}
      {attribution && (
        <p
          className="font-ui"
          style={{ fontSize: "0.7rem", color: "var(--faded)", marginTop: 12, fontStyle: "normal", letterSpacing: "0.15em", textTransform: "uppercase" }}
        >
          {attribution}
        </p>
      )}
    </blockquote>
  );
}

export function KeyStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", margin: "40px 0", padding: "28px 0", borderTop: "1px solid var(--divider)", borderBottom: "1px solid var(--divider)" }}>
      <p className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--deep-blue)", marginBottom: 6 }}>
        {value}
      </p>
      <p className="font-ui" style={{ fontSize: "0.65rem", color: "var(--faded)", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 500 }}>
        {label}
      </p>
    </div>
  );
}

export function Divider() {
  return <div style={{ margin: "56px 0", borderTop: "1px solid var(--divider)" }} />;
}

export function CrossLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p style={{ marginTop: 40 }}>
      <Link href={href} className="font-ui" style={{ fontSize: 14, color: "var(--copper)", fontWeight: 500, letterSpacing: "0.05em" }}>
        {children} →
      </Link>
    </p>
  );
}
