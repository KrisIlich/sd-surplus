// src/utils/SmoothScroll.js
//---------------------------------------------------------------
//  SmoothScroll – one-stop GSAP / ScrollTrigger (and Lenis) helper
//---------------------------------------------------------------
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

export default class SmoothScroll {
  /**
   * @param {Object} lenisOpts – options forwarded to new Lenis(opts)
   *                            pass `{ smooth: false }` if you don’t want Lenis!
   */
  constructor(lenisOpts = {}) {
    /** @private */
    this._lenis = new Lenis({ smooth: true, ...lenisOpts });

    // Drive Lenis & update ScrollTrigger on every RAF tick ------------
    const raf = (time) => {
      this._lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Keep ScrollTrigger fresh on Lenis “scroll” events
    this._lenis.on('scroll', ScrollTrigger.update);

    // Refresh ScrollTrigger on resize / load --------------------------
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);
    window.addEventListener('load',   refresh);

    // Clean-up hook (expose as instance method)
    this._cleanup = () => {
      this._lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener('resize', refresh);
      window.removeEventListener('load',   refresh);
    };
  }

  // ------------------------------------------------------------------
  //  Helpers that wrap patterns used in HomePage.js
  // ------------------------------------------------------------------

  /**
   * Scale an element’s Y-axis while it scrolls past.
   *
   * @param {HTMLElement} elem     – element to animate
   * @param {HTMLElement} trigger  – scrollTrigger trigger element
   * @param {Object}      opts     – { start, end, scrub, scaleY }
   */
  addScaleYOnScroll(elem, trigger, opts = {}) {
    const {
      start  = 'top bottom',
      end    = 'bottom top',
      scrub  = true,
      scaleY = 1.2,
    } = opts;

    gsap.to(elem, {
      scaleY,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub },
    });
  }

  /**
   * Create the exact timeline pattern you used in HomePage.js:
   * an array of { ref, from, to, position } objects animated
   * against a single ScrollTrigger.
   *
   * @param {HTMLElement} trigger – timeline trigger element
   * @param {Array<Object>} steps – [{ ref, from, to, position }]
   * @param {Object} opts        – { start, end, scrub }
   * @returns {gsap.core.Timeline}
   */
  addTimeline(trigger, steps, opts = {}) {
    const { start = 'top bottom', end = 'bottom top', scrub = true } = opts;

    const tl = gsap.timeline({
      scrollTrigger: { trigger, start, end, scrub },
    });

    steps.forEach(({ ref, from, to, position = 0 }) =>
      tl.fromTo(ref.current || ref, from, to, position)
    );

    return tl;
  }

  /** Call inside `useEffect` return-function to tidy up */
  destroy() {
    this._cleanup();
  }
}
