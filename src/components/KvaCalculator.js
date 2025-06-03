// --------------------------------------------------------------
// RoiCalculator.js  –  Keep ▸ Repair ▸ Replace ▸ Sell
// --------------------------------------------------------------
import React, { useState } from "react";
import "../styles/KvaCalculator.css";
import Footer from "./Footer";

import transformerImg from "../assets/transformer-offer-image.png";
import pvfImg         from "../assets/pvf-offer-image2.png";
import electricalImg  from "../assets/electrical-offer-image2.png";
import surplusImg     from "../assets/other-offer-image.png";

export default function RoiCalculator() {
  /* ─────────── state (trimmed for clarity) */
  const [currency,setCurrency]   = useState("USD");
  const [discount,setDiscount]   = useState("7");
  const [analysis,setAnalysis]   = useState("15");

  const [failRate,setFailRate]   = useState("0.4");
  const [failCost,setFailCost]   = useState("250000");
  const [downHrs,setDownHrs]     = useState("168");
  const [downCost,setDownCost]   = useState("100000");

  const [repairCost,setRepairCost] = useState("400000");
  const [repairFail,setRepairFail] = useState("0.15");

  const [replaceCost,setReplaceCost] = useState("1600000");
  const [salePrice,setSalePrice]     = useState("250000");

  const [results,setResults] = useState(null);
  const [tab,setTab]         = useState("how");

  /* ─────────── helpers */
  const sym = currency==="EUR"?"€":`${currency} $`;
  const fmt = v=>`${sym} ${Number(v).toLocaleString()}`;
  const pv  = (a,r,n)=>a*((1-1/Math.pow(1+r,n))/r);

  /* ─────────── calc */
  const calc=()=>{
    const r=parseFloat(discount)/100, N=+analysis;
    const keepAnn=(+failRate/100)*(+failCost+ +downHrs*+downCost);
    const keepNPC=pv(keepAnn,r,N);

    const repAnn=(+repairFail/100)*(+failCost+ +downHrs*+downCost);
    const repairNPC = +repairCost+pv(repAnn,r,N);
    const replaceNPC= +replaceCost;
    const sellNPC   = -+salePrice;

    const repairROI =(keepNPC-repairNPC)/repairNPC*100;
    const replaceROI=(keepNPC-replaceNPC)/replaceNPC*100;

    const best=Math.min(keepNPC,repairNPC,replaceNPC,sellNPC);
    const bestLbl=best===repairNPC?"Repair":best===replaceNPC?
                  "Replace":best===sellNPC?"Sell":"Keep";

    setResults({keepNPC,repairNPC,replaceNPC,sellNPC,repairROI,replaceROI,bestLbl});
  };

  /* ─────────── JSX */
  return(
  <div className="kva-page">
    {/* HERO */}
    <header className="kva-hero bg-blue">
      <h1>Transformer ROI Calculator</h1>
      <p>See whether you should keep, repair, replace, or sell your transformer.</p>
    </header>

    {/* FORM */}
    <section className="kva-calc-section bg-white">
      <form className="kva-form" onSubmit={e=>{e.preventDefault();calc();}}>

        {/* Currency */}
        <div className="phase-selector currency-selector">
          {["USD","CAD","EUR"].map(cur=>(
            <label key={cur} className={currency===cur?"selected":""}>
              <input type="radio" value={cur}
                     checked={currency===cur}
                     onChange={()=>setCurrency(cur)}/>
              {cur==="EUR"?"EUR €":`${cur} $`}
            </label>
          ))}
        </div>

        {/* Economic */}
        <fieldset className="scenario">
          <legend>
            Economic&nbsp;Assumptions
            <span className="hint-icon" data-hint="Discount rate converts future cash-flows to present dollars. Horizon = evaluation period.">?</span>
          </legend>
          <div className="field-row">
            <div className="field">
              <label>Discount&nbsp;%</label>
              <input type="number" value={discount} onChange={e=>setDiscount(e.target.value)}/>
            </div>
            <div className="field">
              <label>Horizon&nbsp;(yrs)</label>
              <input type="number" value={analysis} onChange={e=>setAnalysis(e.target.value)}/>
            </div>
          </div>
        </fieldset>

        {/* Keep */}
        <fieldset className="scenario">
          <legend>
            Keep&nbsp;Running
            <span className="hint-icon" data-hint="Run to failure; calculate expected annual cost.">?</span>
          </legend>
          <div className="field-row">
            <div className="field"><label>Fail&nbsp;%/yr</label><input type="number" value={failRate} onChange={e=>setFailRate(e.target.value)}/></div>
            <div className="field"><label>Repair&nbsp;cost</label><input type="number" value={failCost} onChange={e=>setFailCost(e.target.value)}/></div>
            <div className="field"><label>Outage&nbsp;hrs</label><input type="number" value={downHrs} onChange={e=>setDownHrs(e.target.value)}/></div>
            <div className="field"><label>Outage&nbsp;$&nbsp;/hr</label><input type="number" value={downCost} onChange={e=>setDownCost(e.target.value)}/></div>
          </div>
        </fieldset>

        {/* Repair */}
        <fieldset className="scenario">
          <legend>
            Repair
            <span className="hint-icon" data-hint="Major overhaul then residual failure risk.">?</span>
          </legend>
          <div className="field-row">
            <div className="field"><label>Repair&nbsp;cost</label><input type="number" value={repairCost} onChange={e=>setRepairCost(e.target.value)}/></div>
            <div className="field"><label>Post-repair fail&nbsp;%/yr</label><input type="number" value={repairFail} onChange={e=>setRepairFail(e.target.value)}/></div>
          </div>
        </fieldset>

        {/* Replace */}
        <fieldset className="scenario">
          <legend>
            Replace
            <span className="hint-icon" data-hint="Purchase new or reconditioned unit.">?</span>
          </legend>
          <div className="field-row">
            <div className="field"><label>New unit cost</label><input type="number" value={replaceCost} onChange={e=>setReplaceCost(e.target.value)}/></div>
          </div>
        </fieldset>

        {/* Sell */}
        <fieldset className="scenario">
          <legend>
            Sell
            <span className="hint-icon" data-hint="Immediate cash-in if liquidated.">?</span>
          </legend>
          <div className="field-row">
            <div className="field"><label>Sale&nbsp;price</label><input type="number" value={salePrice} onChange={e=>setSalePrice(e.target.value)}/></div>
          </div>
        </fieldset>

        {/* Buttons */}
        <div className="btn-row">
          <button type="submit" className="cta-btn">Calculate ROI</button>
          <button type="button" className="cta-btn secondary" onClick={()=>setResults(null)}>Reset</button>
        </div>
      </form>
    </section>

    {/* RESULTS */}
    <section className="roi-box bg-white">
      {!results ? (
        <p className="roi-placeholder">Results will appear here after you press <em>Calculate ROI</em>.</p>
      ) : (
        <>
          <h2>Results</h2>
          <div className="roi-flex">
            {["keep","repair","replace","sell"].map(key=>(
              <div key={key} className="roi-item">
                <span className="label">NPC – {key.charAt(0).toUpperCase()+key.slice(1)}</span>
                <span className="value">{fmt(results[`${key}NPC`].toFixed(0))}</span>
              </div>
            ))}
            <div className="roi-item">
              <span className="label">ROI&nbsp;Repair</span>
              <span className="value">{results.repairROI.toFixed(1)}%</span>
            </div>
            <div className="roi-item">
              <span className="label">ROI&nbsp;Replace</span>
              <span className="value">{results.replaceROI.toFixed(1)}%</span>
            </div>
            <div className="roi-item best">
              Best:&nbsp;<strong>{results.bestLbl}</strong>
            </div>
          </div>
        </>
      )}
    </section>

    {/* TABS */}
    <section className="kva-tabs bg-grey">
      <nav className="tab-nav">
        {["how","equation","defs","client"].map(id=>(
          <button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>
            {id==="how"?"How it Works":id==="equation"?"Equations":id==="defs"?"Definitions":"What It Means"}
          </button>
        ))}
      </nav>

      <div className="tab-panel">
        {tab==="how" && (
          <>
            <h3>How it Works</h3>
            <ul className="roi-list">
              <li>We discount every future cash-flow with your chosen discount&nbsp;rate.</li>
              <li>Net Present Cost (NPC) is calculated for each scenario.</li>
              <li>The option with the <b>lowest NPC</b> is cheapest over the horizon.</li>
            </ul>

            {/* CTA grid */}
            <section className="quote-cta bg-white">
              <h2>Ready to act?</h2>
              <div className="cta-grid">
                <a className="cta-tile" href="/sell-transformers"><img src={transformerImg} alt="Transformers"/><span>Transformers</span></a>
                <a className="cta-tile" href="/sell-PVF"><img src={pvfImg} alt="PVF"/><span>PVF</span></a>
                <a className="cta-tile" href="/sell-electrical"><img src={electricalImg} alt="Electrical"/><span>Electrical</span></a>
                <a className="cta-tile" href="/sell-surplus"><img src={surplusImg} alt="Other"/><span>Other</span></a>
              </div>
            </section>
          </>
        )}

        {tab==="equation" && (
          <>
            <h3>Equations</h3>
            <ul className="roi-list">
              <li><b>NPC</b> = Σ cash-flow × (1+r)<sup>-n</sup></li>
              <li><b>ROI</b> = (NPC<sub>keep</sub> – NPC<sub>option</sub>) ÷ NPC<sub>option</sub></li>
              <li>Annual expected failure cost = P(fail) × (repair + outage).</li>
            </ul>
          </>
        )}

        {tab==="defs" && (
          <>
            <h3>Definitions</h3>
            <ul className="roi-list">
              <li><b>Discount Rate</b> – opportunity cost / WACC.</li>
              <li><b>NPC</b> – sum of discounted costs minus inflows.</li>
              <li><b>ROI</b> – savings compared to baseline.</li>
              <li><b>Failure Rate</b> – probability of major failure in a year.</li>
              <li><b>Outage Cost</b> – revenue lost per hour offline.</li>
            </ul>
          </>
        )}

        {tab==="client" && (
          <>
            <h3>What It Means</h3>
            <p>The scenario with the lowest NPC delivers the least life-cycle cost.
               Positive ROI indicates a cost-effective move versus doing nothing.</p>
          </>
        )}
      </div>
    </section>

    {/* FOOTER */}
    <Footer />
  </div>
);}