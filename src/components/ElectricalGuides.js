// ---------------------------------------------------------------------
// ElectricalGuides.js  –  Industrial Electrical Guides (wire, testing, ROI)
// ---------------------------------------------------------------------
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "../styles/Guides.css";
import Footer from "./Footer";
import DownloadChartModal from "./DownloadChartModal";

/* -------------------------------------------------------------
   Images / icons  ➜  replace with your own SVG / PNG assets
   ------------------------------------------------------------- */
import heroImg        from "../assets/electrical-hero.png";
import heroImgAlt      from "../assets/electrical-hero2.png";
import iconSizing     from "../assets/icon-wire-sizing.png";
import iconTesting    from "../assets/icon-electrical-test.png";
import iconEfficiency from "../assets/icon-efficiency.png";
import sellThumb      from "../assets/electrical-offer-image.png";
import ampChart from "../assets/amp-chart.png";
import transformerImg from "../assets/transformer-offer-image.png";
import pvfImg         from "../assets/pvf-offer-image2.png";
import electricalImg  from "../assets/electrical-offer-image2.png";
import surplusImg     from "../assets/other-offer-image.png";

/* -------------------------------------------------------------
   Guide “cards” shown in the static icon row + selector column
   ------------------------------------------------------------- */
const GUIDE_DATA = [
  {
    id: "sizing",
    icon: iconSizing,
    title: "Sizing & Load",
    blurb: "AWG / kcmil tables, conduit fill, derating & short-circuit kA."
  },
  {
    id: "testing",
    icon: iconTesting,
    title: "Testing",
    blurb: "Insulation resistance, hipot, infrared scans, breaker secondary-injection."
  },
  {
    id: "roi",
    icon: iconEfficiency,
    title: "Efficiency & ROI",
    blurb: "Energy losses, power-factor correction, retrofit payback, surplus resale."
  }
];

/* ====================================================================
   MAIN COMPONENT
   ==================================================================== */
