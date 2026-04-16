import Link from "next/link";
import Hero from "@/components/Hero";
import { PageWrapper, SectionHeading, Prose, P, Blockquote, SubHeading, SectionLabel, CrossLink } from "@/components/prose";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Thesis section */}
      <Reveal>
      <section style={{ backgroundColor: "var(--warm-white)", borderTop: "1px solid var(--divider)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "200px 1fr", gap: 48 }}>
          <div>
            <SectionLabel>Central Argument</SectionLabel>
            <div style={{ width: 40, height: 2, backgroundColor: "var(--copper)", marginTop: 8 }} />
          </div>
          <div style={{ borderLeft: "3px solid var(--copper)", paddingLeft: 32 }}>
            <p className="font-display" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontStyle: "italic", lineHeight: 1.65, color: "var(--ink)" }}>
              Miami’s early growth was not simply a story of boosterism and real estate fantasy. It was <strong style={{ fontStyle: "normal", color: "var(--deep-blue)" }}>built on the backs of immigrant labor</strong>, <strong style={{ fontStyle: "normal", color: "var(--deep-blue)" }}>organized through racialized urban planning</strong>, and shaped by unequal access to land, housing, and mobility.
            </p>
          </div>
        </div>
      </section>
      </Reveal>

      {/* About */}
      <PageWrapper>
        <Reveal delay={0.1}>
        <SectionLabel>About This Project</SectionLabel>
        <SectionHeading>About</SectionHeading>
        </Reveal>

        <Reveal delay={0.2}>
        <Prose>
          <P>
            This website presents a condensed digital version of an independent research study examining the development of Miami between approximately 1900 and 1940, with a particular focus on immigration, labor systems, and urban growth. The project situates Miami’s early expansion within broader historical processes, including real estate speculation, tourism-driven development, and the structuring of racial and spatial inequality.
          </P>
          <P>
            Drawing on a combination of qualitative and quantitative sources, this study integrates historical scholarship with census data from the National Historical Geographic Information System (NHGIS) to reconstruct patterns of demographic change and social organization. Key variables examined include population growth, racial composition, nativity, housing tenure, and occupational distribution.
          </P>
          <P>
            A central argument of this project is that Miami’s identity as an immigrant city predates the mid-twentieth century narratives commonly associated with post-1959 migration. Instead, the evidence demonstrates that immigration—particularly from the Bahamas and other regions—was integral to the city’s formation from its earliest stages.
          </P>
          <P>
            By placing demographic data in dialogue with historical narrative, this study seeks to challenge simplified interpretations of Miami as a spontaneously developed or purely leisure-oriented city. Rather, it highlights the deliberate economic, social, and political processes that underpinned its development.
          </P>
        </Prose>
        </Reveal>

        {/* Key findings as stat cards */}
        <Reveal delay={0.3}>
        <div style={{ backgroundColor: "var(--parchment)", padding: "40px 32px", marginTop: 48, borderRadius: 4 }}>
          <SectionLabel>Key Findings</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, marginTop: 20 }}>
            {[
              { value: "258%", unit: "growth", desc: "Dade County population, 1910–1920" },
              { value: "14.6%", unit: "immigrant ties", desc: "Share of population by 1910" },
              { value: "35.1%", unit: "Black population", desc: "Largely Bahamian immigrants, 1910" },
              { value: "55.3%", unit: "homes rented", desc: "A speculative boomtown by 1920" },
            ].map((s) => (
              <div key={s.value} style={{ textAlign: "center", padding: "16px 8px" }}>
                <p className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--deep-blue)", marginBottom: 4 }}>{s.value}</p>
                <p className="font-ui" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--copper)", fontWeight: 600, marginBottom: 8 }}>{s.unit}</p>
                <p className="font-body" style={{ fontSize: 13, color: "var(--faded)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        <CrossLink href="/research">Begin with the Research</CrossLink>
      </PageWrapper>
    </>
  );
}
