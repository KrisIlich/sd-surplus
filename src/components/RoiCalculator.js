// --------------------------------------------------------------
// RoiCalculator.js  —  Keep ▸ Repair ▸ Replace ▸ Sell
// --------------------------------------------------------------
import React, { useState } from "react";
import "../styles/KvaCalculator.css";
import Footer from "./Footer";                      // ⬅️ already in your repo

export default function RoiCalculator() {
  /* ───────────────────────────── state */
  const [currency, setCurrency]           = useState("USD");
  const [discount, setDiscount]           = useState("7");
  const [analysis, setAnalysis]           = useState("15");

  /* keep-running */
  const [failRate,  setFailRate]          = useState("");
  const [failCost,  setFailCost]          = useState("");
  const [downHrs,   setDownHrs]           = useState("");
  const [downCost,  setDownCost]          = useState("");

  /* repair */
  const [repairCost, setRepairCost]       = useState("");
  const [repairLife, setRepairLife]       = useState("");
  const [repairFail, setRepairFail]       = useState("");

  /* replace */
  const [replaceCost, setReplaceCost]     = useState("");
  const [replaceLife, setReplaceLife]     = useState("");

  /* sell */
  const [salePrice, setSalePrice]         = useState("");

  const [results,   setResults]           = useState(null);
  const [tab,       setTab]               = useState("how");

  /* ───────────────────────────── helpers */
  const sym = currency === "EUR" ? "€" : `${currency} $`;
  const fmt = v => isNaN(v) ? "-" : `${sym} ${Number(v).toLocaleString()}`;
  const pvAnn = (a,r,N) => a * ((1 - 1/Math.pow(1+r,N)) / r);

  /* ───────────────────────────── calc */
  const calc = () => {
    const r = parseFloat(discount)/100;
    const N = parseInt(analysis,10);

    const keepAnn = (failRate/100) *
      (+failCost + +downHrs * +downCost);
    const keepNPC = pvAnn(keepAnn,r,N);

    const repAnn = (repairFail/100) *
      (+failCost + +downHrs * +downCost);
    const repairNPC  = +repairCost  + pvAnn(repAnn,r,N);
    const replaceNPC = +replaceCost;
    const sellNPC    = -+salePrice;

    const repairROI  = (keepNPC-repairNPC) / repairNPC  * 100;
    const replaceROI = (keepNPC-replaceNPC)/replaceNPC * 100;

    const best = Math.min(keepNPC,repairNPC,replaceNPC,sellNPC);
    const bestLbl = best===repairNPC? "Repair":
                    best===replaceNPC?"Replace":
                    best===sellNPC   ?"Sell":"Keep Running";

    setResults({keepNPC,repairNPC,replaceNPC,sellNPC,
                repairROI,replaceROI,bestLbl});
  };

  const reset = () => setResults(null);

  /* ───────────────────────────── JSX */
  return (
    <div className="kva-page">
      {/* hero */}
      <header className="kva-hero bg-blue">
        <h1>Transformer ROI Calculator</h1>
        <p>
          Compare the lifetime cost of&nbsp;keeping, repairing, replacing, or selling a power
          transformer.
        </p>
      </header>

      {/* form */}
      <section className="kva-calc-section bg-white">
        <form className="kva-form" onSubmit={e=>{e.preventDefault();calc();}}>

          {/* currency pills */}
          <div className="phase-selector currency-selector">
            {["USD","CAD","EUR"].map(cur=>(
              <label key={cur} className={currency===cur?"selected":""}>
                <input type="radio" value={cur}
                       checked={currency===cur}
                       onChange={()=>setCurrency(cur)}/>
                {cur==="EUR" ? "EUR €" : `${cur} $`}
              </label>
            ))}
          </div>

          {/* economic */}
          <fieldset className="scenario">
            <legend>
              Economic&nbsp;Assumptions
              <span className="hint-icon" title="► Discount rate: your cost of capital (WACC); used to discount future cash-flows.
► Analysis horizon: number of years you want to evaluate (typical 10-30 yrs).">?</span>
            </legend>
            <div className="field-row">
              <div className="field">
                <label>
                  Discount&nbsp;rate&nbsp;%
                
                </label>
                <input type="number" value={discount}
                       onChange={e=>setDiscount(e.target.value)}/>
              </div>
              <div className="field">
                <label>
                  Analysis&nbsp;horizon&nbsp;(yrs)
                
                </label>
                <input type="number" value={analysis}
                       onChange={e=>setAnalysis(e.target.value)}/>
              </div>
            </div>
          </fieldset>

          {/* keep running */}
          <fieldset className="scenario">
            <legend>
              Keep&nbsp;Running
              <span className="hint-icon" title="Expected yearly cost if you do nothing:
– Failure rate × (Repair cost + Outage hrs × $/hr).">?</span>
            </legend>
            <div className="field-row">
              <div className="field">
                <label>Failure rate&nbsp;%/yr</label>
                <input type="number" value={failRate} placeholder="(avg 0.4)"
                       onChange={e=>setFailRate(e.target.value)}/>
              </div>
              <div className="field">
                <label>Repair cost / fail</label>
                <input type="number" value={failCost} placeholder="(avg $250,000)"
                       onChange={e=>setFailCost(e.target.value)}/>
              </div>
              <div className="field">
                <label>Outage hours</label>
                <input type="number" value={downHrs} placeholder="(avg 168)"
                       onChange={e=>setDownHrs(e.target.value)}/>
              </div>
              <div className="field">
                <label>Outage cost / hr</label>
                <input type="number" value={downCost} placeholder="(avg $100,000)"
                       onChange={e=>setDownCost(e.target.value)}/>
              </div>
            </div>
          </fieldset>

          {/* repair */}
          <fieldset className="scenario">
            <legend>
              Repair
              <span className="hint-icon" title="Up-front overhaul cost plus residual failure risk
(calculated with the post-repair failure rate).">?</span>
            </legend>
            <div className="field-row">
              <div className="field">
                <label>Repair cost</label>
                <input type="number" value={repairCost}  placeholder="(avg $400,000)"
                       onChange={e=>setRepairCost(e.target.value)}/>
              </div>
              <div className="field">
                <label>Extra life&nbsp;yrs</label>
                <input type="number" value={repairLife}  placeholder="(avg 10)"
                       onChange={e=>setRepairLife(e.target.value)}/>
              </div>
              <div className="field">
                <label>Post-repair fail&nbsp;%/yr</label> 
                <input type="number" value={repairFail} placeholder="(avg 0.15)"
                       onChange={e=>setRepairFail(e.target.value)}/>
              </div>
            </div>
          </fieldset>

          {/* replace */}
          <fieldset className="scenario">
            <legend>
              Replace
              <span className="hint-icon" title="Purchase price of a new (or re-gasketed) transformer.
Assumes negligible failures during the analysis horizon.">?</span>
            </legend>
            <div className="field-row">
              <div className="field">
                <label>New unit cost</label>
                <input type="number" value={replaceCost} placeholder="(avg 1,600,000)"
                       onChange={e=>setReplaceCost(e.target.value)}/>
              </div>
              <div className="field">
                <label>Expected life&nbsp;yrs</label>
                <input type="number" value={replaceLife} placeholder="(avg 25)"
                       onChange={e=>setReplaceLife(e.target.value)}/>
              </div>
            </div>
          </fieldset>

          {/* sell */}
          <fieldset className="scenario">
            <legend>
              Sell
              <span className="hint-icon" title="Immediate cash if you liquidate the asset.">?</span>
            </legend>
            <div className="field-row">
              <div className="field">
                <label>Sale price today</label>
                <input type="number" value={salePrice} placeholder="(avg 250,000)"
                       onChange={e=>setSalePrice(e.target.value)}/>
              </div>
            </div>
          </fieldset>

          {/* buttons */}
          <div className="btn-row">
            <button type="submit" className="cta-btn">Calculate ROI</button>
            <button type="button" className="cta-btn secondary"
                    onClick={reset}>Reset</button>
          </div>
        </form>
      </section>

      {/* results */}
      <section className="roi-box bg-white">
        {!results ? (
          <p className="roi-placeholder">
            Results will appear here after you press&nbsp;
            <em>Calculate ROI</em>.
          </p>
        ) : (
          <>
            <h2>Results</h2>
            <div className="roi-grid">
              {["keep","repair","replace","sell"].map(key=>(
                <div key={key}>
                  <span className="label">NPC – {key.charAt(0).toUpperCase()+key.slice(1)}</span>
                  <span className="value">
                    {fmt(results[`${key}NPC`].toFixed(0))}
                  </span>
                </div>
              ))}
              <div>
                <span className="label">ROI Repair</span>
                <span className="value">{results.repairROI.toFixed(1)}%</span>
              </div>
              <div>
                <span className="label">ROI Replace</span>
                <span className="value">{results.replaceROI.toFixed(1)}%</span>
              </div>
              <div className="roi-percent">
                Best Option:&nbsp;<strong>{results.bestLbl}</strong>
              </div>
            </div>
          </>
        )}
      </section>

      {/* tabs */}
      <section className="kva-tabs bg-grey">
        <nav className="tab-nav">
          {["how","equation","defs","client"].map(id=>(
            <button key={id}
              className={tab===id?"active":""}
              onClick={()=>setTab(id)}>
              {id==="how"     ?"How it Works":
               id==="equation"?"Equations Used":
               id==="defs"    ?"Definitions":
                               "What It Means"}
            </button>
          ))}
        </nav>

        <div className="tab-panel">
          {tab==="how" && (
            <>
              <h3>How it Works</h3>
              <p>We calculate Net Present Cost (NPC) for every scenario using your discount
                 rate, then show ROI compared with “keep running”.</p>
            </>
          )}

          {tab==="equation" && (
            <>
              <h3>Equations</h3>
              <p><b>NPC</b> = Σ cash-flow × (1+r)<sup>-n</sup></p>
              <p><b>ROI</b> = (NPC<sub>keep</sub> – NPC<sub>option</sub>)
                 ÷ NPC<sub>option</sub></p>
              <p>Annual expected failure cost =
                 P(fail) × (repair + outage).</p>
            </>
          )}

          {tab==="defs" && (
            <>
              <h3>Definitions</h3>
              <ul className="roi-list">
                <li><b>Discount Rate</b> – opportunity cost used to
                    discount future money.</li>
                <li><b>NPC</b> – Net Present Cost; lower is better.</li>
                <li><b>ROI</b> – percentage savings vs. baseline.</li>
                <li><b>Failure Rate</b> – annual probability of major failure.</li>
                <li><b>Outage Cost</b> – revenue or penalty lost per hour offline.</li>
              </ul>
            </>
          )}

          {tab==="client" && (
            <>
              <h3>What It Means</h3>
              <p>The option with the lowest NPC gives the cheapest life-cycle cost
                 over your chosen horizon. Positive ROI indicates savings
                 over doing nothing.</p>
            </>
          )}
        </div>
      </section>

      {/* footer */}
      <Footer />
    </div>
  );
}
