import React from 'react';
import '../styles/SellSurplus.css';
import offerImage from '../assets/electrical-offer-image.png';
import seamlessImage from '../assets/seamless-image.png';
import valuationImage from '../assets/valuation-image.png';
import professionalImage from '../assets/professional-image.png';
import eqImg from '../assets/electrical-types.png';
import eq2Img from '../assets/electrical-types2.png'
import clientsImg from '../assets/our-clients.png';
import OfferForm from './OfferForm';
import Footer from './Footer';

export default function SellElectrical() {
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
          <br /> electrical equipment
        </h2>
        <p>
          We buy breakers, switchgear, MCCs, and more nationwide. Click
          <em> Get an Offer</em>, fill out the quick form, and receive a
          no‑obligation quote fast—or call toll‑free 888‑123‑4567.
        </p>
        <span className="btn-offer-wrap">
          <button className="btn-offer" onClick={onOfferClick}>
            Get an offer
          </button>
        </span>
      </div>
      <div className="offer-right">
        <img src={offerImage} alt="Illustration of electrical equipment quote" />
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
        'Quick replies on specs, photos, and pickup timing—so your surplus gear moves fast and you are never left guessing.',
    },
    {
      img: valuationImage,
      title: '2. Efficient Valuations & Prompt Payments',
      desc:
        'Our buyers track current demand for breakers, switchgear, and drives to deliver competitive offers—and wire payment immediately upon acceptance.',
    },
    {
      img: professionalImage,
      title: '3. Professional Handling of Your Assets',
      desc:
        'We schedule insured freight, handle rigging, and provide chain‑of‑custody documentation—no liability, no hassle.',
    },
  ];

  return (
    <section className="how-it-works-section">
      <h2 className="how-it-works-heading">How Our Electrical Equipment Buying Process Works</h2>
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
      label: 'Low‑Voltage Circuit Breakers',
      note: 'Molded‑case & insulated‑case • 15‑4,000 A',
    },
    {
      label: 'Medium‑Voltage Breakers',
      note: 'Vacuum & SF₆ • 5‑15 kV',
    },
    {
      label: 'Switchgear & Switchboards',
      note: 'LV & MV lineups, sections, buckets',
    },
    {
      label: 'Motor Control Centers (MCCs)',
      note: 'Complete centers or individual buckets',
    },
    {
      label: 'Drives & Soft Starters',
      note: 'VFDs 1‑5,000 HP, reduced‑voltage starters',
    },
    {
      label: 'Panelboards & Disconnects',
      note: 'NEMA 1, 3R, 4X enclosures',
    },
  ];

  return (
    <section className="side-by-side-section">
      <div className="sbs-image">
        <img src={eqImg} alt="Assorted electrical equipment" />
      </div>

      <div className="sbs-content">
        <h2>Types&nbsp;of&nbsp;Electrical&nbsp;Equipment&nbsp;We&nbsp;Buy</h2>

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
      label: 'Voltage Range',
      note: '208 V – 15 kV',
    },
    {
      label: 'Interrupt Rating',
      note: '25 – 200 kAIC',
    },
    {
      label: 'Enclosure Type',
      note: 'NEMA 1, 3R, 4, 4X, 12',
    },
    {
      label: 'Frame Sizes',
      note: '15 A – 6,000 A',
    },
    {
      label: 'Motor HP Range',
      note: '1 – 5,000 HP (VFDs & starters)',
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
        <img src={eq2Img} alt="Electrical equipment technical details" />
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
          We purchase surplus electrical gear from utilities, industrial plants,
          data centers, OEMs, and electrical contractors across North America.
          Whether you’re upgrading switchgear, decommissioning a plant, or
          clearing warehouse stock, we provide top‑of‑market offers and turnkey
          logistics.
        </p>
      </div>
      <div className="sbs-image">
        <img src={clientsImg} alt="Satisfied electrical equipment sellers" />
      </div>
    </section>
  );
}
