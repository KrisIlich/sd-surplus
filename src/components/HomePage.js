//boilerplate homepage
import React from'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import '../styles/HomePage.css';
import bannerImg from '../assets/bannerImg.jpg';



function HomePage() {
  return (
    <>
    <div id="homepage-container">
        <div id="nav-container">

        </div>
        <div id="home-content-container">
           <HomeBanner />
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
            <img 
            src={bannerImg}
            alt="banner"
            id="home-banner-background" 
            />
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