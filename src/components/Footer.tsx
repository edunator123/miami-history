import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--ink)", padding: "48px 24px", borderTop: "1px solid rgba(176,112,64,0.15)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p className="font-ui" style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", marginBottom: 12 }}>
          Built by Labor, Divided by Design
        </p>
        <p className="font-body" style={{ fontSize: 13, color: "rgba(245,240,232,0.25)" }}>
          An Independent Study in Early Miami History · Data: U.S. Census Bureau via NHGIS
        </p>
        <div style={{ margin: "20px auto", width: 40, height: 1, backgroundColor: "rgba(176,112,64,0.2)" }} />
        <div className="font-ui" style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "Research", href: "/research" },
            { label: "Findings", href: "/census" },
            { label: "Dataset", href: "/data" },
            { label: "Timeline", href: "/timeline" },
            { label: "Sources", href: "/sources" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
