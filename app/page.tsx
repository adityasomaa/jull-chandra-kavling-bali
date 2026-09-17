import type { Metadata } from "next";
import { Featured } from "@/components/home/featured";
import { FeaturedDetails } from "@/components/home/featured-details";
import { Hero } from "@/components/home/hero";
import { OtherLocations } from "@/components/home/other-locations";
import { SurveySteps } from "@/components/home/survey-steps";
import { JsonLd } from "@/components/json-ld";
import { FEATURED } from "@/lib/listings";
import { SITE } from "@/lib/site";
import { listingJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={listingJsonLd(FEATURED)} />
      <Hero />
      <Featured />
      <FeaturedDetails />
      <OtherLocations />
      <SurveySteps />
    </>
  );
}
