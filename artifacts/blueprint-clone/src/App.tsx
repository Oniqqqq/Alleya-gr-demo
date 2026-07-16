import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Nav from './components/Nav';
import HomePage from './pages/Home';
import BrandsPage from './pages/Brands';
import NotFound from './pages/not-found';

/**
 * Resets scroll on route change so section scroll-animations
 * (scroll listeners / IntersectionObservers) re-initialize from a clean state.
 * If the new location carries a hash, scrolls to the anchor instead.
 */
function ScrollReset() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      document.documentElement.style.setProperty('--mouse-x-pct', `${e.clientX / window.innerWidth}`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Print grid background */}
      <div className="print-bg">
        <img className="bg" src={`${import.meta.env.BASE_URL}print.svg`} alt="" />
        <div 
          className="print-glow-lines" 
          style={{
            maskImage: `url(${import.meta.env.BASE_URL}print.svg)`,
            WebkitMaskImage: `url(${import.meta.env.BASE_URL}print.svg)`
          }}
        />
        <img className="static" src={`${import.meta.env.BASE_URL}print-static.svg`} alt="" />
      </div>

      <ScrollReset />
      <Nav />

      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/brands" component={BrandsPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
