import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";

export const Route = createFileRoute("/land")({
  head: () => ({
    meta: [
      { title: "Land for sale in Kenya | Property Masters" },
      { name: "description", content: "Residential, agricultural, commercial and development plots for sale in Kenya." },
      { property: "og:title", content: "Land for sale in Kenya | Property Masters" },
      { property: "og:description", content: "Surveyed plots and development land across Kenya." },
      { property: "og:url", content: "/land" },
    ],
    links: [{ rel: "canonical", href: "/land" }],
  }),
  component: () => (
    <PropertyBrowser initial={{ category: "land" }} lock={{ category: true }} heading="Land" />
  ),
});
