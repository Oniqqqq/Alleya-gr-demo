import { useState } from 'react';
import Hero from '../sections/Hero';
import WhatWeDoIntro from '../sections/WhatWeDoIntro';
import StatsSection from '../sections/StatsSection';
import PresenceMap from '../sections/brands/PresenceMap';
import ContactSection from '../sections/ContactSection';
import Footer from '../sections/Footer';
import { CompanyLocation } from '../data/locations';

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<CompanyLocation | null>(null);

  return (
    <main>
      <header>
        <Hero />
      </header>
      <WhatWeDoIntro />
      <StatsSection />
      <PresenceMap onSelectLocation={setSelectedLocation} />
      <ContactSection
        context={{
          location: selectedLocation ? `${selectedLocation.name}, ${selectedLocation.city}` : undefined,
        }}
      />
      <Footer />
    </main>
  );
}
