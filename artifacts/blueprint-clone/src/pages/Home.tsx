import Hero from '../sections/Hero';
import WhatWeDoIntro from '../sections/WhatWeDoIntro';
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
      <StatsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
