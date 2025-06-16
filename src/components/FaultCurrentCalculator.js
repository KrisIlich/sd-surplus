import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/KvaCalculator.css';     // reuse existing styles

import transformerImg from '../assets/transformer-offer-image.png';
import pvfImg         from '../assets/pvf-offer-image2.png';
import electricalImg  from '../assets/electrical-offer-image2.png';
import surplusImg     from '../assets/other-offer-image.png';

import Footer from './Footer';

export default function FaultCurrentCalculator() {
  /* ----------------------- State ----------------------- */
  const [phase, setPhase]         = useState('single');   // single- or three-phase
  const [kva,   setKva]           = useState('');
  const [secV,  setSecV]          = useState('');
  const [imp,   setImp]           = useState('');
  const [faultA,setFaultA]        = useState('');
  const [infoTab, setInfoTab]     = useState('how');      // how | defs | stds

  /* ---------------- Calculate ---------------- */
  const resetFields = () => {
    setKva(''); setSecV(''); setImp(''); setFaultA('');
  };

  const handleCalculate = () => {
    const kVA  = parseFloat(kva);
    const V    = parseFloat(secV);
    const Zpct = parseFloat(imp);
    if (!kVA || !V || !Zpct) return setFaultA('');

    const Ibase = phase === 'single'
      ? (kVA * 1000) / V                 // 1-φ
      : (kVA * 1000) / (Math.sqrt(3) * V); // 3-φ

    const Ifault = Ibase * (100 / Zpct);
    setFaultA(Math.round(Ifault).toLocaleString());
  };

  /* ==================================================== */
  /*                       RENDER                         */
  /* ==================================================== */
  return (
    <div className="kva-page">
      {/* HERO ------------------------------------------------ */}
      <header className="kva-hero bg-blue">
        <h1>Transformer Fault-Current Calculator</h1>
        <p>
          Enter kVA, secondary voltage, and&nbsp;% impedance to estimate the
          available short-circuit current at the transformer secondary.
        </p>
      </header>

      {/* CALCULATOR ----------------------------------------- */}
      <section className="kva-calc-section bg-white">
        <form className="kva-form" onSubmit={e=>e.preventDefault()}>

          {/* phase picker */}
          <div className="phase-selector">
            <label className={phase==='single' ? 'selected' : ''}>
              <input type="radio" value="single"
                     checked={phase==='single'}
                     onChange={()=>setPhase('single')} />
              Single-Phase
            </label>
            <label className={phase==='three' ? 'selected' : ''}>
              <input type="radio" value="three"
                     checked={phase==='three'}
                     onChange={()=>setPhase('three')} />
              Three-Phase
            </label>
          </div>

          {/* numeric inputs */}
          <div className="field-row">
            <div className="field">
              <label htmlFor="kva">kVA</label>
              <input id="kva" type="number" placeholder="e.g. 75"
                     value={kva} onChange={e=>setKva(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="secV">Secondary V</label>
              <input id="secV" type="number" placeholder="e.g. 208"
                     value={secV} onChange={e=>setSecV(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="imp">% Impedance</label>
              <input id="imp" type="number" placeholder="e.g. 5.75"
                     value={imp} onChange={e=>setImp(e.target.value)} />
            </div>
            <div className="field">
              <label>Fault Current (A)</label>
              <input value={faultA} readOnly />
            </div>
          </div>

          {/* buttons */}
          <div className="btn-row">
            <button type="button" className="cta-btn" onClick={handleCalculate}>
              Calculate
            </button>
            <button type="button" className="cta-btn secondary" onClick={resetFields}>
              Restart
            </button>
          </div>
        </form>
      </section>

      {/* INFO TABS  ----------------------------------------- */}
      <section className="kva-tabs bg-grey">

        {/* tab bar */}
        <nav className="tab-nav">
          <button className={infoTab==='how' ? 'active' : ''}
                  onClick={()=>setInfoTab('how')}>
            How&nbsp;It&nbsp;Works
          </button>
          <button className={infoTab==='defs' ? 'active' : ''}
                  onClick={()=>setInfoTab('defs')}>
            Key Definitions
          </button>
          <button className={infoTab==='stds' ? 'active' : ''}
                  onClick={()=>setInfoTab('stds')}>
            Standards &amp;&nbsp;Assumptions
          </button>
        </nav>

        {/* tab content */}
        <div className="tab-panel">

          {/* HOW IT WORKS */}
          {infoTab==='how' && (
            <>
              <h3>Behind the Calculation</h3>
              <p>
                The calculator converts transformer <b>kVA</b> to rated amps,
                then divides by the per-unit impedance to give the
                <em> symmetrical short-circuit current</em>.
              </p>

              <pre className="code-block">
I<sub>fault</sub> = kVA × 1000{"\n"}
          ———————————————{"\n"}
          √3 × V × (Z% / 100)</pre>

              <p>
                Tick the <em>Three-Phase</em> option to include √3 in the
                denominator automatically.
              </p>
            </>
          )}

          {/* DEFINITIONS */}
          {infoTab==='defs' && (
            <>
              <h3>Key Terms</h3>
              <dl className="def-list">
                <dt>Percent Impedance (Z%)</dt>
                <dd>Voltage drop at rated load, expressed as % of rated voltage.</dd>

                <dt>Symmetrical Fault Current</dt>
                <dd>RMS value after the DC offset has decayed ( ≥½ cycle ).</dd>

                <dt>Asymmetrical Fault Current</dt>
                <dd>Peak including DC offset; use for breaker “make” rating.</dd>

                <dt>Bolted Fault</dt>
                <dd>Zero-impedance short; worst-case for equipment duty.</dd>
              </dl>
            </>
          )}

          {/* STANDARDS & ASSUMPTIONS */}
          {infoTab==='stds' && (
            <>
              <h3>Standards &amp; Engineering Assumptions</h3>
              <ul className="roi-list">
                <li>Method per <b>IEEE Std 141 / 399</b> (point-to-point).</li>
                <li>Source infinite unless upstream X″ provided.</li>
                <li>Check results against <b>ANSI C37.010</b> breaker ratings.</li>
                <li>NEC 110.9 / 110.24 require labeling of available fault current.</li>
                <li>No arc-flash energy &mdash; use IEEE 1584 for that study.</li>
              </ul>

              <div className="cta-button-div">
                <Link to="/roi-calculator" className="cta-btn">ROI Calculator</Link>
                <Link to="/kva-calculator" className="cta-btn secondary">kVA Calculator</Link>
              </div>
            </>
          )}

        </div>
      </section>

      {/* CTA GRID ------------------------------------------- */}
      <section className="quote-cta bg-white">
        <h2>Ready to Sell Your Equipment?</h2>
        <div className="cta-grid">
          <Link to="/sell-transformers" className="cta-tile">
            <img src={transformerImg} alt="Transformers"/><span>Transformers</span>
          </Link>
          <Link to="/sell-PVF" className="cta-tile">
            <img src={pvfImg} alt="PVF"/><span>PVF</span>
          </Link>
          <Link to="/sell-electrical" className="cta-tile">
            <img src={electricalImg} alt="Electrical"/><span>Electrical</span>
          </Link>
          <Link to="/sell-surplus" className="cta-tile">
            <img src={surplusImg} alt="Other"/><span>Other Equipment</span>
          </Link>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
