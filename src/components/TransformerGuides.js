import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "../styles/Guides.css";
import Footer from "./Footer";

import heroImg   from "../assets/transformer-hero.png";
import iconSub   from "../assets/icon-substation.png";
import iconOem   from "../assets/icon-oem.png";
import iconTest  from "../assets/icon-testing.png";
import sellThumb from "../assets/transformer-offer-image.png";

const GUIDE_DATA = [
  {
    id: "sel",                       
    icon: iconSub,
    title: "Selection & Sizing",
    blurb:
      "Determine pad-mount vs walk-in designs, kVA tables, " +
      "and primary-secondary voltage picks per IEEE C57.",
  },
  {
    id: "test",
    icon: iconTest,
    title: "Testing & Diagnostics",
    blurb:
      "DGA gas ratios, insulation PF, SFRA analysis, and thermal models.",
  },
  {
    id: "lifecycle",                 
    icon: iconOem,
    title: "Lifecycle ROI",
    blurb:
      "Repair-vs-replace economics, resale valuation, total ownership cost.",
  },
];


export default function TransformerGuides() {
    const [active, setActive] = useState("sel");
    const [subTab, setSubTab]   = useState("chart"); // new: chart | info
    const panelRef = useRef(null);

/* click handler with two-step GSAP timeline */
function selectGuide(id) {
  const panel = panelRef.current;

  /* slide the current panel completely off the screen */
  gsap.to(panel, {
    x: "100vw",               // move full viewport width to the right
    duration: 0.45,
    ease: "power1.in",
    onComplete: () => {
      /* swap the guide content */
      setActive(id);

      /* slide the panel back in from the right edge */
      gsap.fromTo(
        panel,
        { x: "100vw" },        // start completely off-screen
        { x: 0, duration: 0.55, ease: "power1.out" }
      );
    }
  });
}

  const activeGuide = GUIDE_DATA.find(g => g.id === active);

  return (
    <div className="kva-page">
      {/* HERO */}
      <section className="guides-hero">
        <div className="guides-hero__text">
          <p className="eyebrow">New • 2025 Guides Library</p>
          <h1>Master Transformer Selection, Testing, &amp; Lifecycle ROI</h1>
          <p className="subtitle">
            Free technical playbooks on kVA sizing, impedance &amp; fault-current
            formulas, online DGA, and end-of-life asset strategy.
          </p>

          <div className="cta-button-div">
            <a href="#guides" className="cta-btn">Browse Guides</a>
            <a href="/sell-transformers" className="cta-btn secondary">Sell Your Transformers →</a>
          </div>
        </div>
        <div className="guides-hero__image">
          <img src={heroImg} alt="Power transformer on concrete pad"/>
        </div>
      </section>

          {/* --- OVERVIEW ICON ROW (non-interactive) ------------------- */}
        {/* ---------- STATIC OVERVIEW ROW (white) ---------- */}
        <section className="icon-row">
        {[
            {
            id: "sel",
            src: iconSub,
            title: "Selection & Sizing",
            blurb:
                "kVA charts, impedance %, voltage taps, plus harmonic allowance and future load margin."
            },
            {
            id: "test",
            src: iconTest,
            title: "Testing & Diagnostics",
            blurb:
                "Online DGA, power-factor, SFRA, infrared scans, and oil moisture limits for predictive maintenance."
            },
            {
            id: "lifecycle",
            src: iconOem,
            title: "Lifecycle ROI",
            blurb:
                "Repair-vs-replace cash flow, surplus resale pricing, carbon impact, and total ownership cost models."
            }
        ].map(card => (
            <div key={card.id} className="overview-card">
            <img src={card.src} alt="" className="overview-icon" />
            <h4>{card.title}</h4>
            <p>{card.blurb}</p>
            </div>
        ))}
        </section>

      {/* FIRST DARK BAND (unchanged text) */}
      <section className="band band--dark">
        <div className="band-inner">        {/* new wrapper */}
            <div className="band__content">
            <h2>Reliability &amp; ROI Are Our Highest Priority</h2>
            <p>
                From NEC load studies to IEEE C57 maintenance schedules, our
                transformer guides deliver data-driven methods that cut unplanned
                outages and maximise asset value.
            </p>
            <a href="#cta" className="cta-btn">Compare Guides&nbsp;→</a>
            </div>

            <div className="band__visual">
            <img src={heroImg} alt="Transformer monitoring"/>
            </div>
        </div>
        </section>

        {/* ---------- INTERACTIVE GUIDES SELECTOR (white) ---------- */}
        <section id="guides" className="guides-selector">
     <div className="icons-wrap">
        <div className="selector-icons">
            {[
            {id:"sel", src:iconSub,  label:"Selection & Sizing"},
            {id:"test",src:iconTest, label:"Testing"},
            {id:"lifecycle",src:iconOem,label:"Lifecycle ROI"}
            ].map(btn=>(
            <button
                key={btn.id}
                className={`icon-btn ${active===btn.id?"active":""}`}
                onClick={()=>selectGuide(btn.id)}>
                <img src={btn.src} alt=""/>
                <span>{btn.label}</span>
            </button>
            ))}
        </div>
        </div>

        {/* sliding panel */}
            <div className="selector-panel" ref={panelRef}>
            {active === "sel" ? (
                <>
                {/* sub-tab buttons */}
                <div className="sub-tabs">
                    <button
                    className={subTab === "chart" ? "active" : ""}
                    onClick={() => setSubTab("chart")}
                    >
                    Size Selection Chart
                    </button>
                    <button
                    className={subTab === "info" ? "active" : ""}
                    onClick={() => setSubTab("info")}
                    >
                    Sizing Information
                    </button>
                </div>

                {/* CONTENT AREA */}
                {subTab === "chart" ? (
                    <>
                    <div className="table-row">
                        <div className="table-col">
                        <h3 className="chart-heading">Single-Phase – Full-Load Current (Amps)</h3>
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
                            <tr><td>1</td>   <td>8.3</td>  <td>4.2</td>  <td>2.1</td>  <td>1.6</td></tr>
                            <tr><td>2</td>   <td>16.7</td> <td>8.4</td>  <td>4.2</td>  <td>3.2</td></tr>
                            <tr><td>3</td>   <td>25</td>   <td>12.5</td> <td>6.3</td>  <td>5</td></tr>
                            <tr><td>5</td>   <td>41.7</td> <td>20.8</td> <td>10.4</td> <td>8.3</td></tr>
                            <tr><td>7.5</td> <td>62.5</td> <td>31.2</td> <td>15.6</td> <td>12.5</td></tr>
                            <tr><td>10</td>  <td>83.4</td> <td>41.6</td> <td>20.8</td> <td>16.7</td></tr>
                            <tr><td>15</td>  <td>125</td>  <td>62.5</td> <td>31.2</td> <td>25</td></tr>
                            <tr><td>25</td>  <td>208</td>  <td>104</td>  <td>52.1</td> <td>41.6</td></tr>
                            <tr><td>37.5</td><td>312</td>  <td>156</td>  <td>78.2</td><td>62.5</td></tr>
                            <tr><td>50</td>  <td>416</td>  <td>208</td>  <td>104</td>  <td>83.3</td></tr>
                            <tr><td>75</td>  <td>625</td>  <td>312</td>  <td>156</td>  <td>125</td></tr>
                            <tr><td>100</td> <td>833</td>  <td>416</td>  <td>208</td>  <td>167</td></tr>
                            <tr><td>150</td> <td>1250</td> <td>625</td> <td>312</td> <td>250</td></tr>
                            <tr><td>167</td> <td>1391</td><td>696</td> <td>348</td> <td>278</td></tr>
                            <tr><td>250</td> <td>2083</td><td>1041</td><td>521</td> <td>417</td></tr>
                            <tr><td>333</td> <td>2775</td><td>1387</td><td>694</td> <td>555</td></tr>
                            <tr><td>500</td> <td>4166</td><td>2083</td><td>1042</td><td>833</td></tr>
                        </tbody>
                        </table>
                    </div>
                    
                    <div className="table-col">
                        {/* ── THREE-PHASE FULL-LOAD CURRENT ── */}
                        <h3 className="chart-heading">Three-Phase – Full-Load Current per Line (Amps)</h3>
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
                            <tr><td>6</td>     <td>16.6</td>  <td>14.4</td> <td>7.2</td>  <td>5.8</td></tr>
                            <tr><td>9</td>     <td>25</td>    <td>21.6</td> <td>10.8</td> <td>8.7</td></tr>
                            <tr><td>10</td>    <td>28</td>    <td>24</td>  <td>12</td>   <td>9.6</td></tr>
                            <tr><td>15</td>    <td>41.6</td>  <td>36.1</td> <td>18.1</td> <td>14.4</td></tr>
                            <tr><td>30</td>    <td>83.3</td>  <td>72.3</td> <td>36.1</td> <td>28.9</td></tr>
                            <tr><td>45</td>    <td>125</td>   <td>108</td> <td>54</td>   <td>43.2</td></tr>
                            <tr><td>75</td>    <td>208</td>   <td>181</td> <td>90.5</td> <td>72.1</td></tr>
                            <tr><td>112.5</td> <td>312</td>   <td>272</td> <td>136</td>  <td>108</td></tr>
                            <tr><td>150</td>   <td>416</td>   <td>360</td> <td>180</td>  <td>144</td></tr>
                            <tr><td>225</td>   <td>624</td>   <td>541</td> <td>270</td>  <td>216</td></tr>
                            <tr><td>300</td>   <td>832</td>   <td>722</td> <td>361</td>  <td>288</td></tr>
                            <tr><td>450</td>   <td>1250</td>  <td>1083</td><td>542</td>  <td>433</td></tr>
                            <tr><td>500</td>   <td>1388</td>  <td>1203</td><td>601</td>  <td>481</td></tr>
                            <tr><td>600</td>   <td>1666</td>  <td>1445</td><td>722</td>  <td>578</td></tr>
                        </tbody>
                        </table>
                        </div>
                    </div>
                    </>
                ) : (
                    /* placeholder – you’ll flesh this out next prompt */
                    <>
                    <h3>Sizing Information &amp; Best Practices</h3>
                    <p>
                    Proper transformer sizing is critical for <b>power distribution</b> and
                    <b>industrial reliability</b>.  Use measured line-to-line or  
                    line-to-neutral <b>voltage (V)</b> and full-load <b>current (A)</b> to  
                    calculate <b>kVA</b> ratings, then apply these guidelines:
                    </p>

                    <ul className="roi-list">
                    <li>
                        <b>Apparent Power (kVA)</b> = V × A / 1 000 (1-phase) or √3×V×A/1 000  
                        (3-phase).  Always round up to the next available kVA rating.
                    </li>
                    <li>
                        <b>Inrush &amp; Motor Starting</b>: Account for up to 12× full-load current
                        on large motors—choose a transformer with at least 125 % of calculated kVA.
                    </li>
                    <li>
                        <b>Load Diversity &amp; Growth</b>: Use demand factors and 10–20 % future  
                        expansion margin to prevent overloads and thermal stress over time.
                    </li>
                    <li>
                        <b>Impedance &amp; Fault Current</b>: Verify percent impedance for  
                        <b>short-circuit currents</b> and proper <b>breaker coordination</b>.
                    </li>
                    <li>
                        <b>Standards Compliance</b>: Follow IEEE C57.12 (<i>liquid-filled</i>) or  
                        IEEE C57.13 (<i>dry-type</i>) specs, plus NEC Article 450 for overcurrent
                        protection.
                    </li>
                    <li>
                        <b>Environmental &amp; Cooling Class</b>: Select ONAN, ONAF, or OA/FA based on
                        ambient conditions and <b>IP rating</b> requirements.
                    </li>
                    </ul>

                    <div className="cta-button-div">
                    <a href="/kva-calculator" className="cta-btn">
                        Open kVA Calculator
                    </a>
                    <a href="/fault-current-calculator" className="cta-btn secondary">
                        Open Fault-Current Calculator
                    </a>
                    </div>
                </>
                )}
                </>
            ) : (
                <>
                <h3>{activeGuide.title}</h3>
                <p>{activeGuide.blurb}</p>
                </>
            )}
            </div>
        </section>

      {/* CTA GRID */}
      <section id="cta" className="quote-cta bg-white">
        <h2>Ready to Monetise Surplus Transformers?</h2>
        <div className="cta-grid">
          <a href="/sell-transformers" className="cta-tile">
            <img src={sellThumb} alt="Sell Transformers"/>
            <span>Get a Cash Offer</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
