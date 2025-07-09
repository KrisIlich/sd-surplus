// src/pages/AboutUs.js
//---------------------------------------------------------------
//  About Us – S&D Industrial Surplus
//---------------------------------------------------------------
import React, { useEffect } from 'react';
import '../styles/AboutUs.css';
import alexPortrait from '../assets/alex-headshot.png';
import annaPortrait from '../assets/annie-headshot.png';
import salesRep from '../assets/sales.jpg';

import Footer from '../components/Footer';

// smooth-scroll helpers (same libs the other pages use)
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  /* ------------------------------------------------------------------
     Lenis + ScrollTrigger smooth scrolling 
     ------------------------------------------------------------------ */
  useEffect(() => {
    const lenis = new Lenis({ smooth: true });

    // drive Lenis every RAF frame ─ and keep ScrollTrigger in sync
    const raf = (time) => {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // refresh triggers on viewport / content changes
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

  /* ------------------------------------------------------------------ */

  return (
    <>
      {/* ---------- HERO BANNER ---------- */}
      <section className="about-hero">
        <div className="about-hero__overlay">
          <h1 className="about-hero__title">
            Our mission is to maximize <span>value</span><br />
            through responsible reuse of industrial assets
          </h1>
        </div>
      </section>

      <main>
        {/* ---------- OUR STORY ---------- */}
        <section className="about-story container">
          <h2 className="section-heading">Our story</h2>

          <p>
            Founded in 2010, <strong>S&amp;D Industrial Surplus</strong> grew from a
            modest scrapyard operation into one of the largest buyers of
            transformers, switchgear, and PVF equipment in North America.
            We realised early that industry needed a transparent partner—one
            who could extract maximum value from surplus assets while keeping
            sustainability front-and-centre.
          </p>
            <br/>
          <p>
            Today we purchase, refurbish, and responsibly redistribute surplus
            machinery across the globe. Our customers know exactly what their
            equipment is worth, and our vendors trust that nothing goes to
            waste. It’s a win-win that keeps critical materials in circulation
            and delivers better returns for everyone in the supply chain.
          </p>
        </section>

        {/* ---------- TEAM ---------- */}
        <section className="about-team">
          <h2 className="section-heading section-heading--light">Our team</h2>

          <div className="team-grid container">
            {/* Alex */}
            <article className="team-card">
              <div className="team-card__img placeholder-img">
                <img src={alexPortrait} alt="Alex's Headshot" />
              </div>
              <div className='card-text-wrapper'>
                <h3 className="team-card__name">Alex</h3>
                <p className="team-card__role">Co-owner &amp; Operations Lead</p>
                <p>
                    Alex oversees day-to-day logistics, ensuring every transformer
                    and breaker is processed safely and efficiently. He cut his
                    teeth repairing appliances at the family’s&nbsp;
                    <em>Al &amp; Annie’s Appliances</em> storefront in Decatur,
                    Alabama, before scaling that knack for detail to industrial
                    equipment.
                </p>
              </div>
            </article>

            {/* Anna */}
            <article className="team-card">
              <div className="team-card__img placeholder-img">
                <img src={annaPortrait} alt="Anna's Headshot" />
              </div>
              <div className='card-text-wrapper'>
                <h3 className="team-card__name">Anna</h3>
                <p className="team-card__role">Co-owner &amp; Finance Director</p>
                <p>
                    Anna manages vendor relations and keeps S&amp;D’s offers
                    competitive without compromising the bottom line. Her
                    background running the books—and the showroom—at&nbsp;
                    <em>Al &amp; Annie’s Appliances</em> makes her the perfect
                    liaison between buyers, sellers, and recycling partners.
                </p>
              </div>
            </article>

            {/* Future hire / placeholder */}
            <article className="team-card">
              <div className="team-card__img placeholder-img">
                <img src={salesRep} alt="Sales's Headshot" />
              </div>
              <div className='card-text-wrapper'>
                <h3 className="team-card__name">Steven</h3>
                <p className="team-card__role">Sales &amp; Technical Specialist</p>
                <p>
                    Steven bridges the gap between surplus sellers and our technical team, 
                    translating complex equipment specs into clear, fair offers. 
                    With a background in industrial distribution and a knack for relationship-building, 
                    he ensures every vendor walks away confident in the value of their deal.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* Global footer */}
      <Footer />
    </>
  );
};

export default AboutUs;
