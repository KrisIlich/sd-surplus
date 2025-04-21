
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import '../styles/HomePage.css';
import bannerVideo from '../assets/bannerVideo.mp4';
import workerImg from '../assets/worker.png'
import transformerImg from '../assets/transformer.png'
import imageOne from '../assets/image-one.png'
import imageTwo from '../assets/image-two.png'
import imageThree from '../assets/image-three.png'




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
  
    return (
        <div id="home-banner-container">
              <video 
              id="home-banner-video"
              autoPlay      // start automatically
              loop          // repeat endlessly
              muted         // no audio
              playsInline   // allows playback on mobile without full screen
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            >
              <source src={bannerVideo} type="video/mp4" />
              {/* fallback text if video can't play */}
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
                <h1>Find Out How Much Your Equipment Is Worth</h1>
                <p>We are the largest buyer in the US and offer the best rates for your equipment</p>
              </div>

              <div id="home-form">
                {/* White border container for SELL text, dropdown, and GET QUOTE */}
                <div id="equipment-form-box">
                  {/* SELL is now static text (e.g. <h4>) */}
                  <h4 id="sell-label">SELL</h4>

                  {/* Transparent dropdown */}
                  <div className="dropdown-wrapper">
                    <select
                      id="equipment-select"
                      name="equipmentType"
                      defaultValue="transformers"
                    >
                      <option value="transformers">TRANSFORMERS</option>
                      <option value="pvf">PIPES, VALVES, FITTINGS</option>
                      <option value="electrical">ELECTRICAL</option>
                      <option value="other">OTHER EQUIPMENT</option>
                    </select>
                  </div>

                  {/* GET QUOTE button */}
                  <button
                    id="quote-button"
                    onClick={(e) => {
                      // placeholder: handle navigation / form submission
                      console.log('Form submitted for type...');
                    }}
                  >
                    GET QUOTE
                  </button>
                </div>
              </div>
            </div>
            </div>
            );
}

function MissionStatement() {
  return(
      <div id="mission-statement-container">
        <div id="mission-text">
          <h1>
            Maximizing Value For Your Industrial Equipment
          </h1>
          <p>
            We specialize in buying and reprocessing industrial machinery like transformers, switchgear, and breakers. With years of expertise, we ensure fair, transparent deals and the best
            value for your surplus equipment. Our focus on reliability and sustainable practices makes us the trusted choice for managing your equipment needs efficiently
            while maximizing your return.
          </p>
          </div>
      </div>
  );
}

function LargeContent() {
  return(
    <div className="large-content-container">

      <div className="images-div">
        <div className="images-row">
          <img id="left-image" src={transformerImg} alt="electrical worker" />
          <img id="right-image" src={workerImg} alt="transformer glowing" />
        </div>
      </div> 

      <div class="text-cta-container">
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

      <div id="floating-container">

        <div className="trio-div">
          <div className="trio-images-row">
            <img id="image-one" src={imageOne} alt="electrical worker" />
            <img id="image-two" src={imageTwo} alt="transformer glowing" />
            <img id="image-three" src={imageThree} alt="transformer glowing" />
          </div>
        </div>

        <div className="text-cta-container">
          <div className="cta-text">
            <h1>Sell Equipment with Confidence</h1>
            <p>Customers value our service and trust us for our professionalism, delivering fast, accurate quotes and expert support for electrical transformers, PVF, and electrical equipment, all while keeping projects powered and on schedule.</p>
          </div>
          <div className="cta-button-div">
            <button className="cta-button">Get started free</button>
            <button className="cta-button secondary">Learn more</button>
          </div>
        </div>

          <ReviewCarousel />

        <div id="logo-carousel"></div>
      </div>

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
              <img
                className="review-image"
                src="../assets/smiling-guy-one.jpg"
                alt="Placeholder for reviewer"
              />
              <div className="review-content">
                <h5 className="review-title">Testimonial</h5>
                <h3 className="review-quote">"I was impressed by how smooth the entire process was."</h3>
                <p>
                  Customer John Doe reveals how his team used S&D Industrial Surplus to
                  offload their equipment seamlessly.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="review-card">
              <img
                className="review-image"
                src="https://via.placeholder.com/250x250"
                alt="Placeholder for reviewer"
              />
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
              <img
                className="review-image"
                src="https://via.placeholder.com/250x250"
                alt="Placeholder for reviewer"
              />
              <div className="review-content">
                <h5 className="review-title">Testimonial</h5>
                <h3 className="review-quote">"Seamless and easy every step of the way."</h3>
                <p>
                  Another placeholder text about how S&D made it easy to sell equipment.
                </p>
              </div>
            </div>

            <div className="review-card">
              <img
                className="review-image"
                src="https://via.placeholder.com/250x250"
                alt="Placeholder for reviewer"
              />
              <div className="review-content">
                <h5 className="review-title">Testimonial</h5>
                <h3 className="review-quote">"Seamless and easy every step of the way."</h3>
                <p>
                  Another placeholder text about how S&D made it easy to sell equipment.
                </p>
              </div>
            </div>
            <div className="review-card">
              <img
                className="review-image"
                src="https://via.placeholder.com/250x250"
                alt="Placeholder for reviewer"
              />
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
