// ---------------------------------------------------------------------
// PvfGuides.js  –  PVF Guides landing page (selection, testing, ROI)
// ---------------------------------------------------------------------
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "../styles/Guides.css";
import Footer from "./Footer";

/* --- images / icons for PVF ----------------------------------------- */
import heroImg        from "../assets/pvf-offer-image2.png";
import iconSizing     from "../assets/icon-pvf-sizing.png";
import iconTesting    from "../assets/icon-pvf-testing.png";
import iconLifecycle  from "../assets/icon-pvf-lifecycle.png";
import sellThumb      from "../assets/pvf-offer-image2.png";

/* --- static data for the three main PVF guides ----------------------- */
const GUIDE_DATA = [
  {
  id: 'bolts',
  icon: iconSizing,            // import a small bolt icon
  title: 'Bolting Chart',
  blurb: 'Quantity & size of bolts for flanged joints ASME B16.5'
},
  {
    id: "test",
    icon: iconTesting,
    title: "Testing",
    blurb:
      "Hydrostatic pressure tests, leakage analysis, and actuation-function checks for reliable performance."
  },
  {
    id: "lifecycle",
    icon: iconLifecycle,
    title: "Lifecycle ROI",
    blurb:
      "Maintenance-vs-replace cost analysis, corrosion impact, and service-interval optimization."
  }
];

export default function PvfGuides() {
  const [active, setActive] = useState("bolts");
  const [subTab, setSubTab] = useState("chart");
  const [hasOverflow, setHasOverflow] = useState(false);
  const panelRef            = useRef(null);

    // ────────────────────────────────────────────────────
  // Custom scroll-thumb wiring (paste this next)
  useEffect(() => {
    if (!panelRef.current) return;
    const panel = panelRef.current;
    if (!panel) return;
    const wrapper = panel.parentElement;                      // .scroll-wrapper
    const track   = wrapper.querySelector(".scroll-track");   // bail if no track
    if (!track) return;
    const thumb   = track.querySelector(".scroll-thumb");     // bail if no thumb
    if (!thumb) return;
    function updateThumb() {
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      const trackH = track.clientHeight;
      const thumbH = (clientHeight / scrollHeight) * trackH;
      const maxY   = trackH - thumbH;
      const pct    = scrollTop / (scrollHeight - clientHeight);
      thumb.style.height    = `${thumbH}px`;
      thumb.style.transform = `translateY(${pct * maxY}px)`;
    }

    wrapper.addEventListener("scroll", updateThumb);
    updateThumb();
    return () => wrapper.removeEventListener("scroll", updateThumb);
  }, [active, subTab]);
  // ────────────────────────────────────────────────────

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
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.2, ease: "power2.out" }
        );
      }
    });
  }

  useEffect(() => {
    if (active === "test")               setSubTab("overview");
    else if (active === "bolts")           setSubTab("");
    else if (active === "lifecycle")     setSubTab("roiOverview");
    else                                   setSubTab("");
  }, [active]);

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

  function renderActivePanel() {
    switch (active) {
      case "bolts":       return <BoltChartPanel />;
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

  useEffect(() => {
  const panel = panelRef.current;
  if (!panel) return;

  let isDown = false;
  let startY = 0;
  let scrollStart = 0;

  const onDown = e => {
    isDown = true;
    panel.classList.add("drag-scroll");
    startY = e.touches ? e.touches[0].pageY : e.pageY;
    scrollStart = panel.scrollTop;
  };
  const onMove = e => {
    if (!isDown) return;
    const y = e.touches ? e.touches[0].pageY : e.pageY;
    panel.scrollTop = scrollStart - (y - startY);
  };
  const onUp = () => {
    isDown = false;
    panel.classList.remove("drag-scroll");
  };

  panel.addEventListener("mousedown", onDown);
  panel.addEventListener("touchstart", onDown, { passive: true });
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  return () => {
    panel.removeEventListener("mousedown", onDown);
    panel.removeEventListener("touchstart", onDown);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("touchend", onUp);
  };
}, []);

  // ────────────────────────────────────────────────────
  // ② Thumb‐size & position sync
  useEffect(() => {
    const panel = panelRef.current;
    const thumb = panel?.parentNode.querySelector('.scroll-thumb');
    if (!panel || !thumb) return;

    function setThumbSize() {
      const ratio = panel.clientHeight / panel.scrollHeight;
      thumb.style.height = Math.max(ratio * panel.clientHeight, 40) + 'px';
    }
    function syncThumb() {
      const max     = panel.scrollHeight - panel.clientHeight;
      const percent = panel.scrollTop / max;
      const track   = panel.clientHeight - thumb.offsetHeight;
      thumb.style.top = `${percent * track}px`;
    }

    setThumbSize();
    syncThumb();

    panel.addEventListener('scroll', syncThumb);
    window.addEventListener('resize', setThumbSize);

    return () => {
      panel.removeEventListener('scroll', syncThumb);
      window.removeEventListener('resize', setThumbSize);
    };
  }, [active, subTab]);
  // ────────────────────────────────────────────────────

   // detect whether we actually need a scrollbar
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.scrollTop = 0;
    setHasOverflow(panel.scrollHeight > panel.clientHeight);
  }, [active, subTab]);

  // same panel components (SelectionPanel, TestingPanel, LifecyclePanel)
  // reuse the ones from TransformerGuides, since content remains identical


  /* ==================================================================
    Subcomponents
     ================================================================== */

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

                <BoltChartPanel/>

        </>
        );
    }

    // subTab === "info"
    return (
        <>
        <SubTabBar options={tabButtons} />
        <p className="info-blurb">
            Proper PVF sizing is critical for safe, leak-free service. Use port diameter,
            pressure classes, and material compatibilities to pick the right valve or fitting.
        </p>

        <SizingBulletList />

        <div className="cta-button-div">
            <a href="/pvf-calculator"        className="cta-btn">Open PVF Calculator</a>
            <a href="/fault-pvf-calculator"  className="cta-btn secondary">
            Fault-Current Calculator
            </a>
        </div>
        </>
    );
    }

    // reset scroll on tab change
    useEffect(() => {
    const panel = panelRef.current;
    if (panel) panel.scrollTop = 0;
    }, [active, subTab]);


