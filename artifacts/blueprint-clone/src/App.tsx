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
  return (
    <>
      {/* Print grid background */}
      <div className="print-bg">
        <img className="bg" src={`${import.meta.env.BASE_URL}print.svg`} alt="" />
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
