import { PageWrapper, SectionHeading, Prose, P, KeyStat } from "@/components/prose";
import Reveal from "@/components/Reveal";

export default function ConclusionSection() {
  return (
    <PageWrapper>
      <Reveal>
        <SectionHeading>Significance</SectionHeading>
      </Reveal>

      <Reveal delay={0.1}>
        <KeyStat value="3,888 → 42,753" label="Dade County population, 1900–1920" />
      </Reveal>

      <Reveal delay={0.2}>
      <Prose>
        <P>
          Miami was not “born” as an immigrant city in 1960. The roots go much earlier, and you can still see that legacy in today’s map. Black Bahamians and African Americans were building Miami decades before the post-1959 wave that dominates popular narratives. The census data confirms what the historical record describes: explosive growth driven by migration, a labor force structured by race, and a housing market that reflected deep inequality.
        </P>

        <P>
          The patterns Henry Flagler set — luxury on one side, segregation and labor exploitation on the other — replicated themselves through the land boom, the hurricane, and the Depression. Dana Dorsey’s story alone — from first Black millionaire to the loss of Fisher Island — encapsulates how proximity to wealth offered no protection against systemic exclusion.
        </P>

        <P>
          This research offers a framework for studying other resort and tourist cities: look at who does the work and who draws the boundaries. Most of all, it shows that migrant communities — first from the Bahamas and later from elsewhere — built local institutions that kept pushing the city open, even through the hardest years.
        </P>
      </Prose>
      </Reveal>
    </PageWrapper>
  );
}
