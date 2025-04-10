import '../styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';

import HomePage from './HomePage';
import NavBar from './NavBar';
import DropdownPortal from './DropdownPortal';

function App() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownOffset, setDropdownOffset] = useState(null);

  return (
    <BrowserRouter>
      {/* 1) Fixed nav bar at the top */}
      <NavBar 
      activeMenu={activeMenu} 
      setActiveMenu={setActiveMenu}
      setDropdownOffset={setDropdownOffset}
      />

      {/* 2) Dropdown container (renders menus) */}
      <DropdownPortal 
      activeMenu={activeMenu} 
      setActiveMenu={setActiveMenu} 
      dropdownOffset={dropdownOffset}
      />

      {/* 3) Routes/Pages below */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more Routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
