import { companyContact, defaultSettings } from "./settings";
import { formatPrice, formatSize } from "./format";
import type { Article, LocationArea, Property, PropertyType } from "./types";

/**
 * Centralised SEO system for Property Masters.
 *
 * Every indexable route builds its head from `seo()` so that titles,
 * descriptions, canonicals, robots directives, Open Graph and Twitter cards
 * stay consistent, and so metadata rules only ever live in one place.
 */

export const SITE_URL = "https://www.propertymasters.co.ke";
export const SITE_NAME = "Property Masters";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Always HTTPS, always the www host, no trailing slash except the homepage. */
export function canonicalUrl(path = "/"): string {
  const trimmed = String(path).split("#")[0]!.split("?")[0]!.trim();
  const clean = trimmed.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean ? `${SITE_URL}/${clean}` : `${SITE_URL}/`;
}

export interface SeoOptions {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/properties/villa-karen". */
  path: string;
  image?: string | undefined;
  imageAlt?: string | undefined;
  type?: "website" | "article";
  /** Renders `noindex, follow` — the page stays crawlable but is not indexed. */
  noindex?: boolean;
  keywords?: string[] | undefined;
}

type MetaEntry = Record<string, string>;

export function seo(options: SeoOptions): {
  meta: MetaEntry[];
  links: Array<{ rel: string; href: string }>;
} {
  const url = canonicalUrl(options.path);
  const image = options.image?.startsWith("http") ? options.image : DEFAULT_OG_IMAGE;
  const description = clamp(options.description, 158);

  const meta: MetaEntry[] = [
    { title: options.title },
    { name: "description", content: description },
    { name: "robots", content: options.noindex ? "noindex, follow" : "index, follow" },
    { property: "og:title", content: options.title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: options.type ?? "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: options.title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
  if (options.imageAlt) meta.push({ property: "og:image:alt", content: options.imageAlt });
  if (options.keywords?.length) meta.push({ name: "keywords", content: options.keywords.join(", ") });

  return { meta, links: [{ rel: "canonical", href: url }] };
}

export function clamp(value: string, max: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/[\s,.;:-]+$/, "")}…`;
}

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

export function jsonLd(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

/** Site-wide business identity, kept in step with the visible contact details. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#organization`,
    name: companyContact.legalName,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    image: DEFAULT_OG_IMAGE,
    description: defaultSettings.defaultSeoDescription,
    slogan: defaultSettings.tagline,
    telephone: companyContact.officePhone,
    email: companyContact.generalEmail,
    areaServed: { "@type": "Country", name: "Kenya" },
    address: {
      "@type": "PostalAddress",
      streetAddress: companyContact.streetAddress,
      postOfficeBoxNumber: companyContact.postalAddress,
      addressLocality: companyContact.locality,
      addressRegion: companyContact.region,
      addressCountry: "KE",
    },
    openingHours: ["Mo-Fr 08:30-17:30", "Sa 09:00-13:00"],
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function faqLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Property metadata                                                   */
/* ------------------------------------------------------------------ */

/** Demo/placeholder and draft records must never be indexed. */
export function isIndexableProperty(p: Property): boolean {
  return p.status !== "draft" && !p.isDemo && !p.noIndex;
}

export function propertyPath(p: Property): string {
  return `/properties/${p.slug}`;
}

/** "Karen, Nairobi" — never repeats the same name twice. */
export function propertyPlace(p: Property): string {
  const parts = [p.area, p.town].filter(Boolean).map((x) => String(x).trim());
  const unique = parts.filter(
    (value, i) => value && !parts.slice(0, i).some((prev) => prev.toLowerCase() === value.toLowerCase()),
  );
  return unique.join(", ");
}

function actionWord(p: Property): string {
  return p.listingType === "rent" ? "for Rent" : "for Sale";
}

export function propertySeoTitle(p: Property, typeName?: string): string {
  if (p.seoTitle?.trim()) return p.seoTitle.trim();
  const beds = p.bedrooms ? `${p.bedrooms} Bedroom ` : "";
  const type = typeName?.trim() || "Property";
  const place = propertyPlace(p);
  const core = `${beds}${type} ${actionWord(p)}${place ? ` in ${place}` : ""}`;
  return clamp(`${core} | ${SITE_NAME}`, 70);
}

export function propertySeoDescription(p: Property, typeName?: string): string {
  if (p.seoDescription?.trim()) return clamp(p.seoDescription.trim(), 158);

  const beds = p.bedrooms ? `${p.bedrooms} bedroom ` : "";
  const type = (typeName ?? "property").toLowerCase();
  const place = propertyPlace(p);
  const facts = [
    p.bathrooms ? `${p.bathrooms} bathrooms` : null,
    p.parkingSpaces ? `${p.parkingSpaces} parking spaces` : null,
    formatSize(p.propertySize, p.sizeUnit),
    p.price ? formatPrice(p.price, p.listingType) : null,
  ].filter(Boolean);

  const lead = `Explore this ${beds}${type} ${p.listingType === "rent" ? "for rent" : "for sale"}${
    place ? ` in ${place}` : ""
  }`;
  const tail = facts.length ? ` — ${facts.join(", ")}.` : ".";
  return clamp(`${lead}${tail} Enquire with Property Masters or book a viewing.`, 158);
}

/** Descriptive, non-generic alt text derived from the property itself. */
export function propertyImageAlt(
  p: Property,
  index: number,
  typeName?: string,
  provided?: string,
): string {
  const trimmed = provided?.trim();
  if (trimmed && !/^(img|image|photo|dsc)[-_ ]?\d*$/i.test(trimmed)) return trimmed;
  const beds = p.bedrooms ? `${p.bedrooms} bedroom ` : "";
  const type = (typeName ?? "property").toLowerCase();
  const place = propertyPlace(p);
  const base = `${beds}${type} ${p.listingType === "rent" ? "for rent" : "for sale"}${
    place ? ` in ${place}` : ""
  }`;
  return index === 0 ? base : `Photo ${index + 1} of the ${base}`;
}

const AVAILABILITY: Record<Property["status"], string> = {
  draft: "https://schema.org/OutOfStock",
  available: "https://schema.org/InStock",
  pending: "https://schema.org/LimitedAvailability",
  reserved: "https://schema.org/LimitedAvailability",
  sold: "https://schema.org/SoldOut",
  rented: "https://schema.org/OutOfStock",
  unavailable: "https://schema.org/OutOfStock",
};

function residenceType(category?: PropertyType["category"], typeName?: string): string {
  const name = (typeName ?? "").toLowerCase();
  if (name.includes("apartment") || name.includes("studio") || name.includes("bedsitter")) return "Apartment";
  if (category === "residential") return "House";
  return "Place";
}

/** Structured data that only ever mirrors what the page actually shows. */
export function propertyLd(p: Property, typeName?: string, category?: PropertyType["category"]) {
  const url = canonicalUrl(propertyPath(p));
  const images = p.images.map((img) => img.url).filter(Boolean);

  const about: Record<string, unknown> = {
    "@type": residenceType(category, typeName),
    name: p.title,
    address: {
      "@type": "PostalAddress",
      addressLocality: p.area || p.town,
      addressRegion: p.town,
      addressCountry: "KE",
    },
  };
  if (p.bedrooms) about["numberOfRooms"] = p.bedrooms;
  if (p.bathrooms) about["numberOfBathroomsTotal"] = p.bathrooms;
  if (p.propertySize) {
    about["floorSize"] = {
      "@type": "QuantitativeValue",
      value: p.propertySize,
      unitCode: p.sizeUnit === "sqft" ? "FTK" : p.sizeUnit === "acres" ? "ACR" : "MTK",
    };
  }
  if (p.amenities.length) {
    about["amenityFeature"] = p.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    }));
  }
  if (typeof p.latitude === "number" && typeof p.longitude === "number") {
    about["geo"] = { "@type": "GeoCoordinates", latitude: p.latitude, longitude: p.longitude };
  }

  const listing: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    url,
    name: propertySeoTitle(p, typeName).replace(` | ${SITE_NAME}`, ""),
    description: p.description,
    datePosted: p.publishedAt ?? p.createdAt,
    provider: { "@id": `${SITE_URL}/#organization` },
    about,
  };
  if (images.length) listing["image"] = images;
  if (p.price) {
    listing["offers"] = {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency ?? "KES",
      availability: AVAILABILITY[p.status] ?? "https://schema.org/InStock",
      url,
      ...(p.listingType === "rent" ? { businessFunction: "http://purl.org/goodrelations/v1#LeaseOut" } : {}),
    };
  }
  return listing;
}

