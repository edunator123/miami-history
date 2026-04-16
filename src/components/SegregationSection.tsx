import { PageWrapper, SectionHeading, Prose, P, Blockquote, KeyStat } from "@/components/prose";
import Reveal from "@/components/Reveal";

export default function SegregationSection() {
  return (
    <PageWrapper>
      <Reveal>
        <SectionHeading>Segregation and Urban Planning</SectionHeading>
      </Reveal>

      <Reveal delay={0.1}>
      <Prose>
        <P>
          Miami’s segregation was not incidental — it was architectural. Covenants, zoning laws, and commuting rules locked racial separation into the city’s map. Black workers commuted to Miami Beach to build and maintain the resort economy, but could not live there, own property, or remain after dark. The geography of the city itself became a tool of control.
        </P>

        <P>
          In the early 1920s, the Ku Klux Klan terrorized Miami’s Black and Bahamian communities through public parades that white Miami often tolerated or celebrated. In 1920, two dynamite bombs exploded in Colored Town. The following year, the Klan publicly paraded through the city and kidnapped Reverend H.H. Higgs, a Bahamian minister who preached racial equality. No perpetrators were ever punished.
        </P>

        <KeyStat value="1920" label="Two dynamite bombs explode in Colored Town" />

        <P>
          The Klan’s attacks reinforced segregation but also pushed these communities to build their own institutions for survival. Bahamian immigrants, despite their different origins, were absorbed into America’s racial system and faced the same violence as native-born Black Americans. The color line hardened through KKK activity, union exclusion, and nativist immigration politics.
        </P>

        <Blockquote attribution="— from Coming to Miami by Melanie Shell-Weiss">
          <p>“One local journalist observed that the ‘Miami Spirit’ was enough to transform even the devastating hurricane of 1926 into a boon for local residents. After all, he concluded, the extensive loss of shrubbery made it easier for visitors to ‘view the private estates of celebrated people.’”</p>
        </Blockquote>

        <P>
          The Great Hurricane of 1926 exposed who held power. While boosters spun destruction into opportunity, Black residents were conscripted into forced cleanup labor. The crisis did not flip the system — it revealed it. The city pivoted to Prohibition routes, aviation through Pan Am, and light industry, but the fundamental structure of exclusion held firm.
        </P>
      </Prose>
      </Reveal>
    </PageWrapper>
  );
}
