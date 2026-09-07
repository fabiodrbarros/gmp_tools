import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Offerings } from "@/components/sections/offerings";
import { HomeNews } from "@/components/sections/home-news";
import { ContactCTA } from "@/components/sections/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Offerings />
      <HomeNews />
      <ContactCTA />
    </>
  );
}
