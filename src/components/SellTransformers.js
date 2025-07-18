import React from 'react';
import '../styles/SellSurplus.css';
import offerImage from '../assets/offer-image.png';
import seamlessImage from '../assets/seamless-image.png';
import valuationImage from '../assets/valuation-image.png';
import professionalImage from '../assets/professional-image.png';
import eqImg from '../assets/equipment-types.png';
import clientsImg from '../assets/our-clients.png';
import OfferForm from './OfferForm';
import Footer from './Footer';

export default function SellTransformers() {
  // scroll helper for the “Get Started” CTA
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
          Get an offer on your surplus transformers
        </h2>
        <p>
          We’ll send you a no‑obligation quote fast—just tell us what
          transformers you have, and we’ll handle the rest. Click on
          <em>Get an Offer</em> and fill out the inquiry form or call toll‑free at
          <a href="tel:8008852369" className="phone-link"> 800-885-2369</a>
        </p>
        <span className="btn-offer-wrap">
          <button className="btn-offer" onClick={onOfferClick}>
            Get an offer
          </button>
        </span>
      </div>
      <div className="offer-right">
        <img src={offerImage} alt="Illustration of transformer quote" />
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
        'We keep you in the loop at every step of your transformer sale—scheduling pickup, sending photos or answering questions. You get instant, convenient updates and support.',
    },
    {
      img: valuationImage,
      title: '2. Efficient Valuations & Prompt Payments',
      desc:
        'Our team leverages current market data to deliver fast, accurate valuations on your pad‑mount, pole‑mount, dry‑type, or liquid‑filled transformers—and issues payment promptly, so you get the best offer without the wait.',
    },
    {
      img: professionalImage,
      title: '3. Professional Handling of Your Assets',
      desc:
        'From careful on‑site inspection to insured transport, we manage your surplus transformers with top‑tier safety protocols—no liability, no hassle.',
    },
  ];

  return (
    <section className="how-it-works-section">
      <h2 className="how-it-works-heading">
        How Our Transformer Buying Process Works
      </h2>
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
      label: 'Pad‑Mount Transformers',
      note: 'Single‑ & three‑phase • 75‑2,500 kVA',
    },
    {
      label: 'Pole‑Mount Transformers',
      note: 'Single‑phase • 5‑167 kVA',
    },
    {
      label: 'Dry‑Type Transformers',
      note: 'Cast‑coil & VPI • Up to 5 MVA',
    },
    {
      label: 'Liquid‑Filled Power Transformers',
      note: 'Small to mid‑power • 10‑60 MVA',
    },
    {
      label: 'Specialty / Other Transformers',
      note: 'Zig‑zag • grounding • furnace, etc.',
    },
  ];

  return (
    <section className="side-by-side-section">
      <div className="sbs-image">
        <img src={eqImg} alt="Variety of transformers" />
      </div>

      <div className="sbs-content">
        <h2>Types&nbsp;of&nbsp;Transformers&nbsp;We&nbsp;Buy</h2>

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
      label: 'kVA Ratings',
      note: '5 – 60,000 kVA standard ranges',
    },
    {
      label: 'Primary Voltage',
      note: '2.4 kV – 230 kV',
    },
    {
      label: 'Secondary Voltage',
      note: '120/240 V – 34.5 kV',
    },
    {
      label: 'Cooling Class',
      note: 'OA/FA • ONAN/ONAF • KNAN',
    },
    {
      label: 'Impedance Range',
      note: 'Typically 5% – 10%',
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
        <img src={eqImg} alt="Transformer technical details" />
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
          We serve electric utilities, renewable energy developers, industrial
          plants, and electrical contractors nationwide. Whether you’re
          decommissioning pad‑mounts, upgrading substation power, or clearing
          out surplus pole‑mounts, we give you a fast, fair offer and handle
          every step—from quote to pickup.
        </p>
      </div>
      <div className="sbs-image">
        <img src={clientsImg} alt="Satisfied transformer sellers" />
      </div>
    </section>
  );
}
