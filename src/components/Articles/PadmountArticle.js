//---------------------------------------------------------------
//  Article: 3-Phase Pad-Mount Transformers
//---------------------------------------------------------------
import React, { useEffect } from 'react';
import '../../styles/PadmountArticle.css';

import Footer from '../../components/Footer';

import Lenis from '@studio-freight/lenis';
import gsap  from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import heroImg from '../../assets/padmount-hero.jpg';


gsap.registerPlugin(ScrollTrigger);


const PadmountArticle = () => {
  /* ---------- Smooth scroll ---------- */
  useEffect(() => {
    const lenis = new Lenis({ smooth: true });
    const raf   = t => { lenis.raf(t); ScrollTrigger.update(); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);
    window.addEventListener('load',   refresh);
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener('resize', refresh);
      window.removeEventListener('load',   refresh);
    };
  }, []);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <header className="article-hero">
        <img src={heroImg} alt="Service crew installing a 3-phase pad-mount transformer" />

        <div className="article-hero__overlay">
            <div className="container">
            <h1 className="article-title">
                Why 3-Phase Pad-Mount Transformers<br/>
                Power Modern Distribution Grids
            </h1>
            <p className="article-sub">
                Specification guide • Applications • Lifecycle &amp; ROI
            </p>
            </div>
        </div>
        </header>


      <main>
        {/* ---------- METRIC BAR ---------- */}
        <section className="metric-bar">
          <div><strong>45&nbsp;–&nbsp;10,000&nbsp;kVA</strong><br />standard kVA range</div>
          <div><strong>15&nbsp;–&nbsp;35&nbsp;kV</strong><br />primary voltage classes</div>
          <div><strong>60&nbsp;%</strong><br />foot-print savings vs. pole-mount</div>
          <div><strong>50&nbsp;yrs</strong><br />typical service life</div>
        </section>

        {/* ---------- FAST FACTS ---------- */}
        <section className="facts-grid container">
          <article>
            <h4>Configuration</h4>
            <p>Three-phase, oil-filled, tamper-proof, loop or radial feed.</p>
          </article>
          <article>
            <h4>Common Standards</h4>
            <p>IEEE C57.12.34, DOE 10 CFR 431 efficiency, ANSI tank ratings.</p>
          </article>
          <article>
            <h4>Ideal Industries</h4>
            <p>Utility distribution, data centers, renewable interconnects, campuses, &amp; industrial parks.</p>
          </article>
          <article>
            <h4>Cooling Class</h4>
            <p>ONAN / KNAN (natural) with optional ONAF fans for high-load sites.</p>
          </article>
        </section>

        {/* ---------- BACKGROUND ---------- */}
        <section className="article-section container">
          <h2>Background</h2>
          <p>
            As urban density rises and underground distribution becomes the norm, utilities rely on
            <strong> three-phase pad-mount transformers</strong> to step primary voltages (typically 15–35&nbsp;kV)
            down to utilization levels of 208Y/120&nbsp;V or 480Y/277&nbsp;V. Unlike pole-mount units,
            pad-mounts are <em>tamper-resistant, low-profile, and serviceable at ground level</em>,
            reducing right-of-way constraints and improving crew safety.
          </p>
        </section>

        {/* ---------- CHALLENGE ---------- */}
        <section className="article-section container">
          <h2>Challenge: balancing capacity &amp; footprint</h2>
          <p>
            Shrinking easements and higher load densities push utilities to find equipment that
            delivers <strong>higher kVA in smaller real estate</strong>. Traditional substation or
            pole-top designs struggle to meet modern aesthetics and safety codes, while cast-resin
            units can carry higher upfront costs.
          </p>
        </section>

        {/* ---------- SOLUTION ---------- */}
        <section className="article-section container">
          <h2>Solution: modern pad-mount design</h2>
          <ul>
            <li><strong>Compartmentalized tanks</strong> isolate HV, LV, and arrestors for live-front or dead-front terminations.</li>
            <li><strong>Sealed, N2-blanketed tanks</strong> minimize oxygen ingress, extending dielectric life.</li>
            <li><strong>Eco-friendly ester fluids</strong> (FR3) offer 320 °C fire point and biodegradable spill performance.</li>
            <li><strong>Loop-feed elbows</strong> allow rapid sectionalizing and redundancy without vault entry.</li>
            <li><strong>DOE Tier 2 efficiencies&nbsp;(2026)</strong> reduce core / copper losses by up to 18&nbsp;%.</li>
          </ul>
        </section>

        {/* ---------- MAINTENANCE ---------- */}
        <section className="article-section container">
          <h2>Maintenance &amp; lifecycle optimization</h2>
          <p>
            Routine infrared scans, dissolved gas analysis (DGA), and dielectric breakdown testing
            can <strong>extend in-service life beyond 50&nbsp;years</strong>. Retrofit accessories—such as
            smart load-tap changers and real-time fluid monitors—unlock extra capacity without
            replacing the core tank.
          </p>
        </section>

        {/* ---------- SEARCH & SEO KEYWORDS ---------- */}
        <section className="article-section container">
          <h2>Key specs at a glance</h2>
          <table className="spec-table">
            <thead><tr><th>Parameter</th><th>Typical Range</th></tr></thead>
            <tbody>
              <tr><td>kVA rating</td><td>45 – 10,000 kVA</td></tr>
              <tr><td>Primary voltage</td><td>7.2 – 34.5 kV</td></tr>
              <tr><td>Secondary voltage</td><td>208Y/120 V • 480Y/277 V • custom</td></tr>
              <tr><td>Impedance</td><td>2.5 % – 6.5 %</td></tr>
              <tr><td>Fluid options</td><td>Mineral oil, FR3 natural ester, silicone</td></tr>
              <tr><td>Cooling class</td><td>ONAN • KNAN • ONAF (w/ fans)</td></tr>
              <tr><td>BIL rating</td><td>95 kV (15 kV class) – 200 kV (35 kV class)</td></tr>
              <tr><td>Standards</td><td>IEEE C57.12.34, DOE efficiency, ANSI C57.91</td></tr>
            </tbody>
          </table>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="article-cta">
          <h2>Ready to turn surplus pad-mounts into working capital?</h2>
          <a className="btn-primary" href="/sell-transformers">Sell Your Transformers</a>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PadmountArticle;
