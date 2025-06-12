// DropdownPortal.js
import React, { useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {Link} from 'react-router-dom';
import '../styles/NavBar.css';

function DropdownPortal({ activeMenu, setActiveMenu, dropdownOffset, baseTop = 100 }) {
  const menuRef = useRef(null);
  const showOverlay = !!activeMenu;

  // Each chunk of content includes its own onMouseEnter(() => setActiveMenu("..."))
  function renderMenuContent(menuKey) {
    switch (menuKey) {
      case 'resources':
        return (
          <div
            className="dropdown-inner"
            /* Key fix: reintroduce the old approach:
               onMouseEnter => keep 'resources' active */
            onMouseEnter={() => setActiveMenu('resources')}
            style={{
              left: dropdownOffset,
              width: '600px',
              position: 'relative',
            }}
          >
            <div className="dropdown-column">
              <h3>Product Guides</h3>
              <Link to="/transformer-guides">
              <button className="dropdown-button">Transformer Guide</button>
              </Link>
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
              <Link to="/roi-calculator">
              <button className="dropdown-button">ROI Calculator</button>
              </Link>
              <Link to="/kva-calculator">
              <button className="dropdown-button">kVA Calculator</button>
              </Link>
              <Link to="/fault-current-calculator">
              <button className="dropdown-button">Fault Current Calculator</button>
              </Link>
              <button className="dropdown-button">Customer Feedback</button>
              <button className="dropdown-button">FAQ</button>
            </div>
          </div>
        );
      case 'products':
        return (
          <div
            className="dropdown-inner"
            onMouseEnter={() => setActiveMenu('products')}
            style={{
              left: dropdownOffset,
              width: '600px',
              position: 'relative',
            }}
          >
            <div className="dropdown-column">
              <h3>Products</h3>
              <Link to='/sell-transformers'>
              <button className="dropdown-button">Transformers</button>
              </Link>
              <Link to='/sell-pvf'>
              <button className="dropdown-button">Pipes, Valves, Fittings</button>
              </Link>
              <Link to='/sell-electrical'>
              <button className="dropdown-button">Electrical</button>
              </Link>
              <Link to='/sell-surplus'>
              <button className="dropdown-button">Other Industrial Equipment</button>
              </Link>
            </div>
            <div className="dropdown-column">
              <h3>Services</h3>
              <button className="dropdown-button">Sell Your Surplus</button>
              <button className="dropdown-button">Rentals</button>
            </div>
          </div>
        );
      case 'who':
        return (
          <div
            className="dropdown-inner"
            onMouseEnter={() => setActiveMenu('who')}
            style={{
              left: dropdownOffset,
              width: '600px',
              position: 'relative',
            }}
          >
            <div className="dropdown-column">
              <h3>About Us</h3>
              <button className="dropdown-button">Our Story</button>
              <button className="dropdown-button">Leadership</button>
              <button className="dropdown-button">History</button>
              <button className="dropdown-button">Contact</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <>
      {/* Overlay if menu is active */}
      {showOverlay && (
        <div className="dropdown-overlay" onClick={() => setActiveMenu(null)} />
      )}

      {activeMenu && (
        <div
          className="dropdown-menu"
          /* On leaving entire container, close it */
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
          {/* SwitchTransition for smooth switching from one menu to another */}
          <SwitchTransition>
            <CSSTransition
              key={activeMenu}
              nodeRef={menuRef}
              addEndListener={(done) => {
                menuRef.current?.addEventListener('transitionend', done, false);
              }}
              classNames="dropdown-anim"
              unmountOnExit
              mountOnEnter
              appear
            >
              {/* Single child: wrapper with ref */}
              <div ref={menuRef}>
                {renderMenuContent(activeMenu)}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      )}
    </>
  );
}

export default DropdownPortal;
