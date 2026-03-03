/* =====================================================
   SCROLL ANIMATIONS
   - All elements fade + slide up into view via
     IntersectionObserver as the user scrolls down
===================================================== */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════
     FADE-IN ELEMENTS
     Every meaningful element across every section
     starts hidden and gracefully fades up into place.
  ══════════════════════════════════════════════════ */

  const SELECTORS = [
    // Hero
    '#hero .hero-label',
    '#hero .hero-name',
    '#hero .hero-tagline',
    '#hero .hero-pills',
    '#hero .hero-cta',
    // About
    '#about .section-header',
    '#about .about-intro',
    '#about .about-body p',
    // Experience
    '#experience .section-header',
    '#experience .timeline-item',
    // Projects
    '#projects .section-header',
    '#projects .project-card',
    // Resume
    '#resume .section-header',
    '#resume .resume-card',
    // Contact
    '#contact .section-header',
    '#contact .contact-info',
    '#contact .contact-form-card',
  ];

  const els = document.querySelectorAll(SELECTORS.join(', '));

  els.forEach((el) => {
    // Skip hero children — they already have CSS keyframe animations on load
    if (el.closest('#hero')) return;

    el.dataset.fadeReady = 'true';
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = [
      'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
      'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
    ].join(', ');

    // Stagger siblings of the same kind within their parent
    const siblings = el.parentElement
      ? [...el.parentElement.children].filter(c => c.dataset?.fadeReady === 'true')
      : [];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 0.09}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => {
    if (!el.closest('#hero')) observer.observe(el);
  });


  /* ══════════════════════════════════════════════════
     NAV: compact on scroll + active link highlight
  ══════════════════════════════════════════════════ */

  const nav      = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('nav-active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

})();