/* ------------------------------------------------------------------ */
/* Location & article metadata                                         */
/* ------------------------------------------------------------------ */

/** Titles tuned to the way people actually search for each area. */
export function locationSeoTitle(location: LocationArea, dominant?: "land" | "apartments" | "houses"): string {
  const place = location.town && location.town !== location.name ? `${location.name}, ${location.town}` : location.name;
  if (dominant === "land") return clamp(`Land & Property for Sale in ${place} | ${SITE_NAME}`, 70);
  if (dominant === "apartments") return clamp(`Apartments for Sale & Rent in ${place} | ${SITE_NAME}`, 70);
  if (dominant === "houses") return clamp(`Houses & Property for Sale in ${place} | ${SITE_NAME}`, 70);
  return clamp(`Property for Sale & Rent in ${place} | ${SITE_NAME}`, 70);
}

export function locationSeoDescription(location: LocationArea, count: number, typeNames: string[]): string {
  const place = location.town && location.town !== location.name ? `${location.name}, ${location.town}` : location.name;
  const inventory = count
    ? `${count} ${count === 1 ? "property" : "properties"} currently available${
        typeNames.length ? ` including ${typeNames.slice(0, 3).join(", ").toLowerCase()}` : ""
      }.`
    : "Tell us what you are looking for and we will alert you when something suitable comes up.";
  return clamp(`Browse homes, land and commercial property in ${place}. ${location.intro} ${inventory}`, 158);
}

export function locationKeywords(location: LocationArea): string[] {
  const place = location.name;
  return [
    `property for sale ${place}`,
    `property for rent ${place}`,
    `apartments ${place}`,
    `houses for sale ${place}`,
    `land for sale ${place}`,
    `${place} Nairobi real estate`,
    `Property Masters ${place}`,
  ];
}

export function articleLd(article: Article) {
  const url = canonicalUrl(`/insights/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    author: { "@type": "Organization", name: article.author || SITE_NAME, url: `${SITE_URL}/` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
    url,
    ...(article.coverImage ? { image: article.coverImage } : { image: DEFAULT_OG_IMAGE }),
  };
}

export function articleSeoTitle(article: Article): string {
  if (article.seoTitle?.trim()) return article.seoTitle.trim();
  return clamp(`${article.title} | ${SITE_NAME}`, 70);
}

export function articleSeoDescription(article: Article): string {
  if (article.seoDescription?.trim()) return clamp(article.seoDescription.trim(), 158);
  return clamp(article.excerpt, 158);
}
