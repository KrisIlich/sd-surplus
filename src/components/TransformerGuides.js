// ---------------------------------------------------------------------
// TransformerGuides.js  –  Guides landing page (selection, testing, ROI)
// ---------------------------------------------------------------------
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "../styles/Guides.css";
import Footer from "./Footer";

/* --- images / icons ------------------------------------------------- */
import heroImg   from "../assets/transformer-hero.png";
import iconSub   from "../assets/icon-substation.png";
import iconOem   from "../assets/icon-oem.png";
import iconTest  from "../assets/icon-testing.png";
import sellThumb from "../assets/transformer-offer-image.png";

/* --- static data for the three main guides -------------------------- */
const GUIDE_DATA = [
  {
    id: "sel",
    icon: iconSub,
    title: "Selection & Sizing",
    blurb:
      "Determine pad-mount vs walk-in designs, kVA tables, and primary/secondary voltage picks per IEEE C57."
  },
  {
    id: "test",
    icon: iconTest,
    title: "Testing",
    blurb:
      "DGA gas ratios, insulation power-factor, SFRA analysis and thermal models."
  },
  {
    id: "lifecycle",
    icon: iconOem,
    title: "Lifecycle ROI",
    blurb:
      "Repair-vs-replace economics, surplus resale valuation, total ownership cost."
  }
];

/* ====================================================================
   MAIN COMPONENT
   ==================================================================== */
