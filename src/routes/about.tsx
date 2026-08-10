import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Property Masters | Kenyan property specialists" },
      {
        name: "description",
        content:
          "Property Masters helps buyers, tenants and owners across Kenya with accurate listings and straightforward advice.",
      },
      { property: "og:title", content: "About Property Masters" },
      { property: "og:description", content: "How we work, and what we will and won't claim." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container-page py-14 lg:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">About</p>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Property, handled properly.</h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Property Masters is a Kenyan property platform built around one idea: people make better
          decisions when the information in front of them is accurate. We publish listings with the
          details that actually matter — size, tenure, service charge, price basis — and we say when we
          do not know something.
        </p>
        <h2 className="mt-12 text-xl font-bold">How we work</h2>
        <ul className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">Review before publication.</strong> Every submitted
            property is reviewed by our team before it appears on the site.
          </li>
          <li>
            <strong className="text-foreground">Verification where possible.</strong> Listings marked
            verified have had ownership and key particulars checked. Listings without the badge have not
            yet been through that step.
          </li>
          <li>
            <strong className="text-foreground">One point of contact.</strong> The same desk handles your
            enquiry from first viewing to handover.
          </li>
        </ul>
        <h2 className="mt-12 text-xl font-bold">What we don't do</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We do not publish market statistics we cannot source, testimonials we have not received, or
          claims about experience and awards we cannot evidence. Company registration details, office
          address and team profiles will be published here once confirmed.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/properties">Browse properties</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
