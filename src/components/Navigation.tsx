"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Research", href: "/research" },
  { label: "Findings", href: "/census" },
  { label: "Map", href: "/map" },
  { label: "Dataset", href: "/data" },
  { label: "Timeline", href: "/timeline" },
  { label: "Sources", href: "/sources" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showSolid = scrolled || !isHome;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 24px",
        transition: "background-color 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease",
        backgroundColor: showSolid ? "rgba(26,23,20,0.95)" : "transparent",
        backdropFilter: showSolid ? "blur(12px)" : "none",
        borderBottom: showSolid ? "1px solid rgba(176,112,64,0.15)" : "1px solid transparent",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <Link
          href="/"
          className="font-ui"
          style={{
            fontSize: 12,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: showSolid ? "var(--cream)" : "rgba(245,240,232,0.7)",
            textDecoration: "none",
          }}
        >
          Built by Labor
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ gap: 32, alignItems: "center" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-ui"
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: pathname === link.href ? 600 : 400,
                color: pathname === link.href ? "var(--copper)" : (showSolid ? "rgba(245,240,232,0.6)" : "rgba(245,240,232,0.5)"),
                textDecoration: "none",
                borderBottom: pathname === link.href ? "1px solid var(--copper)" : "1px solid transparent",
                paddingBottom: 2,
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
          aria-label="Toggle menu"
        >
          <div style={{ width: 20, height: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ display: "block", width: "100%", height: 1, backgroundColor: "var(--cream)", transition: "all 0.3s", transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "100%", height: 1, backgroundColor: "var(--cream)", opacity: menuOpen ? 0 : 1, transition: "opacity 0.3s" }} />
            <span style={{ display: "block", width: "100%", height: 1, backgroundColor: "var(--cream)", transition: "all 0.3s", transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden" style={{ padding: "16px 0 24px", borderTop: "1px solid rgba(176,112,64,0.15)" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-ui"
              style={{
                display: "block",
                padding: "10px 0",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: pathname === link.href ? "var(--copper)" : "rgba(245,240,232,0.6)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
