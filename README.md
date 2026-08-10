# Property Insights Hub

PROPERTY MASTERS — MASTER LOVABLE DEVELOPMENT PROMPT

Build a complete, production-ready real estate platform called Property Masters.

Property Masters is a modern Kenyan real-estate company/platform focused on helping customers discover, compare, enquire about, buy, rent, and list properties.

The website must feel human-designed, premium, trustworthy, fast, sophisticated and commercially credible.

Do NOT make it look like a generic AI-generated real estate template.

1. CORE OBJECTIVE

Build Property Masters as both:

A polished public-facing real estate website

A functional property management/listing platform with an admin dashboard

The platform must be mobile-first, responsive, SEO-friendly and scalable.

Users should be able to:

Browse properties

Search properties

Filter properties

View detailed property pages

Save/favourite properties

Enquire about properties

Contact Property Masters

Submit a property for listing

Browse properties by location

Browse properties by category

Share property listings

Administrators should be able to:

Add properties

Edit properties

Delete properties

Publish/unpublish properties

Mark properties as featured

Manage property images

Manage enquiries

Manage users

Manage agents

Manage locations

Manage property categories

View dashboard analytics

2. DESIGN DIRECTION

The design must communicate:

Trust

Wealth

Professionalism

Property expertise

Sophistication

Reliability

Avoid the stereotypical real-estate website aesthetic.

DO NOT use:

Excessive gradients

Glassmorphism

Floating blobs

Excessive rounded cards

Neon colours

Cartoon illustrations

Fake-looking AI-generated property imagery

Huge generic hero headlines

Excessive animations

Overly saturated UI

Random decorative elements

Use:

Strong typography

Excellent spacing

Realistic property photography

Large editorial-style imagery

Clean property cards

Subtle borders

Restrained shadows

Elegant hover states

Consistent spacing

Strong visual hierarchy

The site should feel closer to a professionally designed property publication/platform than a template.

3. BRAND SYSTEM

Brand name:

Property Masters

Suggested positioning:

Property, handled properly.

Use this as a starting brand direction, but allow the copy to feel natural rather than forcing the tagline everywhere.

Suggested colour system:

Primary:

Deep charcoal / near-black

Secondary:

Warm ivory / off-white

Accent:

Muted gold or bronze

Supporting:

Soft warm grey

Medium grey

White

Do not overuse the accent colour.

Typography:

Use a sophisticated modern sans-serif.

Recommended:

Inter

Manrope

Plus Jakarta Sans

Use one primary font family consistently unless there is a strong design reason to introduce a secondary display font.

Typography should be spacious and confident.

4. GLOBAL NAVIGATION

Desktop navigation:

PROPERTY MASTERS logo

Buy

Rent

Land

Commercial

Locations

About

Right side:

Search

List Your Property

Contact

Include a subtle account/favourites option where appropriate.

Mobile:

Use a clean mobile navigation drawer.

Do not overcrowd the navigation.

The header should remain usable over both light and image backgrounds.

5. HOMEPAGE

Create a premium real-estate homepage.

Do NOT create a generic hero containing only:

"Find your dream home"

Instead, create a property-discovery-focused opening experience.

Hero concept:

Large authentic property image/video background or carefully composed editorial property image.

Headline example:

Find property worth moving for.

Supporting copy:

Discover carefully selected homes, land and commercial properties across Kenya.

Then immediately place a highly usable search module.

Search tabs:

Buy

Rent

Land

Commercial

Search controls:

Location

Property type

Price range

Bedrooms where applicable

Primary button:

Search Properties

The search component must actually work.

6. HOMEPAGE SECTIONS

Create the following sections:

Featured Properties

Display carefully selected properties.

Each card should contain:

Property image

Featured badge where applicable

For Sale / For Rent badge

Property title

Location

Price

Bedrooms

Bathrooms

Size

Property type

Favourite button

Cards should feel premium and uncluttered.

Explore by Property Type

Categories:

Houses

Apartments

Land

Villas

Commercial

Offices

Shops

Warehouses

Use clean visual cards.

Explore by Location

Create location cards for major Kenyan markets.

Initial locations can include:

Nairobi

Karen

Kilimani

Westlands

Runda

Lavington

Kileleshwa

Mombasa

Kisumu

Nakuru

Eldoret

Kakamega

