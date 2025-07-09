import React, { useState, useEffect } from "react";
import "../styles/KvaCalculator.css";

import pvfImg         from "../assets/pvf-offer-image2.png";
import transformerImg from "../assets/transformer-offer-image.png";
import electricalImg  from "../assets/electrical-offer-image2.png";
import surplusImg     from "../assets/other-offer-image.png";

import Footer from "./Footer";

/* PVF Pipe-Sizing Calculator */
export default function PvfSizingCalculator() {
  /* ---------- INPUT STATE ---------- */
  const [units, setUnits] = useState("imperial");   // imperial | metric
  const [grade, setGrade] = useState("ANSI Sch40");

  const [length,   setLength]   = useState("");     // ft | m
  const [flow,     setFlow]     = useState("");     // gpm | m³/h
  const [velocity, setVelocity] = useState("");     // ft/s | m/s

  /* advanced */
  const [showAdv,    setShowAdv]    = useState(false);
  const [obstructed, setObstructed] = useState("0");
  const [through,    setThrough]    = useState("0");
  const [checks,     setChecks]     = useState("0");
  const [elbows,     setElbows]     = useState("0");
  const [roughness,  setRoughness]  = useState("0.001968");   // in | mm

  /* ---------- OUTPUT STATE ---------- */
  const [diam,         setDiam]         = useState("");   // eg “1.27 in”

  const [nps,      setNps]      = useState("");
  const [dp,       setDp]       = useState("");
  const [vFinal, setVFinal] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [eqLen, setEqLen] = useState("");

  /* tab nav */
  const [tab, setTab] = useState("how");

  /* ---------- HELPERS ---------- */
  const reset = () => {
    setLength(""); setFlow(""); setVelocity("");
    setDiam(""); setNps("");
    setDp(""); setVFinal("");
    setHasResult(false);               // ✨ hide result card
    };

  const displayVel = (v) =>
  v ? (units === "imperial" ? v.toFixed(5) : v.toFixed(5)) : "—"; // ft/s or m/s


/* ---------- CALCULATE --------------------------------------- */
const calculate = () => {
  setHasResult(false);                 // clear flag so first render is always fresh

  /* 1 ─ Extract & guard inputs -------------------------------- */
  const Qgpm = +flow, Vmax = +velocity, Lstraight = +length || 0;
  if (!Qgpm || !Vmax) { reset(); return; }

  /* 2 ─ Pick schedule-40 size that meets velocity ------------- */
const S40 = [
  { nps:"½",  id:0.622 }, { nps:"¾",  id:0.824 }, { nps:"1",  id:1.050 },
  { nps:"1¼", id:1.380 }, { nps:"1½", id:1.610 }, { nps:"2",  id:1.939 },
  { nps:"2½", id:2.323 }, { nps:"3",  id:2.900 }, { nps:"4",  id:3.826 },
  { nps:"5",  id:4.813 }, { nps:"6",  id:5.761 }, { nps:"8",  id:7.625 },
  { nps:"10", id:9.563 }, { nps:"12", id:11.376 }
];

/* Schedule-80 (XS wall) */
const S80 = [
  { nps:"½",  id:0.546 }, { nps:"¾",  id:0.742 }, { nps:"1",  id:0.957 },
  { nps:"1¼", id:1.278 }, { nps:"1½", id:1.500 }, { nps:"2",  id:1.939 },
  { nps:"2½", id:2.323 }, { nps:"3",  id:2.900 }, { nps:"4",  id:3.826 },
  { nps:"5",  id:4.813 }, { nps:"6",  id:5.761 }, { nps:"8",  id:7.565 },
  { nps:"10", id:9.273 }, { nps:"12", id:11.000 }
];

/* Schedule-160 (heavy wall) */
const S160 = [
  { nps:"½",  id:0.466 },  // 0.840 − (2×0.187) = 0.466
  { nps:"¾",  id:0.608 },  // 1.050 − (2×0.221)
  { nps:"1",  id:0.820 },  // 1.315 − (2×0.248)
  { nps:"1¼", id:1.049 },  // 1.660 − (2×0.306)
  { nps:"1½", id:1.249 },  // 1.900 − (2×0.326)
  { nps:"2",  id:1.687 },  // 2.375 − (2×0.344)
  { nps:"2½", id:2.125 },  // 2.875 − (2×0.375)
  { nps:"3",  id:2.624 },  // 3.500 − (2×0.438)
  { nps:"4",  id:3.493 },  // 4.500 − (2×0.504)
  { nps:"5",  id:4.438 },  // 5.563 − (2×0.563)
  { nps:"6",  id:5.290 },  // 6.625 − (2×0.668)
  { nps:"8",  id:7.125 },  // 8.625 − (2×0.750)
  { nps:"10", id:8.750 },  // 10.750 − (2×1.000)
  { nps:"12", id:10.500 }  // 12.750 − (2×1.125)
];
/* API 5L – Standard-weight (≈ Sch-40) */
const API_STD = [
  { nps:"½",  id:0.674 }, { nps:"¾",  id:0.870 }, { nps:"1",  id:1.097 },
  { nps:"1¼", id:1.396 }, { nps:"1½", id:1.611 }, { nps:"2",  id:2.067 },
  { nps:"2½", id:2.469 }, { nps:"3",  id:3.068 }, { nps:"4",  id:4.026 },
  { nps:"5",  id:5.047 }, { nps:"6",  id:6.065 }, { nps:"8",  id:8.079 },
  { nps:"10", id:10.020}, { nps:"12", id:12.000 }
];

/* ──────────────────────────────────────────────────────────────
   Mapped every drop-down label to its diameter table
   ──────────────────────────────────────────────────────────── */
const TABLES = {
  "ANSI Sch40":      S40,
  "ANSI Sch80":      S80,
  "ANSI Sch160":     S160,

  "ASTM A53 Sch40":  S40,
  "ASTM A106 Sch80": S80,

  "API 5L X52":      API_STD,
  "API 5L X65":      API_STD
};

const TABLE = TABLES[grade] || S40;   

  const GAL_TO_FT3 = 0.133681;              
  const ft3s = (Qgpm * GAL_TO_FT3) / 60;                      
  let picked = TABLE.at(-1);
  for (const row of TABLE) {
    const areaFt2 = Math.PI * (row.id/12)**2 / 4;
    if (ft3s / areaFt2 <= Vmax) { picked = row; break; }
  }

  const Dft = picked.id / 12;                           // ft
  const Dm  = Dft * 0.3048;                             // m
  const areaFt2 = Math.PI * Dft**2 / 4;
  const vFt     = ft3s / areaFt2;                      // ft/s
  const vMs     = vFt * 0.3048;                        // m/s

  /* 3 ─ Equivalent length from fittings ---------------------- */
  const k = { globe:429, gate:7.96, check:100, elbow:30 };
  const LeqFt = (
      (+obstructed||0)*k.globe +
      (+through   ||0)*k.gate  +
      (+checks    ||0)*k.check +
      (+elbows    ||0)*k.elbow
    ) * Dft;

  const LtotalFt = Lstraight + LeqFt;
  const LtotalM  = LtotalFt * 0.3048;

  /* 4 ─ Hydraulics (laminar vs turbulent) -------------------- */
  const rho = 998.203;                       // kg / m³
  const mu  = 1.00194e-3;                   // Pa·s  (water 60 °F)
  const Re  = rho * vMs * Dm / mu;

  let f;                                  // Darcy friction factor
  if (Re < 2300) {                        // laminar – Hagen-Poiseuille
    f = 64 / Re;
  } else {                                // turbulent – Swamee-Jain explicit
    const eps = (+roughness||0) *
                (units==="imperial" ? 0.0254 : 0.001); // m
    f = 0.25 /
        Math.pow( Math.log10( eps/(3.7*Dm) + 5.74/Math.pow(Re,0.9) ), 2 );
  }

  const dP_Pa = f * (LtotalM / Dm) * 0.5 * rho * vMs**2;

  /* 5 ─ Push results to state -------------------------------- */
  setNps (`NPS ${picked.nps}`);
  setDiam(units==="imperial"
            ? `${picked.id.toFixed(3)} in`
            : `${(picked.id*25.4).toFixed(2)} mm`);
  setVFinal(vFt);
  setDp( (dP_Pa * 0.00014503774).toFixed(4) );           // psi
  setEqLen( units==="imperial"
              ? `${LtotalFt.toFixed(2)} ft`
              : `${LtotalM .toFixed(2)} m` );

  /* 6 ─ Reveal table ----------------------------------------- */
  setHasResult(true);
};


  /* convert filled inputs when unit-set flips */
  useEffect(() => {
    const f = parseFloat(flow);
    const v = parseFloat(velocity);
    if (isNaN(f) || isNaN(v)) return;
    if (units === "metric") {
      setFlow    ((f * 0.2271247).toFixed(3));   // gpm → m³/h
      setVelocity((v * 0.3048   ).toFixed(3));   // ft/s → m/s
    } else {
      setFlow    ((f / 0.2271247).toFixed(1));   // m³/h → gpm
      setVelocity((v / 0.3048   ).toFixed(2));   // m/s  → ft/s
    }
  }, [units]); /* eslint-disable-line */

  /* ---------- JSX ---------- */
  return (
    <div className="kva-page">
      {/* -- HERO -- */}
      <header className="kva-hero bg-blue">
        <h1>PVF Pipe-Sizing Calculator</h1>
        <p>Compute pipe ID from flow &amp; velocity.</p>
      </header>

      {/* -- FORM -- */}
      <section className="kva-calc-section bg-white">
        <form className="kva-form" onSubmit={e=>{e.preventDefault();calculate();}}>

          {/* units */}
          <div className="phase-selector">
            {["imperial","metric"].map(id=>(
              <label key={id} className={units===id ? "selected" : ""}>
                <input type="radio" name="units" value={id}
                       checked={units===id}
                       onChange={()=>setUnits(id)} />
                {id==="imperial" ? "Imperial" : "Metric"}
              </label>
            ))}
          </div>

          {/* basic rows */}
          <div className="field-row">
            <div className="field">
              <label htmlFor="grade">Pipe Grade</label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {[
                  "ANSI Sch40",
                  "ANSI Sch80",
                  "ANSI Sch160",   // ← newly added
                  "ASTM A53 Sch40",
                  "ASTM A106 Sch80",
                  "API 5L X52",
                  "API 5L X65"
                ].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>


            <div className="field">
              <label htmlFor="length">
                Pipe Length ({units==="imperial" ? "ft" : "m"})
              </label>
              <input id="length" type="number" value={length}
                     onChange={e=>setLength(e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="flow">
                Water Flow Rate ({units==="imperial" ? "gpm" : "m³/h"})
              </label>
              <input id="flow" type="number" value={flow}
                     onChange={e=>setFlow(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="velocity">
                Max Velocity ({units==="imperial" ? "ft/s" : "m/s"})
              </label>
              <input id="velocity" type="number" value={velocity}
                     onChange={e=>setVelocity(e.target.value)} />
            </div>
          </div>

          {/* advanced */}
          <button
            type="button"
            className={`adv-toggle ${showAdv?"open":""}`}
            onClick={()=>setShowAdv(s=>!s)}
          >
            {showAdv ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>

          {showAdv && (
            <div className="adv-grid">
              {[
                ["obstructed","Obstructed Valves (Globe)",obstructed,setObstructed],
                ["through","Through-Flow Valves (Gate)",through,setThrough],
                ["checks","Check Valves",checks,setChecks],
                ["elbows","Elbows",elbows,setElbows],
              ].map(([id,label,val,set])=>(
                <div className="field" key={id}>
                  <label htmlFor={id}>{label}</label>
                  <input id={id} type="number" value={val}
                         onChange={e=>set(e.target.value)} />
                </div>
              ))}

              <div className="field">
                <label htmlFor="rough">
                  Pipe-Wall Roughness ({units==="imperial"?"in":"mm"})
                </label>
                <input id="rough" type="number" value={roughness}
                       onChange={e=>setRoughness(e.target.value)} />
              </div>
            </div>
          )}

          {/* buttons */}
          <div className="btn-row">
            <button type="submit" className="cta-btn">Calculate</button>
            <button type="button" className="cta-btn secondary" onClick={reset}>
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* ---------- RESULT CARD ------------------------------------ */}
        <section className="kva-result bg-white">
        <h2>Results</h2>

        {/* show placeholder until the user clicks Calculate */}
        {!hasResult ? (
            <p className="placeholder">
            Your results will populate here after you click&nbsp;
            <em>Calculate</em>.
            </p>
        ) : (
           <table className="sizing-table">
            <tbody>
              <tr>
                <td>Nominal Pipe Size</td>
                <td className="val-right">{nps || "—"}</td>
              </tr>

              <tr className="alt">
                <td>Pipe Inner Diameter</td>
                <td className="val-right">
                  {diam.split(" ")[0]}{" "}
                  <span className="unit">{units === "imperial" ? "in" : "mm"}</span>
                </td>
              </tr>

              <tr>
                <td>Water Velocity</td>
                <td className="val-right">
                  {displayVel(vFinal)}{" "}
                  <span className="unit">{units === "imperial" ? "ft/s" : "m/s"}</span>
                </td>
              </tr>

              <tr className="alt">
                <td>Pressure Loss</td>
                <td className="val-right">
                  {dp || "—"}{" "}
                  <span className="unit">{units === "imperial" ? "psi" : "kPa"}</span>
                </td>
              </tr>

              <tr>
                <td>Equivalent Straight Length</td>
                <td className="val-right">{eqLen || "—"}</td>
              </tr>
            </tbody>
          </table>

        )}
        </section>

      {/* -- TABS -- */}
      <section className="kva-tabs bg-grey">
        {/* nav */}
        <nav className="tab-nav">
          {[
            ["how","How It Works"],
            ["equation","Equations"],
            ["defs","Definitions"],
          ].map(([id,label])=>(
            <button key={id} className={tab===id?"active":""}
                    onClick={()=>setTab(id)}>{label}</button>
          ))}
        </nav>

        {/* content */}
        <div className="tab-panel">
          {tab === "how" && (
                <>

                    {/* --- What the calculator does --- */}
                    <h3>How the PVF Calculator Works</h3>
                    <ol>
                      <li>
                        Uses the continuity equation to compute a <em>theoretical hydraulic
                        diameter</em>&nbsp;from your design flow-rate and velocity limit.
                      </li>
                      <li>
                        Walks the selected pipe-grade table
                        (<abbr title="American National Standards Institute">ANSI</abbr>&nbsp;/
                        <abbr title="American Society for Testing and Materials">ASTM</abbr>
                        &nbsp;Sch-40, Sch-80, Sch-160, or API&nbsp;5 L) — starting at
                        ½&nbsp;in and stopping at the first size whose velocity is
                        ≤ your cap.
                      </li>
                      <li>
                        Re-calculates velocity, and pressure-loss on that size
                        using <strong>Swamee–Jain</strong> for the Darcy-friction factor
                        and <strong>Darcy–Weisbach</strong> for&nbsp;ΔP.
                      </li>
                    </ol>

                    {/* --- Built-in assumptions --- */}
                    <h3>Built-in assumptions</h3>
                    <ul className = "roi-list">
                      <li>
                        Fluid: 1&nbsp;cP water at 60 °F&nbsp;
                        (ρ = 62.4 lb/ft³&nbsp;|&nbsp;1000 kg/m³).
                      </li>
                      <li>
                        Pipe roughness: 0.001968 in&nbsp;(0.045 mm) — typical carbon-steel
                        Schedule-40. &nbsp;(Grade selection updates roughness automatically.)
                      </li>
                      <li>
                        <strong>No fittings K-factors</strong> unless you open
                        <em> Advanced&nbsp;Options</em> and add them.
                      </li>
                    </ul>

                    {/* --- Designer tips --- */}
                    <h3>Designer tips</h3>
                    <ul className = "roi-list">
                      <li>
                        Keep cold-water utility lines below&nbsp;
                        <strong>7 ft/s&nbsp;(2.1 m/s)</strong> to minimise erosion and noise.
                      </li>
                      <li>
                        Condensate return can run&nbsp;
                        <strong>8–12 ft/s&nbsp;(2.4–3.7 m/s)</strong>.
                      </li>
                      <li>
                        If ΔP exceeds available pump head, bump the pipe one nominal size
                        until losses fall inside the margin.
                      </li>
                      <li>
                        Need stainless or heavier wall? &nbsp;Change the
                        <em> “Pipe&nbsp;Grade”</em> dropdown — IDs, velocity and losses
                        update instantly.
                      </li>
                    </ul>

                </>
                )}

          {tab==="equation" && (
            <>
              <h3>Equations</h3>
              <ul className="roi-list">
                <li>D [in] = 1.273 √(Q [gpm] / v [ft/s])</li>
                <li>D [mm] = 53.5  √(Q [m³/h] / v [m/s])</li>
                <li>Reynolds, Swamee–Jain, Darcy–Weisbach for hydraulic losses.</li>
              </ul>
            </>
          )}

          {tab === "defs" && (
            <>
                {/* ——— High-level intro ——— */}
                <h3>Key PVF Terminology</h3>
                <p className="guide-blurb">
                Understanding these core hydraulic terms will help you interpret the
                calculator’s output and fine-tune your pipe-sizing decisions.
                </p>

                {/* ——— Flow & Velocity ——— */}
                <h4 className="chart-heading">Flow &amp; Velocity</h4>
                <ul className="roi-list">
                <li>
                    <b>Flow Rate (Q)</b> &nbsp;—&nbsp; Volume of liquid that passes a point
                    in a given time. Expressed in <em>gallons per minute&nbsp;(gpm)</em> or
                    <em> cubic metres per hour&nbsp;(m³/h)</em>.
                </li>
                <li>
                    <b>Velocity (v)</b> &nbsp;—&nbsp; Linear speed of that fluid inside the
                    pipe. Reported in <em>feet per second&nbsp;(ft/s)</em> or{" "}
                    <em>metres per second&nbsp;(m/s)</em>. Controlling velocity keeps
                    erosion, noise, and pressure loss within limits.
                </li>
                </ul>

                {/* ——— Diameter & Schedules ——— */}
                <h4 className="chart-heading">Diameter &amp; Pipe Schedules</h4>
                <ul className="roi-list">
                <li>
                    <b>Pipe Inner Diameter (ID)</b> &nbsp;—&nbsp; The clear bore through
                    which fluid actually flows. Our calculator sizes ID to meet your
                    velocity limit.
                </li>
                <li>
                    <b>Nominal Pipe Size (NPS)</b> &nbsp;—&nbsp; Industry tag (½ in, 2 in,
                    etc.) tied to a standard wall thickness <em>schedule</em> (e.g.,
                    Schedule 40). We choose the first NPS whose published ID is ≥ the
                    hydraulic requirement.
                </li>
                <li>
                    <b>Schedule&nbsp;40</b> &nbsp;—&nbsp; The default wall-thickness series
                    for carbon-steel process piping; it balances pressure rating with
                    economy and is the basis for most reference tables.
                </li>
                </ul>

                {/* ——— Losses & Friction ——— */}
                <h4 className="chart-heading">Hydraulic Losses</h4>
                <ul className="roi-list">
                <li>
                    <b>Reynolds Number (Re)</b> &nbsp;—&nbsp; Dimensionless ratio of
                    inertial to viscous forces. Re&nbsp;&lt;&nbsp;2,300 indicates laminar
                    flow; Re&nbsp;&gt;&nbsp;4,000 is fully turbulent.
                </li>
                <li>
                    <b>Darcy Friction Factor (f)</b> &nbsp;—&nbsp; Dimensionless coefficient
                    that links wall roughness and Reynolds number to pressure drop via the
                    Darcy-Weisbach equation.
                </li>
                <li>
                    <b>Pressure Loss&nbsp;(ΔP)</b> &nbsp;—&nbsp; Energy consumed per unit
                    length, shown in <em>psi</em> or <em>kPa</em>. Excess ΔP drives up pump
                    horsepower.
                </li>
                <li>
                    <b>Head Loss</b> &nbsp;—&nbsp; Same loss expressed as vertical height of
                    water column (<em>ft</em> or <em>m</em>), useful for pump TDH checks.
                </li>
                </ul>

                {/* ——— Roughness & Fittings ——— */}
                <h4 className="chart-heading">Roughness &amp; Fittings</h4>
                <ul className="roi-list">
                <li>
                    <b>Wall Roughness&nbsp;(ε)</b> &nbsp;—&nbsp; Microscopic peaks in the
                    pipe bore, typically&nbsp;0.0018 in (0.045 mm) for clean Schedule 40
                    carbon steel. Higher ε increases Darcy&nbsp;f and ΔP.
                </li>
                <li>
                    <b>K-Factor</b> &nbsp;—&nbsp; Dimensionless loss coefficient for valves,
                    bends, and tees. The calculator translates each K into an{" "}
                    <em>equivalent length</em> of straight pipe so your ΔP reflects real-
                    world fittings.
                </li>
                </ul>
            </>
            )}

        </div>
      </section>

      {/* -- CTA GRID -- */}
      <section className="quote-cta bg-white">
        <h2>Need to Liquidate Surplus PVF?</h2>
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

      <Footer/>
    </div>
  );
}
