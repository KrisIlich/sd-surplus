// ---------------------------------------------------------------------
// PvfGuides.js  –  PVF Guides landing page (selection, testing, ROI)
// ---------------------------------------------------------------------
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "../styles/Guides.css";
import Footer from "./Footer";

/* --- images / icons for PVF ----------------------------------------- */
import heroImg        from "../assets/pvf-offer-image2.png";
import iconSizing     from "../assets/icon-pvf-sizing.png";
import iconTesting    from "../assets/icon-pvf-testing.png";
import iconLifecycle  from "../assets/icon-pvf-lifecycle.png";
import sellThumb      from "../assets/pvf-offer-image2.png";
import boltChartImg   from "../assets/bolt-chart-asme-b16-5.png";   // ← NEW

/* --- static data for the three main PVF guides ----------------------- */
const GUIDE_DATA = [
  { id: "bolts",    icon: iconSizing,   title: "Bolting Chart",
    blurb: "Quantity & size of bolts for flanged joints ASME B16.5" },
  { id: "test",     icon: iconTesting,  title: "Testing",
    blurb: "Hydrostatic pressure tests, leakage analysis, and actuation-function checks for reliable performance." },
  { id: "lifecycle",icon: iconLifecycle,title: "Lifecycle ROI",
    blurb: "Maintenance-vs-replace cost analysis, corrosion impact, and service-interval optimization." }
];

