import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";

export const Route = createFileRoute("/rent")({
  head: () => ({
    meta: [
      { title: "Property to rent in Kenya | Property Masters" },
      { name: "description", content: "Apartments, houses and commercial space available to rent across Kenya." },
      { property: "og:title", content: "Property to rent in Kenya | Property Masters" },
      { property: "og:description", content: "Browse homes and commercial space currently available to rent." },
      { property: "og:url", content: "/rent" },
    ],
    links: [{ rel: "canonical", href: "/rent" }],
  }),
  component: () => (
    <PropertyBrowser initial={{ listingType: "rent" }} lock={{ listing: true }} heading="Property to rent" />
  ),
});
