import Hero from '../sections/Hero';
import WhatWeDoIntro from '../sections/WhatWeDoIntro';
import FlexSection from '../sections/FlexSection';
import StatsSection from '../sections/StatsSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../sections/Footer';

export default function HomePage() {
  return (
    <main>
      <header>
        <Hero />
      </header>
      <WhatWeDoIntro />
      <FlexSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
