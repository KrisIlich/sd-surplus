import React, { useState } from 'react';
import '../styles/LogoCarousel.css';

// your logo imports…
import ciscoLogo     from '../assets/logos/cisco.avif';
import dellLogo      from '../assets/logos/dell.avif';
import eatonLogo     from '../assets/logos/eaton.avif';
import emcorLogo     from '../assets/logos/emcor.avif';
import fujitsuLogo   from '../assets/logos/fujitsu.avif';
import googleLogo    from '../assets/logos/google.avif';
import microsoftLogo from '../assets/logos/microsoft.avif';
import necLogo       from '../assets/logos/nec.avif';
import questLogo     from '../assets/logos/quest.avif';
import schneiderLogo from '../assets/logos/schneider.avif';
import siemensLogo   from '../assets/logos/siemens.avif';
import trippliteLogo from '../assets/logos/tripplite.avif';

export default function LogoCarousel() {
  const [playing, setPlaying] = useState(true);
  const logos = [
    ciscoLogo, dellLogo, eatonLogo, emcorLogo,
    fujitsuLogo, googleLogo, microsoftLogo, necLogo,
    questLogo, schneiderLogo, siemensLogo, trippliteLogo
  ];

  return (

    <div className={`logos ${playing ? '' : 'paused'}`}>
      {/* two passes for seamless loop */}
      <div className="logos-slide">
        {logos.map((src,i) => (
          <img src={src} key={`A${i}`} className="logo-item" alt="" />
        ))}
      </div>
      <div className="logos-slide">
        {logos.map((src,i) => (
          <img src={src} key={`B${i}`} className="logo-item" alt="" />
        ))}
      </div>

      {/* play / pause control */}
      <button
        className="carousel-control"
        onClick={() => setPlaying(p => !p)}
        aria-label={playing ? "Pause carousel" : "Play carousel"}
      >
        {playing ? (
          // Pause icon (two bars)
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect x="4" y="3" width="4" height="14" rx="1" fill="#474747" />
            <rect x="12" y="3" width="4" height="14" rx="1" fill="#474747" />
          </svg>
        ) : (
          // Play icon (triangle)
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon points="6,4 6,16 16,10" fill="#474747" />
          </svg>
        )}
      </button>
    </div>
  );
}
