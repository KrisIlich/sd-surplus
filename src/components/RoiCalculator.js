// --------------------------------------------------------------
// RoiCalculator.js  —  Keep ▸ Repair ▸ Replace ▸ Sell
// --------------------------------------------------------------
import React, { useState } from "react";
import "../styles/KvaCalculator.css";
import Footer from "./Footer";                      

export default function RoiCalculator() {
      /* ─────────── state */
      const [currency, setCurrency] = useState("USD");

      /* economic inputs (blank by default with placeholders) */
      const [discount, setDiscount] = useState("");   // %
      const [analysis, setAnalysis] = useState("");   // yrs

      /* keep-running */
      const [failRate, setFailRate] = useState("");
      const [failCost, setFailCost] = useState("");
      const [downHrs,  setDownHrs]  = useState("");
      const [downCost, setDownCost] = useState("");

      /* repair */
      const [repairCost, setRepairCost] = useState("");
      const [repairLife, setRepairLife] = useState("");
      const [repairFail, setRepairFail] = useState("");

      /* replace */
      const [replaceCost, setReplaceCost] = useState("");
      const [replaceLife, setReplaceLife] = useState("");

      const [results, setResults] = useState(null);
      const [tab, setTab]         = useState("how");

      /* ─────────── helpers */
      const sym  = currency==="EUR"?"€":`${currency} $`;
      const fmt  = v=>isNaN(v)?"-":`${sym} ${Number(v).toLocaleString()}`;
      const pv   = (a,r,n)=>a*((1-1/Math.pow(1+r,n))/r);

      /* ─────────── calc */
      const calc = () => {
        const r = parseFloat(discount)/100;
        const N = parseInt(analysis,10);
        if (isNaN(r)||isNaN(N)) return;      // need economic inputs first

        const keepAnn = (+failRate/100)*(+failCost + +downHrs*+downCost);
        const keepNPC = pv(keepAnn, r, N);

        const repAnn  = (+repairFail/100)*(+failCost + +downHrs*+downCost);
        const repairNPC  = +repairCost + pv(repAnn, r, N);
        const replaceNPC = +replaceCost;     // residual risk ignored

        const repairROI  =(keepNPC-repairNPC)/repairNPC*100;
        const replaceROI =(keepNPC-replaceNPC)/replaceNPC*100;

        const bestCost = Math.min(keepNPC, repairNPC, replaceNPC);
        const bestLbl  = bestCost===repairNPC ? "Repair"
                        : bestCost===replaceNPC? "Replace" : "Keep Running";

        setResults({keepNPC, repairNPC, replaceNPC, repairROI, replaceROI, bestLbl});
      };

      const reset = () => setResults(null);

      /* ─────────── JSX */
      return (
        <div className="kva-page">

          {/* HERO */}
          <header className="kva-hero bg-blue">
            <h1>Transformer ROI Calculator</h1>
            <p>Compare the life-cycle cost of keeping, repairing, or replacing a transformer.</p>
          </header>

          {/* FORM */}
          <section className="kva-calc-section bg-white">
            <form className="kva-form" onSubmit={e=>{e.preventDefault();calc();}}>

              {/* currency pills */}
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

              {/* Economic assumptions */}
              <fieldset className="scenario">
                <legend>
                  Economic&nbsp;Assumptions
                  <span className="hint-icon"
                    title="► Discount rate (WACC) converts future cash-flows to today.\n► Horizon is the number of years to evaluate.">
                  ?</span>
                </legend>
                <div className="field-row">
                  <div className="field">
                    <label>Discount&nbsp;%</label>
                    <input type="number" value={discount}
                          placeholder="(avg 7)" onChange={e=>setDiscount(e.target.value)}/>
                  </div>
                  <div className="field">
                    <label>Horizon&nbsp;yrs</label>
                    <input type="number" value={analysis}
                          placeholder="(avg 15)" onChange={e=>setAnalysis(e.target.value)}/>
                  </div>
                </div>
              </fieldset>

              {/* Keep-running */}
              <fieldset className="scenario">
                <legend>
                  Keep Running
                  <span className="hint-icon"
                    title="Failure cost = P(fail) × (Repair + Outage hrs × $/hr)">
                  ?</span>
                </legend>
                <div className="field-row">
                  <div className="field"><label>Fail&nbsp;%/yr</label>
                    <input type="number" value={failRate} placeholder="(avg 0.4)"
                          onChange={e=>setFailRate(e.target.value)}/></div>
                  <div className="field"><label>Repair cost</label>
                    <input type="number" value={failCost} placeholder="(avg 250 000)"
                          onChange={e=>setFailCost(e.target.value)}/></div>
                  <div className="field"><label>Outage hrs</label>
                    <input type="number" value={downHrs} placeholder="(avg 168)"
                          onChange={e=>setDownHrs(e.target.value)}/></div>
                  <div className="field"><label>$ / hr</label>
                    <input type="number" value={downCost} placeholder="(avg 100 000)"
                          onChange={e=>setDownCost(e.target.value)}/></div>
                </div>
              </fieldset>

              {/* Repair */}
              <fieldset className="scenario">
                <legend>
                  Repair
                  <span className="hint-icon"
                    title="Up-front overhaul cost plus residual failure risk.">
                  ?</span>
                </legend>
                <div className="field-row">
                  <div className="field"><label>Repair cost</label>
                    <input type="number" value={repairCost} placeholder="(avg 400 000)"
                          onChange={e=>setRepairCost(e.target.value)}/></div>
                  <div className="field"><label>Extra life yrs</label>
                    <input type="number" value={repairLife} placeholder="(avg 10)"
                          onChange={e=>setRepairLife(e.target.value)}/></div>
                  <div className="field"><label>Post-repair %/yr</label>
                    <input type="number" value={repairFail} placeholder="(avg 0.15)"
                          onChange={e=>setRepairFail(e.target.value)}/></div>
                </div>
              </fieldset>

              {/* Replace */}
              <fieldset className="scenario">
                <legend>
                  Replace
                  <span className="hint-icon"
                    title="Purchase new or re-conditioned unit (net of trade-in).">
                  ?</span>
                </legend>
                <div className="field-row">
                  <div className="field"><label>New unit cost</label>
                    <input type="number" value={replaceCost} placeholder="(avg 1 600 000)"
                          onChange={e=>setReplaceCost(e.target.value)}/></div>
                  <div className="field"><label>Life yrs</label>
                    <input type="number" value={replaceLife} placeholder="(avg 25)"
                          onChange={e=>setReplaceLife(e.target.value)}/></div>
                </div>
              </fieldset>

              {/* Buttons */}
              <div className="btn-row">
                <button type="submit" className="cta-btn">Calculate ROI</button>
                <button type="button" className="cta-btn secondary" onClick={reset}>Reset</button>
              </div>
            </form>
          </section>

          {/* RESULTS */}
          <section className="roi-box bg-white">
            {!results ? (
              <p className="roi-placeholder">Results will appear after you press <em>Calculate ROI</em>.</p>
            ) : (
              <>
                <h2>Results</h2>
                <div className="roi-grid">
                  {["keep","repair","replace"].map(k=>(
                    <div key={k}>
                      <span className="label">NPC – { k.charAt(0).toUpperCase()+k.slice(1) }</span>
                      <span className="value">{ fmt(results[`${k}NPC`].toFixed(0)) }</span>
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

                  {/* Best cell */}
                  <div className="best-cell">
                    <span className="label">Best Option</span>
                    <span className="value">{results.bestLbl}</span>
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
              <h3>How the ROI Calculator Works</h3>

              <p>
                This tool applies standard <b>life-cycle cost analysis (LCCA)</b> used by
                <b> electric utilities</b>, <b>renewable-energy developers</b>, and
                <b>industrial facilities</b> to decide whether to <em>keep, repair,
                replace, or sell</em> a power transformer.  It converts every cash-flow
                into <b>Net Present Cost (NPC)</b> and highlights the option with the
                lowest total cost.
              </p>

              <ul className="roi-list">
                <li>
                  <b>Input your economics.</b>  Enter <b>discount rate / WACC</b> and
                  <b> analysis horizon</b>. These drive the time-value-of-money
                  calculation.
                </li>

                <li>
                  <b>Keep Running.</b>  Provide <b>failure probability</b>,
                  <b> repair invoice</b>, and <b>unplanned outage cost ( hours × $/hr )</b>.
                  The calculator estimates annual risk cost.
                </li>

                <li>
                  <b>Repair Scenario.</b>  Add the one-time <b>overhaul quote</b>,
                  residual failure rate, and extra service life. We amortise that cost
                  plus the remaining risk.
                </li>

                <li>
                  <b>Replace Scenario.</b>  Enter your <b>new-unit purchase price</b>
                  and expected life. Assumes negligible failure during the horizon.
                </li>

                <li>
                  Press <em>Calculate&nbsp;ROI</em>. The app discounts every future
                  cash-flow with your WACC, sums them to NPC, and prints
                  <b> ROI&nbsp;Repair</b> and <b>ROI&nbsp;Replace</b> versus the “do
                  nothing” baseline.
                </li>
              </ul>

              <p>
                Use the output to justify <b>capital-ex budgets</b>,
                <b>refurbishment programs</b>, and <b>decommission decisions</b>. The
                methodology aligns with IEEE C57 transformer asset-management guides and
                standard utility <b>total-ownership-cost</b> models.
              </p>
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
              <h3>Key Financial &amp; Reliability Definitions</h3>

              <ul className="roi-list">
                <li>
                  <b>Discount&nbsp;Rate&nbsp;(WACC)</b> – Weighted-Average
                  Cost of Capital; used to translate future cash-flows into
                  <b> Net Present Value (NPV)</b>.
                </li>

                <li>
                  <b>Analysis&nbsp;Horizon</b> – The number of years over
                  which <b>life-cycle cost analysis (LCCA)</b> is performed.
                  Longer horizons favour low-maintenance assets with long service life.
                </li>

                <li>
                  <b>Net Present Cost&nbsp;(NPC)</b> – Sum of all discounted
                  out-flows minus in-flows for a scenario.  The <em>lowest NPC</em>
                  indicates the cheapest long-term option.
                </li>

                <li>
                  <b>Return on Investment&nbsp;(ROI)</b> – Savings relative to the
                  “keep running” baseline:  
                  ROI&nbsp;=&nbsp;(NPC<sub>keep</sub>&nbsp;−&nbsp;NPC<sub>option</sub>)
                  &nbsp;/&nbsp;NPC<sub>option</sub> × 100&nbsp;%.
                </li>

                <li>
                  <b>Failure Rate</b> – Probability that a transformer will experience
                  a major fault in a given year.  Industry averages range
                  from&nbsp;0.2 % (new oil-filled units) to&nbsp;>1 % for ageing
                  fleets.
                </li>

                <li>
                  <b>Outage Cost ($/hr)</b> – Lost production, contractual penalties,
                  or purchased-power cost incurred while the transformer is offline.
                </li>

                <li>
                  <b>Repair Cost</b> – Vendor quote for rewind, re-gasket, or core/coil
                  replacement; includes labour, rigging, and oil processing.
                </li>

                <li>
                  <b>Replacement Cost</b> – Purchase price plus shipping and
                  installation of a new or re-manufactured transformer; often called
                  <em>Total Ownership Cost</em> in utility budgeting.
                </li>

              </ul>
            </>
          )}

          {tab==="client" && (
             <>
              <h3>What the Results Mean for You</h3>

              <p>
                The calculator highlights the scenario with the <b>lowest Net Present
                Cost</b>.  That option delivers the cheapest <b>total cost of ownership
                (TCO)</b> across the analysis horizon when you factor in purchase price,
                failure risk, outage losses, and disposal value.
              </p>

              <ul className="roi-list">
                <li>
                  <b>Positive ROI</b> on the <em>Repair</em> or <em>Replace</em> paths
                  means the investment generates a payback versus running to failure.
                  Use the percentage to justify <b>capital-ex budgets</b> in annual
                  planning.
                </li>

                <li>
                  A <b>negative ROI</b> signals that repairing or replacing today costs
                  more than accepting the risk—useful when budgets are tight or the
                  asset is nearing a scheduled site decommission.
                </li>

                <li>
                  NPC values are discounted with your <b>WACC</b>, making them directly
                  comparable to other <b>asset-management</b> projects competing for
                  limited funds (e.g., switch-gear replacements, substation upgrades).
                </li>

                <li>
                  Combine the ROI insight with <b>condition-monitoring data</b> (oil
                  DGA, insulation PF, thermal models) to build a risk-based
                  transformer replacement roadmap.
                </li>
              </ul>

              <p>
                In short, the output converts complex reliability statistics into a
                single financial metric, letting <b>asset managers, plant engineers,
                and finance teams</b> speak the same language when deciding whether to
                refurbish, retire, or monetise ageing transformers.
              </p>
            </>
          )}
        </div>
      </section>

      {/* footer */}
      <Footer />
    </div>
  );
}