export default function TransformerGuides() {
  /* ----- state ----- */
  const [active, setActive]   = useState("sel");   // which big guide?
  const [subTab, setSubTab]   = useState("chart"); // sub-tab within a guide
  const panelRef              = useRef(null);

  function selectGuide(id) {
  const panel = panelRef.current;

  // 1) blur-out & fade-out (150 ms)
  gsap.to(panel, {
    opacity: 0,
    scale: 0.96,
    filter: "blur(6px)",     // full blur at the end of phase-out
    duration: 0.15,
    ease: "power2.in",
    onComplete: () => {
      // 2) swap the React state while panel is invisible
      setActive(id);

      // 3) fade-in & sharpen (200 ms)
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.96, filter: "blur(6px)" },
        { opacity: 1, scale: 1,   filter: "blur(0px)",
          duration: 0.20,
          ease: "power2.out"
        }
      );
    }
  });
}

  /* ----- choose default sub-tab when guide changes ----- */
  useEffect(() => {
    if (active === "test")      setSubTab("overview");
    else if (active === "sel")  setSubTab("chart");
    else if (active === "lifecycle") setSubTab("roiOverview");
    else                        setSubTab("");
  }, [active]);

  /* ------------------------------------------------------------------
     helper: generic sub-tab button bar
  ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------
     ① Selection & Sizing
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

          <div className="table-row">
            <div className="table-col">
              <h3 className="chart-heading">Single-Phase – Full-Load Current (A)</h3>
              <SinglePhaseTable />
            </div>

            <div className="table-col">
              <h3 className="chart-heading">Three-Phase – F/L Current per Line (A)</h3>
              <ThreePhaseTable />
            </div>
          </div>
        </>
      );
    }

    /* --- sizing-information sub-tab --- */
    return (
      <>
        <SubTabBar options={tabButtons} />

        <h3>Sizing Information &amp; Best Practices</h3>
        <p>
          Proper transformer sizing is critical for <b>power distribution</b> and&nbsp;
          <b>industrial uptime</b>. Measure line-to-line or line-to-neutral&nbsp;
          <b>voltage (V)</b> and full-load <b>current (A)</b>, compute apparent power
          (<b>kVA</b>), then apply these rules …
        </p>

        <SizingBulletList />

        <div className="cta-button-div">
          <a href="/kva-calculator"           className="cta-btn">Open kVA Calculator</a>
          <a href="/fault-current-calculator" className="cta-btn secondary">Fault-Current Calculator</a>
        </div>
      </>
    );
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
      case "overview":   content = <TestOverview />;          break;
      case "workflow":   content = <DiagnosticsWorkflow />;   break;
      case "intervals":  content = <MaintenanceIntervals />;  break;
      default:           content = null;
    }

    return (
      <>
        <SubTabBar options={tabs} />
        {content}
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
      { id: "carbon",      label: "Carbon Impact" }
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

  /* ------------------------------------------------------------------
     decide which panel to show
  ------------------------------------------------------------------ */
  function renderActivePanel() {
    switch (active) {
      case "sel":       return <SelectionPanel />;
      case "test":      return <TestingPanel />;
      case "lifecycle": return <LifecyclePanel />;
      default:
        const g = GUIDE_DATA.find(x => x.id === active) || {};
        return (
          <>
            <h3>{g.title}</h3>
            <p>{g.blurb}</p>
          </>
        );
    }
  }

  /* ---------------------------------------------------------------
   Enable drag / swipe scrolling inside the selector-panel
  ---------------------------------------------------------------- */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let isDown = false;
    let startY = 0;
    let scrollStart = 0;

    /* pointer / touch down */
    const onDown = e => {
      isDown = true;
      panel.classList.add('drag-scroll');   // optional cursor change
      startY      = (e.touches ? e.touches[0].pageY : e.pageY);
      scrollStart = panel.scrollTop;
    };

    /* move → translate to scrollTop */
    const onMove = e => {
      if (!isDown) return;
      const y = (e.touches ? e.touches[0].pageY : e.pageY);
      const delta = y - startY;
      panel.scrollTop = scrollStart - delta;
    };

    /* pointer / touch up */
    const onUp = () => {
      isDown = false;
      panel.classList.remove('drag-scroll');
    };

    /* attach listeners */
    panel.addEventListener('mousedown',  onDown);
    panel.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchend',  onUp);

    /* cleanup on unmount */
    return () => {
      panel.removeEventListener('mousedown',  onDown);
      panel.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchend',  onUp);
    };
  }, []);

      useEffect(() => {
      const panel = panelRef.current;
      const thumb = panel?.parentNode.querySelector('.scroll-thumb');

      if(!panel || !thumb) return;

      /* Resize thumb proportional to content height */
      function setThumbSize(){
        const ratio   = panel.clientHeight / panel.scrollHeight;
        thumb.style.height = Math.max(ratio * panel.clientHeight, 40) + 'px';
      }

      /* Move thumb as user scrolls (or via GSAP animation) */
      function syncThumb(){
        const max     = panel.scrollHeight - panel.clientHeight;
        const percent = panel.scrollTop / max;
        const track   = panel.clientHeight - thumb.offsetHeight;
        thumb.style.top = percent * track + 'px';
      }

      /* initial */
      setThumbSize();  syncThumb();

      /* listeners */
      panel.addEventListener('scroll', syncThumb);
      window.addEventListener('resize', setThumbSize);

      /* clean-up */
      return () => {
        panel.removeEventListener('scroll', syncThumb);
        window.removeEventListener('resize', setThumbSize);
      };
    }, [active, subTab]);   // re-run whenever panel content swaps


  /* ==================================================================
     RENDER
     ================================================================== */
  return (
    <div className="kva-page">
      {/* ---------- HERO ---------- */}
      <section className="guides-hero">
        <div className="guides-hero__text">
          <p className="eyebrow">New • 2025 Guides Library</p>
          <h1>Master Transformer Selection, Testing &amp; Lifecycle ROI</h1>
          <p className="subtitle">
            Free technical playbooks on kVA sizing, impedance &amp; fault-current
            formulas, online DGA and asset end-of-life strategy.
          </p>

          <div className="cta-button-div">
            <a href="#guides"          className="cta-btn">Browse Guides</a>
            <a href="/sell-transformers" className="cta-btn secondary">
              Sell Your Transformers
            </a>
          </div>
        </div>

        <div className="guides-hero__image">
          <img src={heroImg} alt="Power transformer on concrete pad" />
        </div>
      </section>

      {/* ---------- NON-INTERACTIVE OVERVIEW ICONS ---------- */}
      <section className="icon-row">
        {GUIDE_DATA.map(card => (
          <div key={card.id} className="overview-card">
            <img src={card.icon} alt="" className="overview-icon" />
            <h4>{card.title}</h4>
            <p>{card.blurb}</p>
          </div>
        ))}
      </section>

      {/* ---------- DARK PROMO BAND ---------- */}
      <section className="band band--dark">
        <div className="band-inner">
          <div className="band__content">
            <h2>Reliability &amp; ROI Are Our Highest Priority</h2>
            <p>
              From NEC load studies to IEEE C57 maintenance schedules, our guides
              deliver data-driven methods that cut unplanned outages and maximise
              asset value.
            </p>
            <a href="#guides" className="cta-btn">Compare Guides</a>
          </div>

          <div className="band__visual">
            <img src={heroImg} alt="Transformer monitoring" />
          </div>
        </div>
      </section>

      {/* ---------- INTERACTIVE SELECTOR ---------- */}
      <section id="guides" className="guides-selector">
        {/* icon column */}
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

        {/* sliding content panel */}
        <div className="scroll-wrapper">
        <div className="selector-panel" ref={panelRef}>
          {renderActivePanel()}
        </div>

        <div className="scroll-track">
          <div className="scroll-thumb">
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA GRID ---------- */}
      <section id="cta" className="quote-cta bg-white">
        <h2>Ready to Monetise Surplus Transformers?</h2>
        <div className="cta-grid">
          <a href="/sell-transformers" className="cta-tile">
            <img src={sellThumb} alt="Sell transformers" />
            <span>Get a Cash Offer</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}





