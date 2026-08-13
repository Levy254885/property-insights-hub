export type ListingType = "sale" | "rent";

/**
 * Inventory statuses for property owned/marketed by Property Masters.
 * There are no seller/submission statuses — inventory is internal.
 */
export type PropertyStatus =
  | "draft"
  | "available"
  | "reserved"
  | "sold"
  | "rented"
  | "unavailable";

export type PropertyCategory = "residential" | "land" | "commercial";

export interface PropertyType {
  id: string;
  name: string;
  slug: string;
  category: PropertyCategory;
}

export interface County {
  id: string;
  name: string;
  slug: string;
}

export interface LocationArea {
  id: string;
  name: string;
  slug: string;
  countyId: string;
  town: string;
  /** Short editorial introduction shown on the location landing page. */
  intro: string;
  parentSlug?: string;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  role: string;
  phone: string;
  email: string;
  bio: string;
  photoUrl?: string;
  areasServed: string[];
  specialisations: string[];
  active: boolean;
}

export interface PropertyImage {
  url: string;
  alt: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  listingType: ListingType;
  propertyTypeId: string;
  price: number;
  currency: "KES";
  negotiable?: boolean;
  countyId: string;
  town: string;
  area: string;
  areaSlug: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  propertySize?: number;
  landSize?: number;
  sizeUnit: "sqm" | "sqft" | "acres";
  amenities: string[];
  features: string[];
  images: PropertyImage[];
  primaryImage: string;
  agentId?: string;
  status: PropertyStatus;
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** Demo records are shipped for development and are clearly labelled. */
  isDemo?: boolean;
}

/** Leads always come from prospective buyers or tenants. */
export type EnquiryStatus =
  | "new"
  | "contacted"
  | "viewing_requested"
  | "viewing_scheduled"
  | "negotiating"
  | "closed"
  | "not_interested";

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate?: string;
  preferredContact: "phone" | "email" | "whatsapp";
  status: EnquiryStatus;
  assignedTo?: string;
  createdAt: string;
}

export type ViewingStatus = "requested" | "scheduled" | "completed" | "cancelled";

export interface ViewingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: ViewingStatus;
  assignedTo?: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  author: string;
  coverImage?: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
}

/** Accounts exist only for internal Property Masters staff. */
export type UserRole = "staff" | "admin" | "super_admin";

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  currency: "KES";
  social: { facebook?: string; instagram?: string; linkedin?: string; x?: string };
  defaultSeoTitle: string;
  defaultSeoDescription: string;
}

export interface PropertyFiltersState {
  q: string;
  listingType: ListingType | "all";
  category: PropertyCategory | "all";
  typeId: string;
  areaSlug: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minSize: string;
  amenities: string[];
  sort: "newest" | "price_asc" | "price_desc" | "featured" | "largest";
}