function BoltChartPanel() {
  // full ASME B16.5 nominal pipe sizes (20 columns)
  const sizes = [
    '½″','¾″','1″','1¼″','1½″','2″','2½″','3″','3½″','4″',
    '5″','6″','8″','10″','12″','14″','16″','18″','20″','24″'
  ];

  // ──────────────────────────────────────────────────────────────────
  // Predefined arrays for each class—no self-references inside `data`:
  // ──────────────────────────────────────────────────────────────────

  // Class 150
  const qty150     = ['4','4','4','4','4','4','4','4','8','8','8','8','12','12','12','16','16','20','20','20'];
  const dia150     = ['½″','½″','½″','½″','½″','⅝″','⅝″','⅝″','⅝″','⅝″','¾″','⅞″','⅞″','⅞″','⅞″','1″','1″','1-1/8″','1-1/8″','1-1/4″'];
  const studRf150  = ['2-1/4"','2-1/2"','2-1/2"','2-1/2"','2-3/4"','3"','3-1/4"','3-1/4"','3-1/4"','3-1/4"','3-1/4"','4"','4-1/4"','4-1/4"','4-1/4"','4-1/4"','5-1/4"','6-1/4"','6-3/4"','7-1/4"'];
  const studRtj150 = ['2"','2-1/4"','2-1/4"','2-1/4"','2-1/2"','2-3/4"','3"','3"','3"','3"','3"','3-3/4"','4"','4"','4"','4"','5"','6"','6-1/2"','6-3/4"'];
  const machRf150  = studRf150;
  const machRtj150 = studRtj150;
  const ring150    = ['R15','R17','R19','R22','R25','R29','R33','R36','R40','R43','R48','R52','R56','R59','R63','R68','R72','R76','R80','R84'];

  // Class 300
  const qty300     = ['4','4','4','4','4','4','8','8','8','8','8','12','16','20','20','24','24','24','24','24'];
  const dia300     = ['½″','⅝″','⅝″','¾″','¾″','¾″','¾″','1″','1″','1-1/4″','1-1/4″','1-1/4″','1½″','1½″','1½″','1½″','1½″','1½″','1½″','1½″'];
  const studRf300  = ['2"','2-1/4"','2-1/4"','2-1/4"','2-1/2"','2-3/4"','3-1/4"','3-1/4"','3-1/2"','3-3/4"','4"','4-1/2"','5"','6"','6-1/2"','7-1/4"','7-3/4"','8-1/4"','8-3/4"','9-1/4"'];
  const studRtj300 = ['2-1/2"','2-3/4"','2-3/4"','3"','3-1/4"','3-3/4"','4"','4-1/4"','4-3/4"','5"','5-1/2"','6-1/4"','7-1/4"','8-1/4"','9-1/4"','10-1/2"','11-1/4"','12-3/4"','13-3/4"','14-1/2"'];
  const machRf300  = studRf300;
  const machRtj300 = studRtj300;
  const ring300    = ['R11','R13','R16','R18','R20','R23','R27','R31','R34','R37','R41','R45','R50','R53','R57','R61','R65','R69','R73','R77'];

  // Class 400
  const qty400     = [...qty300];
  const dia400     = ['½″','⅝″','⅝″','⅝″','¾″','¾″','¾″','¾″','⅞″','⅞″','⅞″','1″','1″','1-1/8″','1-1/8″','1-1/4″','1-1/4″','1-3/8″','1-3/8″','1-3/8″'];
  const studRf400  = ['3-1/2"','3-1/2"','3-1/2"','3-1/2"','3-1/2"','4"','4-1/2"','4-1/2"','4-1/2"','4-1/2"','5-1/2"','5-1/2"','6-1/2"','7-1/2"','8-1/2"','10"','11-1/2"','13"','14"','15-1/2"'];
  const studRtj400 = ['3-1/4"','3-1/4"','3-1/4"','3-1/4"','3-1/4"','3-3/4"','4-1/4"','4-1/4"','4-1/4"','4-1/4"','5-1/4"','5-1/4"','6-1/4"','7-1/4"','8-1/4"','9-3/4"','11-1/4"','12-3/4"','13-3/4"','15-1/4"'];
  const machRf400  = studRf400;
  const machRtj400 = studRtj400;
  const ring400    = [...ring300];

  // Class 600
  const qty600     = [...qty300];
  const dia600     = ['½″','⅝″','⅝″','⅝″','¾″','⅝″','¾″','¾″','⅞″','⅞″','⅞″','⅞″','1″','1-1/8″','1-1/4″','1-1/4″','1-3/8″','1-3/8″','1-1/2″','1-3/4″'];
  const studRf600  = [...studRf400];
  const studRtj600 = [...studRtj400];
  const machRf600  = studRf400;
  const machRtj600 = studRtj400;
  const ring600    = [...ring400];

  // Class 900
  const qty900     = [...qty300];
  const dia900     = ['¾″','¾″','⅞″','⅞″','1″','⅞″','1″','⅞″','⅞″','1-1/8″','1-1/4″','1″','1-1/8″','1-1/4″','1-1/4″','1-3/8″','1-1/2″','1-3/4″','1-7/8″','2-1/4″'];
  const studRf900  = ['4"','4"','4"','4"','4"','5"','5"','5"','5"','6-1/4"','7-1/4"','8-1/4"','10-1/4"','12-1/4"','13-1/4"','15"','17"','19"','21"','23"'];
  const studRtj900 = ['3-3/4"','3-3/4"','3-3/4"','3-3/4"','3-3/4"','4-3/4"','4-3/4"','4-3/4"','4-3/4"','5-3/4"','6-3/4"','7-3/4"','9-3/4"','11-3/4"','12-3/4"','14-1/2"','16-1/2"','18-1/2"','20-1/2"','22-1/2"'];
  const machRf900  = studRf900;
  const machRtj900 = studRtj900;
  const ring900    = ['R12','R14','R16','R18','R20','R23','R27','R31','R34','R37','R41','R45','R49','R53','R57','R61','R65','R69','R73','R77'];

  // Class 1500
  const qty1500     = [...qty300];
  const dia1500     = ['¾″','¾″','⅞″','⅞″','1″','⅞″','1″','⅞″','1-1/8″','1-1/8″','1-1/4″','1-1/8″','1-1/4″','1-1/4″','1-3/8″','1-1/2″','1-5/8″','1-5/8″','1-7/8″','2″'];
  const studRf1500  = [...studRf900];
  const studRtj1500 = [...studRtj900];
  const machRf1500  = studRf900;
  const machRtj1500 = studRtj900;
  const ring1500    = [...ring900];

  // Class 2500
  const qty2500     = [...qty300];
  const dia2500     = ['¾″','¾″','⅞″','⅞″','1″','⅞″','1″','⅞″','1-1/8″','1-1/8″','1-1/4″','1-1/4″','1-1/2″','1-3/8″','1-5/8″','1-3/4″','1-7/8″','2″','2-1/4″','2-1/2″'];
  const studRf2500  = [...studRf900];
  const studRtj2500 = [...studRtj900];
  const machRf2500  = studRf900;
  const machRtj2500 = studRtj900;
  const ring2500    = ['R13','R16','R18','R20','R23','R26','R28','R32','R38','R42','R47','R51','R55','R60','R64','R68','R72','R76','R80','R84'];

  // ──────────────────────────────────────────────────────────────────
  // Assemble without self-references
  // ──────────────────────────────────────────────────────────────────
  const data = {
    150: { quantity: qty150, diameter: dia150,   studRf: studRf150,   studRtj: studRtj150,   machRf: machRf150,   machRtj: machRtj150,   ring: ring150 },
    300: { quantity: qty300, diameter: dia300,   studRf: studRf300,   studRtj: studRtj300,   machRf: machRf300,   machRtj: machRtj300,   ring: ring300 },
    400: { quantity: qty400, diameter: dia400,   studRf: studRf400,   studRtj: studRtj400,   machRf: machRf400,   machRtj: machRtj400,   ring: ring400 },
    600: { quantity: qty600, diameter: dia600,   studRf: studRf600,   studRtj: studRtj600,   machRf: machRf600,   machRtj: machRtj600,   ring: ring600 },
    900: { quantity: qty900, diameter: dia900,   studRf: studRf900,   studRtj: studRtj900,   machRf: machRf900,   machRtj: machRtj900,   ring: ring900 },
    1500:{ quantity: qty1500,diameter: dia1500,  studRf: studRf1500,  studRtj: studRtj1500,  machRf: machRf1500,  machRtj: machRtj1500,  ring: ring1500 },
    2500:{ quantity: qty2500,diameter: dia2500,  studRf: studRf2500,  studRtj: studRtj2500,  machRf: machRf2500,  machRtj: machRtj2500,  ring: ring2500 }
  };

   // map for row labels
  const labelMap = {
    quantity: 'Quantity',
    diameter: 'Diameter',
    studRf:   'Stud Bolts (RF)',
    studRtj:  'Stud Bolts (RTJ)',
    machRf:   'Machine Bolts (RF)',
    machRtj:  'Machine Bolts (RTJ)',
    ring:     'Ring No.'
  };

  // build flat array of rows
  const rows = [];
  Object.entries(data).forEach(([cls, vals]) => {
    Object.keys(labelMap).forEach(key => {
      rows.push({
        cls,
        label: labelMap[key],
        values: vals[key]
      });
    });
  });

  return (
    <section className="bolt-chart">
      <h2>Stud, Nut &amp; Bolt Chart</h2>
      <div className="bolt-chart__table-wrapper">
        <table className="bolt-table">
          <thead>
            <tr>
              <th>Class / Size</th>
              {sizes.map(sz => <th key={sz}>{sz}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              // determine group index (every 7 rows = one class)
              const groupIndex = Math.floor(i / 7);
              const bgColor = groupIndex % 2 === 0 ? "#f2f2f2" : "transparent";

              return (
                <tr
                  key={`${row.cls}-${row.label}`}
                  style={{ background: bgColor }}
                >
                  <th>{`Class ${row.cls} ${row.label}`}</th>
                  {row.values.map((v, j) => <td key={j}>{v}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}


    function SizingBulletList() {
    return (
        <ul className="roi-list">
        <li>Check port size vs. flow requirements (Cv or Kv values)</li>
        <li>Match material specs for temperature &amp; chemical compatibility</li>
        <li>Verify flange ratings per ASME B16.5 / B16.47</li>
        <li>Apply safety factors for pressure surges &amp; water hammer</li>
        </ul>
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
        case "overview":   content = <TestOverview />;         break;
        case "workflow":   content = <DiagnosticsWorkflow />;  break;
        case "intervals":  content = <MaintenanceIntervals />; break;
        default:           content = null;
    }

    return (
        <>
        <SubTabBar options={tabs} />
        {content}
        </>
    );
    }

    function TestOverview() {
    return (
        <>
        <h3 className="chart-heading">Hydrostatic &amp; Leak-Test Overview</h3>
        <ul className="roi-list">
            <li><b>Hydrostatic Pressure</b> – hold to rated test pressure; inspect for deformations.</li>
            <li><b>Leak Detection</b> – bubble test or helium tracer; max allowed rate per API Std&nbsp;598.</li>
            <li><b>Actuation Check</b> – cycle open/close under no-load; verify torque &amp; response times.</li>
            <li><b>Seat Integrity</b> – ensure soft seats hold ≤0.01% leakage per industry guidelines.</li>
        </ul>
        <div className="btn-row" style={{ marginTop: "1rem" }}>
            <a href="/pvf-calculator" className="cta-btn">Sizing Calculator</a>
            <a href="/roi-calculator" className="cta-btn secondary">ROI Calculator</a>
        </div>
        </>
    );
    }

    function DiagnosticsWorkflow() {
    return (
        <>
        <h3 className="chart-heading">Diagnostics Workflow</h3>
        <p>
            Combine <b>routine pressure tests</b> with <b>visual inspections</b> and
            <b>non-destructive leak checks</b> to move from calendar-based to
            condition-based maintenance.
        </p>
        <ol className="roi-list">
            <li>Record initial acceptance readings &rarr; set baseline in CMMS.</li>
            <li>Perform quarterly leak &amp; actuation tests; log in trend charts.</li>
            <li>Trigger full teardown inspection when leakage threshold.</li>
            <li>Update maintenance intervals based on actual performance data.</li>
        </ol>
        </>
    );
    }

    function MaintenanceIntervals() {
    return (
        <>
        <h3 className="chart-heading">Recommended Maintenance Intervals</h3>
        <table className="sizing-table">
            <thead>
            <tr>
                <th>Component</th>
                <th>Inspection</th>
                <th>Re-seal</th>
                <th>Full Overhaul</th>
            </tr>
            </thead>
            <tbody>
            <tr><td>Ball / Gate Valve</td>     <td>6 mo</td> <td>24 mo</td> <td>72 mo</td></tr>
            <tr><td>Butterfly / Check Valve</td><td>12 mo</td><td>36 mo</td><td>84 mo</td></tr>
            <tr><td>Pump Seals</td>            <td>3 mo</td> <td>18 mo</td> <td>60 mo</td></tr>
            {/* …add more rows as needed… */}
            </tbody>
        </table>
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
        { id: "carbon",      label: "Carbon Impact"}
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

    function RoiOverview() {
    return (
        <>
        <h3 className="chart-heading">Why Lifecycle ROI Matters</h3>
        <p>
            PVF assets carry costs beyond purchase—seals, actuation, downtime,
            and environmental compliance. Our ROI framework folds in
            <strong>inspection fees, replacement parts, failure penalties,
            and carbon mitigation</strong> to let you decide whether to
            repair, replace, or remarket with full confidence.
        </p>
        <ul className="roi-list">
            <li>Include seal-replacement costs and labor hours</li>
            <li>Factor leak-penalty clauses and downtime fees</li>
            <li>Apply carbon credits for low-leakage upgrades</li>
            <li>Use ROI calculator for ESG alignment</li>
        </ul>
        <a href="/sell-pvf-stock" className="cta-btn">
            Sell Your PVF Inventory
        </a>
        </>
    );
    }

    function CashflowModel() {
    return (
        <>
        <h3 className="chart-heading">Repair vs Replace Cash-Flow Model</h3>
        <table className="sizing-table">
            <thead>
            <tr>
                <th>Line Item</th>
                <th>Keep Running</th>
                <th>Major Repair</th>
                <th>New Replacement</th>
                <th>Immediate Sale</th>
            </tr>
            </thead>
            <tbody>
            <tr><td>Seal Replacement</td>    <td>$2,000</td>  <td>$6,000</td>  <td>$10,000</td> <td>$4,000</td></tr>
            <tr><td>Downtime Cost</td>       <td>$1,500</td>  <td>$5,000</td>  <td>$0</td>      <td>$0</td></tr>
            <tr><td>Labor &amp; Parts</td>    <td>$500</td>    <td>$2,500</td>  <td>$0</td>      <td>$0</td></tr>
            {/* …more rows as needed… */}
            </tbody>
        </table>
        <ul className="roi-list">
            <li>Embed carbon-savings credit where applicable</li>
            <li>Model replacement COGS vs. overhaul CAPEX</li>
        </ul>
        <a href="/sell-pvf-stock" className="cta-btn">
            Sell Your PVF Inventory
        </a>
        </>
    );
    }

    function CarbonImpact() {
    return (
        <>
        <h3 className="chart-heading">Carbon &amp; ESG Considerations</h3>
        <p>
            Upgrading to low-leakage seals can reduce fugitive emissions
            by up to <b>95%</b>. With internal carbon prices and
            regulatory credits, that often offsets CAPEX in under one cycle.
        </p>
        <ul className="roi-list">
            <li>Estimate tCO₂e saved per seal upgrade</li>
            <li>Include compliance-credit revenues</li>
            <li>Apply ESG scoring for investor reporting</li>
        </ul>
        <a href="/sell-pvf-stock" className="cta-btn">
            Sell Your PVF Inventory
        </a>
        </>
    );
    }





  /* ==================================================================
     RENDER
     ================================================================== */
  return (
    <div className="kva-page">
      {/* ---------- HERO ---------- */}
      <section className="guides-hero">
        <div className="guides-hero__text">
          <p className="eyebrow">New • 2025 PVF Guides Library</p>
          <h1>Master PVF Selection, Testing &amp; Lifecycle ROI</h1>
          <p className="subtitle">
            Free technical playbooks on valve sizing, pressure-test formulas,
            and asset end-of-life strategies for PVF equipment.
          </p>
          <div className="cta-button-div">
            <a href="#guides" className="cta-btn">Browse Guides</a>
            <a href="/sell-pvf-stock" className="cta-btn secondary">
              Sell Your PVF Inventory
            </a>
          </div>
        </div>
        <div className="guides-hero__image">
          <img src={heroImg} alt="PVF equipment overview" />
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

      {/* ---------- LIGHT PROMO BAND (variation) ---------- */}
      <section className="band band--light">
        <div className="band-inner">
          <div className="band__content">
            <h2>Optimize PVF Performance &amp; Profit</h2>
            <p>
              From ASME sizing charts to corrosion-impact analysis, our PVF guides
              provide data-driven methods that reduce downtime and maximize ROI.
            </p>
            <a href="#guides" className="cta-btn">Compare Guides</a>
          </div>
          <div className="band__visual">
            <img src={heroImg} alt="PVF performance" />
          </div>
        </div>
      </section>

      {/* ---------- INTERACTIVE SELECTOR ---------- */}
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
         {hasOverflow && (
          <div className="scroll-track">
            <div className="scroll-thumb"></div>
          </div>
         )}
        </div>
      </section>

      {/* ---------- CTA GRID ---------- */}
      <section id="cta" className="quote-cta bg-white">
        <h2>Ready to Monetise PVF Inventory?</h2>
        <div className="cta-grid">
          <a href="/sell-pvf-stock" className="cta-tile">
            <img src={sellThumb} alt="Sell PVF items" />
            <span>Get a Cash Offer</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
