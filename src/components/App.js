import '../styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ScrollToTop from './ScrollToTop';

import HomePage from './HomePage';
import NavBar from './NavBar';
import DropdownPortal from './DropdownPortal';
import Lenis from 'lenis'
import ChatButton    from './ChatButton';
import SellSurplus from './SellSurplus';
import SellTransformers from './SellTransformers';
import SellPVF from './SellPVF';
import SellElectrical from './SellElectrical';
import KvaCalculator from './KvaCalculator';
import FaultCurrentCalculator from './FaultCurrentCalculator';
import RoiCalculator from './RoiCalculator';
import TransformerGuides from './TransformerGuides';
import PvfGuides from './PvfGuides';
import PvfSizingCalculator from './PvfSizingCalculator';
import ElectricalGuides from './ElectricalGuides';
import UnderConstruction from './UnderConstruction';
import AboutUs from './AboutUs';
import PadmountArticle from './Articles/PadmountArticle';

function App() {
  const [navHeight, setNavHeight] = useState(100);
  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownOffset, setDropdownOffset] = useState(null);
  useEffect(() => {
    // 1) create a Lenis instance
    const lenis = new Lenis({
      duration: 0.8,                   // how long (in seconds) it takes to “catch up” to the target scroll
      easing: t => (--t)*t*t+1,                   // your easing function (t 0→1)
      orientation: 'vertical',         // or 'horizontal'
      direction:   'vertical',         // or 'horizontal'
      gestureOrientation: 'vertical',  // wheel/touch gesture must be in this dir to trigger  
      smoothWheel: true,               // enable smooth inertia for wheel
      smoothTouch: false,              // enable smooth inertia for touch
      wheelMultiplier: .9,              // multiply wheel delta (1→ more natural; <1→slower)
      touchMultiplier: .9,              // multiply touch delta
      infinite: false                  // wrap scroll so it never ends
    })

    // 2) create RAF loop
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // optional cleanup
    return () => {
      lenis.destroy()
    }
    }, [])

  return (
    <BrowserRouter basename="/sd-surplus">
    <ScrollToTop>
      {/* 1) Fixed nav bar at the top */}
      <NavBar 
      activeMenu={activeMenu} 
      setActiveMenu={setActiveMenu}
      setDropdownOffset={setDropdownOffset}
      onHeightChange={setNavHeight}
      />

      {/* 2) Dropdown container (renders menus) */}
      <DropdownPortal 
      activeMenu={activeMenu} 
      setActiveMenu={setActiveMenu} 
      dropdownOffset={dropdownOffset}
      baseTop={navHeight}
      />

      {/* 3) Routes/Pages below */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sell-surplus" element={<SellSurplus />} />
        <Route path ="/sell-transformers" element={<SellTransformers/>}/>
        <Route path="/sell-pvf" element={<SellPVF />} />
        <Route path="/sell-electrical" element={<SellElectrical />} />
        <Route path="/kva-calculator" element={<KvaCalculator />} />
        <Route path="/fault-current-calculator" element={<FaultCurrentCalculator />} />
        <Route path="/roi-calculator" element={<RoiCalculator />} />
        <Route path="/transformer-guides" element={<TransformerGuides/>} />
        <Route path="/pvf-guides" element={<PvfGuides/>} />
        <Route path="/pvf-sizing" element={<PvfSizingCalculator/>}/>
        <Route path="/electrical-guides" element={<ElectricalGuides/>} />
        <Route path="/under-construction" element={<UnderConstruction/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/articles/3-phase-padmount" element={<PadmountArticle />} />
        
        </Routes>
      <ChatButton />
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
