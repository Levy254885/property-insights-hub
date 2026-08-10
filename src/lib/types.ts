export type ListingType = "sale" | "rent";

export type PropertyStatus =
  | "draft"
  | "published"
  | "pending"
  | "sold"
  | "rented"
  | "archived";

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

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "viewing_scheduled"
  | "converted"
  | "closed";

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
  createdAt: string;
}

export type SubmissionStatus = "pending" | "approved" | "rejected" | "changes_requested";

export interface PropertySubmission {
  id: string;
  title: string;
  listingType: ListingType;
  propertyTypeId: string;
  price: number;
  county: string;
  town: string;
  area: string;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  propertySize?: number;
  landSize?: number;
  amenities: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  images: string[];
  status: SubmissionStatus;
  createdAt: string;
  reviewNote?: string;
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

export type UserRole = "customer" | "agent" | "admin" | "super_admin";

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
