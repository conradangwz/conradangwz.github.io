/* =====================================================
   TEXT ANIMATIONS
   - Hero name:      char-by-char scramble reveal
   - Hero tagline:   typewriter cursor effect
   - Section titles: scramble reveal on scroll
===================================================== */

(function () {
  'use strict';

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  const rand  = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  /* ── Scramble a span to its target character ── */
  function scrambleTo(span, target, delay = 0, duration = 300, tick = 40) {
    setTimeout(() => {
      let elapsed = 0;
      const t = setInterval(() => {
        elapsed += tick;
        span.textContent = elapsed >= duration ? (clearInterval(t), target) : rand();
      }, tick);
    }, delay);
  }

  /* ── Split a heading's child nodes into .char spans ──
     Handles: plain text nodes, <span class="accent">, <br>
     Returns the container (mutated in place).              */
  function splitToChars(el, charClass, accentClass) {
    el.setAttribute('aria-label', el.textContent.trim());

    const nodes = [...el.childNodes];
    el.innerHTML = '';

    nodes.forEach(node => {
      if (node.nodeName === 'BR') {
        el.appendChild(document.createElement('br'));
        return;
      }

      const isAccent = node.nodeType === Node.ELEMENT_NODE
        && node.classList.contains('accent');

      [...node.textContent].forEach(ch => {
        const span = document.createElement('span');
        if (ch === ' ') {
          span.className = `${charClass} ${charClass}--space`;
          span.innerHTML = '&nbsp;';
        } else {
          span.className      = charClass + (isAccent ? ` ${accentClass}` : '');
          span.dataset.target = ch;
          span.textContent    = ch;
        }
        el.appendChild(span);
      });
    });
  }

  /* ── Inject shared CSS once ── */
  function injectStyles() {
    if (document.getElementById('ta-styles')) return;
    const s = document.createElement('style');
    s.id = 'ta-styles';
    s.textContent = `
      .ta-char            { display: inline-block; will-change: opacity, transform; }
      .ta-char--accent    { color: var(--color-accent); }
      .ta-char--space     { display: inline; }

      .st-char            { display: inline-block; opacity: 0; transform: translateY(0.3em);
                            transition: opacity .18s ease, transform .38s cubic-bezier(.22,1,.36,1);
                            will-change: opacity, transform; }
      .st-char.visible    { opacity: 1; transform: translateY(0); }
      .st-char--accent    { color: var(--color-accent); }
      .st-char--space     { display: inline; opacity: 1; transform: none; }

      @keyframes ta-blink { 0%,100%{opacity:1} 50%{opacity:0} }
      .ta-cursor          { color: var(--color-accent); font-style: normal;
                            animation: ta-blink .85s step-end infinite; margin-left: 1px; }
    `;
    document.head.appendChild(s);
  }

  /* ─────────────────────────────────────────
     1. HERO NAME — char split + scramble
     ───────────────────────────────────────── */
  function initHeroName() {
    const el = document.querySelector('.hero-name');
    if (!el) return;

    el.style.cssText += 'animation:none;opacity:1';
    splitToChars(el, 'ta-char', 'ta-char--accent');

    el.querySelectorAll('.ta-char:not(.ta-char--space)').forEach((span, i) => {
      Object.assign(span.style, { opacity: '0', transform: 'translateY(0.4em)', transition: 'none' });

      setTimeout(() => {
        span.style.transition = 'opacity .15s ease, transform .35s cubic-bezier(.22,1,.36,1)';
        span.style.opacity    = '1';
        span.style.transform  = 'translateY(0)';
        scrambleTo(span, span.dataset.target, 0, 280, 38);
      }, 350 + i * 55);
    });
  }

  /* ─────────────────────────────────────────
     2. HERO TAGLINE — typewriter
     ───────────────────────────────────────── */
  function initHeroTagline() {
    const el = document.querySelector('.hero-tagline');
    if (!el) return;

    el.style.cssText += 'animation:none;opacity:1';
    const text = el.textContent.trim();
    el.textContent = '';

    const cursor = Object.assign(document.createElement('span'), {
      className: 'ta-cursor', textContent: '|'
    });
    el.appendChild(cursor);

    let i = 0;
    setTimeout(() => {
      const t = setInterval(() => {
        if (i < text.length) {
          el.insertBefore(document.createTextNode(text[i++]), cursor);
        } else {
          clearInterval(t);
          setTimeout(() => {
            cursor.style.cssText = 'animation:none;opacity:0;transition:opacity .4s ease';
          }, 2500);
        }
      }, 38);
    }, 950);
  }

  /* ─────────────────────────────────────────
     3. SECTION TITLES — scramble on scroll
     ───────────────────────────────────────── */
  function initSectionTitles() {
    const titles = document.querySelectorAll('.section-title');
    if (!titles.length) return;

    titles.forEach(title => {
      splitToChars(title, 'st-char', 'st-char--accent');
      title._animated = false;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting || target._animated) return;
        target._animated = true;
        observer.unobserve(target);

        target.querySelectorAll('.st-char:not(.st-char--space)').forEach((span, i) => {
          setTimeout(() => {
            span.classList.add('visible');
            scrambleTo(span, span.dataset.target, 0, 300, 40);
          }, i * 38);
        });
      });
    }, { threshold: 0.25 });

    titles.forEach(t => observer.observe(t));
  }

  /* ── Init ── */
  function init() {
    injectStyles();
    initHeroName();
    initHeroTagline();
    initSectionTitles();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();