Make the location system database-driven so locations can be added later.

Why Property Masters

Create a trust section explaining:

Verified listings

Local market knowledge

Professional assistance

Transparent property information

Responsive customer support

Avoid exaggerated claims unless they can be supported.

Latest Properties

Show the newest published listings.

Sell or List Your Property

Strong CTA section:

Have a property to sell or rent?

Allow owners/agents to submit property information.

CTA:

List Your Property

Market/Insights Section

Create a section for future real-estate articles.

Examples:

Property buying guides

Land buying tips

Nairobi property market insights

Rental market updates

Investment guides

This should eventually support SEO/content marketing.

Final CTA

Create a restrained final call-to-action:

Let's find the right property.

Buttons:

Browse Properties

Contact Property Masters

7. PROPERTIES PAGE

Create:

/properties

This is the main property discovery page.

Include:

Search bar

Buy/Rent tabs

Property type

Location

Min price

Max price

Bedrooms

Bathrooms

Property size

Amenities

Sort options

Sort:

Newest

Price: Low to High

Price: High to Low

Featured

Largest

Include both:

Grid view

Optional list view

Desktop can use a two-column discovery layout where appropriate.

Mobile must remain extremely easy to browse.

8. PROPERTY CARD

Every property card should have:

Image gallery/cover image

Status:

FOR SALE

FOR RENT

SOLD

RENTED

Optional:

FEATURED

Information:

Property name/title

Location

Price

Bedrooms

Bathrooms

Area

Property type

Favourite button

"View Property"

Make the entire card clickable.

Use proper hover interactions on desktop.

9. PROPERTY DETAILS PAGE

Every property must have its own SEO-friendly URL.

Example:

/properties/modern-4-bedroom-house-karen

Page structure:

Large image gallery

Property title

Location

Price

Status

Property type

Bedrooms

Bathrooms

Parking

Property size

Land size where applicable

Description

Amenities

Features

Location information

Map placeholder/integration

Agent/Property Masters representative

Contact buttons

Enquiry form

Similar properties

Share property

Favourite property

10. PROPERTY IMAGE GALLERY

Support multiple images per property.

Features:

Main image

Thumbnail navigation

Fullscreen gallery

Next/previous controls

Mobile swipe support

Image lazy loading

Alt text

Images must be stored in Firebase Storage.

Do not use random placeholder images in production.

During development, use high-quality royalty-free/stock imagery only as temporary placeholders.

11. PROPERTY ENQUIRY SYSTEM

Every property should have an enquiry form.

Fields:

Name

Email

Phone

Message

Preferred viewing date

Preferred contact method

Submit enquiry.

Save the enquiry to Firestore.

Admin should receive/view the enquiry.

Include quick contact actions:

Call

WhatsApp

Send Enquiry

Do not expose private admin information publicly.

12. PROPERTY SUBMISSION

Create:

/list-property

Allow users/property owners/agents to submit a listing.

Fields:

Basic information:

Property title

Listing type

Property type

Price

Location

County

Town

Area/neighbourhood

Description

Bedrooms

Bathrooms

Parking

Property size

Land size

Amenities

Contact name

Contact phone

Contact email

Images:

Allow multiple image uploads.

Submission should create a Firestore record with:

status:

pending

An administrator must approve it before it becomes publicly visible.

13. PROPERTY TYPES

Support:

Residential:

Apartment

House

Villa

Townhouse

Bungalow

Maisonette

Bedsitter

Studio

Land:

Residential Land

Agricultural Land

Commercial Land

Development Land

Commercial:

Office

Shop

Warehouse

Retail Space

Hotel

Industrial Property

Commercial Building

Allow administrators to add new property types later.

14. LOCATION SYSTEM

Create a structured location database.

Hierarchy:

Country

→ County

→ City/Town

→ Area/Neighbourhood

Examples:

Kenya

→ Nairobi County

→ Nairobi

→ Westlands

Property listings should reference structured location IDs rather than storing everything as random text.

This will allow future location landing pages.

15. LOCATION PAGES

Create SEO-friendly pages such as:

/locations/nairobi

/locations/nairobi/westlands

/locations/karen

/locations/kilimani

Each location page should display:

Location introduction

Available properties

Property types

Price overview

Related areas

Frequently asked questions

Contact CTA

Do not fabricate market statistics.

16. FAVOURITES

