import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import '../styles/HomePage.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from 'scrollreveal';
import LogoCarousel from './LogoCarousel';
import ProductCards from './ProductCards';

//images
import bannerVideo from '../assets/bannerVideo.mp4';
import workerImg from '../assets/worker.png'
import transformerImg from '../assets/transformer.png'
import imageOne from '../assets/image-one.png'
import imageTwo from '../assets/image-two.png'
import imageThree from '../assets/image-three.png'
import EducationalSection from './EducationalSection.js';
import Footer from './Footer.js';
import { useNavigate } from 'react-router-dom';


gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  return (
    <>
    <div id="homepage-container">
        <div id="nav-container">

        </div>
        <div id="home-content-container">
           <HomeBanner />
           <MissionStatement/>
           <LargeContent />
           <Footer />
        </div>
    </div>
    </>
  );
}

export default HomePage;

//----------------------------------------------------------------
// HTML Components for Homepage 
// ---------------------------------------------------------------

function HomeBanner() {

  const navigate = useNavigate();

  const handleQuoteClick = () => {
    const selected = document.getElementById('equipment-select').value;
    switch (selected) {
      case 'other':
        navigate('/sell-surplus')
        break; 

        case 'transformers':   // TRANSFORMERS
        navigate('/sell-transformers')
        break;

        case 'pvf':            // PIPES, VALVES, FITTINGS
        navigate('/sell-PVF')
        break;

      case 'electrical':     // ELECTRICAL
        navigate('/sell-electrical')
        break;

      default:
        console.warn('Unknown selection:', selected);
        } 
  }
  
  
    return (
        <div id="home-banner-container">
              <video 
              id="home-banner-video"
              autoPlay      
              loop          
              muted         
              playsInline   
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            >
              <source src={bannerVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div id="home-banner-overlay"></div>
            <div id="home-banner-text">
                <h1>
                    WE BUY <span>TRANSFORMERS</span><br/> PVF & ELECTRICAL EQUIPMENT
                    </h1>
            </div>
              <div id="home-form-container">
                <div id="home-form-text">
                  <h1>Find out how much your equipment is worth</h1>
                  <p>We are the largest buyer in the US and offer the best rates for your equipment</p>
                </div>

                <div id="home-form">
                  <div id="equipment-form-box">
                    <h4 id="sell-label">SELL</h4>

                    <div className="dropdown-wrapper">
                      <select
                        id="equipment-select"
                        name="equipmentType"
                        defaultValue="transformers"
                      >
                        <option value="transformers">TRANSFORMERS</option>
                        <option value="pvf">PVF</option>
                        <option value="electrical">ELECTRICAL</option>
                        <option value="other">OTHER EQUIPMENT</option>
                      </select>
                    </div>

                    <button
                      id="quote-button"
                      onClick={handleQuoteClick}
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
}

function MissionStatement() {
  const bgRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
  // clean up any old triggers
  ScrollTrigger.getAll().forEach(t => t.kill());

  ScrollTrigger.matchMedia({
    // ───── MOBILE ONLY (≤ 1000px) ─────
    "(max-width: 1000px)": () => {
      gsap.to("#mission-statement-container", {
        scrollTrigger: {
          trigger: "#mission-statement-container",
          start: "top 65%",      // when top of card hits 65% down the viewport
          end:   "bottom top",   // until its bottom hits the very top
          scrub: true,           // tie to scroll
        },
        y:   -60,                // drift up by 50px
        transformOrigin: "center bottom",
        ease: "none",
      });
    },

    // ───── DESKTOP (ignored) ─────
    "(min-width: 1001px)": () => {
      // no mobile scroll effect on full‑screen
    }
  });

  // cleanup on unmount
  return () => ScrollTrigger.getAll().forEach(t => t.kill());
}, []);

/*
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        scaleY: 1.4 ,                     
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger:      wrapperRef.current,
          start:        'top bottom',
          end:          'bottom top',
          scrub:        true,
          // markers:    true
        }
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

    */

  return (
    <div
      id="mission-statement-container"
      ref={wrapperRef}
    >
      <div
        className="mission-bg"
        ref={bgRef}
      />
      <div id="mission-text">
        <h1>
          Maximizing <span>Value</span> For Your Industrial Equipment
        </h1>
        <p>
        We specialize in buying and reprocessing industrial machinery like transformers, switchgear, and breakers. With years of expertise, we ensure fair, transparent deals and the best
          value for your surplus equipment. Our focus on reliability and sustainable practices makes us the trusted choice for managing your equipment needs efficiently
          while maximizing your return.
        </p>
      </div>
    </div>
  )
}


