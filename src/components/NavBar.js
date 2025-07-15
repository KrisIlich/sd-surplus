//nav bar imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import "../styles/NavBar.css";
import logo from "../assets/logo.png";
import {Link, useNavigate} from 'react-router-dom';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';



//Nav Bar
function NavBar({
    activeMenu, 
    setActiveMenu, 
    setDropdownOffset, 
    onHeightChange  //from App
    }) {


const [isShrunk, setIsShrunk] = useState(false);
const [mobileOpen, setMobileOpen] = useState(false);
const [mobileMenuKey, setMobileMenuKey] = useState(null);
const mobileRef = useRef(null);
const burgerRef   = useRef(null);
const tlRef = useRef(null);
const navigate = useNavigate();


const closeDrawer = () => {
  setMobileOpen(false);
  setMobileMenuKey(null);
};

const MOBILE_ITEMS = {
    home: [
        {label: 'Home',     to: '/'}
    ],
  products: [
    { label: 'Transformers',    to: '/sell-transformers' },
    { label: 'Pipes • Valves • Fittings', to: '/sell-pvf' },
    { label: 'Electrical',      to: '/sell-electrical'  },
    { label: 'Sell Your Surplus', to: '/sell-surplus'   }
  ],
  resources: [
    { label: 'Transformer Guide',  to: '/transformer-guides' },
    { label: 'PVF Guide',          to: '/pvf-guides'         },
    { label: 'Electrical Guide',   to: '/electrical-guides'  },
    { label: 'ROI Calculator',     to: '/roi-calculator'     },
    { label: 'kVA Calculator',     to: '/kva-calculator'     },
    { label: 'Fault Current Calc', to: '/fault-current-calculator' },
    { label: 'PVF Sizing Calc',    to: '/pvf-sizing'         }
  ],
  who: [
    { label: 'About Us',       to: '/about-us' },
  ]
};


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

function handleItemClick() {
    setActiveMenu(null);
}
    /* ------------------------------------------------------------------
        GSAP – fire when the drawer opens, reverse when it closes
        -------------------------------------------------------------------*/
        useEffect(() => {
        if (!mobileOpen) return;            // run only when the drawer is opening
        if (!mobileRef.current) return;

        // 1) get fresh nodes (top-level or current submenu)
        const items = mobileRef.current.querySelectorAll('[data-mobile-item]');
        if (!items.length) return;

        // 2) clean up any previous tween
        tlRef.current?.kill();

        // 3) set start-values, then animate in
        gsap.set(items, { x: 250, autoAlpha: 0 });

        tlRef.current = gsap.to(items, {
            x: 0,
            autoAlpha: 1,
            duration: 1.55,
            stagger: 0.07,
            ease: 'power4.out',
        });

        // 4) optional: tidy up when component unmounts
        return () => tlRef.current?.kill();
        }, [mobileOpen, mobileMenuKey]);   // ← rebuild whenever either changes

        useEffect(() => {
        const tl = tlRef.current;
        if (!tl) return;

        if (mobileOpen) {
            tl.restart();   // rewinds to frame 0 *and* plays forward
        } else {
            tl.reverse();   // sweeps everything back off-canvas
        }
        }, [mobileOpen]);


            

   /* ------------------------------------------------------------------
     Close the panel if user clicks outside it or presses Esc
  -------------------------------------------------------------------*/
  useEffect(() => {
    if (!mobileOpen) return;

    function handleClick(e) {

        if (burgerRef.current && burgerRef.current.contains(e.target)) return;

        if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        closeDrawer();
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") handleClick(e);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keyup", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keyup", handleEsc);
    };
  }, [mobileOpen]);


  /* ------------------------------------------------------------------
    GSAP – solo bounce for the CTA
    -------------------------------------------------------------------*/
    useEffect(() => {
    if (!mobileOpen) {
        // drawer is closed → make sure CTA is hidden & tiny
        const cta = mobileRef.current?.querySelector('[data-mobile-cta]');
        if (cta) gsap.set(cta, { scale: 0, autoAlpha: 0 });
        return;
    }

    // drawer just opened
    const menuLinks = mobileRef.current?.querySelectorAll('[data-mobile-item]');
    const cta       = mobileRef.current?.querySelector('[data-mobile-cta]');
    if (!cta || !menuLinks?.length) return;

    /*  — when should the bounce start? —
        main link tween:
            duration  = 1.55 s
            stagger   = 0.07 s
            linkCount = menuLinks.length
        last link finishes at:
            1.55 + (linkCount - 1) * 0.07
        add a hair (0.05 s) so the CTA begins *after* that */
    const delay =
      1 + (menuLinks.length - 1) * 0.07 + 0.05;

    // build the little pop
    gsap.set(cta, { scale: 0, autoAlpha: 0 });

    gsap
        .timeline()
        .to(
        cta,
        {
            scale: 1.1,
            autoAlpha: 1,
            duration: 0.25,
            ease: 'power2.out',
            delay,          // wait until links are in place
        }
        )
        .to(cta, {
        scale: 1,
        duration: 0.15,
        ease: 'power2.out',
        });
    }, [mobileOpen, mobileMenuKey]);   // rebuild whenever the drawer (or submenu) opens



    return (

        <div
      id="nav-bar"
      // Condition for shrink class if scrolled down
      className={isShrunk ? 'shrink' : ''}
        >
            <div id="nav-bar-left-section">
                <Link to="/" className="logo-link" onClick={() => window.scrollTo(0, 0)}>
                    <div id="nav-bar-logo">
                        <img src={logo} alt="logo" />
                        <span id="logo-span">S&D Industrial Surplus</span>
                    </div>
                </Link>

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

            {/* ───────── Hamburger Icon ───────── */}
            <div
            ref={burgerRef}
            className={`menu-icon ${mobileOpen ? 'is-active' : ''}`}   // ← add is-active class
            onClick={e => {
                e.stopPropagation();          // <-- keeps a close click from re-opening
                setMobileOpen(p => !p);
            }}
            >
            <span className="menu-icon__line menu-icon__line-left"></span>
            <span className="menu-icon__line"></span>
            <span className="menu-icon__line menu-icon__line-right"></span>
            </div>
            

            {/* ── Mobile panel ───────────────────────── */}
            <div 
                ref={mobileRef}  
                className={`mobile-menu ${mobileOpen ? "open" : ""}`}
            >

           {/*  STEP 1 – top level  */}
            {!mobileMenuKey && (
            <>
                <ul className="mobile-top-list">
                {['home', 'products', 'resources', 'who'].map((key) => (
                    <li key={key}>
                    <button
                        data-mobile-item
                        className="mobile-top"
                        onClick={() => {
                        if (key === 'home') {
                            closeDrawer();
                            navigate('/')
                            
                        } else {
                            setMobileMenuKey(key);  // open submenu
                        }
                        }}
                    >
                        {key === 'home'
                        ? 'Home'
                        : key === 'products'
                        ? 'Products & Services'
                        : key === 'resources'
                        ? 'Resources'
                        : 'Who We Are'}
                    </button>
                    </li>
                ))}
                </ul>
            </>
            )}
            {/*  STEP 2 – second level  */}
            {mobileMenuKey && (
                <div className="mobile-sub">
                <button className="back-btn" onClick={()=>setMobileMenuKey(null)}>
                    ← Back
                </button>
                {MOBILE_ITEMS[mobileMenuKey].map(({label,to})=>(
                    <Link
                    data-mobile-item
                    key={label}
                    to={to}
                    onClick={()=>{
                        closeDrawer();
                        navigate('/')
                    }}
                    >
                    {label}
                    </Link>
                ))}
                </div>
                
            )}
            
               <div className="mobile-cta-wrapper" data-mobile-cta>
                <Link
                    to="/sell-surplus"
                    className="cta-link"
                    onClick={() => {
                    closeDrawer();      // hide drawer
                    }}
                >
                    SELL YOUR SURPLUS
                </Link>
                </div>

            </div>
            
            {mobileOpen && (
            <div
                className="mobile-backdrop"
                onClick={closeDrawer}
            />
            )}

            <div id="nav-bar-right-section">
                <div id="nav-bar-cta">
                    <Link to="/sell-surplus" className="cta-link">
                        <button>SELL YOUR SURPLUS</button>
                    </Link>
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
