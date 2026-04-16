import { PageWrapper, SectionHeading, Prose, P, SubHeading } from "@/components/prose";

export default function SourcesSection() {
  return (
    <PageWrapper>
      <SectionHeading>Sources and Methods</SectionHeading>

      <Prose>
        <SubHeading>Methodology</SubHeading>

        <P>
          This independent study combines qualitative historical analysis with quantitative census data. Primary sources include the U.S. Census of 1910 and 1920, accessed through the National Historical Geographic Information System. The census data was processed into comparative tables tracking population growth, racial composition, nativity, housing tenure, and county-level rankings across Florida.
        </P>

        <P>
          The research follows a THOMAS analytical framework — examining Topic, Historiography, Organization, Methodology, Argument, and Significance — applied to key secondary sources to ensure rigorous engagement with the existing scholarship.
        </P>

        <SubHeading>Secondary Sources</SubHeading>

        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          Shell-Weiss, Melanie. <em>Coming to Miami: A Social History.</em> University Press of Florida, 2009.
        </p>
        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          Dunn, Marvin. <em>Black Miami in the Twentieth Century.</em> University Press of Florida, 1997.
        </p>
        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          Knowles, Christopher. <em>Bubble in the Sun: The Florida Boom of the 1920s.</em> Simon & Schuster, 2020.
        </p>

        <SubHeading>Primary Sources</SubHeading>

        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          National Historical Geographic Information System (NHGIS). <em>U.S. Census Data, 1910 & 1920.</em>
        </p>
        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          HistoryMiami Museum. <em>“Greater Miami and the Depression, Part II.”</em>
        </p>

        <SubHeading>Datasets</SubHeading>

        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          NHGIS Dataset 36: Population by Race, 1910.
        </p>
        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          NHGIS Dataset 37: Nativity and Parentage, 1910.
        </p>
        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          NHGIS Dataset 43: Housing Tenure, 1920.
        </p>
        <p style={{ paddingLeft: "2em", textIndent: "-2em", marginBottom: 12 }}>
          <a href="/Dade_County_Miami_Census_1910_1920.xlsx" download style={{ color: "#234190" }}>
            Download the complete dataset (Excel)
          </a>
        </p>
      </Prose>
    </PageWrapper>
  );
}
