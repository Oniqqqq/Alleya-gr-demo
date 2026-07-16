import LogoGallery from './LogoGallery';

const INVESTOR_LOGOS = [
  { name: 'Point72', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIMsrpReVYa4Txb_Point72.svg' },
  { name: 'SmashVentures', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIMxbpReVYa4Txe_SmashVentures.svg' },
  { name: 'General Catalyst', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIM17pReVYa4Txj_GeneralCatalyst.svg' },
  { name: 'Imaginary', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIM6LpReVYa4Txk_Imaginary.svg' },
  { name: 'Goldman Sachs', url: 'https://blueprint.cdn.prismic.io/blueprint/aRIM-7pReVYa4Txo_GoldmanSachs.svg' },
];

export default function InvestorsSection() {
  return (
    <div className="investors-section">
      <LogoGallery
        title="Our clients are backed by leading investors"
        logos={INVESTOR_LOGOS}
      />
    </div>
  );
}
