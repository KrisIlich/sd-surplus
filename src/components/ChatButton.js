// src/components/ChatButton.js
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import chatIcon from '../assets/icons/chat.svg';
import '../styles/ChatButton.css';

export default function ChatButton() {
  /* 1️⃣ give each button its own ref */
  const desktopBtnRef = useRef(null);
  const mobileBtnRef  = useRef(null);

  /* 2️⃣ animate whichever one is currently visible */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const el = mq.matches ? mobileBtnRef.current : desktopBtnRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { x: 100, opacity: 0, filter: 'blur(10px)' },
      { x: 0,   opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
    );

    /* optional – re‑run animation if the user resizes */
    const handler = (e) => {
      const target = e.matches ? mobileBtnRef.current : desktopBtnRef.current;
      gsap.fromTo(
        target,
        { x: 100, opacity: 0, filter: 'blur(10px)' },
        { x: 0,   opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
      );
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleClick = () => {
    console.log('toggle chat…');
  };

  return (
    <>
      {/* desktop / tablet */}
      <button
        ref={desktopBtnRef}
        className="chat-button"
        onClick={handleClick}
        aria-label="Chat with us"
      >
        <span className="chat-label">Chat with us</span>
        <img src={chatIcon} alt="" className="chat-icon" />
      </button>

      {/* ≤ 700 px */}
      <button
        ref={mobileBtnRef}
        className="chat-button-mobile"
        onClick={handleClick}
        aria-label="Chat with us"
      >
        <img src={chatIcon} alt="" className="chat-icon" />
      </button>
    </>
  );
}
