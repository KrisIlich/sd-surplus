import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import '../styles/EducationalSection.css';

import imgRoi         from '../assets/ed-roi.png';
import imgMaintenance from '../assets/ed-maintenance.png';
import imgPVFGuide    from '../assets/ed-pvf.png';

export default function EducationalSection() {
  const sectionRef = useRef(null);

  const posts = [
    {
      title: 'How to Maximize ROI with Surplus Industrial Equipment',
      desc:  'Strategies to get the best return on your surplus transformers, switchgear, and more.',
      img:   imgRoi,
      link:  '/blog/maximize-roi-surplus-equipment'
    },
    {
      title: 'Top 5 Maintenance Tips for Electrical Transformers',
      desc:  'Keep your transformers running safely and efficiently with these expert maintenance steps.',
      img:   imgMaintenance,
      link:  '/blog/transformer-maintenance-tips'
    },
    {
      title: 'Ultimate Guide to PVF Selection & Installation',
      desc:  'Everything you need to know about choosing, sizing, and installing industrial pipes, valves & fittings.',
      img:   imgPVFGuide,
      link:  '/blog/pvf-selection-installation'
    }
  ];

  /* keep the card‑fade animation exactly as before */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.edu-card',
        { opacity: 0, filter: 'blur(20px)', scale: 0.5 },
        {
          opacity: 1, filter: 'blur(0)', scale: 1,
          duration: 0.3, stagger: 0.03,
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 55%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="edu-section" ref={sectionRef}>
      <h1 className="edu-heading">Discover, Learn & Thrive with S&amp;D</h1>

      {/* ▼‑‑‑ now flex, not grid ‑‑‑▼ */}
      <div className="edu-card-row">
        {posts.map(({ img, title, desc, link }, idx) => (
          <Link key={idx} to={link} className="edu-card">
            <img src={img} alt={title} />
            <div className="edu-card-body">
              <span className="edu-tag">Article</span>
              <h3 className="edu-title">{title}</h3>
              <p  className="edu-desc">{desc}</p>
              <span className="learn-more">Read article →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
