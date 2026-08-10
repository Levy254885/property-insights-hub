import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Property for sale in Kenya | Property Masters" },
      { name: "description", content: "Houses, apartments, villas and land for sale across Kenya." },
      { property: "og:title", content: "Property for sale in Kenya | Property Masters" },
      { property: "og:description", content: "Browse homes and land currently for sale." },
      { property: "og:url", content: "/buy" },
    ],
    links: [{ rel: "canonical", href: "/buy" }],
  }),
  component: () => (
    <PropertyBrowser initial={{ listingType: "sale" }} lock={{ listing: true }} heading="Property for sale" />
  ),
});
