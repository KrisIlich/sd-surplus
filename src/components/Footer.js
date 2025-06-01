import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import facebookLogo from '../assets/icons/facebook.png';
import twitterLogo  from '../assets/icons/twitter.png';
import youtubeLogo  from '../assets/icons/youtube.png';
import { ReactComponent as ChevronRight } from '../assets/icons/chevron-right.svg';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top Links */}
        <div className="footer-top">
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><Link to="/products/transformers">Transformers</Link></li>
              <li><Link to="/products/pvf">Pipes, Valves, Fittings</Link></li>
              <li><Link to="/products/electrical">Electrical Equipment</Link></li>
              <li><Link to="/products/related">Related Equipment</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/resources/guides">Guides & Specs</Link></li>
              <li><Link to="/resources/basics">Transformer Basics</Link></li>
              <li><Link to="/resources/safety">Safety & Compliance</Link></li>
              <li><Link to="/resources/case-studies">Success Stories</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Who We Are</h4>
            <ul>
              <li><Link to="/about/mission">Company Mission</Link></li>
              <li><Link to="/about/sd">About S&D</Link></li>
              <li><Link to="/about/team">Meet Our Team</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          {/* add more columns as needed */}
        </div>

        {/* Divider */}
        <hr className="footer-divider" />

        {/* Social + Language */}
        <div className="footer-social-row">
          <a href="https://twitter.com" className="social-link">
            <img src={twitterLogo} className="social-icon" alt="Twitter" />
          </a>
          <a href="https://facebook.com" className="social-link">
            <img src={facebookLogo} className="social-icon" alt="Facebook" />
          </a>
          <a href="https://youtube.com" className="social-link">
            <img src={youtubeLogo} className="social-icon" alt="YouTube" />
          </a>

          <div className="language-selector">
            English (United States)
            <ChevronRight />
          </div>
        </div>
        <div className="address">
            <span className="address-company">S&D Industrial Surplus</span><br/>
            7311 Galveston rd<br/>
            Houston, TX 77034

        </div>
      </div>
    </footer>
  );
}
