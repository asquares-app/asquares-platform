import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProductsIntro } from "@/components/sections/ProductsIntro";
import { ProductStack } from "@/components/sections/ProductStack";
import { ProductARMenu } from "@/components/sections/ProductARMenu";
import { ProductRealEstate } from "@/components/sections/ProductRealEstate";
import { ProductSpillTheTea } from "@/components/sections/ProductSpillTheTea";
import { About } from "@/components/sections/About";
import { OriginStory } from "@/components/sections/OriginStory";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTABanner } from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <Hero />

        <section id="products" className="scroll-mt-20 bg-white">
          <ProductsIntro />
          <ProductStack>
            <ProductARMenu />
            <ProductRealEstate />
            <ProductSpillTheTea />
          </ProductStack>
        </section>

        <section id="about" className="scroll-mt-20 bg-white">
          <About />
          <OriginStory />
        </section>

        <Testimonials />

        <section id="contact" className="scroll-mt-20 bg-white">
          <FAQ />
          <CTABanner />
        </section>
      </main>
      <Footer />
    </>
  );
}