Allow authenticated users to save properties.

Create:

/favorites

Users should be able to:

Save

Remove

View saved properties

Use Firebase Authentication.

Guests can optionally use local storage before login.

17. AUTHENTICATION

Use Firebase Authentication.

Support:

Email/password

Google sign-in if practical

Roles:

Customer

Agent

Admin

Super Admin

Implement role-based access control.

Never rely only on frontend route protection.

Use Firebase security rules to protect data.

18. ADMIN DASHBOARD

Create:

/admin

The admin dashboard should look like a serious SaaS/business dashboard.

Navigation:

Overview

Properties

Add Property

Enquiries

Users

Agents

Locations

Property Types

Featured Properties

Submissions

Content

Settings

19. ADMIN OVERVIEW

Dashboard statistics:

Total Properties

Published

Pending

Sold

Rented

Total Enquiries

New Enquiries

Registered Users

Include simple charts where useful.

Do not overdesign the dashboard.

20. ADMIN PROPERTY MANAGEMENT

Admins can:

Create

Read

Update

Delete

Publish

Unpublish

Feature

Unfeature

Mark Sold

Mark Rented

Archive

Each property should have:

Internal ID

Slug

Created date

Updated date

Published date

Status

Use confirmation dialogs for destructive actions.

21. ADMIN PROPERTY EDITOR

Create a professional form.

Sections:

Basic Information

Pricing

Location

Property Details

Amenities

Description

Images

SEO

Publishing

Allow drag-and-drop image ordering.

Allow administrators to select the primary image.

22. ADMIN ENQUIRIES

Display:

Customer name

Phone

Email

Property

Message

Date

Status

Statuses:

New

Contacted

Viewing Scheduled

Converted

Closed

Allow admins to update enquiry status.

23. ADMIN SUBMISSIONS

Property submissions should appear in:

/admin/submissions

Actions:

Review

Approve

Reject

Request changes

Approved listings can be published.

Rejected listings should remain stored for audit/history.

24. AGENT SYSTEM

Create an agent database.

Agent profile:

Name

Profile photo

Phone

Email

Bio

Areas served

Specialisations

Active/inactive

Each property can optionally be assigned to an agent.

Create agent pages:

/agents/[slug]

Display their active listings.

25. FIREBASE ARCHITECTURE

Use Firebase.

Services:

Firebase Authentication

Firestore

Firebase Storage

Firebase App Check where appropriate

Firestore collections should include approximately:

users

properties

propertyTypes

locations

counties

agents

enquiries

favorites

propertySubmissions

amenities

articles

settings

Use references/IDs rather than duplicating large amounts of data.

26. PROPERTY DATA MODEL

Use a structured property model similar to:

id

title

slug

description

listingType

propertyTypeId

price

currency

countyId

town

area

address

latitude

longitude

bedrooms

bathrooms

parkingSpaces

propertySize

landSize

sizeUnit

amenities

features

images

primaryImage

agentId

status

featured

verified

createdAt

updatedAt

publishedAt

createdBy

seoTitle

seoDescription

seoImage

27. SECURITY

Implement proper Firebase security rules.

Public users:

Can read published properties.

Authenticated users:

Can manage their own favourites.

Users submitting properties:

Can create submissions but cannot publish them.

Agents:

Can manage only properties assigned to them if that workflow is enabled.

Admins:

Can manage platform data.

Super Admin:

Can manage users/roles and critical settings.

Never put Firebase admin credentials or service-account keys in frontend code.

28. SEO

SEO is extremely important.

Implement:

Dynamic page titles

Dynamic meta descriptions

Canonical URLs

Open Graph metadata

Twitter/X metadata

Structured data

Sitemap

Robots.txt

Breadcrumbs

Semantic HTML

Proper heading hierarchy

Image alt text

Generate property-specific metadata.

Example:

Title:

4 Bedroom House for Sale in Karen | Property Masters

Description:

Create dynamically from the property information.

29. STRUCTURED DATA

Implement appropriate JSON-LD structured data.

Use:

Organization

RealEstateAgent where appropriate

BreadcrumbList

Product/Offer-style property data where appropriate

Article for blog posts

Do not create fake reviews, ratings, prices or statistics.

30. SITEMAP

Create dynamic sitemap functionality.

The sitemap should include:

Homepage

Property pages

Location pages

Agent pages

