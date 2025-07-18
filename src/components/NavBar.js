//nav bar imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import "../styles/NavBar.css";
import logo from "../assets/logo.png";
import phoneIcon from "../assets/icons/phone.png"
import {Link, useNavigate} from 'react-router-dom';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft } from 'lucide-react';



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
const panel = mobileRef.current;


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

useLayoutEffect(() => {
  if (panel) gsap.set(panel, { xPercent: 100 });   // drawer lives off‑canvas
}, []);

/////////////////lock body
useEffect(() => {
  let scrollY = 0;

  if (mobileOpen) {
    scrollY = window.scrollY;
    // lock the page at current scroll
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${scrollY}px`;
    document.body.style.left     = '0';
    document.body.style.right    = '0';
    // HIDE the scrollbar
    document.documentElement.style.overflow = 'hidden';
  } else {
    // unlock
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.left     = '';
    document.body.style.right    = '';
    // restore scrollbar
    document.documentElement.style.overflow = '';
    // jump back to where you were
    window.scrollTo(0, scrollY);
  }

  return () => {
    // cleanup on unmount
    document.body.style.position            = '';
    document.body.style.top                 = '';
    document.body.style.left                = '';
    document.body.style.right               = '';
    document.documentElement.style.overflow = '';
  };
}, [mobileOpen]);

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
  if (!mobileRef.current) return;
  if (!window.matchMedia('(max-width:1050px)').matches) return;

  const panel = mobileRef.current;

  /* 1️⃣  Always slide the drawer itself */
  gsap.to(panel, {
    xPercent: mobileOpen ? 0 : 100,
    duration: 0.45,
    ease: 'power3.out',
  });

  /* 2️⃣  MAIN LIST — no animation, just make sure it’s visible */
  if (!mobileMenuKey) {
    const items = panel.querySelectorAll('[data-mobile-item]');
    const cta   = panel.querySelector('[data-mobile-cta]');
    gsap.set([...items, cta], { autoAlpha: 1, y: 0 });
    return;                       // stop; no further tween
  }

  /* 3️⃣  SUBMENU — keep the sweep‑in */
  const sub = panel.querySelector('.mobile-sub');
  if (sub) {
    gsap.fromTo(
      sub,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.5, ease: 'expo.out' }
    );
  }
}, [mobileOpen, mobileMenuKey]);


            

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


        /* ────────────────────────────────────────────────────────
        AUTO‑CLOSE drawer when window exceeds 1050 px
        ──────────────────────────────────────────────────────── */
        useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 1050) {
            // 1) force the panel off‑canvas
            gsap.set(mobileRef.current, { xPercent: 100 });
            // 2) reset React state so future clicks work as expected
            setMobileOpen(false);
            setMobileMenuKey(null);
            }
        }

        handleResize();                    // run once on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        }, []);


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
            <div className="mobile-icon-wrapper">
            {mobileOpen && mobileMenuKey && (
                <button className="back-btn" onClick={() => setMobileMenuKey(null)}>
                <ArrowLeft className="back-icon" />
                </button>
            )}
            <div
                ref={burgerRef}
                className={`menu-icon ${mobileOpen ? 'is-active' : ''}`}
                onClick={e => {
                e.stopPropagation();
                setMobileOpen(p => !p);
                }}
            >
            <span className="menu-icon__line menu-icon__line-left"></span>
            <span className="menu-icon__line"></span>
            <span className="menu-icon__line menu-icon__line-right"></span>
                </div>
            </div>
            

            {/* ── Mobile panel ───────────────────────── */}
            <div 
                ref={mobileRef}  
                className={`mobile-menu ${mobileOpen ? "open" : ""}`}
            >
            
           {/* ───────────────────────────────────────────
                SLIDING ZONE  (main list + sub‑menu)
            ─────────────────────────────────────────── */}
            <div className="mobile-content">

            {/* STEP 1 – top‑level menu  */}
            <ul className="mobile-top-list">
                {['home', 'products', 'resources', 'who'].map((key) => (
                <li key={key}>
                    <button
                    data-mobile-item
                    className="mobile-top"
                    onClick={() => {
                        if (key === 'home') {
                        closeDrawer();
                        navigate('/');
                        } else {
                        setMobileMenuKey(key);   // opens sub‑menu
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

            {/* STEP 2 – sub‑menu (slides over main list) */}
            {mobileMenuKey && (
                <div className="mobile-sub">
                {/* header row: arrow + title */}
                <div className="mobile-sub-header">
                    <button
                    className="sub-back-btn"
                    aria-label="Go back"
                    onClick={() => {
                        const sub = mobileRef.current?.querySelector('.mobile-sub');
                        if (sub) {
                        gsap.to(sub, {
                            xPercent: 100,          // slide out to right
                            duration: 0.5,
                            ease: 'expo.in',
                            onComplete: () => setMobileMenuKey(null), // show main list
                        });
                        } else {
                        setMobileMenuKey(null);
                        }
                    }}
                    >
                    <ArrowLeft size={24} />
                    </button>
                    <span className="sub-title">
                    {mobileMenuKey.charAt(0).toUpperCase() + mobileMenuKey.slice(1)}
                    </span>
                </div>

                {/* sub‑links */}
                <div className="submenu-list">
                    {MOBILE_ITEMS[mobileMenuKey].map(({ label, to }) => (
                    <Link
                        key={label}
                        to={to}
                        data-mobile-item
                        onClick={() => {
                        closeDrawer();
                        navigate(to);
                        }}
                    >
                        {label}
                    </Link>
                    ))}
                </div>
                </div>
            )}
            </div>

            {/* ───────────────────────────────────────────
                PERSISTENT FOOTER  (phone + CTA)
            ─────────────────────────────────────────── */}
            
                        <div className="mobile-cta-wrapper" data-mobile-cta>
                <a href="tel:8008852369" className="phone-link">
                <div className="phone-wrapper">
                    <img src={phoneIcon} alt="" className="phone-icon" />
                    <p>(800) 885-2369</p>
                </div>
                </a>

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
                <a href="tel:8008852369" className="phone-link">
                <div className="phone-wrapper-expanded-menu">
                    <img src={phoneIcon} alt="" className="phone-icon" />
                    <p>(800) 885-2369</p>
                </div>
                </a>
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
