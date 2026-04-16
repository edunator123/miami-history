import { PageWrapper, SectionHeading, Prose, P, SubHeading, KeyStat } from "@/components/prose";
import Reveal from "@/components/Reveal";

export default function ImmigrationSection() {
  return (
    <PageWrapper>
      <Reveal>
        <SectionHeading>Immigration and Labor</SectionHeading>
      </Reveal>

      <Reveal delay={0.1}>
      <Prose>
        <P>
          Black Bahamians arrived in South Florida seeking economic opportunity, drawn by the railroad and construction boom. They found work but also encountered American-style segregation for the first time. As one immigrant recalled, it was “the first time I had heard that opprobrious epithet employed.” Despite the hostile environment, Bahamian immigrants silently endured segregation in pursuit of economic gain.
        </P>

        <P>
          Work was divided along racial lines, and gender mattered too. Jobs as maids, laundresses, servers, and caregivers were considered not just women’s work, but nonwhite women’s work. Jobs for men of color as laborers, janitors, and cooks proliferated — most were low-paying with little room for advancement.
        </P>

        <SubHeading>Dana A. Dorsey</SubHeading>

        <P>
          Miami’s first Black millionaire, Dana A. Dorsey became wealthy through real estate and used his fortune to serve the Black community. He founded the Negro Savings Bank in 1916 so Black residents would “have a place of their own to bank.” He built the first Black-owned hotel in Miami and in 1918 purchased 21 acres of Fisher Island to create oceanfront access for Black residents, who were forbidden from public beaches.
        </P>

        <P>
          When the 1925 land boom skyrocketed property values, Dorsey was forced to sell to Carl Fisher’s company — and Black Miamians lost ocean access for another twenty years. During the Depression, Dorsey lent money to William M. Burdine to keep his department store open — the same store later acquired by Macy’s. Despite his wealth, Dorsey’s story encapsulates how proximity to capital offered no protection against systemic exclusion.
        </P>

        <KeyStat value="1916" label="Year the Negro Savings Bank was founded" />

        <SubHeading>Black Institutions</SubHeading>

        <P>
          Despite exclusion, Black communities built their own institutions — churches, businesses, hospitals, and theaters. The Colored Board of Trade, established around 1900, became the first effective Black organization other than the church. Black entrepreneurs established businesses in Lemon City and Colored Town, though they were forbidden from serving white customers while white merchants operated freely in Black neighborhoods.
        </P>
      </Prose>
      </Reveal>
    </PageWrapper>
  );
}
