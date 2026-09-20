import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";
import { seo } from "@/lib/seo";

const head = seo({
  title: "Commercial Property in Kenya — Offices, Retail & Warehouses | Property Masters",
  description:
    "Office suites, retail units, warehouses and commercial buildings for sale or rent in Upper Hill, Westlands and across Kenya. Marketed by Property Masters.",
  path: "/commercial",
  keywords: [
    "commercial property Kenya",
    "office space for rent Upper Hill",
    "office space Westlands",
    "warehouse for rent Nairobi",
    "retail space for sale Nairobi",
    "Property Masters",
  ],
});

export const Route = createFileRoute("/commercial")({
  head: () => head,
  component: () => (
    <PropertyBrowser initial={{ category: "commercial" }} lock={{ category: true }} heading="Commercial property" />
  ),
});
