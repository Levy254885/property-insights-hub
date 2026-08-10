import type { SiteSettings } from "./types";

const env = import.meta.env as Record<string, string | undefined>;

/**
 * Placeholder business details. Real values are configured in
 * /admin/settings (stored in the `settings` collection) or via env vars.
 * Nothing here should be presented to visitors as verified company data.
 */
export const defaultSettings: SiteSettings = {
  companyName: "Property Masters",
  tagline: "Property, handled properly.",
  phone: env["VITE_CONTACT_PHONE"] ?? "+254 700 000 000",
  whatsapp: env["VITE_CONTACT_WHATSAPP"] ?? "+254 700 000 000",
  email: env["VITE_CONTACT_EMAIL"] ?? "hello@propertymasters.co.ke",
  address: env["VITE_CONTACT_ADDRESS"] ?? "Address to be confirmed, Nairobi, Kenya",
  businessHours: "Monday to Friday, 8:30am – 5:30pm · Saturday, 9:00am – 1:00pm",
  currency: "KES",
  social: {},
  defaultSeoTitle: "Property Masters | Homes, land and commercial property in Kenya",
  defaultSeoDescription:
    "Discover carefully selected homes, land and commercial properties across Kenya with Property Masters.",
};
