import { useCallback, useEffect, useRef, useState } from 'react';
import BrandPicker from '../sections/brands/BrandPicker';
import ApplicationsPicker from '../sections/brands/ApplicationsPicker';
import PresenceMap from '../sections/brands/PresenceMap';
import ContactSection from '../sections/ContactSection';
import Footer from '../sections/Footer';
import { getBrand } from '../data/brands';
import { getApplication, APPLICATIONS } from '../data/applications';
import { CompanyLocation } from '../data/locations';

export default function BrandsPage() {
  const [selectedBrandId, setSelectedBrandId] = useState('alleya-group');
  const [selectedAppId, setSelectedAppId] = useState(APPLICATIONS[0].id);
  const [selectedLocation, setSelectedLocation] = useState<CompanyLocation | null>(null);
  const pendingBrand = useRef(0);

  // Переход «направление → бренд»: сначала плавная прокрутка к блоку
  // брендов, затем запуск перехода активного состояния.
  const goToBrand = useCallback((brandId: string) => {
    const section = document.getElementById('brands-picker');
    if (!section) {
      setSelectedBrandId(brandId);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      section.scrollIntoView({ behavior: 'auto', block: 'start' });
      setSelectedBrandId(brandId);
      return;
    }

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // ждём окончания прокрутки, затем запускаем анимацию смены бренда
    clearTimeout(pendingBrand.current);
    let lastY = -1;
    let stableFrames = 0;
    const watch = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 1) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }
      lastY = y;
      if (stableFrames >= 6) {
        setSelectedBrandId(brandId);
        return;
      }
      pendingBrand.current = window.setTimeout(() => requestAnimationFrame(watch), 16);
    };
    requestAnimationFrame(watch);
  }, []);

  useEffect(() => () => clearTimeout(pendingBrand.current), []);

  const selectedBrand = getBrand(selectedBrandId);
  const selectedApp = getApplication(selectedAppId);

  return (
    <main className="brands-page">
      <BrandPicker
        selectedBrandId={selectedBrandId}
        onSelectBrand={setSelectedBrandId}
      />

      <ApplicationsPicker
        selectedAppId={selectedAppId}
        onSelectApp={setSelectedAppId}
        onGoToBrand={goToBrand}
      />

      <PresenceMap onSelectLocation={setSelectedLocation} />

      <ContactSection
        context={{
          brand: selectedBrand?.name,
          application: selectedApp?.name,
          location: selectedLocation ? `${selectedLocation.name}, ${selectedLocation.city}` : undefined,
        }}
      />

      <Footer />
    </main>
  );
}
