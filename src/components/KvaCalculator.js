// --------------------------------------------------------------
// KvaCalculator.js   –   Converts Volts & Amps to kVA
// --------------------------------------------------------------
import React, { useState } from "react";
import "../styles/KvaCalculator.css";

import transformerImg from "../assets/transformer-offer-image.png";
import pvfImg         from "../assets/pvf-offer-image2.png";
import electricalImg  from "../assets/electrical-offer-image2.png";
import surplusImg     from "../assets/other-offer-image.png";

import Footer from "./Footer";

export default function KvaCalculator() {
  /* ────────────── state */
  const [phase, setPhase]         = useState("single"); // 'single' | 'three'
  const [volts, setVolts]         = useState("");
  const [amps,  setAmps]          = useState("");
  const [kva,   setKva]           = useState("");
  const [tab,   setTab]           = useState("how");   // how | equation | defs

  /* ────────────── helpers */
  const reset = () => { setVolts(""); setAmps(""); setKva(""); };

  const calculate = () => {
    const V = parseFloat(volts);
    const A = parseFloat(amps);
    if (isNaN(V) || isNaN(A)) { setKva(""); return; }

    const result = phase === "single"
      ? (V * A) / 1000
      : (Math.sqrt(3) * V * A) / 1000;

    setKva(result.toFixed(2));
  };

  /* ────────────── JSX */
  return (
    <div className="kva-page">
      {/* HERO */}
      <header className="kva-hero bg-blue">
        <h1>kVA Calculator</h1>
        <p>Quickly convert Amps & Volts into kVA for single-phase or three-phase loads.</p>
      </header>

      {/* CALCULATOR */}
      <section className="kva-calc-section bg-white">
        <form className="kva-form" onSubmit={e=>{e.preventDefault();calculate();}}>

          {/* Phase selector pills */}
          <div className="phase-selector">
            <label className={phase==="single"?"selected":""}>
              <input
                type="radio"
                name="phase"
                value="single"
                checked={phase==="single"}
                onChange={()=>setPhase("single")}
              />Single-Phase
            </label>
            <label className={phase==="three"?"selected":""}>
              <input
                type="radio"
                name="phase"
                value="three"
                checked={phase==="three"}
                onChange={()=>setPhase("three")}
              />Three-Phase
            </label>
          </div>

          {/* Volt / Amp / kVA fields */}
          <div className="field-row">
            <div className="field">
              <label htmlFor="volts">Volts (V)</label>
              <input
                id="volts"
                type="number"
                placeholder="(avg 480)"
                value={volts}
                onChange={e=>setVolts(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="amps">Amps (A)</label>
              <input
                id="amps"
                type="number"
                placeholder="(avg 100)"
                value={amps}
                onChange={e=>setAmps(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="kva">kVA</label>
              <input id="kva" type="text" value={kva} readOnly />
            </div>
          </div>

          {/* Buttons */}
          <div className="btn-row">
            <button type="submit" className="cta-btn">Calculate</button>
            <button type="button" className="cta-btn secondary" onClick={reset}>Reset</button>
          </div>
        </form>
      </section>

      {/* INFO TABS */}
      <section className="kva-tabs bg-grey">
        <nav className="tab-nav">
          {["how","equation","defs"].map(id=>(
            <button key={id}
              className={tab===id?"active":""}
              onClick={()=>setTab(id)}>
              {id==="how" ? "How It Works" :
               id==="equation" ? "Equations Used" : "Definitions"}
            </button>
          ))}
        </nav>

        <div className="tab-panel">
          {tab==="how" && (
            <>
              <h3>How the kVA Calculator Works</h3>

              <p>
                This free <b>kVA converter</b> lets <b>electrical engineers</b>, <b>facility
                managers</b> and <b>field electricians</b> turn measured
                <b>volts (V)</b> and <b>amps (A)</b> into <b>apparent power (kVA)</b> in
                seconds—perfect for <b>transformer sizing</b>, <b>generator checks</b> and
                <b>panel-load studies</b>.
              </p>

              <ul className="roi-list">
                <li>
                  Select <b>Single-Phase</b> or <b>Three-Phase</b> (the latter
                  auto-applies √3&nbsp;≈ 1.732).
                </li>
                <li>
                  Type your <b>line voltage</b> and <b>current draw</b>. Values can come
                  from a clamp meter or nameplate.
                </li>
                <li>
                  Click&nbsp;<em>Calculate</em>. The tool runs
                  <code>kVA = (V × A)/1000</code> (1-phase) or
                  <code>kVA = (√3 × V × A)/1000</code> (3-phase) and shows the result.
                </li>
              </ul>

              <p>
                Typical uses include validating <b>transformer kVA ratings</b>,
                confirming <b>generator standby load</b>, planning <b>UPS capacity</b>,
                and estimating <b>power-factor correction banks</b>.
              </p>
            </>

          )}
          {tab==="equation" && (
            <>
              <h3>Equations</h3>
              <ul className="roi-list">
                <li><b>Single-phase:</b> kVA = (Volts × Amps) / 1000</li>
                <li><b>Three-phase:</b> kVA = (√3 × Volts × Amps) / 1000</li>
              </ul>
            </>
          )}
          {tab==="defs" && (
            <>
              <h3>Key Electrical Definitions</h3>

              <ul className="roi-list">
                <li>
                  <b>Voltage (V)</b> – The electrical “pressure” that pushes electrons
                  through a conductor. Common service voltages include 208 V,
                  480 V (industrial three-phase) and 600 V (Canada).
                </li>

                <li>
                  <b>Ampere (A)</b> – The rate of current flow. Accurate amp readings are
                  critical when sizing <b>transformers</b>, <b>generators</b> and
                  <b>motor-control centres</b>.
                </li>

                <li>
                  <b>kVA (kilovolt-ampere)</b> – Unit of <em>apparent power</em>. One kVA
                  equals 1000 volt-amps. Used by utilities, UPS vendors and NEC load
                  tables when specifying equipment capacity.
                </li>

                <li>
                  <b>Single-Phase vs Three-Phase</b> – Single-phase supplies homes and
                  light commercial sites; three-phase delivers balanced power for heavy
                  industry, data centres and HVAC chillers. Our calculator applies the
                  √3 factor for three-phase loads automatically.
                </li>

                <li>
                  <b>Power Factor (PF)</b> – Ratio of real power (kW) to apparent power
                  (kVA). While PF isn’t needed for a straight kVA conversion, knowing it
                  helps when choosing <b>capacitor banks</b> or estimating <b>energy
                  efficiency</b>.
                </li>

                <li>
                  <b>Transformer Rating</b> – Nameplate capacity expressed in kVA. Always
                  pick a rating higher than your calculated demand to allow for
                  <b>inrush current</b> and <b>future load growth</b>.
                </li>
              </ul>
            </>

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

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