/* ====================================================================
    SUB-COMPONENTS
   ==================================================================== */


   /* --------------------------------------------------------------
   Single-Phase – Full-Load Current (Amps)  ✅ production version
   -------------------------------------------------------------- */
function SinglePhaseTable() {
  return (
    <table className="sizing-table">
      <thead>
        <tr>
          <th>kVA</th>
          <th>120&nbsp;V</th>
          <th>240&nbsp;V</th>
          <th>480&nbsp;V</th>
          <th>600&nbsp;V</th>
        </tr>
      </thead>

      <tbody>
        <tr><td>1</td>     <td>8.3</td>    <td>4.2</td>   <td>2.1</td>    <td>1.6</td></tr>
        <tr><td>2</td>     <td>16.7</td>   <td>8.4</td>   <td>4.2</td>    <td>3.2</td></tr>
        <tr><td>3</td>     <td>25.0</td>   <td>12.5</td>  <td>6.3</td>    <td>5.0</td></tr>
        <tr><td>5</td>     <td>41.7</td>   <td>20.8</td>  <td>10.4</td>   <td>8.3</td></tr>
        <tr><td>7.5</td>   <td>62.5</td>   <td>31.2</td>  <td>15.6</td>   <td>12.5</td></tr>
        <tr><td>10</td>    <td>83.4</td>   <td>41.7</td>  <td>20.8</td>   <td>16.7</td></tr>
        <tr><td>15</td>    <td>125</td>    <td>62.5</td>  <td>31.2</td>   <td>25.0</td></tr>
        <tr><td>25</td>    <td>208</td>    <td>104</td>   <td>52.1</td>   <td>41.6</td></tr>
        <tr><td>37.5</td>  <td>312</td>    <td>156</td>   <td>78.2</td>   <td>62.5</td></tr>
        <tr><td>50</td>    <td>416</td>    <td>208</td>   <td>104</td>    <td>83.3</td></tr>
        <tr><td>75</td>    <td>625</td>    <td>312</td>   <td>156</td>    <td>125</td></tr>
        <tr><td>100</td>   <td>833</td>    <td>416</td>   <td>208</td>    <td>167</td></tr>
        <tr><td>150</td>   <td>1 250</td>  <td>625</td>   <td>312</td>    <td>250</td></tr>
        <tr><td>167</td>   <td>1 391</td>  <td>696</td>   <td>348</td>    <td>278</td></tr>
        <tr><td>250</td>   <td>2 083</td>  <td>1 041</td> <td>521</td>    <td>417</td></tr>
        <tr><td>333</td>   <td>2 775</td>  <td>1 387</td> <td>694</td>    <td>555</td></tr>
        <tr><td>500</td>   <td>4 166</td>  <td>2 083</td> <td>1 042</td>  <td>833</td></tr>
      </tbody>
    </table>
  );
}
/* --------------------------------------------------------------
   Three-Phase – Full-Load Current per Line (Amps)
   -------------------------------------------------------------- */
