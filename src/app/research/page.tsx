import HistorySection from "@/components/HistorySection";
import ImmigrationSection from "@/components/ImmigrationSection";
import SegregationSection from "@/components/SegregationSection";
import ConclusionSection from "@/components/ConclusionSection";

function QuoteBreak({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <section
      className="grain"
      style={{
        backgroundColor: "var(--ink)",
        padding: "10vh 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative quotation mark */}
      <div
        className="font-display"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "20rem",
          color: "rgba(245,240,232,0.04)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        “
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <p
          className="font-display"
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
            fontStyle: "italic",
            color: "var(--cream)",
            lineHeight: 1.65,
            marginBottom: 20,
          }}
        >
          “{quote}”
        </p>
        <p
          className="font-ui"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--copper)",
          }}
        >
          {attribution}
        </p>
      </div>
    </section>
  );
}

export const metadata = {
  title: "Research — Built by Labor, Divided by Design",
};

export default function ResearchPage() {
  return (
    <>
      <HistorySection />
      <QuoteBreak
        quote="Arriving in Colored Town, I alighted from the carriage in front of an unpainted, poorly ventilated rooming house… Colored Miami certainly was not the Miami of which I had heard."
        attribution="Bahamian immigrant, interviewed by Ira Reid, 1939"
      />
      <ImmigrationSection />
      <QuoteBreak
        quote="Jobs as maids, laundresses, servers, and caregivers were considered not just women's work, but nonwhite women's work."
        attribution="From Coming to Miami by Melanie Shell-Weiss"
      />
      <SegregationSection />
      <QuoteBreak
        quote="The extensive loss of shrubbery made it easier for visitors to view the private estates of celebrated people."
        attribution="Miami journalist on the 1926 hurricane"
      />
      <ConclusionSection />
    </>
  );
}
