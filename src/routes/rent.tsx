import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";
import { seo } from "@/lib/seo";

const head = seo({
  title: "Property to Rent in Kenya — Apartments & Houses | Property Masters",
  description:
    "Apartments, houses and commercial space available to rent in Nairobi and across Kenya. Clear rents, service charge notes and viewing support from Property Masters.",
  path: "/rent",
  keywords: [
    "property to rent Kenya",
    "apartments for rent Nairobi",
    "houses for rent Nairobi",
    "2 bedroom apartment Westlands",
    "apartment for rent Kilimani",
    "Property Masters",
  ],
});

export const Route = createFileRoute("/rent")({
  head: () => head,
  component: () => (
    <PropertyBrowser initial={{ listingType: "rent" }} lock={{ listing: true }} heading="Property to rent" />
  ),
});