function LargeContent() {
  const containerRef = useRef(null);
  const leftRef      = useRef(null);
  const rightRef     = useRef(null);
  const ctaRef       = useRef(null);
  const floatingRef = useRef(null);
  const trioRef      = useRef(null)
  const oneRef       = useRef(null)
  const twoRef       = useRef(null)
  const threeRef     = useRef(null)


  useEffect(() => {
    const el = floatingRef.current;

    gsap.fromTo(el,
      {
        scale: 0.75,
        transformOrigin: 'center center'
      },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=55',
          end:   'top center',
          scrub: true,
        }
      }
    )
  

    // cleanup
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  useEffect(() => {
    const sr = ScrollReveal({ reset: true })

    // 1) Heading: slide *down* from above
    sr.reveal('.text-cta-container h1', {
      origin:   'top',
      distance: '50px',
      duration: 600,
      opacity:  0,
      easing:   'ease-in-out',
    })

    // 2) Paragraph: slide *up* from below, with a little delay
    sr.reveal('.text-cta-container p', {
      origin:   'bottom',
      distance: '50px',
      duration: 600,
      opacity:  0,
      delay:    200,
      easing:   'ease-in-out',
    })

    // 3) Buttons container: slide *up* a bit later
    sr.reveal('.text-cta-container .cta-button-div', {
      origin:   'bottom',
      distance: '30px',
      duration: 600,
      opacity:  0,
      delay:    400,
      easing:   'ease-in-out',
    })

    // If you have subsequent CTA blocks (e.g. in your floating-container)
    // just re‑use the same selectors — ScrollReveal will pick them all up.

    return () => sr.destroy()
  }, [])


  useScrollPan({
    triggerRef: containerRef,
    animations: [
      {
        ref: leftRef,
        from: { y:  50 },      // start 200px below its resting spot
        to:   { y: -250, ease: 'none' }  // end 200px above
      },
      {
        ref: leftRef, // note both tweens can share the same timeline position
        from: { y: 50 },
        to:   { y: -250, ease: 'none' },
        position: 0
      },
      {
        ref: rightRef,
        from: { y: 0 },     
        to:   { y:  -100, ease: 'none' },
        position: 0
      }
    ]
  });

  useScrollPan({
    triggerRef: trioRef,
    animations: [
      { ref: oneRef,   from:{ y:  50 }, to:{ y:-200, ease:'none' } },
      { ref: twoRef,   from:{ y:  250 }, to:{ y:-200, ease:'none' }, position:0 },
      { ref: threeRef, from:{ y:  200 }, to:{ y: -100, ease:'none' }, position:0 },
    ]
  })
 
  return (
    <div className="large-content-container">

      <div className="images-div" ref={containerRef}>
        <div className="images-row">
          <img
            ref={leftRef}
            id="left-image"
            src={transformerImg}
            alt="Transformer"
          />
          <img
            ref={rightRef}
            id="right-image"
            src={workerImg}
            alt="Worker"
          />
        </div>
      </div> 

      <div class="text-cta-container" ref={ctaRef}>
        <div class="cta-text">
          <h1>Instant, Actionable Quotes</h1>
          <p>Request a fast, accurate quote from S&D for your industrial transformer, PVF & Electrical Equipment—get reliable pricing, expert support, and keep your project powered and on schedule.</p>
        </div>
        <div className="cta-button-div">
          <button className="cta-button">
            Get started free
          </button>
          <button className="cta-button secondary">
            Learn more
          </button>
        </div>
      </div>

      <div id="floating-container"
      ref={floatingRef}
      style={{ transformOrigin: 'center center' }}
      >

        <div className="trio-div" ref={trioRef}>
          <div className="trio-images-row">
            <img ref={oneRef}   id="image-one"   src={imageOne}   alt="One" />
            <img ref={twoRef}   id="image-two"   src={imageTwo}   alt="Two" />
            <img ref={threeRef} id="image-three" src={imageThree} alt="Three" />
          </div>
        </div>


        <div className="text-cta-container">
          <div className="cta-text">
            <h1>Sell with Confidence</h1>
            <p>Customers value our service and trust us for our professionalism, delivering fast, accurate quotes and expert support for electrical transformers, PVF, and electrical equipment, all while keeping projects powered and on schedule.</p>
          </div>
          <div className="cta-button-div">
            <button className="cta-button">Get started free</button>
            <button className="cta-button secondary">Learn more</button>
          </div>
        </div>

          <ReviewCarousel />
          <div className="logo-text">
            A vast dealer network ready to move your surplus equipment, trusted by the biggest companies in the world.
          </div>
          <LogoCarousel />
      </div>
        <ProductCards />
        <EducationalSection />
    </div>
  );
} 


