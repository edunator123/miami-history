"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  populationGrowth,
  racialComposition,
  housingTenure1920,
  whiteNativity1910,
  sexRatio1910,
  dadeVsFlorida,
  topCounties1920,
} from "@/data/census";
import { COPPER, TEAL, GOLD, MUTED } from "@/lib/colors";

/* ------------------------------------------------------------------ */
/*  Warm-palette custom tooltip                                        */
/* ------------------------------------------------------------------ */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #dee2e6", borderRadius: 4, padding: "8px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      {label && (
        <p className="mb-1 text-xs font-semibold tracking-wide text-text-muted">
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm text-text-dark" style={{ color: entry.color }}>
          {entry.name}:{" "}
          <span className="font-semibold">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart wrapper                                                      */
/* ------------------------------------------------------------------ */
function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: "16px auto 40px", padding: 16, border: "1px solid #dee2e6", borderRadius: 4, maxWidth: 600 }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const GRID_STROKE = "rgba(42, 37, 32, 0.08)";
const AXIS_FILL = "#6b635a";

const HOUSING_COLORS: Record<string, string> = {
  Rented: COPPER,
  Owned: TEAL,
  Unknown: MUTED,
};

/* ================================================================== */
/*  Main Section                                                       */
/* ================================================================== */
export default function CensusDataSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const racialData = racialComposition.map((d) => ({
    year: d.year,
    White: d.white,
    "Non-White":
      d.year === "1910"
        ? ((d as Record<string, unknown>).negro as number) +
          (((d as Record<string, unknown>).other as number) || 0)
        : ((d as Record<string, unknown>).nonWhite as number),
    whitePercent: d.whitePercent,
    nonWhitePercent: d.nonWhitePercent,
  }));

  const nativityData = whiteNativity1910.map((d) => ({
    ...d,
    label: d.category.replace(/\n/g, " "),
  }));

  const d1910 = dadeVsFlorida[0];
  const d1920 = dadeVsFlorida[1];

  return (
    <div style={{ padding: "48px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        <p className="font-ui" style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: "var(--copper)", marginBottom: 12 }}>Census Findings</p>
        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, marginBottom: 24, color: "var(--ink)", lineHeight: 1.15 }}>The Numbers Behind the Narrative</h2>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", marginBottom: 24 }}>
          Census data from 1910 and 1920 reveals the quantitative reality behind
          Miami’s explosive growth — a story of migration,
          speculation, and inequality measured in population counts, housing
          records, and demographic shifts.
        </p>

        {/* ============================================================ */}
        {/*  Finding 1 — Population Growth                                */}
        {/* ============================================================ */}
        <p className="font-ui" style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 6, fontWeight: 600 }}>Finding 01 of 07</p>
        <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333" }}>
          Explosive Growth
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", marginBottom: 16 }}>
          In 1900, Dade County recorded just 3,888 residents. By 1910, that
          number had tripled to 11,933 — a 207% increase driven by
          Flagler’s railroad and the land rush. By 1920, the population
          had exploded to 42,753, a staggering 258% growth in a single decade.
          No other major Florida county came close.
        </p>

        {mounted && (
          <ChartCard>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={populationGrowth}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="copperGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COPPER} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={COPPER} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: AXIS_FILL, fontSize: 13 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: AXIS_FILL, fontSize: 12 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="population"
                  name="Population"
                  stroke={COPPER}
                  strokeWidth={2.5}
                  fill="url(#copperGrad)"
                  dot={{ r: 5, fill: COPPER, stroke: "#faf7f0", strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        <div className="mb-20" />

        {/* ============================================================ */}
        {/*  Finding 2 — Racial Composition                               */}
        {/* ============================================================ */}
        <p className="font-ui" style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 6, fontWeight: 600 }}>Finding 02 of 07</p>
        <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333" }}>
          A City Built on Black Labor
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", marginBottom: 16 }}>
          In 1910, over 35% of Dade County’s population was
          Black — largely Bahamian immigrants and African Americans
          who built the city’s infrastructure. By 1920, while the total
          population had nearly quadrupled, the non-white share had actually
          decreased to 29.9%, as white migration outpaced Black population
          growth. The demographic shift masked the foundational role of Black
          labor.
        </p>

        {mounted && (
          <ChartCard>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={racialData}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: AXIS_FILL, fontSize: 13 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: AXIS_FILL, fontSize: 12 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="White" name="White" fill={MUTED} fillOpacity={0.6} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Non-White" name="Non-White" fill={COPPER} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex justify-center gap-6 text-xs text-text-muted">
              {racialData.map((d) => (
                <div key={d.year} className="text-center">
                  <span className="font-semibold text-text-dark">{d.year}</span>
                  {" — "}
                  <span style={{ color: MUTED }}>{d.whitePercent}% White</span>
                  {" / "}
                  <span style={{ color: COPPER }}>{d.nonWhitePercent}% Non-White</span>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        <div className="mb-20" />

        {/* ============================================================ */}
        {/*  Finding 3 — Sex Ratio (labor migration signature)            */}
        {/* ============================================================ */}
        <p className="font-ui" style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 6, fontWeight: 600 }}>Finding 03 of 07</p>
        <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333" }}>
          A Labor Migration Signature
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", marginBottom: 16 }}>
          The 1910 census recorded a male-to-female ratio of 1.21 overall
          — a hallmark of labor-driven migration. Among the white
          population, men outnumbered women 4,237 to 3,497. Among Black
          residents, the ratio was even more skewed: 2,285 men to 1,909 women.
          Young men came for construction and railroad work; families followed
          later, if at all.
        </p>

        {mounted && (
          <ChartCard>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={sexRatio1910}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="category"
                  tick={{ fill: AXIS_FILL, fontSize: 13 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: AXIS_FILL, fontSize: 12 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                  }
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="male" name="Male" fill={TEAL} radius={[4, 4, 0, 0]} />
                <Bar dataKey="female" name="Female" fill={COPPER} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex justify-center gap-6 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TEAL }} />
                Male
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COPPER }} />
                Female
              </div>
            </div>
          </ChartCard>
        )}

        <div className="mb-20" />

        {/* ============================================================ */}
        {/*  Finding 4 — White Nativity                                   */}
        {/* ============================================================ */}
        <p className="font-ui" style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 6, fontWeight: 600 }}>Finding 04 of 07</p>
        <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333" }}>
          An Immigrant Character Before 1959
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", marginBottom: 16 }}>
          Even among the white population in 1910, nearly a quarter had
          immigrant ties. Foreign-born whites made up 9.4% of all whites, and
          another 13.2% were second-generation with at least one foreign-born
          parent. The total immigration-related share of Dade County’s
          population stood at 14.6% — remarkably high for a
          frontier county. Miami was an immigrant city long before the
          post-1959 narrative that dominates popular memory.
        </p>

        {mounted && (
          <ChartCard>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={nativityData}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: AXIS_FILL, fontSize: 12 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={140}
                  tick={{ fill: AXIS_FILL, fontSize: 11 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Population" fill={GOLD} radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        <div className="mb-20" />

        {/* ============================================================ */}
        {/*  Finding 5 — Housing Tenure                                   */}
        {/* ============================================================ */}
        <p className="font-ui" style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 6, fontWeight: 600 }}>Finding 05 of 07</p>
        <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333" }}>
          Renters in a Speculative City
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", marginBottom: 16 }}>
          The 1920 census reveals a city of renters. Over 55% of homes were
          rented, and among those owned, only 38.6% were owned free and clear.
          This pattern reflects Miami’s character as a transient
          boomtown — a place where speculation drove development and
          most residents, especially workers of color, had little stake in the
          land they helped build.
        </p>

        {mounted && (
          <ChartCard>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={housingTenure1920}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  stroke="none"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  label={(props: any) => {
                    const cx = props.cx as number;
                    const cy = props.cy as number;
                    const midAngle = props.midAngle as number;
                    const or = props.outerRadius as number;
                    const name = props.name as string;
                    const RADIAN = Math.PI / 180;
                    const radius = or + 20;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    const entry = housingTenure1920.find((d) => d.category === name);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#6b635a"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {name} {entry?.percent ?? ""}%
                      </text>
                    );
                  }}
                >
                  {housingTenure1920.map((entry) => (
                    <Cell key={entry.category} fill={HOUSING_COLORS[entry.category]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <text
                  x="50%"
                  y="47%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fill: "#2a2520", fontSize: 22, fontWeight: 700 }}
                >
                  11,014
                </text>
                <text
                  x="50%"
                  y="57%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fill: "#6b635a", fontSize: 11 }}
                >
                  total homes
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-5">
              {housingTenure1920.map((entry) => (
                <div
                  key={entry.category}
                  className="flex items-center gap-1.5 text-xs text-text-muted"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: HOUSING_COLORS[entry.category] }}
                  />
                  {entry.category} ({entry.percent}%)
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        <div className="mb-20" />

        {/* ============================================================ */}
        {/*  Finding 6 — Dade vs Florida (callout)                        */}
        {/* ============================================================ */}
        <p className="font-ui" style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 6, fontWeight: 600 }}>Finding 06 of 07</p>
        <h4 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333" }}>
          Dade County’s Share of Florida
        </h4>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", marginBottom: 16 }}>
          In 1910, Dade County represented just {d1910.dadePercent}% of Florida’s total population ({d1910.dadePop.toLocaleString()} of {d1910.floridaPop.toLocaleString()}). By 1920, that share had nearly tripled to {d1920.dadePercent}% ({d1920.dadePop.toLocaleString()} of {d1920.floridaPop.toLocaleString()}).
        </p>

        <div className="mb-20" />

        {/* ============================================================ */}
        {/*  Finding 7 — County Rankings                                  */}
        {/* ============================================================ */}
        <p className="font-ui" style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--copper)", marginBottom: 6, fontWeight: 600 }}>Finding 07 of 07</p>
        <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333" }}>
          Florida’s Fastest-Growing County
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", marginBottom: 16 }}>
          By 1920, Dade ranked fourth in Florida by total population —
          but its growth rate of 258% dwarfed every other major county. Only
          Palm Beach, another frontier county carved from the same boom,
          approached comparable growth. The established urban centers of Duval
          (Jacksonville) and Hillsborough (Tampa) grew modestly by comparison.
        </p>

        {mounted && (
          <ChartCard>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={topCounties1920}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: AXIS_FILL, fontSize: 12 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <YAxis
                  type="category"
                  dataKey="county"
                  width={110}
                  tick={{ fill: AXIS_FILL, fontSize: 11 }}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="pop" name="1920 Population" radius={[0, 4, 4, 0]} barSize={22}>
                  {topCounties1920.map((entry) => (
                    <Cell
                      key={entry.county}
                      fill={entry.county === "Dade (Miami)" ? COPPER : MUTED}
                      fillOpacity={entry.county === "Dade (Miami)" ? 1 : 0.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-3 text-center text-xs text-text-muted">
              Dade’s 258% growth rate highlighted in copper. Top 10 Florida
              counties by 1920 population.
            </p>
          </ChartCard>
        )}

        {/* ---- Data Summary Table ---- */}
        <div className="mt-20 mb-4">
          <h4 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333", marginTop: 32 }}>
            Dade County at a Glance
          </h4>
          <div className="overflow-x-auto rounded-lg border border-border-light">
            <table className="w-full text-left font-body text-sm">
              <thead>
                <tr className="border-b border-border-light bg-bg-gray">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Metric
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    1910
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    1920
                  </th>
                </tr>
              </thead>
              <tbody className="text-text-dark">
                <tr className="border-b border-border-light">
                  <td className="px-5 py-3 text-text-muted">Total Population</td>
                  <td className="px-5 py-3 font-semibold">11,933</td>
                  <td className="px-5 py-3 font-semibold">42,753</td>
                </tr>
                <tr className="border-b border-border-light bg-bg-gray">
                  <td className="px-5 py-3 text-text-muted">White Population</td>
                  <td className="px-5 py-3">7,734 (64.8%)</td>
                  <td className="px-5 py-3">29,983 (70.1%)</td>
                </tr>
                <tr className="border-b border-border-light">
                  <td className="px-5 py-3 text-text-muted">Non-White Population</td>
                  <td className="px-5 py-3">4,199 (35.2%)</td>
                  <td className="px-5 py-3">12,770 (29.9%)</td>
                </tr>
                <tr className="border-b border-border-light bg-bg-gray">
                  <td className="px-5 py-3 text-text-muted">Foreign-Born White</td>
                  <td className="px-5 py-3">724 (9.4% of whites)</td>
                  <td className="px-5 py-3 text-text-muted">—</td>
                </tr>
                <tr className="border-b border-border-light">
                  <td className="px-5 py-3 text-text-muted">Immigration-Related Share</td>
                  <td className="px-5 py-3">14.6%</td>
                  <td className="px-5 py-3 text-text-muted">—</td>
                </tr>
                <tr className="border-b border-border-light bg-bg-gray">
                  <td className="px-5 py-3 text-text-muted">Male / Female Ratio</td>
                  <td className="px-5 py-3">1.21</td>
                  <td className="px-5 py-3 text-text-muted">—</td>
                </tr>
                <tr className="border-b border-border-light">
                  <td className="px-5 py-3 text-text-muted">Total Homes</td>
                  <td className="px-5 py-3 text-text-muted">—</td>
                  <td className="px-5 py-3">11,014</td>
                </tr>
                <tr className="border-b border-border-light bg-bg-gray">
                  <td className="px-5 py-3 text-text-muted">Homes Rented</td>
                  <td className="px-5 py-3 text-text-muted">—</td>
                  <td className="px-5 py-3">6,095 (55.3%)</td>
                </tr>
                <tr className="border-b border-border-light">
                  <td className="px-5 py-3 text-text-muted">Homes Owned</td>
                  <td className="px-5 py-3 text-text-muted">—</td>
                  <td className="px-5 py-3">4,388 (39.8%)</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-text-muted">Dade % of Florida</td>
                  <td className="px-5 py-3">1.59%</td>
                  <td className="px-5 py-3">4.41%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ---- Source ---- */}
        <p className="mt-12 text-center text-xs text-text-muted">
          Source: NHGIS Datasets 36, 37, 43 — U.S. Census Bureau,
          1910 and 1920. County-level data; no sub-county tract breakdowns
          available.
        </p>

        <p style={{ marginTop: 32, fontSize: 15 }}>
          <a href="/data" style={{ color: "#234190" }}>Explore the full dataset →</a>
        </p>
      </div>
    </div>
  );
}
