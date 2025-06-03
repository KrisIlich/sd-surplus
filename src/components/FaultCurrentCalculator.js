import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/KvaCalculator.css'; // reuse identical styling

import transformerImg from '../assets/transformer-offer-image.png';
import pvfImg         from '../assets/pvf-offer-image2.png';
import electricalImg  from '../assets/electrical-offer-image2.png';
import surplusImg     from '../assets/other-offer-image.png';

import Footer from './Footer';

export default function FaultCurrentCalculator() {
  const [phase, setPhase]         = useState('three');     // 'single' | 'three'
  const [kva,   setKva]           = useState('');          // nameplate kVA
  const [secV,  setSecV]          = useState('');          // secondary voltage (V)
  const [imp,   setImp]           = useState('');          // % impedance Z
  const [faultA,setFaultA]        = useState('');          // computed fault current
  const [activeTab, setActiveTab] = useState('equation');  // info tabs

  /* helpers */
  const resetFields = () => {
    setKva(''); setSecV(''); setImp(''); setFaultA('');
  };

  const handleCalculate = () => {
    const kVA  = parseFloat(kva);
    const V    = parseFloat(secV);
    const Zpct = parseFloat(imp);
    if (!kVA || !V || !Zpct) return setFaultA('');

    // base current (A) at rated load
    const Ibase = phase === 'single'
      ? (kVA * 1000) / V                             // single‑phase
      : (kVA * 1000) / (Math.sqrt(3) * V);           // three‑phase

    const Ifault = Ibase * (100 / Zpct);             // fault current amps
    setFaultA(Math.round(Ifault).toLocaleString());  // round & format
  };

  return (
    <div className="kva-page">
      {/* HERO */}
      <header className="kva-hero bg-blue">
        <h1>Transformer Fault Current Calculator</h1>
        <p>Fill in the rated kVA, secondary voltage, and % impedance to estimate the transformer’s secondary fault current.</p>
      </header>

      {/* CALCULATOR */}
      <section className="kva-calc-section bg-white">
        <form className="kva-form" onSubmit={e=>e.preventDefault()}>
          {/* phase selector */}
          <div className="phase-selector">
            <label className={phase==='single' ? 'selected' : ''}>
              <input type="radio" name="phase" value="single" checked={phase==='single'} onChange={()=>setPhase('single')} />
              Single-Phase
            </label>
            <label className={phase==='three' ? 'selected' : ''}>
              <input type="radio" name="phase" value="three" checked={phase==='three'} onChange={()=>setPhase('three')} />
              Three-Phase
            </label>
          </div>

          {/* input fields */}
          <div className="field-row">
            <div className="field">
              <label htmlFor="kva">kVA</label>
              <input id="kva" placeholder="e.g. 75" type="number" value={kva} onChange={e=>setKva(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="secV">Secondary voltage</label>
              <input id="secV" placeholder="e.g. 208" type="number" value={secV} onChange={e=>setSecV(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="imp">% Impedance (Z)</label>
              <input id="imp" placeholder="e.g. 5.75" type="number" value={imp} onChange={e=>setImp(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="fault">Available Fault Current (Amps)</label>
              <input id="fault" type="text" value={faultA} readOnly />
            </div>
          </div>

          {/* buttons */}
          <div className="btn-row">
            <button type="button" className="cta-btn" onClick={handleCalculate}>Calculate</button>
            <button type="button" className="cta-btn secondary" onClick={resetFields}>Restart</button>
          </div>
        </form>
      </section>

      {/* INFO TABS */}
      <section className="kva-tabs bg-grey">
        <nav className="tab-nav">
          <button className={activeTab==='how'?'active':''}      onClick={()=>setActiveTab('how')}>How to Use</button>
          <button className={activeTab==='equation'?'active':''} onClick={()=>setActiveTab('equation')}>Equation</button>
          <button className={activeTab==='defs'?'active':''}     onClick={()=>setActiveTab('defs')}>Definitions</button>
        </nav>

        <div className="tab-panel">
          {activeTab==='how' && (
            <>
              <h3>Using the Fault Current Calculator</h3>
              <p>Enter the transformer’s <b>nameplate kVA</b>, <b>secondary voltage</b>, and <b>percent impedance</b>. Choose single‑phase or three‑phase, then click <em>Calculate</em> to display the available fault current on the secondary terminals.</p>
              <p>This value is useful for sizing <b>breakers</b>, <b>fuses</b>, and verifying short‑circuit ratings of downstream gear.</p>
            </>
          )}

          {activeTab==='equation' && (
            <>
              <h3>Fault Current Formula</h3>
              <p><b>3‑Phase:</b> I<sub>fault</sub> = (kVA × 1000) ÷ (√3 × V × Z%)</p>
              <p><b>1‑Phase:</b> I<sub>fault</sub> = (kVA × 1000) ÷ (V × Z%)</p>
              <p className="small">where Z% is the nameplate impedance in percent (e.g.&nbsp;5.75).</p>
            </>
          )}

          {activeTab==='defs' && (
            <>
              <h3>Key Terms</h3>
              <p><b>Percent Impedance (Z%)</b> – The voltage drop across the transformer at rated current, expressed as a percentage of rated voltage.</p>
              <p><b>Fault Current</b> – The maximum instantaneous current that can flow if the secondary is short‑circuited.</p>
            </>
          )}
        </div>
      </section>

      {/* CTA GRID (unchanged) */}
      <section className="quote-cta bg-white">
        <h2>Ready to Sell Your Equipment?</h2>
        <div className="cta-grid">
          <Link to="/sell-transformers" className="cta-tile"><img src={transformerImg} alt="Transformers"/><span>Transformers</span></Link>
          <Link to="/sell-PVF"          className="cta-tile"><img src={pvfImg}         alt="PVF"         /><span>PVF</span></Link>
          <Link to="/sell-electrical"   className="cta-tile"><img src={electricalImg} alt="Electrical"   /><span>Electrical</span></Link>
          <Link to="/sell-surplus"      className="cta-tile"><img src={surplusImg}    alt="Other"        /><span>Other Equipment</span></Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
