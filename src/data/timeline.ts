export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: "founding" | "labor" | "segregation" | "development" | "crisis";
}

export const timelineEvents: TimelineEvent[] = [
  {
    year: "1836",
    title: "Dade County Incorporated",
    description: "Named after Brevet Major Francis Langhorne Dade, killed in a Seminole ambush. The county would encompass the vast, sparsely populated southern tip of Florida for decades.",
    category: "founding",
  },
  {
    year: "1880s",
    title: "Flagler's Railroad Begins",
    description: "Henry Flagler, co-founder of Standard Oil, begins building his Florida East Coast Railway and hotel empire, reshaping entire towns along the coast. Black workers are pushed into segregated settlements.",
    category: "development",
  },
  {
    year: "1896",
    title: "City of Miami Incorporated",
    description: "Julia Tuttle convinced Flagler to extend his railroad to Miami by sending him blooming orange branches after the Great Freeze. Black Bahamian voters helped meet the incorporation threshold. The Royal Palm Hotel opens, but Colored Town receives no city services.",
    category: "founding",
  },
  {
    year: "1900",
    title: "Census: Population 3,888",
    description: "Dade County records its first substantial census count. The population is small but the foundations of a booming frontier economy are being laid through railroad expansion and land speculation.",
    category: "development",
  },
  {
    year: "1910",
    title: "Census: Population 11,933",
    description: "A 207% increase in one decade. Miami is dubbed 'The Magic City.' Over 35% of the population is Black, largely Bahamian immigrants and African Americans who built the city's infrastructure. Foreign-born whites make up 9.4% of the white population.",
    category: "development",
  },
  {
    year: "1910s",
    title: "Bahamian Labor Migration Peaks",
    description: "Black Bahamians arrive seeking economic opportunity but encounter American segregation for the first time. They find lodging in Colored Town's 'unpainted, poorly ventilated rooming houses' — 'a filthy backyard to the Magic City.'",
    category: "labor",
  },
  {
    year: "1916",
    title: "Dana Dorsey Founds Negro Savings Bank",
    description: "Miami's first Black millionaire, Dana A. Dorsey, establishes the Negro Savings Bank so Black residents would have 'a place of their own to bank.' He also builds the first Black-owned hotel in Miami.",
    category: "labor",
  },
  {
    year: "1918",
    title: "Dorsey Purchases Fisher Island",
    description: "Dorsey buys 21 acres near Miami Beach to create oceanfront access for Black residents, who were forbidden from public beaches. Rising land values during the 1925 boom force him to sell to Carl Fisher's company.",
    category: "segregation",
  },
  {
    year: "1920",
    title: "Census: Population 42,753",
    description: "A staggering 258% growth in a single decade. Dade County's share of Florida's population nearly triples from 1.6% to 4.4%. Over 55% of homes are rented — a signature of transient labor and speculative growth.",
    category: "development",
  },
  {
    year: "1920",
    title: "KKK Bombs Colored Town",
    description: "Two dynamite bombs explode in Colored Town. The following year, the Klan parades publicly through Miami and kidnaps Reverend H.H. Higgs, a Bahamian minister who preached racial equality. No perpetrators are punished.",
    category: "segregation",
  },
  {
    year: "1920s",
    title: "The Land Boom",
    description: "Real estate speculation reaches a fever pitch. Property values skyrocket. The color line hardens through KKK activity, union exclusion, nativist immigration politics, and restrictive covenants. Miami Beach is staged as a resort built on commuter Black labor.",
    category: "development",
  },
  {
    year: "1926",
    title: "The Great Miami Hurricane",
    description: "A devastating hurricane destroys much of the city. It exposes who holds power: Black residents are conscripted into forced cleanup labor. The city pivots to Prohibition routes, aviation (Pan Am), and light industry.",
    category: "crisis",
  },
  {
    year: "1930s",
    title: "Depression and Reinvention",
    description: "Despite the Great Depression, Miami experiences unusual construction growth. Hundreds of Art Deco hotels rise on South Beach. Jewish and Latin American newcomers reshape ownership and commerce, but the color line holds firm.",
    category: "crisis",
  },
];