Blog/article pages

Important static pages

Only include published/indexable content.

31. ROBOTS.TXT

Create:

robots.txt

Allow search engines to crawl public content.

Disallow private areas such as:

/admin

/account

/api where appropriate

Do not block property pages.

32. PERFORMANCE

Target excellent Lighthouse performance.

Implement:

Lazy-loaded images

Responsive images

Proper image sizing

Code splitting

Efficient Firestore queries

Pagination

Avoid unnecessary realtime listeners

Avoid huge JavaScript bundles

Avoid loading all properties at once

Property listings should use pagination or infinite loading.

33. RESPONSIVE DESIGN

Mobile-first.

The website must work beautifully at:

320px

375px

390px

414px

Tablet

Laptop

Desktop

Large desktop

Do not simply shrink the desktop UI.

Redesign layouts appropriately for mobile.

Property cards should remain easy to scan.

Search filters should become a clean mobile filter drawer/modal.

34. ACCESSIBILITY

Implement:

Semantic HTML

Keyboard navigation

Visible focus states

Proper labels

Accessible forms

Sufficient contrast

Alt text

ARIA only where necessary

Accessible dialogs

Accessible mobile navigation

35. WHATSAPP INTEGRATION

Where appropriate, include WhatsApp enquiry functionality.

Do not hardcode random phone numbers.

Store the official Property Masters contact details in environment/configuration or an admin settings collection.

Generate WhatsApp messages dynamically based on the property.

Example:

"Hello Property Masters, I am interested in the [Property Name] in [Location]."

36. CONTACT PAGE

Create:

/contact

Include:

Phone

Email

WhatsApp

Office/location information

Business hours

Contact form

Map section

Keep the design clean.

37. ABOUT PAGE

Create:

/about

Tell the Property Masters story.

Focus on:

Professionalism

Local property knowledge

Customer service

Transparency

Property expertise

Do not invent years of experience, awards, clients or achievements.

Use editable content so these details can be updated later.

38. BLOG / INSIGHTS

Create:

/insights

Individual article pages:

/insights/[slug]

Admin should be able to create and edit articles.

Article fields:

Title

Slug

Excerpt

Body

Featured image

Author

Category

Tags

SEO title

SEO description

Published date

Optimize articles for search engines.

39. SEARCH ENGINE FRIENDLY PROPERTY URLS

Use readable URLs.

Good:

/properties/modern-3-bedroom-apartment-westlands

Bad:

/property?id=829292

Property slugs must be unique.

If a property title changes, preserve old URLs where possible using redirects.

40. ERROR STATES

Create polished states for:

No properties found

Property unavailable

Network error

Loading

Empty favourites

Empty enquiries

Failed image upload

Invalid form

Unauthorized admin access

Do not show ugly default browser errors.

41. LOADING STATES

Use elegant skeleton loaders.

Avoid excessive spinners.

Property cards should have skeleton versions.

Property detail pages should have appropriate loading states.

42. MICROINTERACTIONS

Use subtle animations.

Examples:

Card hover image movement

Favourite animation

Button hover

Page transitions

Search interaction

Gallery transitions

Mobile drawer animation

Keep animations fast and professional.

Do not animate everything.

Use Framer Motion only where it adds value.

43. EMPTY STATES

Examples:

"No properties match your search."

Give users options:

Clear filters

Change location

Expand price range

Browse all properties

For favourites:

"You haven't saved any properties yet."

44. DATA VALIDATION

Validate all forms.

Price:

Numeric.

Phone:

Validate Kenyan phone formats where appropriate.

Email:

Valid email.

Required fields:

Clearly indicate them.

Do not allow publishing incomplete properties.

45. ADMIN SETTINGS

Create a settings area where admins can configure:

Company name

Logo

Phone

WhatsApp

Email

Address

Social links

Business hours

Default SEO metadata

Currency

Homepage featured properties

Do not hardcode these values throughout the application.

46. CURRENCY

Primary currency:

KES

Display prices professionally.

Example:

KES 18,500,000

KES 85,000 / month

Allow the system to distinguish between:

Sale price

Monthly rent

Negotiable

47. PROPERTY VERIFICATION

Add an optional:

Verified Property

status.

Only admins can mark a property as verified.

Do not automatically claim every property is verified.

48. ANALYTICS

Create the foundation for analytics.