function ThreePhaseTable() {
  return (
    <table className="sizing-table">
      <thead>
        <tr>
          <th>kVA</th>
          <th>208&nbsp;V</th>
          <th>240&nbsp;V</th>
          <th>480&nbsp;V</th>
          <th>600&nbsp;V</th>
        </tr>
      </thead>

      <tbody>
        <tr><td>6</td>       <td>16.6</td>   <td>14.4</td>   <td>7.2</td>    <td>5.8</td></tr>
        <tr><td>9</td>       <td>25.0</td>   <td>21.6</td>   <td>10.8</td>   <td>8.7</td></tr>
        <tr><td>10</td>      <td>28.0</td>   <td>24.0</td>   <td>12.0</td>   <td>9.6</td></tr>
        <tr><td>15</td>      <td>41.6</td>   <td>36.1</td>   <td>18.1</td>   <td>14.4</td></tr>
        <tr><td>30</td>      <td>83.3</td>   <td>72.3</td>   <td>36.1</td>   <td>28.9</td></tr>
        <tr><td>45</td>      <td>125</td>    <td>108</td>    <td>54.0</td>   <td>43.2</td></tr>
        <tr><td>75</td>      <td>208</td>    <td>181</td>    <td>90.5</td>   <td>72.1</td></tr>
        <tr><td>112.5</td>   <td>312</td>    <td>272</td>    <td>136</td>    <td>108</td></tr>
        <tr><td>150</td>     <td>416</td>    <td>360</td>    <td>180</td>    <td>144</td></tr>
        <tr><td>225</td>     <td>624</td>    <td>541</td>    <td>270</td>    <td>216</td></tr>
        <tr><td>300</td>     <td>832</td>    <td>722</td>    <td>361</td>    <td>288</td></tr>
        <tr><td>450</td>     <td>1 250</td>  <td>1 083</td>  <td>542</td>    <td>433</td></tr>
        <tr><td>500</td>     <td>1 388</td>  <td>1 203</td>  <td>601</td>    <td>481</td></tr>
        <tr><td>600</td>     <td>1 666</td>  <td>1 445</td>  <td>722</td>    <td>578</td></tr>
      </tbody>
    </table>
  );
}

/* ------------------------------------------------------------------
   Bullet-list helper – Sizing Information & Best Practices
   ------------------------------------------------------------------ */
function SizingBulletList() {
  return (
    <ul className="roi-list">
      <li>
        <b>Apparent Power&nbsp;(kVA)</b> = V&nbsp;×&nbsp;A&nbsp;/ 1000 for 1-phase,
        or √3&nbsp;×&nbsp;V&nbsp;×&nbsp;A&nbsp;/ 1000 for 3-phase.  
        <em>Always round up</em> to the next standard kVA rating.
      </li>

      <li>
        <b>Inrush &amp; Motor Starting</b> – Large motors can draw
        6–12&nbsp;× full-load current.  Specify a transformer at least
        125 % of calculated kVA, or use soft-start / VFD mitigation.
      </li>

      <li>
        <b>Load Diversity &amp; Growth</b> – Apply demand factors and add a
        10–20 % margin for future expansion to avoid chronic overloads.
      </li>

      <li>
        <b>Impedance &amp; Fault-Current</b> – Check %Z to confirm available
        short-circuit amperes and ensure breaker coordination.
      </li>

      <li>
        <b>Standards Compliance</b> – Follow
        IEEE&nbsp;C57.12 for liquid-filled or IEEE&nbsp;C57.13 for dry-type
        units, plus NEC Article 450 for over-current protection.
      </li>

      <li>
        <b>Environment &amp; Cooling Class</b> – Choose ONAN, ONAF, or OA/FA
        based on ambient temperature, enclosure type, and required IP rating.
      </li>
    </ul>
  );
}


/* ------------------------------------------------------------------
    Core electrical & oil-based tests – “Test Overview” sub-tab
   ------------------------------------------------------------------ */
