import MapLoader from "./MapLoader";

export const metadata = {
  title: "Map — Built by Labor, Divided by Design",
  description: "Explore Miami's history through an interactive map. Scroll through time to see key events unfold across the city's geography.",
};

export default function MapPage() {
  return <MapLoader />;
}