export default function PvfGuides() {
  const [active,   setActive]   = useState("bolts");
  const [subTab,   setSubTab]   = useState("chart");
  const [hasOverflow, setHasOverflow] = useState(false);
  const panelRef              = useRef(null);

/* ================================================================
   ①  CUSTOM TRACK + THUMB (height & Y offset)
   ================================================================ */
useEffect(() => {
  const panel = panelRef.current;
  if (!panel) return;

  const track = panel.parentElement.querySelector(".scroll-track");
  const thumb = track?.querySelector(".scroll-thumb");
  if (!track || !thumb) return;

  /* helper that sizes the thumb and positions it */
  const syncThumb = () => {
    const { scrollTop, scrollHeight, clientHeight } = panel;

    // --- size ---
    const trackH  = track.clientHeight;
    const thumbH  = Math.max((clientHeight / scrollHeight) * trackH, 40); // min 40 px
    thumb.style.height = `${thumbH}px`;

    // --- position ---
    const maxY = trackH - thumbH;                 // travel range
    const pct  = scrollTop / (scrollHeight - clientHeight || 1);
    thumb.style.top = `${pct * maxY}px`;
  };

  // initial & listeners
  syncThumb();
  panel.addEventListener("scroll",  syncThumb);
  window.addEventListener("resize", syncThumb);

  return () => {
    panel.removeEventListener("scroll",  syncThumb);
    window.removeEventListener("resize", syncThumb);
  };
}, [active, subTab]);

  /* ================================================================
     ②   FADE / BLUR ANIMATION WHEN SWITCHING GUIDE
     ================================================================ */
  function selectGuide(id) {
    const panel = panelRef.current;
    gsap.to(panel, {
      opacity: 0, scale: 0.96, filter: "blur(6px)", duration: 0.15, ease: "power2.in",
      onComplete: () => {
        setActive(id);
        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.96, filter: "blur(6px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.2, ease: "power2.out" }
        );
      }
    });
  }

  /* switch the sub-tab when guide changes */
  useEffect(() => {
    if (active === "test")        setSubTab("overview");
    else if (active === "bolts")  setSubTab("");
    else if (active === "lifecycle") setSubTab("roiOverview");
    else                          setSubTab("");
  }, [active]);

  /* sub-tab bar component */
  function SubTabBar({ options }) {
    return (
      <div className="sub-tabs">
        {options.map(opt => (
          <button
            key={opt.id}
            className={subTab === opt.id ? "active" : ""}
            onClick={() => setSubTab(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  /* decide which main panel to render */
  function renderActivePanel() {
    switch (active) {
      case "bolts":    return <BoltChartPanel />;
      case "test":     return <TestingPanel />;
      case "lifecycle":return <LifecyclePanel />;
      default:
        const g = GUIDE_DATA.find(x => x.id === active) || {};
        return (<><h3>{g.title}</h3><p>{g.blurb}</p></>);
    }
  }

  /* drag-scroll (desktop + touch — pointer-events) */
useEffect(() => {
  const panel = panelRef.current;
  if (!panel) return;

  let lastY = 0;

  const onPtrDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;   // only left-click
    lastY = e.clientY;
    panel.setPointerCapture(e.pointerId);
    panel.classList.add('drag-scroll');
    panel.style.cursor = 'grabbing';
    e.preventDefault();                                       // block text-select
  };

  const onPtrMove = (e) => {
    if (!panel.hasPointerCapture(e.pointerId)) return;
    const dy        = e.clientY - lastY;
    panel.scrollTop -= dy;            // incremental delta
    lastY            = e.clientY;
    e.preventDefault();
  };

  const endDrag = (e) => {
    if (panel.hasPointerCapture(e.pointerId)) {
      panel.releasePointerCapture(e.pointerId);
    }
    panel.classList.remove('drag-scroll');
    panel.style.cursor = '';
  };

  panel.addEventListener('pointerdown',   onPtrDown, { passive: false });
  panel.addEventListener('pointermove',   onPtrMove, { passive: false });
  panel.addEventListener('pointerup',     endDrag);
  panel.addEventListener('pointercancel', endDrag);

  return () => {
    panel.removeEventListener('pointerdown',   onPtrDown);
    panel.removeEventListener('pointermove',   onPtrMove);
    panel.removeEventListener('pointerup',     endDrag);
    panel.removeEventListener('pointercancel', endDrag);
  };
}, []);


  /* detect if scrollbar actually needed */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.scrollTop = 0;
    setHasOverflow(panel.scrollHeight > panel.clientHeight);
  }, [active, subTab]);

  

  /* ------------------------------------------------------------------
     Sub-panels
     ------------------------------------------------------------------ */
  function SelectionPanel() {
    const tabButtons = [
      { id: "chart", label: "Size Selection Chart" },
      { id: "info",  label: "Sizing Information"  }
    ];

    if (subTab === "chart") {
      return (
        <>
          <SubTabBar options={tabButtons} />
          <BoltChartPanel />
        </>
      );
    }
    /* ——— Info tab ——— */
    return (
      <>
        <SubTabBar options={tabButtons} />
        <p className="info-blurb">
          Proper PVF sizing is critical for safe, leak-free service.
          Use port diameter, pressure classes, and material compatibilities
          to pick the right valve or fitting.
        </p>
        <SizingBulletList />
        <div className="cta-button-div">
          <a href="/pvf-calculator"       className="cta-btn">Open PVF Calculator</a>
          <a href="/fault-pvf-calculator" className="cta-btn secondary">Fault-Current Calculator</a>
        </div>
      </>
    );
  }

  /* reset scroll when (sub)tab changes */
  useEffect(() => { panelRef.current && (panelRef.current.scrollTop = 0); },
           [active, subTab]);

  /* ------------------------------------------------------------------
     BoltChartPanel — now just an embedded PNG
     ------------------------------------------------------------------ */
  function BoltChartPanel() {
  return (
    <section className="bolt-chart">
      <h3 className="chart-heading">
        Quantity & Size of Bolts for Flanged Joints — ASME B 16.5
      </h3>

      {/*  the wrapper that actually scrolls  */}
      <div className="bolt-chart__image-wrapper">
        <img
          src={boltChartImg}
          alt="Bolt quantity, diameter, stud length and ring number for ASME B16.5 flanges"
          className="bolt-chart-image"
          onLoad={(e) => {
            /* tell React whether we need the custom scrollbar */
            const panel = e.target.closest(".selector-panel");
            if (panel) {
              const need = panel.scrollHeight > panel.clientHeight;
              setHasOverflow(need);
            }
          }}
        />
      </div>
    </section>
  );
}


  /* simple bullet list used in Info tab */
  const SizingBulletList = () => (
    <ul className="roi-list">
      <li>Check port size vs. flow requirements (Cv or Kv values)</li>
      <li>Match material specs for temperature &amp; chemical compatibility</li>
      <li>Verify flange ratings per ASME B16.5 / B16.47</li>
      <li>Apply safety factors for pressure surges &amp; water hammer</li>
    </ul>
  );

  /* ------------------------------------------------------------------
     Testing & Lifecycle panels remain unchanged
     ------------------------------------------------------------------ */
  function TestingPanel() {
    const tabs = [
      { id: "overview",  label: "Test Overview" },
      { id: "workflow",  label: "Diagnostics Workflow" },
      { id: "intervals", label: "Maintenance Intervals" }
    ];
    let content = null;
    switch (subTab) {
      case "overview":  content = <TestOverview />;        break;
      case "workflow":  content = <DiagnosticsWorkflow />; break;
      case "intervals": content = <MaintenanceIntervals />;break;
      default:          content = null;
    }
    return (<><SubTabBar options={tabs} />{content}</>);
  }

  /* ...TestOverview, DiagnosticsWorkflow, MaintenanceIntervals
      (unchanged – omitted here for brevity) ...                                               */

  function LifecyclePanel() {
    const tabs = [
      { id: "roiOverview", label: "ROI Overview"  },
      { id: "cashflow",    label: "Cash-Flow Model" },
      { id: "carbon",      label: "Carbon Impact" }
    ];
    let content = null;
    switch (subTab) {
      case "roiOverview": content = <RoiOverview />; break;
      case "cashflow":    content = <CashflowModel />; break;
      case "carbon":      content = <CarbonImpact />; break;
      default:            content = null;
    }
    return (<><SubTabBar options={tabs} />{content}</>);
  }

/* ------------------------------------------------------------------
   ② Testing & Diagnostics
   ------------------------------------------------------------------ */
   function TestingPanel() {
   const tabs = [
       { id: "overview",  label: "Test Overview"        },
       { id: "workflow",  label: "Diagnostics Workflow" },
       { id: "intervals", label: "Maintenance Intervals"}
   ];


   let content = null;
   switch (subTab) {
       case "overview":   content = <TestOverview />;         break;
       case "workflow":   content = <DiagnosticsWorkflow />;  break;
       case "intervals":  content = <MaintenanceIntervals />; break;
       default:           content = null;
   }


   return (
       <>
       <SubTabBar options={tabs} />
       {content}
       </>
   );
   }


   function TestOverview() {
   return (
       <>
       <h3 className="chart-heading">Hydrostatic &amp; Leak-Test Overview</h3>
       <ul className="roi-list">
           <li><b>Hydrostatic Pressure</b> – hold to rated test pressure; inspect for deformations.</li>
           <li><b>Leak Detection</b> – bubble test or helium tracer; max allowed rate per API Std&nbsp;598.</li>
           <li><b>Actuation Check</b> – cycle open/close under no-load; verify torque &amp; response times.</li>
           <li><b>Seat Integrity</b> – ensure soft seats hold ≤0.01% leakage per industry guidelines.</li>
       </ul>
       <div className="btn-row" style={{ marginTop: "1rem" }}>
           <a href="/pvf-calculator" className="cta-btn">Sizing Calculator</a>
           <a href="/roi-calculator" className="cta-btn secondary">ROI Calculator</a>
       </div>
       </>
   );
   }


   function DiagnosticsWorkflow() {
   return (
       <>
       <h3 className="chart-heading">Diagnostics Workflow</h3>
       <p>
           Combine <b>routine pressure tests</b> with <b>visual inspections</b> and
           <b>non-destructive leak checks</b> to move from calendar-based to
           condition-based maintenance.
       </p>
       <ol className="roi-list">
           <li>Record initial acceptance readings &rarr; set baseline in CMMS.</li>
           <li>Perform quarterly leak &amp; actuation tests; log in trend charts.</li>
           <li>Trigger full teardown inspection when leakage threshold.</li>
           <li>Update maintenance intervals based on actual performance data.</li>
       </ol>
       </>
   );
   }


   function MaintenanceIntervals() {
   return (
       <>
       <h3 className="chart-heading">Recommended Maintenance Intervals</h3>
       <table className="sizing-table">
           <thead>
           <tr>
               <th>Component</th>
               <th>Inspection</th>
               <th>Re-seal</th>
               <th>Full Overhaul</th>
           </tr>
           </thead>
           <tbody>
           <tr><td>Ball / Gate Valve</td>     <td>6 mo</td> <td>24 mo</td> <td>72 mo</td></tr>
           <tr><td>Butterfly / Check Valve</td><td>12 mo</td><td>36 mo</td><td>84 mo</td></tr>
           <tr><td>Pump Seals</td>            <td>3 mo</td> <td>18 mo</td> <td>60 mo</td></tr>
           {/* …add more rows as needed… */}
           </tbody>
       </table>
       </>
   );
   }


   /* ------------------------------------------------------------------
   ③ Lifecycle ROI
   ------------------------------------------------------------------ */
   function LifecyclePanel() {
   const tabs = [
       { id: "roiOverview", label: "ROI Overview"  },
       { id: "cashflow",    label: "Cash-Flow Model"},
       { id: "carbon",      label: "Carbon Impact"}
   ];


   let content = null;
   switch (subTab) {
       case "roiOverview": content = <RoiOverview />;   break;
       case "cashflow":    content = <CashflowModel />; break;
       case "carbon":      content = <CarbonImpact />;  break;
       default:            content = null;
   }


   return (
       <>
       <SubTabBar options={tabs} />
       {content}
       </>
   );
   }


   function RoiOverview() {
   return (
       <>
       <h3 className="chart-heading">Why Lifecycle ROI Matters</h3>
       <p>
           PVF assets carry costs beyond purchase—seals, actuation, downtime,
           and environmental compliance. Our ROI framework folds in
           <strong>inspection fees, replacement parts, failure penalties,
           and carbon mitigation</strong> to let you decide whether to
           repair, replace, or remarket with full confidence.
       </p>
       <ul className="roi-list">
           <li>Include seal-replacement costs and labor hours</li>
           <li>Factor leak-penalty clauses and downtime fees</li>
           <li>Apply carbon credits for low-leakage upgrades</li>
           <li>Use ROI calculator for ESG alignment</li>
       </ul>
       <a href="/sell-pvf-stock" className="cta-btn">
           Sell Your PVF Inventory
       </a>
       </>
   );
   }


   function CashflowModel() {
   return (
       <>
       <h3 className="chart-heading">Repair vs Replace Cash-Flow Model</h3>
       <table className="sizing-table">
           <thead>
           <tr>
               <th>Line Item</th>
               <th>Keep Running</th>
               <th>Major Repair</th>
               <th>New Replacement</th>
               <th>Immediate Sale</th>
           </tr>
           </thead>
           <tbody>
           <tr><td>Seal Replacement</td>    <td>$2,000</td>  <td>$6,000</td>  <td>$10,000</td> <td>$4,000</td></tr>
           <tr><td>Downtime Cost</td>       <td>$1,500</td>  <td>$5,000</td>  <td>$0</td>      <td>$0</td></tr>
           <tr><td>Labor &amp; Parts</td>    <td>$500</td>    <td>$2,500</td>  <td>$0</td>      <td>$0</td></tr>
           {/* …more rows as needed… */}
           </tbody>
       </table>
       <ul className="roi-list">
           <li>Embed carbon-savings credit where applicable</li>
           <li>Model replacement COGS vs. overhaul CAPEX</li>
       </ul>
       <a href="/sell-pvf-stock" className="cta-btn">
           Sell Your PVF Inventory
       </a>
       </>
   );
   }


   function CarbonImpact() {
   return (
       <>
       <h3 className="chart-heading">Carbon &amp; ESG Considerations</h3>
       <p>
           Upgrading to low-leakage seals can reduce fugitive emissions
           by up to <b>95%</b>. With internal carbon prices and
           regulatory credits, that often offsets CAPEX in under one cycle.
       </p>
       <ul className="roi-list">
           <li>Estimate tCO₂e saved per seal upgrade</li>
           <li>Include compliance-credit revenues</li>
           <li>Apply ESG scoring for investor reporting</li>
       </ul>
       <a href="/sell-pvf-stock" className="cta-btn">
           Sell Your PVF Inventory
       </a>
       </>
   );
   }


                                  

  /* ===================================================================
     RENDER
     =================================================================== */
  return (
    <div className="kva-page">
      {/* ---------- HERO ---------- */}
      <section className="guides-hero">
        <div className="guides-hero__text">
          <p className="eyebrow">New • 2025 PVF Guides Library</p>
          <h1>Master PVF Selection, Testing &amp; Lifecycle ROI</h1>
          <p className="subtitle">
            Free technical playbooks on valve sizing, pressure-test formulas,
            and asset end-of-life strategies for PVF equipment.
          </p>
          <div className="cta-button-div">
            <a href="#guides" className="cta-btn">Browse Guides</a>
            <a href="/sell-pvf-stock" className="cta-btn secondary">Sell Your PVF Inventory</a>
          </div>
        </div>
        <div className="guides-hero__image">
          <img src={heroImg} alt="PVF equipment overview" />
        </div>
      </section>

      {/* ---------- ICON ROW ---------- */}
      <section className="icon-row">
        {GUIDE_DATA.map(card => (
          <div key={card.id} className="overview-card">
            <img src={card.icon} alt="" className="overview-icon" />
            <h4>{card.title}</h4>
            <p>{card.blurb}</p>
          </div>
        ))}
      </section>

      {/* ---------- PROMO BAND ---------- */}
      <section className="band band--light">
        <div className="band-inner">
          <div className="band__content">
            <h2>Optimize PVF Performance &amp; Profit</h2>
            <p>
              From ASME sizing charts to corrosion-impact analysis, our PVF guides
              provide data-driven methods that reduce downtime and maximize ROI.
            </p>
            <a href="#guides" className="cta-btn">Compare Guides</a>
          </div>
          <div className="band__visual">
            <img src={heroImg} alt="PVF performance" />
          </div>
        </div>
      </section>

      {/* ---------- SELECTOR ---------- */}
      <section id="guides" className="guides-selector">
        <div className="selector-icons">
          {GUIDE_DATA.map(btn => (
            <button
              key={btn.id}
              className={`icon-btn ${active === btn.id ? "active" : ""}`}
              onClick={() => selectGuide(btn.id)}
            >
              <img src={btn.icon} alt="" />
              <span>{btn.title}</span>
            </button>
          ))}
        </div>

        <div className="scroll-wrapper">
          <div className="selector-panel" ref={panelRef}>
            {renderActivePanel()}
          </div>
          {hasOverflow && (
            <div className="scroll-track">
              <div className="scroll-thumb" />
            </div>
          )}
        </div>
      </section>

      {/* ---------- CTA GRID ---------- */}
      <section id="cta" className="quote-cta bg-white">
        <h2>Ready to Monetise PVF Inventory?</h2>
        <div className="cta-grid">
          <a href="/sell-pvf-stock" className="cta-tile">
            <img src={sellThumb} alt="Sell PVF items" />
            <span>Get a Cash Offer</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
