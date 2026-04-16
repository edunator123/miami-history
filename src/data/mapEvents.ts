export interface MapEvent {
  year: number;
  yearLabel: string;
  title: string;
  description: string;
  category: "founding" | "labor" | "segregation" | "development" | "crisis" | "institution";
  lat: number;
  lng: number;
  location: string;
}

export const mapEvents: MapEvent[] = [
  // ── Pre-incorporation & Seminole era ──────────────────────────────

  {
    year: 1836,
    yearLabel: "1836",
    title: "Fort Dallas Established",
    description:
      "The U.S. Army establishes Fort Dallas on Richard Fitzpatrick's plantation on the north bank of the Miami River during the Second Seminole War. The fort supports Navy patrols on Biscayne Bay to prevent trade between Seminoles and Cuban merchants. It will later serve as a trading post, post office, and temporary Dade County Courthouse.",
    category: "founding",
    lat: 25.7653,
    lng: -80.1897,
    location: "Fort Dallas — north bank of Miami River, near present SE 1st Ave & 3rd St",
  },

  {
    year: 1836,
    yearLabel: "1836",
    title: "Dade County Created",
    description:
      "Named after Brevet Major Francis Langhorne Dade, killed in an ambush that helped trigger the Second Seminole War. The county encompasses the vast, sparsely populated southern tip of Florida for decades.",
    category: "founding",
    lat: 25.7617,
    lng: -80.1918,
    location: "Dade County",
  },

  // ── Early settlements (1870s-1880s) ───────────────────────────────

  {
    year: 1873,
    yearLabel: "1870s",
    title: "Lemon City Settlement Founded",
    description:
      "Homesteaders establish the oldest continuously settled community in Miami-Dade County among abundant lemon groves. Entrepreneur Eugene C. Harrington purchases an 11-acre strip from homesteader John Saunders in 1889 and plats the town. A main street offers lodging, retail, and fellowship, with a large Bahamian population.",
    category: "founding",
    lat: 25.8275,
    lng: -80.1865,
    location: "Lemon City — near present NE 61st St & NE 2nd Ave (Little Haiti)",
  },

  {
    year: 1882,
    yearLabel: "1882",
    title: "Peacock Inn Opens in Coconut Grove",
    description:
      "Charles and Isabella Peacock open the Bay View Inn (later the Peacock Inn), the first hotel on the mainland of Southeast Florida, in what is now Peacock Park. It becomes the social center of the Coconut Grove settlement. Bahamian laborers who work at the inn establish the first Black community in South Florida along nearby Charles Avenue.",
    category: "founding",
    lat: 25.7270,
    lng: -80.2370,
    location: "Peacock Park, Coconut Grove — 2820 McFarlane Rd",
  },

  {
    year: 1884,
    yearLabel: "1880s",
    title: "Black Bahamian Settlement on Charles Avenue",
    description:
      "Bahamian workers at the Peacock Inn establish their own community along Evangelist Street (now Charles Avenue) in Coconut Grove, predating Miami's incorporation by over a decade. Mariah Brown purchases a plot for $50 from landowner Joseph Frow and builds a home within walking distance of the inn. By 1900, the community claims over one hundred residents.",
    category: "labor",
    lat: 25.7262,
    lng: -80.2420,
    location: "Charles Avenue, West Coconut Grove",
  },

  // ── Julia Tuttle and the founding of Miami ────────────────────────

  {
    year: 1891,
    yearLabel: "1891",
    title: "Julia Tuttle Acquires Fort Dallas",
    description:
      "Julia Tuttle purchases the 640-acre James Egan land grant on the north side of the Miami River, including the old Fort Dallas stone buildings, using her parents' estate. She repairs and converts the former officers' quarters into a grand home overlooking the river and Biscayne Bay, becoming the sole woman to found a major American city.",
    category: "founding",
    lat: 25.7660,
    lng: -80.1895,
    location: "Fort Dallas Park — north bank of Miami River, near SE 1st Ave & 3rd St",
  },

  {
    year: 1895,
    yearLabel: "1895",
    title: "The Great Freeze and Tuttle's Gambit",
    description:
      "The catastrophic freezes of 1894-95 devastate the citrus groves of central and northern Florida, wiping out fortunes. Julia Tuttle writes or wires Henry Flagler that the shores of Biscayne Bay remain untouched by the cold, and she arranges for fresh orange blossoms and citrus to be shipped north as proof. In exchange for free land for a hotel and rail station, Flagler agrees to extend his railroad to Miami.",
    category: "founding",
    lat: 25.7660,
    lng: -80.1900,
    location: "Julia Tuttle's property — north bank of Miami River",
  },

  // ── Railroad and incorporation ────────────────────────────────────

  {
    year: 1896,
    yearLabel: "1896",
    title: "FEC Railway Reaches Miami",
    description:
      "On April 15, 1896, the first Florida East Coast Railway train arrives at a wood-framed station at NW 1st Avenue and 3rd Street. John Sewell and his crew of Black laborers had stripped a square mile of jungle and hammock to make way for the railroad terminus and the Royal Palm Hotel. The station stands at what will become the nerve center of a booming city.",
    category: "development",
    lat: 25.7762,
    lng: -80.1961,
    location: "FEC Railway Station — 200 NW 1st Avenue, Downtown Miami",
  },

  {
    year: 1896,
    yearLabel: "1896",
    title: "Black Voters Help Incorporate Miami",
    description:
      "On July 28, 1896, 368 men gather to vote on incorporating the City of Miami; 344 votes are cast, of which 162 come from Black men, mostly Bahamian laborers recruited by Flagler's company. They comprise 44% of the electorate — essential for meeting the incorporation threshold — yet Black residents are immediately confined to 'Colored Town' by restrictive land deeds and denied meaningful political participation for over sixty years.",
    category: "founding",
    lat: 25.7750,
    lng: -80.1930,
    location: "Downtown Miami — incorporation meeting site",
  },

  {
    year: 1897,
    yearLabel: "1897",
    title: "Royal Palm Hotel Opens",
    description:
      "Henry Flagler's grand Royal Palm Hotel opens on January 16, 1897, on the north bank of the Miami River overlooking Biscayne Bay. The six-story luxury resort offers Miami's first electric lights, a swimming pool, and elevators, establishing the city as a winter tourist destination for wealthy northerners. It is built by Black labor on land donated by Julia Tuttle.",
    category: "development",
    lat: 25.7651,
    lng: -80.1900,
    location: "Royal Palm Hotel — north bank of Miami River, near present SE 2nd St",
  },

  // ── Colored Town / Overtown institutions ──────────────────────────

  {
    year: 1896,
    yearLabel: "1896",
    title: "Colored Town Established",
    description:
      "Black railroad workers are confined by restrictive deed covenants to a segregated district west of the FEC tracks, initially living in tents near work sites. Lots sell for $50 apiece (50x150 feet) and shacks rent for $1 per month. 'Colored Town' — bounded roughly by NW 20th St to the north, NW 5th St to the south — receives no city water, sewerage, or paved streets while the white city is built beside it.",
    category: "segregation",
    lat: 25.7835,
    lng: -80.2042,
    location: "Colored Town (Overtown) — NW 2nd Ave corridor",
  },

  {
    year: 1896,
    yearLabel: "1896",
    title: "Mt. Zion Baptist Church Founded",
    description:
      "Founded on September 18, 1896, Mt. Zion Baptist Church is among the first institutions built by Miami's Black community. D.A. Dorsey serves as one of its founders. The present Mediterranean Revival building at 301 NW 9th Street begins construction in 1928 and takes thirteen years to complete. It becomes one of the first meeting places for Black Boy and Girl Scout troops.",
    category: "institution",
    lat: 25.7818,
    lng: -80.1991,
    location: "Mt. Zion Baptist Church — 301 NW 9th St, Overtown",
  },

  {
    year: 1900,
    yearLabel: "1900",
    title: "Census: Population 3,888",
    description:
      "Dade County records its first substantial census count. A booming frontier economy is being laid through railroad expansion and land speculation.",
    category: "development",
    lat: 25.7743,
    lng: -80.1937,
    location: "Downtown Miami",
  },

  {
    year: 1904,
    yearLabel: "1904",
    title: "Colored Board of Trade Established",
    description:
      "Miami's Colored Board of Trade is organized as a clearinghouse for commercial and civic betterment of the Black community. Allen Stokes, a South Carolina-born grocery store owner, serves as president. The 1904 city directory already lists Black-owned businesses including general stores, a medical doctor, 26 laundresses, and several hundred laborers — an entire parallel economy forged within the color line.",
    category: "institution",
    lat: 25.7828,
    lng: -80.2000,
    location: "Colored Town (Overtown) — NW 2nd Ave commercial district",
  },

  {
    year: 1910,
    yearLabel: "1910",
    title: "Census: Population 11,933 — 'The Magic City'",
    description:
      "A 207% increase in one decade. Miami is dubbed 'The Magic City.' Over 35% of the population is Black, largely Bahamian immigrants. Foreign-born whites make up 9.4%.",
    category: "development",
    lat: 25.7753,
    lng: -80.1900,
    location: "Miami city center",
  },

  // ── Miami Beach development ───────────────────────────────────────

  {
    year: 1912,
    yearLabel: "1912",
    title: "Lummus Brothers Plat Miami Beach",
    description:
      "In July 1912, brothers John Newton Lummus and James Edward Lummus file the first official plat to develop land on the barrier island across Biscayne Bay. They sell their oceanfront property between 6th and 14th Streets to the city, creating what is still known as Lummus Park. The sandy stretch will become the iconic public beach of South Beach.",
    category: "development",
    lat: 25.7780,
    lng: -80.1300,
    location: "Lummus Park — Ocean Drive between 5th & 15th Streets, South Beach",
  },

  {
    year: 1912,
    yearLabel: "1910s",
    title: "Bahamian Labor Migration Peaks",
    description:
      "Black Bahamians arrive seeking opportunity but encounter American segregation. They find lodging in Colored Town's 'unpainted, poorly ventilated rooming houses.'",
    category: "labor",
    lat: 25.7835,
    lng: -80.2042,
    location: "Colored Town (Overtown)",
  },

  {
    year: 1913,
    yearLabel: "1913",
    title: "Collins Bridge Opens",
    description:
      "On June 12, 1913, the Collins Bridge — the longest wooden vehicular bridge in the world at 2.5 miles — opens across Biscayne Bay, connecting Miami to the barrier island. John S. Collins, a New Jersey farmer turned developer, builds it after Carl Fisher loans him $50,000 to complete construction. In exchange, Fisher receives 200 acres on Miami Beach.",
    category: "development",
    lat: 25.7880,
    lng: -80.1560,
    location: "Collins Bridge — Biscayne Bay crossing near present Venetian Causeway",
  },

  {
    year: 1913,
    yearLabel: "1913",
    title: "D.A. Dorsey House Built",
    description:
      "Dana Albert Dorsey, Miami's first Black millionaire, builds a white frame vernacular home at 250 NW 9th Street for his wife. Dorsey arrives in Miami as a carpenter and amasses a real estate fortune despite the color line, owning property throughout the region. His home is now on the National Register of Historic Places, owned by the Black Archives Foundation.",
    category: "institution",
    lat: 25.7808,
    lng: -80.1985,
    location: "D.A. Dorsey House — 250 NW 9th St, Overtown",
  },

  {
    year: 1914,
    yearLabel: "1914",
    title: "Lyric Theater Opens on 'Little Broadway'",
    description:
      "Georgia native Geder Walker builds the Lyric Theater at 819 NW 2nd Avenue in the heart of Overtown. It becomes the anchor of 'Little Broadway,' a vibrant strip of Black-owned theaters, hotels, and nightclubs that flourishes for nearly fifty years. Over 150 performers eventually grace its stage, including Ella Fitzgerald, Count Basie, B.B. King, and Aretha Franklin.",
    category: "institution",
    lat: 25.7840,
    lng: -80.1972,
    location: "Lyric Theater — 819 NW 2nd Ave, Overtown",
  },

  {
    year: 1916,
    yearLabel: "1916",
    title: "Dorsey Founds Industrial Bank for Negroes",
    description:
      "Miami's first Black millionaire D.A. Dorsey establishes the Industrial Bank for Negroes so Black residents would 'have a place of their own to bank.' He also builds the first Black-owned hotel. In an era when mainstream banks refuse service to Black customers, Dorsey's bank channels capital into Colored Town's growing business district.",
    category: "labor",
    lat: 25.7845,
    lng: -80.2010,
    location: "Colored Town (Overtown) — NW 2nd Ave",
  },

  {
    year: 1918,
    yearLabel: "1918",
    title: "Dorsey Purchases Fisher Island for Black Beach",
    description:
      "D.A. Dorsey purchases 21 acres of the barrier island now known as Fisher Island to create oceanfront access for Black residents who are forbidden from using public beaches. Rising land values during the 1925 boom force him to sell the property to the Alton Beach Company in 1919. Today Fisher Island is one of the wealthiest ZIP codes in America.",
    category: "segregation",
    lat: 25.7565,
    lng: -80.1478,
    location: "Fisher Island",
  },

  // ── 1920s boom era ────────────────────────────────────────────────

  {
    year: 1920,
    yearLabel: "1920",
    title: "Census: Population 42,753",
    description:
      "A staggering 258% population growth in one decade. Dade County's share of Florida's population nearly triples. Over 55% of homes are rented — a signature of transient labor and speculative real estate growth.",
    category: "development",
    lat: 25.7680,
    lng: -80.1960,
    location: "Miami — citywide",
  },

  {
    year: 1920,
    yearLabel: "1920",
    title: "KKK Bombs Colored Town",
    description:
      "Two dynamite bombs explode in Colored Town. The following year, the Klan parades through Miami and kidnaps Reverend H.H. Higgs, a Bahamian minister. No perpetrators are punished. Racial terror is wielded to enforce the boundaries of segregation during the land boom.",
    category: "segregation",
    lat: 25.7825,
    lng: -80.2055,
    location: "Colored Town (Overtown)",
  },

  {
    year: 1921,
    yearLabel: "1921",
    title: "Carl Fisher's Flamingo Hotel Opens",
    description:
      "On New Year's Eve 1920, Carl Fisher opens the 200-room, 11-story Flamingo Hotel on 15th Street and Bay Road, two blocks south of Lincoln Road. Designed by Indianapolis firm Rubush & Hunter, it is the crown jewel of Fisher's resort empire that transforms Miami Beach from mangrove swamp to playground of the wealthy. Fisher builds it with deed restrictions excluding Black and Jewish guests.",
    category: "development",
    lat: 25.7895,
    lng: -80.1425,
    location: "Flamingo Hotel — 15th St & Bay Rd, Miami Beach",
  },

  {
    year: 1922,
    yearLabel: "1922",
    title: "Glenn Curtiss and James Bright Found Hialeah",
    description:
      "Aviation pioneer Glenn Curtiss and Missouri cattleman James H. Bright establish the Curtiss-Bright Ranch Company on the 'high prairie' west of Miami. Bright builds a house at the corner of Hialeah Drive and East 2nd Avenue; Curtiss builds an airfield that becomes the Deer Park section. They donate land for churches, a school, city hall, and a race track, creating a new city from scratch.",
    category: "development",
    lat: 25.8576,
    lng: -80.2781,
    location: "Hialeah — Hialeah Drive & E 2nd Ave",
  },

  {
    year: 1923,
    yearLabel: "1920s",
    title: "The Land Boom and the Color Line",
    description:
      "Real estate speculation reaches a fever pitch. Miami's city commission zones most of residential 'Colored Town' as 'industrial,' restricting new construction and hardening the color line. The KKK is active, unions exclude Black workers, and restrictive covenants bar property sales to African Americans across the growing city.",
    category: "segregation",
    lat: 25.7835,
    lng: -80.2050,
    location: "Overtown — zoned industrial by the city",
  },

  {
    year: 1924,
    yearLabel: "1924",
    title: "Venetian Pool Opens in Coral Gables",
    description:
      "George Merrick transforms a coral rock quarry into the Venetian Pool, designed by artist Denman Fink and architect Phineas Paist. It is the centerpiece of Merrick's 'City Beautiful' — Coral Gables, one of America's first planned communities, with Mediterranean Revival architecture, broad boulevards, and plazas. Merrick spends $5 million on advertising alone.",
    category: "development",
    lat: 25.7456,
    lng: -80.2733,
    location: "Venetian Pool — 2701 De Soto Blvd, Coral Gables",
  },

  {
    year: 1925,
    yearLabel: "1925",
    title: "Hialeah Park Race Track Opens",
    description:
      "The Miami Jockey Club launches thoroughbred horse racing at Hialeah Park on January 25, 1925, on 206 acres developed by Glenn Curtiss and James Bright. The opening receives more coverage than any sporting event in Miami's history. The track — spanning 40 blocks from Palm Ave to East 4th Ave — becomes a symbol of the boom era's extravagant ambitions.",
    category: "development",
    lat: 25.8413,
    lng: -80.2821,
    location: "Hialeah Park — 100 E 32nd St, Hialeah",
  },

  {
    year: 1926,
    yearLabel: "1926",
    title: "Miami Biltmore Hotel Opens in Coral Gables",
    description:
      "George Merrick and hotel magnate John McEntee Bowman unveil the $10 million Miami Biltmore Hotel at 1200 Anastasia Avenue on January 15, 1926. Designed by Schultze and Weaver, its 315-foot tower is modeled on the Giralda in Seville. By October, Coral Gables boasts over 4,000 structures — but the hurricane is nine months away.",
    category: "development",
    lat: 25.7510,
    lng: -80.2735,
    location: "Miami Biltmore Hotel — 1200 Anastasia Ave, Coral Gables",
  },

  {
    year: 1926,
    yearLabel: "1926",
    title: "Opa-locka: Glenn Curtiss's Arabian Nights City",
    description:
      "Aviation pioneer Glenn Curtiss founds Opa-locka, commissioning architect Bernhardt Muller to design 86 buildings in Moorish Revival style inspired by One Thousand and One Nights. The Administration Building at 777 Sharazad Blvd — featuring onion domes, minarets, and Saracenic arches — is completed in August 1926 and becomes City Hall. It is called 'The Nation's Weirdest City Hall.'",
    category: "development",
    lat: 25.9022,
    lng: -80.2503,
    location: "Opa-locka City Hall — 777 Sharazad Blvd, Opa-locka",
  },

  // ── Hurricane and aftermath ───────────────────────────────────────

  {
    year: 1926,
    yearLabel: "1926",
    title: "Great Miami Hurricane — Downtown & Overtown",
    description:
      "On September 18, 1926, winds exceeding 150 mph and 11-foot storm surge devastate the city. The hurricane destroys 4,700 homes and leaves 25,000 people homeless across South Florida. The worst destruction occurs in the poorer, mostly Black sections. Black residents are later conscripted into forced cleanup labor. The storm ends the land boom overnight.",
    category: "crisis",
    lat: 25.7750,
    lng: -80.1940,
    location: "Downtown Miami & Overtown — citywide devastation",
  },

  {
    year: 1926,
    yearLabel: "1926",
    title: "Hurricane Destroys Miami Beach",
    description:
      "From 13th Street to 59th Street, 'not a home remains without being damaged.' The Roney Plaza, one of the most exclusive hotels, is practically destroyed. The Fleetwood Hotel has nearly every window broken. The Million Dollar Pier is wrecked. The storm flattens the Fulford-Miami Speedway in North Miami Beach, which never reopens.",
    category: "crisis",
    lat: 25.7900,
    lng: -80.1310,
    location: "Miami Beach — 13th St to 59th St, Ocean Drive corridor",
  },

  {
    year: 1926,
    yearLabel: "1926",
    title: "Hurricane Levels Hialeah",
    description:
      "Strong winds level hundreds of working-class homes in Hialeah and severely damage 70% of the town. Winds peel the roof from the grandstand at Hialeah Race Track and destroy the kennels, releasing racing greyhounds. The town's rapid growth from the land boom is reversed in a single night.",
    category: "crisis",
    lat: 25.8576,
    lng: -80.2781,
    location: "Hialeah — citywide",
  },

  // ── Booker T. Washington and 1920s institutions ───────────────────

  {
    year: 1927,
    yearLabel: "1927",
    title: "Booker T. Washington High School Opens",
    description:
      "On February 28, 1927, the first public high school for Black students south of Palm Beach opens at 1200 NW 6th Avenue in Overtown. Students travel from as far as Key West and West Palm Beach for a 12th-grade education. The partially built structure had been bombed during construction — an act of sabotage reflecting the hostility toward Black education in the Jim Crow South.",
    category: "institution",
    lat: 25.7816,
    lng: -80.2058,
    location: "Booker T. Washington High School — 1200 NW 6th Ave, Overtown",
  },

  {
    year: 1927,
    yearLabel: "1927",
    title: "Greater Bethel AME Church",
    description:
      "Construction begins on Greater Bethel African Methodist Episcopal Church at 245 NW 8th Street, home to one of Miami's oldest Black congregations. The building is completed in 1943. Together with Mt. Zion Baptist and St. John's Baptist, these churches form the spiritual backbone of Overtown, serving as community meeting halls, mutual aid centers, and sites of civil rights organizing.",
    category: "institution",
    lat: 25.7808,
    lng: -80.1983,
    location: "Greater Bethel AME Church — 245 NW 8th St, Overtown",
  },

  // ── Segregation infrastructure ────────────────────────────────────

  {
    year: 1937,
    yearLabel: "1930s",
    title: "Liberty City Segregation Wall Built",
    description:
      "A concrete wall is erected along NW 12th Avenue from 62nd to 67th Streets to physically separate the Black community on the west side from the white neighborhood on the east. Standing reportedly 4 to 8 feet tall, it is a piece of racist infrastructure built during the same era as HOLC redlining maps that grade Black neighborhoods 'D' — denying residents access to home loans. Remnants of the wall are now designated a historic monument.",
    category: "segregation",
    lat: 25.8350,
    lng: -80.2200,
    location: "NW 12th Ave between 62nd & 67th Streets, Liberty City",
  },

  // ── Pan American Airways ──────────────────────────────────────────

  {
    year: 1930,
    yearLabel: "1930",
    title: "Pan American Airways at Dinner Key",
    description:
      "Pan Am selects the former WWI naval air base at Dinner Key in Coconut Grove as the hub for its inter-American operations. The inaugural flight from Dinner Key to Panama departs December 1, 1930. The first 'passenger terminal' is a houseboat towed from Havana. By 1934, Pan Am completes an elaborate Art Deco terminal building, and Dinner Key becomes one of the nation's busiest seaplane airports.",
    category: "development",
    lat: 25.7270,
    lng: -80.2350,
    location: "Dinner Key — Pan American Dr & S Bayshore Dr, Coconut Grove",
  },

  // ── Art Deco District ─────────────────────────────────────────────

  {
    year: 1934,
    yearLabel: "1930s",
    title: "Art Deco District Rises on South Beach",
    description:
      "Despite the Depression, hundreds of Art Deco and Streamline Moderne hotels rise on South Beach between 5th and 23rd Streets. Architects Henry Hohauser and L. Murray Dixon design pastel-colored buildings with streamlined curves, jutting towers, and 'eyebrow' windows — an optimistic futurism 'buttressed by the belief that times would get better.' The Colony Hotel (736 Ocean Dr, 1935), Park Central (640 Ocean Dr, 1937), and Breakwater (940 Ocean Dr, 1939) define the era.",
    category: "development",
    lat: 25.7825,
    lng: -80.1340,
    location: "Art Deco District — Ocean Drive, 5th to 23rd St, South Beach",
  },

  {
    year: 1935,
    yearLabel: "1935",
    title: "Colony Hotel Built",
    description:
      "Architect Henry Hohauser designs the Colony Hotel at 736 Ocean Drive, one of the finest examples of Art Deco architecture in South Beach. Its rooftop neon sign becomes an iconic image of Miami Beach. Hohauser, a prolific architect of the district, shapes the neighborhood's signature look of pastel facades, porthole windows, and geometric ornamentation.",
    category: "development",
    lat: 25.7808,
    lng: -80.1303,
    location: "Colony Hotel — 736 Ocean Dr, South Beach",
  },

  // ── Hotels in Overtown for Black travelers ────────────────────────

  {
    year: 1938,
    yearLabel: "1938",
    title: "Josephine Hotel Opens in Overtown",
    description:
      "The Josephine Hotel opens in Overtown, catering to Black entertainers who perform in Miami Beach's whites-only hotels and clubs but are forbidden from staying there. Together with the adjacent Dunns Hotel (1947), it becomes part of the Dunns-Josephine complex — the last surviving hotel of Overtown's once-thriving hospitality district. Artists like Sam Cooke and Josephine Baker stay here.",
    category: "institution",
    lat: 25.7832,
    lng: -80.1968,
    location: "Dunns-Josephine Hotel — NW 2nd Ave, Overtown",
  },

  // ── Lemon City Library ────────────────────────────────────────────

  {
    year: 1904,
    yearLabel: "1904",
    title: "Lemon City Library Opens",
    description:
      "The Lemon City Library opens along Rock Road (now NE 2nd Avenue), followed by the first independent post office in 1905. Lemon City, connected to Miami by the new road completed in 1902, maintains its own civic identity until it is annexed by the city of Miami in 1925. The settlement's institutions reflect a community that predates and competes with downtown Miami.",
    category: "institution",
    lat: 25.8275,
    lng: -80.1870,
    location: "Lemon City — NE 2nd Avenue (Rock Road)",
  },

  {
    year: 1940,
    yearLabel: "1940",
    title: "St. John's Baptist Church",
    description:
      "St. John's Baptist Church is built at 1328 NW 3rd Avenue in Overtown, adding to the network of Black churches that serve as community anchors, mutual aid societies, and eventually civil rights organizing centers. Along with Mt. Zion Baptist, Greater Bethel AME, and the Lyric Theater, these institutions form the cultural core of a community built under the constraints of rigid segregation.",
    category: "institution",
    lat: 25.7870,
    lng: -80.1995,
    location: "St. John's Baptist Church — 1328 NW 3rd Ave, Overtown",
  },
];

export const categoryColors: Record<string, string> = {
  founding: "#2d6b5e",
  labor: "#b07040",
  segregation: "#1c2d5a",
  development: "#c4963a",
  crisis: "#8b6b6b",
  institution: "#7b4a8e",
};

export const categoryLabels: Record<string, string> = {
  founding: "Founding",
  labor: "Labor",
  segregation: "Segregation",
  development: "Development",
  crisis: "Crisis",
  institution: "Institution",
};