export default function ElectricalGuides() {
  /* ----- state ----- */
  const [active, setActive] = useState("sizing");   // which big guide?
  const [subTab, setSubTab] = useState("chart");    // sub-tab within a guide
  const panelRef            = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const syncThumbRef = useRef(() => {});

  /* ---------- guide switch animation ---------- */
  function selectGuide(id) {
    const panel = panelRef.current;
    gsap.to(panel, {
      opacity: 0,
      scale: 0.96,
      filter: "blur(6px)",
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        setActive(id);
        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.96, filter: "blur(6px)" },
          { opacity: 1, scale: 1, filter: "blur(0)", duration: 0.2, ease: "power2.out" }
        );
      }
    });
  }

  /* ---------- default sub-tab on guide change ---------- */
  useEffect(() => {
    if (active === "testing")  setSubTab("overview");
    else if (active === "sizing") setSubTab("chart");
    else if (active === "roi")  setSubTab("roiOverview");
  }, [active]);

  /* ------------------------------------------------------
     generic sub-tab bar
     ------------------------------------------------------ */
  function SubTabBar({ options }) {
    return (
      <div className="sub-tabs">
        {options.map(o => (
          <button
            key={o.id}
            className={subTab === o.id ? "active" : ""}
            onClick={() => setSubTab(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    );
  }

  /* ===================================================================
     ①  Sizing & Load
     =================================================================== */
  function SizingPanel() {
    const tabs = [
      { id: "chart", label: "Wire-Ampacity Chart" },
      { id: "info",  label: "Sizing Info" }
    ];

    if (subTab === "chart") {
      return (
        <>
          <SubTabBar options={tabs} />
          <WireChart />
        </>
      );
    }

    /* --- “Sizing Info” sub-tab --- */
    return (
      <>
        <SubTabBar options={tabs} />
        <div
          id="wire-ampacity-info"
          role="tabpanel"
          aria-labelledby="wire-ampacity-info-tab"            /* keep your swap logic */
          className="guide-copy"
        >
          <h3 className="guide-heading">How to read the ampacity chart</h3>

          <ul className="roi-list">
            <li>
              <strong>Pick the conductor material first</strong><br />
              Blue columns list <em>copper</em> ampacities, grey columns list
              <em> aluminum</em>.
            </li>

            <li>
              <strong>Match the insulation / temperature rating</strong><br />
              • 60 °C&nbsp;NM-B&nbsp;&nbsp;•&nbsp;75 °C&nbsp;THHN/THWN&nbsp;&nbsp;•&nbsp;90 °C&nbsp;THHN-2  
              Use the 90 °C column only if <em>every</em> termination on the circuit
              is also rated 90 °C.
            </li>

            <li>
              <strong>Locate the AWG or kcmil row</strong><br />
              Slide across to the correct temperature column—the figure you meet is
              the maximum continuous current (amps) that size may carry without
              exceeding its temperature limit (<em>ampacity</em>).
            </li>

            <li>
              <strong>Derate when required</strong><br />
              More than 3 current-carrying conductors in a raceway or ambient above
              86 °F (30 °C) requires adjustment (NEC §310).  
              Multiply the listed ampacity by the appropriate derating factor, then
              choose the next larger conductor if the result drops below your load.
            </li>

            <li>
              <strong>Leave headroom</strong><br />
              Keep calculated load ≤ 80 % of the ampacity for continuous loads
              (NEC §210.20(A)) and ≤ 125 % for motor branch circuits.
            </li>
          </ul>

          <p className="guide-note">
            <em>Values originate from&nbsp;NEC® Table 310.16 (2023&nbsp;edition) for
            75 °C &amp; 90 °C thermoplastic insulation. Always verify against your
            local code amendments.</em>
          </p>
        </div>
      </>
    );
  }

  /* ===================================================================
     ②  Testing & Diagnostics
     =================================================================== */
  function TestingPanel() {
    const tabs = [
      { id: "overview",  label: "Test Overview" },
      { id: "workflow",  label: "Workflow"      },
      { id: "intervals", label: "Intervals"     }
    ];

    let body = null;
    switch (subTab) {
      case "overview":  body = <TestOverview/>; break;
      case "workflow":  body = <TestWorkflow/>;           break;
      case "intervals": body = <TestIntervals/>;          break;
      default:          body = null;
    }

    return (
      <>
        <SubTabBar options={tabs} />
        {body}
      </>
    );
  }

  /* ===================================================================
     ③  Efficiency / ROI
     =================================================================== */
  function RoiPanel() {
    const tabs = [
      { id: "roiOverview", label: "ROI Overview" },
      { id: "energy",      label: "Energy Model" },
      { id: "carbon",      label: "Carbon Impact"}
    ];

    let body = null;
    switch (subTab) {
      case "roiOverview": body = <RoiOverview/>;       break;
      case "energy":      body = <EnergyModel/>;         break;
      case "carbon":      body = <CarbonImpact/>;             break;
      default:            body = null;
    }

    return (
      <>
        <SubTabBar options={tabs} />
        {body}
      </>
    );
  }

  /* ====================================================================
  wire-ampacity chart 
   ==================================================================== */
function WireChart() {
    return (
        <>
        {/* ---------- Guide block ----------------------------------------- */}
        <section className="guide-block">
            {/* left-hand text + CTA */}
            <div className="guide-copy">
            <h2 className="chart-heading">Wire&nbsp;Size &amp; Amp&nbsp;Ratings</h2>

            <p className="download-line">
                Need a quick amperage reference? Download the full AWG/ampacity
                chart – ideal for shop walls, service trucks, and job-site trailers.
            </p>

            <div className="chart-button">
                <button
                className="cta-btn download-btn"      /* ← same classes used in PVF */
                onClick={() => setModalOpen(true)}
                >
                Download the ampacity chart
                </button>
            </div>
            </div>

            {/* right-hand image */}
            <div className="guide-img-wrap">
            <img
                src={ampChart}
                alt="Wire size and amp-rating chart"
                className="wire-image"
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

        {/* ---------- gated download modal ------------------------------- */}
        {modalOpen && (
      <DownloadChartModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fileSrc="/assets/amp-chart.png"   // just point to your PNG
        fileName="amp-chart.png"
      />
        )}
        </>
    );
    }

  /* ---------- decide which large panel to show ---------- */
  function renderActivePanel() {
    if (active === "sizing")   return <SizingPanel />;
    if (active === "testing")  return <TestingPanel />;
    if (active === "roi")      return <RoiPanel />;
    return null;
  }

  /* ---------- simple drag / swipe scroll for tall panels ---------- */
  /* drag-scroll (desktop + touch — pointer events) */
    useEffect(() => {
      const panel = panelRef.current;
      if (!panel) return;
  
      let lastY = 0;
  
      const onPtrDown = (e) => {
      /* 1 ─ ignore right / middle click (mouse only) */
      if (e.pointerType === 'mouse' && e.button !== 0) return;
  
      /* 2 ─ bail out only when the gesture begins on an interactive control */
      if (
        e.target.closest(
          'button, a, input, textarea, select, [role="button"]'
        )
      ) {
        return;                // let React deliver a normal click
      }
  
      /* 3 ─ continue with drag-scroll setup */
      lastY = e.clientY;
      panel.setPointerCapture(e.pointerId);
      panel.classList.add('drag-scroll');
      panel.style.cursor = 'grabbing';
    };
  
    const onPtrMove = (e) => {
      if (!panel.hasPointerCapture(e.pointerId)) return;
      const dy = e.clientY - lastY;
      panel.scrollTop -= dy;
      lastY = e.clientY;
      syncThumbRef.current();
      e.preventDefault();
    };
  
    const endDrag = (e) => {
      if (panel.hasPointerCapture(e.pointerId)) {
        panel.releasePointerCapture(e.pointerId);
      }
      panel.classList.remove('drag-scroll');
      panel.style.cursor = '';
    };
  
    panel.addEventListener('pointerdown',   onPtrDown,   { passive: false });
    panel.addEventListener('pointermove',   onPtrMove,   { passive: false });
    panel.addEventListener('pointerup',     endDrag);
    panel.addEventListener('pointercancel', endDrag);
    return () => {
      panel.removeEventListener('pointerdown',   onPtrDown);
      panel.removeEventListener('pointermove',   onPtrMove);
      panel.removeEventListener('pointerup',     endDrag);
      panel.removeEventListener('pointercancel', endDrag);
    };
  }, []);

 /* ================================================================
    ①  CUSTOM TRACK + THUMB  (height & Y offset)
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
 
       // — size —
       const trackH = track.clientHeight;
       const thumbH = Math.max((clientHeight / scrollHeight) * trackH, 40); // min 40 px
       thumb.style.height = `${thumbH}px`;
 
       // — position —
       const maxY = trackH - thumbH;                 // travel range
       const pct  = scrollTop / (scrollHeight - clientHeight || 1);
       thumb.style.top = `${pct * maxY}px`;
     };
 
     /* make it visible to the drag-scroll effect */
     syncThumbRef.current = syncThumb;
 
     // initial + listeners
     syncThumb();
     panel.addEventListener('scroll',  syncThumb);
     window.addEventListener('resize', syncThumb);
 
     /* cleanup */
     return () => {
       panel.removeEventListener('scroll',  syncThumb);
       window.removeEventListener('resize', syncThumb);
     };
   }, [active, subTab, hasOverflow]);           // ← same deps as before

  /* ---------- individual sub-tab bodies ---------- */
const TestOverview = () => (
  <ul className="roi-list">
    <li><strong>Prove name-plate performance</strong> – kVA rating, voltage ratio, impedance and loss values confirmed before energising.</li>
    <li><strong>Catch latent defects early</strong> – insulation weak-points, winding displacement, moisture ingress, loose core clamping.</li>
    <li><strong>Baseline for life-cycle trending</strong> – reference data lets you spot deterioration years later.</li>
    <li><strong>Meet code / warranty requirements</strong> – IEEE C57 &amp; IEC 60076 acceptance tests prior to energisation.</li>
    <li><strong>Typical acceptance suite</strong><br/>
        • winding DC resistance<br/>
        • ratio &amp; phase-angle<br/>
        • insulation resistance / PI<br/>
        • power-factor (tan δ)<br/>
        • applied / induced voltage (HIPOT)<br/>
        • SFRA for large power units<br/>
        • oil dielectric &amp; DGA tests
    </li>
  </ul>
);

const TestWorkflow = () => (
  <ol className="roi-list">
    <li><strong>Visual / name-plate check</strong> – shipping damage, oil level, tap setting, grounding.</li>
    <li><strong>Isolation &amp; safety</strong> – LOTO, ground to station grid.</li>
    <li><strong>Core / tank tests</strong> – insulation resistance, PI, power factor (10 kV).</li>
    <li><strong>Winding tests</strong> – DC resistance (all taps), ratio, vector group.</li>
    <li><strong>High-potential tests</strong> – applied &amp; induced per rating.</li>
    <li><strong>Advanced diagnostics</strong> – SFRA, PD, IR scan, vibration (as required).</li>
    <li><strong>Oil sampling</strong> – dielectric, moisture, DGA, furan.</li>
    <li><strong>Data review / acceptance</strong> – compare to factory &amp; standard limits, issue report.</li>
  </ol>
);

const TestIntervals = () => (
  <ul className="roi-list">
    <li><strong>Commissioning</strong> – 100 % of new / relocated units.</li>
    <li><strong>Year-1 warranty check</strong> – resistance + oil screen.</li>
    <li><strong>Routine service</strong><br/>
        • Dry-type ≤ 2.5 MVA : every&nbsp;5 yrs<br/>
        • Oil-filled  10 MVA : DGA yearly, electrical every 5 yrs<br/>
        • Power ≥ 10 MVA : DGA qtrly/½-yr, full electrical every 3 yrs
    </li>
    <li><strong>Condition-based triggers</strong> – DGA spike, through-fault, abnormal vibration/noise.</li>
    <li><strong>Post-maintenance</strong> – repeat full acceptance after rewind, bushing/oil change, tap-changer overhaul.</li>
  </ul>
  
);

/* ─── ROI Overview sub-panel ───────────────────────────────────────── */
function RoiOverview() {
  return (
    <div className="guide-copy">
      <ul className="roi-list">
        <li><strong>Why bother?</strong> – retrofitting a high-loss transformer can cut no-load losses 30-70 %, slashing plant kWh and demand charges.</li>
        <li><strong>Total cost of ownership (TCO)</strong> = purchase price + lifetime energy loss + reliability / downtime risk.</li>
        <li><strong>Payback usually beats depreciation</strong> – modern 98-99 % efficient units often pay for themselves in &lt; 4 yr on 24 h process loads.</li>
        <li><strong>Utility rebates &amp; tax credits</strong> (DOE TP-1 / NEMA Premium) can offset 10-25 % of project CapEx.</li>
        <li><strong>Resale value</strong> – surplus XLPE-dry or liquid-filled units ≥ 1 MVA command 30-50 % of new list price in the second-hand market.</li>
      </ul>
      <div className="cta-button-div">
        <a href="/sell-electrical" className="cta-btn">Sell Electrical Assets</a>
      </div>
    </div>
  );
}

/* ─── Energy Model sub-panel ───────────────────────────────────────── */
function EnergyModel() {
  return (
    <div className="guide-copy">
      <ul className="roi-list">
        <li><strong>No-load losses (core)</strong> – constant 24-7; kW = core-loss × hours ÷ 1000.</li>
        <li><strong>Load losses (copper)</strong> – vary with squared load: kW = load-loss × (load / base)².</li>
        <li><strong>Annual energy cost</strong> = (no-load kW + load kW) × hrs × $/kWh + demand kW × $/kW-mo.</li>
        <li><strong>Capitalised-loss method</strong> – multiply core-loss W by $/W factor (10-20 $/W) to compare bids apples-to-apples.</li>
        <li><strong>Sensitivity</strong> – each ¢/kWh ↑ power price trims simple payback by ≈ 8 months for a 1500 kVA swap.</li>
      </ul>
    </div>
  );
}

/* ─── Carbon Impact sub-panel ──────────────────────────────────────── */
function CarbonImpact() {
  return (
    <div className="guide-copy">
      <ul className="roi-list">
        <li><strong>Scope-2 emissions</strong> – every kWh lost in a transformer shows up in your purchased-power CO₂e line.</li>
        <li><strong>Quick estimate</strong> – ΔkWh × grid factor (US avg ≈ 0.385 kg CO₂e / kWh).</li>
        <li><strong>Typical retrofit saves</strong> – 1 MVA, 20-yr life, 0.6 % efficiency gain → ~250 MWh &amp; 96 t CO₂e avoided.</li>
        <li><strong>ESG frameworks</strong> – reductions book under GHG-Protocol Scope 2, ISO 14064, or SEC climate-risk disclosure.</li>
        <li><strong>Carbon-monetary linkage</strong> – at $50 / t CO₂e social-cost, the same retrofit adds ~$4.8 k to “avoided cost.”</li>
      </ul>
    </div>
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
          <p className="eyebrow">New • 2025 Electrical Guides</p>
          <h1>Master Wire Sizing, Field Testing &amp; Energy ROI</h1>
          <p className="subtitle">
            Free technical playbooks on ampacity, insulation diagnostics and
            efficiency upgrades for industrial power systems.
          </p>
          <div className="cta-button-div">
            <a href="#guides" className="cta-btn">Browse Guides</a>
            <a href="/sell-electrical" className="cta-btn secondary">Sell Electrical Assets</a>
          </div>
        </div>

        <div className="guides-hero__image">
          <img src={heroImg} alt="Electrical switchgear and cabling" />
        </div>
      </section>

      {/* ---------- OVERVIEW CARDS ---------- */}
      <section className="icon-row">
        {GUIDE_DATA.map(card => (
          <div key={card.id} className="overview-card">
            <img src={card.icon} alt="" className="overview-icon" />
            <h4>{card.title}</h4>
            <p>{card.blurb}</p>
          </div>
        ))}
      </section>

      {/* ---------- ACCENT BAND (custom colour) ---------- */}
      <section className="band band--dark">
        <div className="band-inner">
          <div className="band__content">
            <h2>Safety &amp; Efficiency First</h2>
            <p>
              NEC compliance, NFPA&nbsp;70E arc-flash safety and true
              lifecycle ROI — distilled into three actionable guides.
            </p>
            <a href="#guides" className="cta-btn">Compare Guides</a>
          </div>
          <div className="band__visual">
            <img src={heroImgAlt} alt="Infrared inspection of switchgear" />
          </div>
        </div>
      </section>

      {/* ---------- SELECTOR (icons + sliding panel) ---------- */}
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

          {/* track + thumb only render if content is taller than viewport */}
          {hasOverflow && (
            <div className="scroll-track">
              <div className="scroll-thumb" />
            </div>
          )}
       </div>
      </section>

      {/* CTA GRID */}
      <section className="quote-cta bg-white">
        <h2>Ready to Sell Your Equipment?</h2>
        <div className="cta-grid">
          <a className="cta-tile" href="/sell-transformers">
            <img src={transformerImg} alt="Transformers"/><span>Transformers</span>
          </a>
          <a className="cta-tile" href="/sell-PVF">
            <img src={pvfImg} alt="PVF"/><span>PVF</span>
          </a>
          <a className="cta-tile" href="/sell-electrical">
            <img src={electricalImg} alt="Electrical"/><span>Electrical</span>
          </a>
          <a className="cta-tile" href="/sell-surplus">
            <img src={surplusImg} alt="Other"/><span>Other Equipment</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
