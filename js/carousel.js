(function () {
  const carousel = document.getElementById('projectsCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  const realCards = Array.from(carousel.querySelectorAll('.project-card'));
  const total = realCards.length;

  /* ─────────────────────────────────────────────────────────────
     Clone cards to create an infinite-loop illusion:
       [clone of last]  [real 0…n-1]  [clone of first]
     The scroll position lives inside the "real" band.
     When we detect we've landed on a clone, we silently
     teleport to its real counterpart.
  ───────────────────────────────────────────────────────────── */
  const cloneFirst = realCards[0].cloneNode(true);
  const cloneLast = realCards[total - 1].cloneNode(true);
  cloneFirst.setAttribute('aria-hidden', 'true');
  cloneLast.setAttribute('aria-hidden', 'true');

  carousel.insertBefore(cloneLast, realCards[0]); // slot 0
  carousel.appendChild(cloneFirst);               // slot total+1

  // After insertion: allCards[0] = cloneLast, allCards[1…total] = real, allCards[total+1] = cloneFirst
  const allCards = Array.from(carousel.querySelectorAll('.project-card'));

  let currentIndex = 0; // logical index into realCards (0-based)
  let isScrolling = false;

  /* ── Build dots (one per real card) ── */
  realCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dot.addEventListener('click', () => goToCard(i));
    dotsContainer.appendChild(dot);
  });

  function setActiveDot(n) {
    currentIndex = n;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === n);
    });
  }

  /* ── DOM card for a logical real index (offset +1 for the leading clone) ── */
  function domCard(realIdx) {
    return allCards[realIdx + 1];
  }

  /* ── Scroll to a real card index, centred in the track ── */
  function goToCard(n, instant) {
    n = ((n % total) + total) % total; // wrap

    isScrolling = true;
    setActiveDot(n);

    const card = domCard(n);
    const target = card.offsetLeft - (carousel.offsetWidth - card.offsetWidth) / 2;

    carousel.scrollTo({ left: Math.max(0, target), behavior: instant ? 'instant' : 'smooth' });

    clearTimeout(carousel._scrollTimer);
    carousel._scrollTimer = setTimeout(() => { isScrolling = false; }, 600);
  }

  /* ── After scrolling settles, silently jump if we're on a clone ── */
  function resolveClones() {
    const centre = carousel.scrollLeft + carousel.offsetWidth / 2;
    const cloneLastCard = allCards[0];
    const cloneFirstCard = allCards[total + 1];
    const threshold = cloneLastCard.offsetWidth * 0.6;

    const distLast = Math.abs((cloneLastCard.offsetLeft + cloneLastCard.offsetWidth / 2) - centre);
    const distFirst = Math.abs((cloneFirstCard.offsetLeft + cloneFirstCard.offsetWidth / 2) - centre);

    if (distLast < threshold) { goToCard(total - 1, true); return true; }
    if (distFirst < threshold) { goToCard(0, true); return true; }
    return false;
  }

  /* ── Nearest real card by centre distance ── */
  function getNearestRealIndex() {
    const centre = carousel.scrollLeft + carousel.offsetWidth / 2;
    let best = 0, bestDist = Infinity;
    realCards.forEach((_, i) => {
      const dist = Math.abs((domCard(i).offsetLeft + domCard(i).offsetWidth / 2) - centre);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  /* ── Prev / Next ── */
  prevBtn.addEventListener('click', () => goToCard(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToCard(currentIndex + 1));

  /* ── Click any real card to focus it ── */
  realCards.forEach((card, i) => card.addEventListener('click', () => goToCard(i)));

  /* ── Native scroll handler (touch / swipe / drag) ── */
  carousel.addEventListener('scroll', () => {
    if (isScrolling) return;
    clearTimeout(carousel._scrollTimer);
    carousel._scrollTimer = setTimeout(() => {
      if (!resolveClones()) {
        const nearest = getNearestRealIndex();
        if (nearest !== currentIndex) goToCard(nearest);
      }
    }, 120);
  }, { passive: true });

  /* ── Drag-to-scroll (desktop mouse) ── */
  let isDragging = false, startX = 0, scrollLeft = 0;

  carousel.addEventListener('mousedown', e => {
    isDragging = true;
    carousel.classList.add('dragging');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', () => { isDragging = false; carousel.classList.remove('dragging'); });
  carousel.addEventListener('mouseup', () => { isDragging = false; carousel.classList.remove('dragging'); });
  carousel.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    carousel.scrollLeft = scrollLeft - (e.pageX - carousel.offsetLeft - startX) * 1.5;
  });

  /* ── Init: snap to first real card with no animation ── */
  goToCard(0, true);
})();