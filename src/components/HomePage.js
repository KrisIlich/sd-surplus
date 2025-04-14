//boilerplate homepage
import React from'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import '../styles/HomePage.css';
import bannerVideo from '../assets/bannerVideo.mp4';



function HomePage() {
  return (
    <>
    <div id="homepage-container">
        <div id="nav-container">

        </div>
        <div id="home-content-container">
           <HomeBanner />
           <HomeForm />
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
                    WE BUY <span>TRANSFORMERS</span><br/>
                    PVF & ELECTRICAL<br/>
                    INDUSTRIAL EQUIPMENT
                    </h1>
            </div>
    </div>
    );
}

function HomeForm() {
  return (
    <div id="home-form-container">
      <div id="home-form-text">
        <h1>Find Out How Much Your Equipment Is Worth</h1>
        <p>We are the largest buyer in the US and offer the best rates for your equipment.</p>
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
  );
}


function LargeContent() {
  return(
    <div className="large-content-container">

      <div className="animated-container">
        <div id="left-image"></div>
        <div id="right-image"></div>
      </div>

      <div id="large-content-cta">
        <h1>Instant, Actionable Quotes</h1>
        <p>Request a fast, accurate quote from S&D for your electrical transformer, PVF & Electrical Equipment—get reliable pricing, expert support, and keep your project powered and on schedule.</p>
        <div className="cta-button-div">
          <button>Get started free</button>
          <button>Learn more</button>
        </div>
      </div>

      <div id="floating-container">

        <div id="image-trio"></div>

        <div id="floating-container-cta">
          <h1>Sell Equipment with Confidence</h1>
          <p>Customers value our service and trust us for our professionalism, delivering fast, accurate quotes and expert support for electrical transformers, PVF, and electrical equipment, all while keeping projects powered and on schedule.</p>
          <div className="cta-button-div">
            <button>Get started free</button>
            <button>Learn more</button>
          </div>
        </div>

        <div id="review-carosuel"></div>

        <div id="logo-carousel"></div>
      </div>

    </div>
  );
}