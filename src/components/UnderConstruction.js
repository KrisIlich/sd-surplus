import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Guides.css';               // already hosts the shared fonts / vars
import '../styles/UnderConstruction.css';    // styles right below

export default function UnderConstruction() {
  return (
    <main className="uc-wrapper">
      {/* “tape” band */ }
      <div className="uc-band">
        <span>PAGE IN PROGRESS</span>
      </div>

      {/* hero icon */}
      <div className="uc-icon">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="58" fill="var(--blue-mid)" />
          <path d="M36 72h48v6H36zM46 54h28v6H46zM56 36h8v6h-8z"
                fill="#fff"/>
        </svg>
      </div>

      {/* headline + copy */}
      <h1 className="uc-headline">We’re Building Something New</h1>
      <p className="uc-lead">
        This section is under construction and will be live soon.  
        Come back shortly—or leave us your info below and we’ll send a ping
        when it drops.
      </p>

      {/* call-to-action buttons */}
      <div className="uc-actions">
        <a
          className="cta-btn"
          href="mailto:info@industrialsurplus.com?subject=Notify%20me%20when%20the%20page%20is%20live">
          Notify Me
        </a>
        <Link className="text-link" to="/">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}