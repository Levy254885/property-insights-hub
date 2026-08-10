import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";

export const Route = createFileRoute("/commercial")({
  head: () => ({
    meta: [
      { title: "Commercial property in Kenya | Property Masters" },
      { name: "description", content: "Offices, retail units, warehouses and commercial buildings across Kenya." },
      { property: "og:title", content: "Commercial property in Kenya | Property Masters" },
      { property: "og:description", content: "Office, retail and industrial space to buy or let." },
      { property: "og:url", content: "/commercial" },
    ],
    links: [{ rel: "canonical", href: "/commercial" }],
  }),
  component: () => (
    <PropertyBrowser initial={{ category: "commercial" }} lock={{ category: true }} heading="Commercial property" />
  ),
});
