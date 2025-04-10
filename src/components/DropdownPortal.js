// DropdownPortal.js
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../styles/NavBar.css'; // or separate file for dropdown styles

function DropdownPortal({ activeMenu, setActiveMenu, dropdownOffset }) {
  // Refs for each dropdown if you have multiple transitions
  const resourcesRef = useRef(null);
  const productsRef = useRef(null);
  const whoRef = useRef(null);

  // header spaceing accomodation
  const baseTop = 100;

  return (
    <>
      {/* RESOURCES Dropdown */}
      <CSSTransition
        in={activeMenu === "resources"}
        timeout={350}
        classNames="dropdown-anim"
        unmountOnExit
        mountOnEnter
        nodeRef={resourcesRef}
      >
        <div
          ref={resourcesRef}
          className="dropdown-menu"
          onMouseEnter={() => setActiveMenu("resources")}
          onMouseLeave={() => setActiveMenu(null)}
          style={{
            // Full-width background
            position: 'fixed',
            top: `${baseTop}px`,
            left: 0,
            right: 0,
            zIndex: 4,
            // you can keep your full width background design
            width: '100vw', // if desired
          }}
        >
          <div 
          className="dropdown-inner"
          style={{
            // SHIFT the columns so 1st column lines up with nav link
            position: 'relative',
            left: `${dropdownOffset}px`,
            // or if you want a certain container width:
            width: '600px', // or however wide your menu is
          }}
          >
            <div className="dropdown-column">
            <h3>Product Guides & Specs</h3>
              <button className="dropdown-button">Transformer Guide</button>
              <button className="dropdown-button">PVF Guide</button>
              <button className="dropdown-button">Electrical Guide</button>
              <button className="dropdown-button">Data Sheets</button>
            </div>
            <div className="dropdown-column">
              <h3>Educational</h3>
              <button className="dropdown-button">Case Studies</button>
              <button className="dropdown-button">Workshops</button>
              <button className="dropdown-button">Safety & Compliance</button>
            </div>
            <div className="dropdown-column">
              <h3>Tools</h3>
              <button className="dropdown-button">Pricing Tools</button>
              <button className="dropdown-button">ROI Calculator</button>
              <button className="dropdown-button">Customer Feedback</button>
              <button className="dropdown-button">FAQ</button>
              <button className="dropdown-button">Contact Us</button>
            </div>
          </div>
        </div>
      </CSSTransition>

      {/* PRODUCTS Dropdown */}
      <CSSTransition
        in={activeMenu === "products"}
        timeout={350}
        classNames="dropdown-anim"
        unmountOnExit
        mountOnEnter
        nodeRef={productsRef}
      >
        <div
          ref={productsRef}
          className="dropdown-menu"
          onMouseEnter={() => setActiveMenu("products")}
          onMouseLeave={() => setActiveMenu(null)}
          style={{
            position: 'fixed',
            top: `${baseTop}px`,
            left: 0,
            right: 0,
            zIndex: 4,
            width: '100vw',
          }}
        >
          <div className="dropdown-inner"
            style={{
              position: 'relative',
              left: `${dropdownOffset}px`,
              width: '600px',
            }}>
          <div className="dropdown-column">
            {/* your product items */}
            <h3>Products</h3>
            <button className="dropdown-button">Transformers</button>
            <button className="dropdown-button">Pipes, Valves, Fittings</button>
          </div>
          <div className="dropdown-column">
            {/* your product items */}
            <div style={{ height: '55px' }}></div>
            <button className="dropdown-button">Electrical</button>
            <button className="dropdown-button">Other Industrial Equipment</button>
          </div>
          <div className="dropdown-column">
            {/* your product items */}
            <h3>Services</h3>
            <button className="dropdown-button">Sell Your Surplus</button>
            <button className="dropdown-button">Rentals</button>
          </div>
          </div>
        </div>
      </CSSTransition>

      {/* WHO WE ARE Dropdown */}
      <CSSTransition
        in={activeMenu === "who"}
        timeout={350}
        classNames="dropdown-anim"
        unmountOnExit
        mountOnEnter
        nodeRef={whoRef}
      >
        <div
          ref={whoRef}
          className="dropdown-menu"
          onMouseEnter={() => setActiveMenu("who")}
          onMouseLeave={() => setActiveMenu(null)}
          style={{
            position: 'fixed',
            top: `${baseTop}px`,
            left: 0,
            right: 0,
            zIndex: 4,
            width: '100vw',
          }}
        >
          <div style={{
              position: 'relative',
              left: `${dropdownOffset}px`,
              width: '600px',
            }}>
            <div className="dropdown-column">
              {/* who we are content */}
              <h3>About Us</h3>
              <button className="dropdown-button">Our Story</button>
              <button className="dropdown-button">Leadership</button>
              <button className="dropdown-button">Our Story</button>
              <button className="dropdown-button">Leadership</button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
}

export default DropdownPortal;
