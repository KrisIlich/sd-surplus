//nav bar imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import "../styles/NavBar.css";
import logo from "../assets/logo.png";
import {Link} from 'react-router-dom';
import  { useRef, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';


//Nav Bar
function NavBar({
    activeMenu, 
    setActiveMenu, 
    setDropdownOffset, 
    onHeightChange  //from App
    }) {


const [isShrunk, setIsShrunk] = useState(false);


useEffect(() => {
    function handleScroll() {
      // If scrolled more than 1px, shrink
      if (window.scrollY > 1) {
        setIsShrunk(true);
        onHeightChange(60);
      } else {
        setIsShrunk(false);
        onHeightChange(100);
      }
    }

    // Attach the scroll listener
    window.addEventListener('scroll', handleScroll);
    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


function handleMouseEnter(e, menuKey) {
    const rect= e.currentTarget.getBoundingClientRect();
    //setDropdownOffset({ top: rect.top + rect.height, left: rect.left });
    setDropdownOffset(rect.left);
    setActiveMenu(menuKey);
}

function handleMouseLeave() {
    setActiveMenu(null);
}



    return (

        <div
      id="nav-bar"
      // Condition for shrink class if scrolled down
      className={isShrunk ? 'shrink' : ''}
        >
            <div id="nav-bar-left-section">
                <div id="nav-bar-logo">
                    <img src={logo} alt="logo" />
                    <span id="logo-span">S&D Industrial Surplus</span>
                </div>

                <div id="nav-bar-links">

                    
                    <div className={`nav-item-wrapper ${activeMenu === "products" ? "is-open" : ""}`}
                    onMouseEnter={(e) => handleMouseEnter(e, "products")}
                    onMouseLeave={handleMouseLeave}
                    >
                        <span className="nav-link">
                            Products & Services <NavArrow />
                        </span>
                    </div>

                    
                        <div className={`nav-item-wrapper ${activeMenu === "resources" ? "is-open" : ""}`}
                            onMouseEnter={(e) => handleMouseEnter(e, "resources")}
                            onMouseLeave={handleMouseLeave}
                        >
                            <span className="nav-link">
                                Resources <NavArrow />
                            </span>
                        </div>

                      
                    <div className={`nav-item-wrapper ${activeMenu === "who" ? "is-open" : ""}`}
                         onMouseEnter={(e) => handleMouseEnter(e, "who")}
                         onMouseLeave={handleMouseLeave}
                    >
                        <span className="nav-link">
                            Who We Are <NavArrow />
                        </span>
                    </div>                
                </div>
            </div>

            <div id="nav-bar-right-section">
                <div id="nav-bar-cta">
                    <button>SELL YOUR SURPLUS</button>
                </div>
            </div>
        </div>
    );
}

export default NavBar;

//----------------------------------------------------------------
// Nav Bar Components 
//----------------------------------------------------------------

function NavArrow() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dropdown-arrow"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}
