import type { SiteSettings } from "./types";

const env = import.meta.env as Record<string, string | undefined>;

/**
 * Official Property Masters business details, taken from the company
 * business card. Editable in /admin/settings (stored in `settings/site`).
 */
export const defaultSettings: SiteSettings = {
  companyName: "Property Masters",
  tagline: "With you all the way",
  phone: env["VITE_CONTACT_PHONE"] ?? "+254 715 311 930",
  whatsapp: env["VITE_CONTACT_WHATSAPP"] ?? "+254 722 124 837",
  email: env["VITE_CONTACT_EMAIL"] ?? "info@propertymasters.co.ke",
  address:
    env["VITE_CONTACT_ADDRESS"] ??
    "3rd Floor, Lotus Plaza, 15 Chiromo Lane (Chiromo Lane / Ojijo Road), Westlands, P.O. Box 14234-00400, Nairobi",
  businessHours: "Monday to Friday, 8:30am – 5:30pm · Saturday, 9:00am – 1:00pm",
  currency: "KES",
  social: {},
  defaultSeoTitle: "Property Masters | Homes, land and commercial property in Kenya",
  defaultSeoDescription:
    "Property Masters markets homes, land and commercial property across Kenya. Browse verified listings, book a viewing and enquire with our Westlands, Nairobi team.",
};

/** Additional contact details from the company business card. */
export const companyContact = {
  legalName: "Property Masters",
  websiteUrl: "https://www.propertymasters.co.ke",
  directorName: "Nicholas Waweru",
  directorRole: "Director",
  directorPhone: "+254 722 124 837",
  directorEmail: "nicholas@propertymasters.co.ke",
  generalEmail: "info@propertymasters.co.ke",
  officePhone: "+254 715 311 930",
  streetAddress: "3rd Floor, Lotus Plaza, 15 Chiromo Lane, Westlands",
  postalAddress: "P.O. Box 14234-00400",
  locality: "Nairobi",
  region: "Nairobi County",
  country: "KE",
};
