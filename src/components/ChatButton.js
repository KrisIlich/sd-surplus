// src/components/ChatButton.js
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import chatIcon from '../assets/icons/chat.svg';
import '../styles/ChatButton.css';

export default function ChatButton() {
  const btnRef = useRef(null);

  useEffect(() => {
    const el = btnRef.current;
    gsap.fromTo(
      el,
      {
        x: 100,
        opacity: 0,
        filter: 'blur(10px)',
      },
      {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
      }
    );
  }, []);

  const handleClick = () => {
    console.log('toggle chat…');
    // TODO : wire up real chat open/close here
  };

  return (
    <button
      ref={btnRef}
      className="chat-button"
      onClick={handleClick}
      aria-label="Chat with us"
    >
      Chat with us
      <img src={chatIcon} alt="" className="chat-icon" />
    </button>
  );
}
