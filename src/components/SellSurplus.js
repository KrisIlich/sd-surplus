import React from 'react';
import '../styles/SellSurplus.css';
import offerImage from '../assets/offer-image.png';
import seamlessImage from '../assets/seamless-image.png';
import valuationImage from '../assets/valuation-image.png';
import professionalImage from '../assets/professional-image.png';
import eqImg from '../assets/equipment-types.png';
import clientsImg from '../assets/our-clients.png'
import OfferForm from './OfferForm';
import Footer from './Footer';

export default function SellSurplus() {
  // scroll helper for the “Get Started” CTA
  const scrollToGetStarted = () => {
    document
      .getElementById('get-started')
      .scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sell-surplus-container">
        <GetOfferCTA onOfferClick={scrollToGetStarted}/>
        <HowItWorks />
        <div className='sbs-wrapper'>
            <EquipmentTypes/>
            <WhoWeBuyFrom />
        </div>
        <OfferForm />
        <Footer />
    </div>
  );
}


function GetOfferCTA({onOfferClick}) {
    return (
      <section className="get-offer-cta">
        <div className="offer-left">
          <h2>Get an offer on<br/> your industrial<br/> surplus equipment</h2>
          <p>
            We’ll send you a no-obligation quote fast, just tell us what you have,
            and we’ll handle the rest. Click on get an offer and fill out the inquiry form or call toll free at 888-123-4567.
          </p>
          <span className="btn-offer-wrap">
            <button className="btn-offer" onClick={onOfferClick}>
              Get an offer
            </button>
          </span>
        </div>
        <div className="offer-right">
          <img src={offerImage} alt="Illustration of equipment quote" />
        </div>
      </section>
    );
  }

  function HowItWorks() {
    const steps = [
      {
        img: seamlessImage,  
        title: '1. Seamless Communication',
        desc: `We keep you in the loop at every step of your industrial transformer, PVF & electrical surplus sale—whether it’s scheduling a pick-up, sending photos, or answering questions, you get instant, convenient updates and support.`,
      },
      {
        img: valuationImage,  
        title: '2. Efficient Valuations & Prompt Payments',
        desc: `Our team leverages market data to deliver fast, accurate valuations on your electrical industrial surplus—transformers, switchgear, PVF and more—and issues payments promptly, so you get the best offer without the wait.`,
      },
      {
        img: professionalImage,  
        title: '3. Professional Handling of Your Assets',
        desc: `From careful on-site inspection to insured transport, we manage your surplus transformers, PVF piping, and other electrical equipment with top-tier safety protocols and professional handling—no liability, no hassle.`,
      },
    ];
  
    return (
      <section className="how-it-works-section">
        <h2 className="how-it-works-heading">
          How Our Surplus Equipment Buying Process Works
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
        label: 'Transformers',
        note :
          'Padmount · Polemount · Dry-Type · Liquid Filled',
      },
      {
        label: 'PVF',
        note :
          'Industrial pipes · valves · fittings (all sizes & materials)',
      },
      {
        label: 'Electrical Switchgear',
        note :
          'Metal-enclosed · pad-mount · low & medium-voltage',
      },
      {
        label: 'Substation Gear',
        note :
          'Breakers · panelboards · control gear & apparatus',
      },
      {
        label: 'Related Industrial Equipment',
        note : 'Motors · capacitors · relay panels, etc.',
      },
    ];
  
    return (
      <section className="side-by-side-section">
        <div className="sbs-image">
          <img src={eqImg} alt="Variety of industrial equipment" />
        </div>
  
        <div className="sbs-content">
          <h2>What&nbsp;Equipment&nbsp;We&nbsp;Buy</h2>
  
          {/* ★ modern, bullet-free list */}
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
  

  function WhoWeBuyFrom() {
    return (
      <section className="side-by-side-section">
        <div className="sbs-content">
          <h2>Who We Buy From</h2>
          <p>
            We serve utility companies, OEMs, contractors, and facility managers nationwide, large or small. S&D gives you a fast, fair offer and handles every step, from quote to pickup, for transformers, PVF, and switchgear.
          </p>
        </div>
        <div className="sbs-image">
          <img src={clientsImg} alt="Happy industrial clients" />
        </div>
      </section>
    );
  }