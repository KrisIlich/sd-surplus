import React, { useRef, useEffect } from 'react';
import '../styles/ProductCards.css';
import gsap from 'gsap';

// placeholder images – swap these out with your real assets
import padmountImg        from '../assets/cards/padmount.png';
import polemountImg       from '../assets/cards/polemount.png';
import substationImg      from '../assets/cards/substation.png';
import lowDryTypeImg      from '../assets/cards/low-dry-type.png';
import medDryTypeImg      from '../assets/cards/med-dry-type.png';
import castCoilImg        from '../assets/cards/cast-coil.png';
import pvfImg             from '../assets/cards/pvf.png';
import switchgearImg      from '../assets/cards/switchgear.png';

const ITEMS = [
  {
    title: '3-Phase Padmounted Transformer',
    img: padmountImg,
    desc: 'Highly efficient, outdoor-rated 3-phase padmount transformers for distribution networks.',
    link: '/products/padmount-transformer'
  },
  {
    title: 'Pole-Mounted Transformer',
    img: polemountImg,
    desc: 'Reliable pole-mounted transformers for overhead single- and three-phase lines.',
    link: '/products/polemount-transformer'
  },
  {
    title: 'Substation Transformer',
    img: substationImg,
    desc: 'Heavy-duty transformers designed for utility substations and large-scale distribution.',
    link: '/products/substation-transformer'
  },
  {
    title: 'Low Voltage Dry-Type Transformer',
    img: lowDryTypeImg,
    desc: 'Ventilated, low-voltage dry-type units ideal for indoor commercial or industrial use.',
    link: '/products/low-dry-type-transformer'
  },
  {
    title: 'Medium Voltage Dry-Type Transformer',
    img: medDryTypeImg,
    desc: 'Maintenance-free dry-type transformers rated for medium-voltage applications.',
    link: '/products/medium-dry-type-transformer'
  },
  {
    title: 'Cast Coil Transformer',
    img: castCoilImg,
    desc: 'Super-durable cast coil transformers built for harsh environments and high reliability.',
    link: '/products/cast-coil-transformer'
  },
  {
    title: 'Pipes, Valves & Fittings (PVF)',
    img: pvfImg,
    desc: 'Complete range of industrial pipes, valves and fittings for fluid handling systems.',
    link: '/products/pvf'
  },
  {
    title: 'Metal-Enclosed Switchgear',
    img: switchgearImg,
    desc: 'Compact, metal-enclosed switchgear assemblies for safe, efficient power distribution.',
    link: '/products/metal-enclosed-switchgear'
  },
];

export default function ProductCards() {

  const containerRef = useRef(null);

  useEffect(() => {
    // create a GSAP context tied to our section
    let ctx = gsap.context(() => {
      // animate all .product-card elements
      gsap.fromTo(
        '.product-card',
        {
          // from this “out-of-focus” state (matches our CSS)
          opacity: 0,
          filter:  'blur(20px)',
          scale:   1.1
        },
        {
          // to fully visible, sharp, and correctly scaled
          opacity: 1,
          filter:  'blur(0px)',
          scale:   1,
          duration: 0.8,
          ease:     'power2.out',
          // stagger so they come in one after the other
          stagger:  0.1,
          scrollTrigger: {
            trigger:      containerRef.current,
            start:        'top 45%',      // when top of card hits 80% down the viewport
            toggleActions:'play none none none',
          }
        }
      );
    }, containerRef);

    // cleanup on unmount
    return () => ctx.revert();
  }, []);


  return (
    <section className="page-card-container" ref={containerRef}>
      <h1 className="cards-heading">
        S&amp;D Industrial Surplus purchases across industries
      </h1>
      <div className="product-card-grid">
        {ITEMS.map(({ title, img, desc, link }) => (
          <div className="product-card" key={title}>
            <img src={img} alt={title} className="card-image" />
            <div className="card-body">
              <h2 className="card-title">{title}</h2>
              <p className="card-desc">{desc}</p>
              <a href={link} className="learn-more">
                Learn more&nbsp;→
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