Track where practical:

Property views

Searches

Enquiries

Favourite actions

Listing submissions

Contact clicks

Structure the system so Google Analytics/other analytics can be integrated later.

49. ADMIN ANALYTICS

Display:

Most viewed properties

Most favourited properties

Most enquired properties

Popular locations

Property inventory by type

Properties by status

Do not create fake analytics data.

If there is insufficient data, show an appropriate empty state.

50. CONTENT MANAGEMENT

Important homepage text and business information should not require code changes.

Make important content editable from the admin dashboard where practical.

51. DEMO DATA

Create realistic seed/demo properties for development.

Examples:

4 Bedroom Contemporary Villa — Karen

3 Bedroom Apartment — Westlands

Residential Land — Kitengela

Modern Apartment — Kilimani

Commercial Office — Upper Hill

Family Home — Runda

Clearly mark demo data so it can be removed before production.

Do not represent demo properties as real available properties.

52. NO FAKE INFORMATION

This is critical.

Do not invent:

Company registration details

Physical addresses

Phone numbers

Awards

Reviews

Testimonials

Property owners

Property availability

Market statistics

Agents

Certifications

Use placeholders/configurable content where real information has not been supplied.

53. FINAL PAGE STRUCTURE

Create:

/

/properties

/properties/[slug]

/buy

/rent

/land

/commercial

/locations

/locations/[slug]

/locations/[location]/[area]

/agents

/agents/[slug]

/list-property

/favorites

/about

/contact

/insights

/insights/[slug]

/login

/register

/account

/admin

/admin/properties

/admin/properties/new

/admin/properties/[id]

/admin/enquiries

/admin/submissions

/admin/users

/admin/agents

/admin/locations

/admin/property-types

/admin/articles

/admin/settings

54. DEVELOPMENT QUALITY

Write clean, maintainable code.

Use reusable components.

Create:

Header

Footer

PropertyCard

PropertyGrid

PropertySearch

PropertyFilters

PropertyGallery

PropertyAmenities

EnquiryForm

LocationCard

AgentCard

LoadingSkeleton

EmptyState

Modal

Toast

Pagination

Do not duplicate components unnecessarily.

Use proper TypeScript types.

Do not use any everywhere.

55. FIREBASE ENVIRONMENT

Use environment variables for Firebase configuration.

Never expose service-account credentials.

Create a clear .env.example.

Document required variables.

The frontend must be safe to deploy to Vercel.

56. DEPLOYMENT

Prepare the project for:

GitHub → Vercel → Firebase

The project must build successfully.

Fix all TypeScript/build/lint errors.

Do not leave broken imports.

Do not leave placeholder TODOs for core functionality.

57. FINAL QUALITY CHECK

Before considering the project complete, test:

Public website

Homepage

Navigation

Search

Filters

Property cards

Property details

Gallery

Favourites

Contact forms

Property submission

Mobile navigation

Responsive layouts

Authentication

Register

Login

Logout

Protected routes

Admin

Dashboard

Create property

Edit property

Delete property

Publish property

Feature property

Upload images

Manage enquiries

Manage submissions

Manage agents

Manage locations

SEO

Verify:

Titles

Descriptions

Canonicals

Sitemap

Robots

Open Graph

Structured data

Clean URLs

Performance

Verify:

Images are optimized

No unnecessary requests

No huge bundle

No console errors

No broken links

58. IMPORTANT IMPLEMENTATION RULE

Do NOT try to build everything as a visual mockup.

This must be a real functional application.

The property search must work.

The filters must work.

The property detail pages must work.

Firebase must actually store the data.

Authentication must work.

Admin permissions must work.

Image uploads must work.

Enquiries must be stored.

Property submissions must require approval.

Use real database queries rather than hardcoded arrays for production functionality.

59. MOST IMPORTANT DESIGN PRINCIPLE

Property Masters should feel like a company that already has a strong reputation.

The visitor should immediately think:

"These people understand property."

Not:

"This looks like an AI-generated website."

Prioritize authenticity, restraint, typography, photography, spacing and usability.

Every section should earn its place.

Do not fill empty space just because there is empty space.

Do not add sections simply to make the homepage longer.

The final product should look premium, modern, trustworthy and commercially ready.

Build the application accordingly.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3a4c08ec-b7a0-428f-a235-2df038c684dc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
