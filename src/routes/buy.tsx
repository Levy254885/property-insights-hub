import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";
import { seo } from "@/lib/seo";

const head = seo({
  title: "Property for Sale in Kenya — Houses, Apartments & Land | Property Masters",
  description:
    "Browse houses, apartments, villas and land for sale across Nairobi and Kenya. Verified listings with clear sizes, prices and tenure from Property Masters, Westlands.",
  path: "/buy",
  keywords: [
    "property for sale Kenya",
    "houses for sale Nairobi",
    "apartments for sale Nairobi",
    "land for sale Kenya",
    "villa for sale Nairobi",
    "Property Masters",
  ],
});

export const Route = createFileRoute("/buy")({
  head: () => head,
  component: () => (
    <PropertyBrowser initial={{ listingType: "sale" }} lock={{ listing: true }} heading="Property for sale" />
  ),
});
