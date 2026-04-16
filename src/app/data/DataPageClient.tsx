"use client";

import { useState, useMemo } from "react";
import sheetsData from "@/data/sheets.json";
import { COPPER, TEAL, GOLD, MUTED, BLUE } from "@/lib/colors";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Sheet {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  headers: string[];
  rows: string[][];
}

const sheets = sheetsData as Sheet[];

/* ------------------------------------------------------------------ */
/*  Sheet descriptions                                                 */
/* ------------------------------------------------------------------ */
const descriptions: Record<string, string> = {
  Dashboard:
    "Summary dashboard of Dade County (Miami) population statistics from the 1910 and 1920 U.S. Census, including racial composition, nativity, and housing data.",
  "All FL Counties 1910":
    "Population, race, and nativity data for all 47 Florida counties recorded in the 1910 Census. Source: NHGIS Dataset 37.",
  "All FL Counties 1920":
    "Population and housing data for all 54 Florida counties in the 1920 Census, including homeownership rates. Source: NHGIS Dataset 43.",
  "1910-1920 Comparison":
    "Decade-over-decade comparison of Florida counties showing population growth, racial composition shifts, and white population growth between 1910 and 1920.",
  "Dade County Deep Dive":
    "Detailed breakdown of Dade County's population timeline, racial composition, housing tenure, and nativity statistics.",
  "Notes & Sources":
    "Data definitions, source datasets, geographic notes, and known limitations of the census extract.",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function parseNum(s: string): number {
  const cleaned = s.replace(/%$/, "").replace(/,/g, "");
  const n = Number(cleaned);
  return isNaN(n) ? -Infinity : n;
}

/* ------------------------------------------------------------------ */
/*  Sortable Table                                                     */
/* ------------------------------------------------------------------ */
function DataTable({ sheet }: { sheet: Sheet }) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return sheet.rows;
    const q = search.toLowerCase();
    return sheet.rows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(q))
    );
  }, [sheet.rows, search]);

  const sorted = useMemo(() => {
    if (sortCol === null) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol] ?? "";
      const bv = b[sortCol] ?? "";
      const an = parseNum(av);
      const bn = parseNum(bv);
      if (an !== -Infinity && bn !== -Infinity) {
        return sortDir === "asc" ? an - bn : bn - an;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortCol, sortDir]);

  const handleSort = (col: number) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  return (
    <div>
      {/* Search */}
      {sheet.rows.length > 5 && (
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Search this table…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "6px 10px",
              fontSize: 14,
              border: "1px solid #ccc",
              borderRadius: 3,
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto", border: "1px solid #dee2e6", borderRadius: 4 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
              {sheet.headers.map((h, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(i)}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: 13,
                    color: "#333",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  {h}
                  {sortCol === i && (
                    <span style={{ marginLeft: 4, fontSize: 11 }}>
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  backgroundColor: ri % 2 === 0 ? "#fff" : "#fafafa",
                  borderBottom: "1px solid #eee",
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "6px 12px",
                      whiteSpace: "nowrap",
                      color: ci === 0 ? "#333" : "#555",
                      fontWeight: ci === 0 ? 500 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
        {sorted.length} row{sorted.length !== 1 ? "s" : ""}
        {search && ` (filtered from ${sheet.rows.length})`}
        {" · Click column headers to sort"}
      </p>
    </div>
  );
}

/* ================================================================== */
/*  Main Page                                                          */
/* ================================================================== */
export default function DataPageClient() {
  const [activeTab, setActiveTab] = useState(0);

  const activeSheet = sheets[activeTab];

  return (
    <div>
      {/* Dark header */}
      <div style={{ backgroundColor: "var(--ink)", padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="font-ui" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 8, fontWeight: 600 }}>Raw Data</p>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--cream)", marginBottom: 8 }}>Dataset Explorer</h2>
            <p className="font-body" style={{ fontSize: 15, color: "rgba(245,240,232,0.5)" }}>Complete census data from all Florida counties — browse, search, and sort the raw tables.</p>
          </div>
          <a href="/Dade_County_Miami_Census_1910_1920.xlsx" download style={{ display: "inline-block", padding: "10px 20px", fontSize: 13, fontWeight: 500, backgroundColor: "var(--copper)", color: "var(--cream)", borderRadius: 3, textDecoration: "none", whiteSpace: "nowrap" }}>
            ↓ Download Excel
          </a>
        </div>
      </div>

      {/* Content area */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 48px" }}>

      <p className="font-ui" style={{ fontSize: 14, marginBottom: 24 }}>
        <a href="/census" style={{ color: "var(--copper)" }}>← Read the analysis</a>
      </p>

      {/* Sheet Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderBottom: "2px solid #dee2e6", marginBottom: 20 }}>
        {sheets.map((sheet, i) => (
          <button
            key={sheet.id}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: activeTab === i ? "bold" : "normal",
              color: activeTab === i ? "#234190" : "#666",
              background: activeTab === i ? "#f0f4ff" : "transparent",
              border: "none",
              borderBottom: activeTab === i ? "2px solid #234190" : "2px solid transparent",
              cursor: "pointer",
              marginBottom: -2,
            }}
          >
            {sheet.name}
          </button>
        ))}
      </div>

      {/* Active Sheet */}
      <div>
        <h4 style={{ fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 }}>
          {activeSheet.title}
        </h4>
        {activeSheet.subtitle && (
          <p style={{ fontSize: 13, color: "#999", marginBottom: 4 }}>{activeSheet.subtitle}</p>
        )}
        <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
          {descriptions[activeSheet.name] || ""}
        </p>

        <DataTable sheet={activeSheet} />
      </div>
    </div></div>
  );
}
