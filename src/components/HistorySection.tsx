import { PageWrapper, SectionHeading, Prose, P, Blockquote, KeyStat } from "@/components/prose";
import Reveal from "@/components/Reveal";

export default function HistorySection() {
  return (
    <PageWrapper>
      <Reveal>
        <SectionHeading>Historical Background</SectionHeading>
      </Reveal>

      <Reveal delay={0.1}>
      <Prose>
        <P>
          In 1910, developers dubbed Miami the “Magic City” — a name coined to inspire wealthy investors to buy land, even though much of it was still underwater. Real estate magnates like John Collins, Carl Graham Fisher, and the Lummus brothers transformed Miami Beach from overgrown swampland into a “billion-dollar sandbar.” By 1920, Miami had become “America’s Riviera.”
        </P>

        <KeyStat value="207%" label="Dade County population growth, 1900–1910" />

        <P>
          But maintaining this image required dedicated urban planning. Where downtown Miami was first lined with pioneer wood-framed structures, by the 1920s it boasted some of the highest real estate prices in the area. Biscayne Bay was deepened. Wetlands were filled, creating pristine waterfront views. Where people moved once in the city, how they got there, and what they saw became ever more controlled — separating those who could afford to live in paradise from those whose labor made paradise possible.
        </P>

        <Blockquote attribution="— Bahamian immigrant, interviewed by Ira Reid, 1939">
          <p>“Arriving in Colored Town, I alighted from the carriage in front of an unpainted, poorly ventilated rooming house… Colored Miami certainly was not the Miami of which I had heard. It was a filthy backyard to the Magic City.”</p>
        </Blockquote>

        <P>
          Henry Flagler’s Florida East Coast Railway was the engine of this transformation. A co-founder of Standard Oil, Flagler reshaped entire towns along the coast. Julia Tuttle convinced him to extend the railroad to Miami by sending blooming orange branches after the Great Freeze of 1894–95. The Royal Palm Hotel opened, streets were paved, and utilities installed — but only for some. Colored Town received no city services, even as Black Bahamian voters had helped meet the incorporation threshold in 1896.
        </P>

        <P>
          The patterns Flagler set — luxury on one side, segregation and labor exploitation on the other — would define Miami for decades. Hotels, streets, and the port were built by Black workers who were barred from enjoying what they created. The city sold glamour, depended on immigrant labor, managed space and mobility to protect that image, and faced steady pressure from below to open access.
        </P>
      </Prose>
      </Reveal>
    </PageWrapper>
  );
}