function TestOverview() {
  return (
    <>
      <h3 className="chart-heading">
        Core Electrical&nbsp;&amp; Oil-Based Tests
      </h3>

      <ul className="roi-list">
        <li>
          <b>Dissolved Gas Analysis (DGA)</b> – IEC 60599 limits, Duval
          triangles, trending for incipient faults and overheating.
        </li>

        <li>
          <b>Power-Factor / Tan Δ</b> – 10 kV insulation health check,
          moisture &amp; ageing indicators; flag results &gt; 1 %.
        </li>

        <li>
          <b>Sweep-Frequency Response (SFRA)</b> – Detects core shift or
          winding displacement after through-faults or transport.
        </li>

        <li>
          <b>Winding Resistance &amp; TTR</b> – Hot-spot calculation,
          tap-changer contact evaluation, phase balance verification.
        </li>

        <li>
          <b>Infrared Thermography</b> – Cooling-fan failures, bushing
          hot-spots, blocked radiators or oil-flow paths.
        </li>

        <li>
          <b>Oil Quality</b> – ASTM D1816 dielectric strength, ppm
          moisture, interfacial tension &amp; furan ageing markers.
        </li>
      </ul>

      {/* Optional calculator shortcuts */}
      <div className="btn-row" style={{ marginTop: "1rem" }}>
        <a href="/kva-calculator" className="cta-btn">
          kVA Calculator
        </a>
        <a href="/roi-calculator" className="cta-btn secondary">
          ROI Calculator
        </a>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
    Step-by-step “Diagnostics Workflow” sub-tab
   ------------------------------------------------------------------ */
function DiagnosticsWorkflow() {
  return (
    <>
      <h3 className="chart-heading">Diagnostics Workflow</h3>

      <p>
        Combine <b>online condition monitoring</b> (DGA, load &amp;
        temperature trending) with <b>annual offline tests</b> to move
        from time-based to reliability-centred maintenance. The sequence
        below aligns with <b>IEEE C57.104</b> guidelines and the thermal
        model in <b>IEC 60076-7</b>.
      </p>

      <ol className="roi-list">
        <li>
          Capture factory acceptance data &rarr; build a{" "}
          <em>digital twin</em> baseline.
        </li>
        <li>
          Upload on-line DGA and load histograms quarterly; trend key
          gases (H₂, C₂H₂, CO₂) and top-oil&nbsp;ΔT.
        </li>
        <li>
          Apply risk indices—trigger offline tests only when thresholds
          are exceeded, avoiding unnecessary outages.
        </li>
        <li>
          Perform SFRA and power-factor after any through-fault or major
          transport event.
        </li>
        <li>
          Feed the updated failure-probability data into the{" "}
          <b>ROI Calculator</b> to refine repair-vs-replace budgets.
        </li>
      </ol>
    </>
  );
}
/* ------------------------------------------------------------------
   “Maintenance Intervals” sub-tab (Testing guide)
   ------------------------------------------------------------------ */
function MaintenanceIntervals() {
  return (
    <>
      <h3 className="chart-heading">Recommended Test Frequency</h3>

      {/* compact two-column table */}
      <table className="sizing-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Normal Duty&nbsp;<small>(≤70&nbsp;% load)</small></th>
            <th>Critical Load&nbsp;<small>(&gt;70&nbsp;% load)</small></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DGA (online)</td>
            <td>Monthly</td>
            <td>Weekly</td>
          </tr>
          <tr>
            <td>Oil Moisture&nbsp;/ Dielectric Strength</td>
            <td>12&nbsp;months</td>
            <td>6&nbsp;months</td>
          </tr>
          <tr>
            <td>Power-Factor, TTR</td>
            <td>3&nbsp;years</td>
            <td>18&nbsp;months</td>
          </tr>
          <tr>
            <td>SFRA</td>
            <td>5&nbsp;years&nbsp;/ post-fault</td>
            <td>2&nbsp;years&nbsp;/ post-fault</td>
          </tr>
          <tr>
            <td>Infrared Scan</td>
            <td>Quarterly</td>
            <td>Monthly</td>
          </tr>
        </tbody>
      </table>

      <p style={{ marginTop: "0.6rem" }}>
        Frequencies follow <b>NETA&nbsp;MTS</b>, <b>IEEE&nbsp;C57</b> series
        and <b>Cigre&nbsp;WG&nbsp;A2-62</b>. Adjust for ambient cycling, load
        factor, and the asset-criticality index in your reliability programme.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------
   “ROI Overview” sub-tab (Lifecycle guide)
   ------------------------------------------------------------------ */
function RoiOverview() {
  return (
    <>
      <h3 className="chart-heading">Why Lifecycle ROI&nbsp;Matters</h3>

      <p>
        A transformer’s <b>Net Present Cost&nbsp;(NPC)</b> is far more than its
        purchase price. You must include <strong>unplanned failure cost, outage
        penalties, core-loss energy, depreciation, resale value, and even carbon
        offsets</strong>. Our lifecycle ROI framework rolls every one of those
        variables into a single metric so you can choose <em>repair, replace, or
        sell</em> with confidence.
      </p>

      <ul className="roi-list">
        <li>Discounted-cash-flow model using your hurdle/discount rate</li>
        <li>Accounts for post-repair residual failure probability</li>
        <li>Captures salvage or surplus revenue streams (&ldquo;sell&rdquo; option)</li>
        <li>Optionally integrates an internal carbon price for ESG reporting</li>
      </ul>

      <div className="cta-button-div">
        <a href="/roi-calculator" className="cta-btn">
          Launch ROI&nbsp;Calculator
        </a>
        <a href="/sell-transformers" className="cta-btn secondary">
          Get a Cash Offer
        </a>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
   “Cash-Flow Model” sub-tab
   ------------------------------------------------------------------ */
function CashflowModel() {
  return (
    <>
      <h3 className="chart-heading">Repair&nbsp;vs&nbsp;Replace Cash-Flow Model</h3>

      {/* 15-year DCF snapshot (example values) */}
      <table className="sizing-table">
        <thead>
          <tr>
            <th>Line&nbsp;Item</th>
            <th>Keep&nbsp;Running</th>
            <th>Major&nbsp;Repair</th>
            <th>New&nbsp;Replacement</th>
            <th>Immediate&nbsp;Sale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cap-Ex&nbsp;(t₀)</td>
            <td>—</td>
            <td>$ 400 k</td>
            <td>$ 1.6 M</td>
            <td>(+$ 250 k)</td>
          </tr>
          <tr>
            <td>Failure Cost&nbsp;/ yr</td>
            <td>$ 250 k</td>
            <td>$ 85 k</td>
            <td>$ 10 k</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Energy Loss&nbsp;/ yr</td>
            <td>$ 18 k</td>
            <td>$ 15 k</td>
            <td>$ 10 k</td>
            <td>—</td>
          </tr>
          <tr>
            <td>NPC&nbsp;(@ 15 yr,&nbsp;7 %)</td>
            <td>$ 3.02 M</td>
            <td>$ 2.05 M</td>
            <td>$ 1.78 M</td>
            <td>$ -0.25 M</td>
          </tr>
          <tr>
            <td><strong>ROI vs&nbsp;Keep</strong></td>
            <td>—</td>
            <td>+32 %</td>
            <td><strong>+41 %</strong></td>
            <td>Best cash return</td>
          </tr>
        </tbody>
      </table>

      <p style={{ marginTop: "0.9rem" }}>
        Figures are illustrative only—enter your own parameters in the&nbsp;
        <a href="/roi-calculator">interactive ROI Calculator</a> for a
        project-specific analysis.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------
  “Carbon Impact” sub-tab
   ------------------------------------------------------------------ */
function CarbonImpact() {
  return (
    <>
      <h3 className="chart-heading">Carbon &amp; ESG Considerations</h3>

      <p>
        Switching to modern low-loss core material can cut no-load losses by up
        to <b>40 %</b>, avoiding roughly <strong>15 t&nbsp;CO₂e per
        10 MVA-year</strong>.  With an internal carbon price of
        $50 / t&nbsp;CO₂e that equates to an extra&nbsp;<b>$ 750 k</b> in
        lifecycle value—often tipping the decision toward replacement.
      </p>

      <ul className="roi-list">
        <li>Embodied carbon of a new unit&nbsp;≈&nbsp;<em>2.4 t&nbsp;CO₂e / MVA</em></li>
        <li>No-load core losses account for ~60 % of lifetime emissions</li>
        <li>Carbon credit markets can subsidise the upgrade CAPEX</li>
        <li>Include CO₂e cost in the ROI Calculator for ESG alignment</li>
      </ul>

      <a href="/sell-transformers" className="cta-btn">
        Sell Your Transformer
      </a>
    </>
  );
}

