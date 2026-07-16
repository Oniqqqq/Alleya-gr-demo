import Nav from './components/Nav';
import Hero from './sections/Hero';
import WhatWeDoIntro from './sections/WhatWeDoIntro';
import WhatWeDo from './sections/WhatWeDo';
import LogoGallery from './sections/LogoGallery';
import FlexSection from './sections/FlexSection';
import StatsSection from './sections/StatsSection';
import TechSection from './sections/TechSection';
import VsSection from './sections/VsSection';
import InvestorsSection from './sections/InvestorsSection';
import Footer from './sections/Footer';

function App() {
  return (
    <>
      {/* Print grid background */}
      <div className="print-bg">
        <img className="bg" src={`${import.meta.env.BASE_URL}print.svg`} alt="" />
        <img className="static" src={`${import.meta.env.BASE_URL}print-static.svg`} alt="" />
      </div>

      <Nav />

      <main>
        <header>
          <Hero />
        </header>
        <WhatWeDoIntro />
        <WhatWeDo />
        <LogoGallery
          title="Built by Blueprint. Featured on"
          logos={[
            { name: 'Healthline', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIKh7pReVYa4Tui_Healthline.svg' },
            { name: 'TechCrunch', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIKqrpReVYa4Tum_Techcrunch.svg' },
            { name: 'BusinessWire', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIKvLpReVYa4Tuq_BusinessWire.svg' },
            { name: 'The Business Journal', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIK4bpReVYa4Tus_ThebusinessJournal.svg' },
            { name: 'Forbes', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIK-bpReVYa4Tut_Forbes.svg' },
            { name: 'Billboard', url: 'https://blueprint.cdn.prismic.io/blueprint/aRILCbpReVYa4Tuu_Billboard.svg' },
            { name: 'Business Insider', url: 'https://blueprint.cdn.prismic.io/blueprint/aRILLbpReVYa4Tu7_BusinessInsider.svg' },
            { name: 'Music Business WorldWide', url: 'https://blueprint.cdn.prismic.io/blueprint/aRILRLpReVYa4Tu9_MusicBusinessWorldWide.svg' },
          ]}
        />
        <FlexSection />
        <StatsSection />
        <TechSection />
        <VsSection />
        <InvestorsSection />
        <Footer />
      </main>
    </>
  );
}

export default App;
