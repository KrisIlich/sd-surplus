// DropdownPortal.js
import React, { useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {Link} from 'react-router-dom';
import '../styles/NavBar.css';

function DropdownPortal({ activeMenu, setActiveMenu, dropdownOffset, baseTop = 100 }) {
  const menuRef = useRef(null);
  const showOverlay = !!activeMenu;
  const handleItemClick = () => setActiveMenu(null);

  function renderMenuContent(menuKey) {
    switch (menuKey) {
      case 'resources':
        return (
          <div
            className="dropdown-inner"
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
              <button className="dropdown-button" onClick={handleItemClick}>Transformer Guide</button>
              
              </Link>
              <Link to="/pvf-guides">
              <button className="dropdown-button" onClick={handleItemClick}>PVF Guide</button>
              </Link>
              <Link to="/electrical-guides">
              <button className="dropdown-button" onClick={handleItemClick}>Electrical Guide</button>
              </Link>
              <Link to ="/under-construction">
              <button className="dropdown-button" onClick={handleItemClick}>Data Sheets</button>
              </Link>
            </div>
            <div className="dropdown-column">
              <h3>Educational</h3>
              <Link to ="/under-construction">
              <button className="dropdown-button" onClick={handleItemClick}>Case Studies</button>
              </Link>
              <Link to ="/under-construction">
              <button className="dropdown-button" onClick={handleItemClick}>Workshops</button>
              </Link>
              <Link to ="/under-construction">
              <button className="dropdown-button" onClick={handleItemClick}>Safety & Compliance</button>
              </Link>
            </div>
            <div className="dropdown-column">
              <h3>Tools</h3>
              <Link to="/roi-calculator">
              <button className="dropdown-button" onClick={handleItemClick}>ROI Calculator</button>
              </Link>
              <Link to="/kva-calculator">
              <button className="dropdown-button" onClick={handleItemClick}>kVA Calculator</button>
              </Link>
              <Link to="/fault-current-calculator">
              <button className="dropdown-button" onClick={handleItemClick}>Fault Current Calculator</button>
              </Link>
              <Link to="/pvf-sizing">
              <button className="dropdown-button" onClick={handleItemClick}>PVF Sizing Calculator</button>
              </Link>
              <Link to ="/under-construction">
              <button className="dropdown-button" onClick={handleItemClick}>Customer Feedback</button>
              </Link>
              <button className="dropdown-button" onClick={handleItemClick}>FAQ</button>
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
              <button className="dropdown-button" onClick={handleItemClick}>Transformers</button>
              </Link>
              <Link to='/sell-pvf'>
              <button className="dropdown-button" onClick={handleItemClick}>Pipes, Valves, Fittings</button>
              </Link>
              <Link to='/sell-electrical'>
              <button className="dropdown-button" onClick={handleItemClick}>Electrical</button>
              </Link>
              <Link to='/sell-surplus'>
              <button className="dropdown-button" onClick={handleItemClick}>Other Industrial Equipment</button>
              </Link>
            </div>
            <div className="dropdown-column">
              <h3>Services</h3>
              <Link to="/sell-surplus">
              <button className="dropdown-button" onClick={handleItemClick}>Sell Your Surplus</button>
              </Link>
              <button className="dropdown-button" onClick={handleItemClick}>Rentals</button>
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
              <Link to="/about-us">
              <button className="dropdown-button" onClick={handleItemClick}>About Us</button>
              </Link>
              <button className="dropdown-button" onClick={handleItemClick}>History</button>
              <button className="dropdown-button" onClick={handleItemClick}>Contact</button>
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