function ReviewCarousel() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const slider = wrapperRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    function handleMouseDown(e) {
      isDown = true;
      slider.classList.add('active');  // optional, for styling
      // e.pageX is the mouse x position; offsetLeft is the distance of the element from the left of the page
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    }
    function handleMouseLeave() {
      isDown = false;
      slider.classList.remove('active');
    }
    function handleMouseUp() {
      isDown = false;
      slider.classList.remove('active');
    }
    function handleMouseMove(e) {
      if (!isDown) return; // stop if mouse isn't down
      e.preventDefault();  // prevent text highlight
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;  // multiplier for speed
      slider.scrollLeft = scrollLeft - walk;
    }

    // Attach events
    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    // Cleanup on unmount
    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div id="review-carosuel">
      <div className="review-wrapper" ref={wrapperRef}>
        {/* Card 1 */}
        <div className="review-card">
              
              <div className="review-content">
                <h5 className="review-title">Testimonial</h5>
                <h3 className="review-quote">"I was impressed by how smooth the entire process was."</h3>
                <p>
                  Another placeholder text about how S&D made it easy to sell equipment.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="review-card">
              
              <div className="review-content">
                <h5 className="review-title">Testimonial</h5>
                <h3 className="review-quote">"Seamless and easy every step of the way."</h3>
                <p>
                  Another placeholder text about how S&D made it easy to sell equipment.
                </p>
              </div>
            </div>

            {/* ...similarly for cards 3, 4, 5... */}
            <div className="review-card">
              
              <div className="review-content">
                <h5 className="review-title">Testimonial</h5>
                <h3 className="review-quote">"Seamless and easy every step of the way."</h3>
                <p>
                  Another placeholder text about how S&D made it easy to sell equipment.
                </p>
              </div>
            </div>

            <div className="review-card">
              
              <div className="review-content">
                <h5 className="review-title">Testimonial</h5>
                <h3 className="review-quote">"Seamless and easy every step of the way."</h3>
                <p>
                  Another placeholder text about how S&D made it easy to sell equipment.
                </p>
              </div>
            </div>
            <div className="review-card">
            
              <div className="review-content">
                <h5 className="review-title">Testimonial</h5>
                <h3 className="review-quote">"Seamless and easy every step of the way."</h3>
                <p>
                  Another placeholder text about how S&D made it easy to sell equipment.
                </p>
              </div>
            </div>

      </div>
    </div>
  );
}



//----------------------------------------------------------------
// Animations for Homepage 
// ---------------------------------------------------------------



/**
 * Hook to animate one or more refs in a scrubbed scroll‑tied timeline.
 *
 * @param {Object}   config
 * @param {React.Ref} config.triggerRef   – the container you scroll through
 * @param {Array}     config.animations   – array of { ref, from, to, position? }
 * @param {string}    [config.start]      – scrollTrigger.start (default: "top bottom")
 * @param {string}    [config.end]        – scrollTrigger.end   (default: "bottom top")
 * @param {boolean}   [config.scrub=true] – tie animation to scroll
 */
export function useScrollPan({
  triggerRef,
  animations,
  start = 'top bottom',
  end   = 'bottom top',
  scrub = true,
}) {
  useEffect(() => {
    if (!triggerRef.current) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start,
          end,
          scrub,
          // markers: true, // <-- uncomment to debug
        },
      });

      animations.forEach(({ ref, from, to, position = 0 }) => {
        tl.fromTo(ref.current, from, to, position);
      });
    }, triggerRef);

    return () => ctx.revert();
  }, [triggerRef, animations, start, end, scrub]);
}



