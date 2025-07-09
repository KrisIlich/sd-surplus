import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/EducationalSection.css';
import imgRoi      from '../assets/ed-roi.png';
import imgMaintenance from '../assets/ed-maintenance.png';
import imgPVFGuide from '../assets/ed-pvf.png';

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
      desc:  'Everything you need to know about choosing, sizing, and installing industrial pipes, valves and fittings.',
      img:   imgPVFGuide,
      link:  '/blog/pvf-selection-installation'
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.edu-card');

      gsap.fromTo(cards,
        {
          opacity: 0,
          filter:  'blur(20px)',
          scale:   0.5
        },
        {
          opacity:    1,
          filter:     'blur(0px)',
          scale:      1,
          duration:   0.3,
          ease:       'none',
          stagger:    0.03,
          scrollTrigger: {
            trigger:      sectionRef.current,
            start:        'top 55%',
            toggleActions:'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="edu-section" ref={sectionRef}>
      <h1 className="edu-heading">
        Discover, Learn & Thrive with S&amp;D
      </h1>

      <div className="edu-card-grid">
        {posts.map((post, idx) => (
          <article className="edu-card" key={idx}>
            <img
              src={post.img}
              alt={post.title}
              className="edu-card-image"
            />
            <div className="edu-card-body">
              <span className="edu-card-type">Article</span>
              <h2 className="edu-card-title">{post.title}</h2>
              <p className="edu-card-desc">{post.desc}</p>
              <a href={post.link} className="edu-learn-more">
                Read article &rarr;
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
