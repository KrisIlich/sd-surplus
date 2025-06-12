import React from 'react';
import '../styles/SellSurplus.css';
import offerImage from '../assets/pvf-offer-image.png';
import seamlessImage from '../assets/seamless-image.png';
import valuationImage from '../assets/valuation-image.png';
import professionalImage from '../assets/professional-image.png';
import eqImg from '../assets/pvf-types.png';
import pvfImg from '../assets/pvf-offer-image2.png'
import clientsImg from '../assets/our-clients.png';
import OfferForm from './OfferForm';
import Footer from './Footer';

export default function SellPVF() {
  const scrollToGetStarted = () => {
    document.getElementById('get-started').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sell-surplus-container">
      <GetOfferCTA onOfferClick={scrollToGetStarted} />
      <HowItWorks />
      <div className="sbs-wrapper">
        <EquipmentTypes />
        <TechnicalSpecifications />
        <WhoWeBuyFrom />
      </div>
      <OfferForm />
      <Footer />
    </div>
  );
}

function GetOfferCTA({ onOfferClick }) {
  return (
    <section className="get-offer-cta">
      <div className="offer-left">
        <h2>
          Get an offer on
          <br /> your surplus
          <br /> pipes, valves & fittings
        </h2>
        <p>
          We buy carbon‑steel, stainless, and alloy PVF inventory nationwide.
          Click on <em>Get an Offer</em>, fill out the quick form, and receive a
          no‑obligation quote fast—or call toll‑free 888‑123‑4567.
        </p>
        <span className="btn-offer-wrap">
          <button className="btn-offer" onClick={onOfferClick}>
            Get an offer
          </button>
        </span>
      </div>
      <div className="offer-right">
        <img src={offerImage} alt="Illustration of PVF quote" />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      img: seamlessImage,
      title: '1. Seamless Communication',
      desc:
        'Rapid responses on specs, pictures, and pickup windows—so your surplus PVF moves quickly and you’re never left guessing.',
    },
    {
      img: valuationImage,
      title: '2. Efficient Valuations & Prompt Payments',
      desc:
        'Our buyers leverage real‑time steel and alloy markets to deliver competitive offers—and wire funds immediately upon acceptance.',
    },
    {
      img: professionalImage,
      title: '3. Professional Handling of Your Assets',
      desc:
        'We arrange insured freight, load‑out, and documentation. All you do is sign the bill of lading.',
    },
  ];

  return (
    <section className="how-it-works-section">
      <h2 className="how-it-works-heading">How Our PVF Buying Process Works</h2>
      <div className="how-it-works-grid">
        {steps.map(({ img, title, desc }, i) => (
          <div className="how-it-works-card" key={i}>
            <img src={img} alt="" className="how-it-works-img" />
            <h3 className="how-it-works-title">{title}</h3>
            <p className="how-it-works-desc">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EquipmentTypes() {
  const ITEMS = [
    {
      label: 'Seamless & ERW Pipe',
      note: '½” – 48” OD • Schedules 40–160',
    },
    {
      label: 'Stainless & Alloy Pipe',
      note: '304/L, 316/L, Duplex, Chrome‑Moly',
    },
    {
      label: 'Valves (Ball, Gate, Globe, Check)',
      note: 'Class 150 – 2500 • ANSI & API',
    },
    {
      label: 'Fittings & Flanges',
      note: 'Elbows, Tees, Reducers, Weld Necks',
    },
    {
      label: 'Specialty PVF',
      note: 'Forged fittings, stud bolts, gaskets',
    },
  ];

  return (
    <section className="side-by-side-section">
      <div className="sbs-image">
        <img src={eqImg} alt="Assorted pipes, valves, and fittings" />
      </div>

      <div className="sbs-content">
        <h2>Types&nbsp;of&nbsp;Pipes, Valves&nbsp;&amp;&nbsp;Fittings&nbsp;We&nbsp;Buy</h2>

        <div className="equip-grid">
          {ITEMS.map(({ label, note }) => (
            <div className="equip-item" key={label}>
              <span className="equip-icon" aria-hidden />
              <div className="equip-text">
                <strong>{label}</strong>
                <small>{note}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnicalSpecifications() {
  const SPECS = [
    {
      label: 'Diameters',
      note: '½” – 48” (DN15 – DN1200)',
    },
    {
      label: 'Schedules',
      note: 'Sch 10S – Sch 160 / XXH',
    },
    {
      label: 'Pressure Classes',
      note: 'ANSI 150 – 2500, API 3,000 – 20,000',
    },
    {
      label: 'End Connections',
      note: 'Beveled, Threaded, Socket‑Weld, Flanged',
    },
    {
      label: 'Material Grades',
      note: 'ASTM A106, A53, A333, A312, A234, A105, A182',
    },
  ];

  return (
    <section className="side-by-side-section">
      <div className="sbs-content">
        <h2>Technical&nbsp;Specifications&nbsp;We&nbsp;Consider</h2>
        <div className="equip-grid">
          {SPECS.map(({ label, note }) => (
            <div className="equip-item" key={label}>
              <span className="equip-icon" aria-hidden />
              <div className="equip-text">
                <strong>{label}</strong>
                <small>{note}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sbs-image">
        <img src={pvfImg} alt="PVF technical details" />
      </div>
    </section>
  );
}

function WhoWeBuyFrom() {
  return (
    <section className="side-by-side-section">
      <div className="sbs-content">
        <h2>Who We Buy From</h2>
        <p>
          We purchase surplus PVF from energy producers, petrochemical plants,
          mechanical contractors, and distributors across North America. Whether
          you’re clearing out project overages or liquidating warehouse stock,
          we provide top‑of‑market offers and turnkey logistics.
        </p>
      </div>
      <div className="sbs-image">
        <img src={clientsImg} alt="Satisfied PVF sellers" />
      </div>
    </section>
  );
}
