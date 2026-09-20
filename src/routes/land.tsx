import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";
import { seo } from "@/lib/seo";

const head = seo({
  title: "Land for Sale in Kenya — Residential & Development Plots | Property Masters",
  description:
    "Residential, agricultural, commercial and development land for sale in Kitengela, Kiambu, Nairobi and beyond. Title-aware marketing from Property Masters.",
  path: "/land",
  keywords: [
    "land for sale Kenya",
    "plots for sale Kitengela",
    "residential land for sale Nairobi",
    "land for sale Kiambu",
    "development land Kenya",
    "Property Masters",
  ],
});

export const Route = createFileRoute("/land")({
  head: () => head,
  component: () => (
    <PropertyBrowser initial={{ category: "land" }} lock={{ category: true }} heading="Land" />
  ),
});
