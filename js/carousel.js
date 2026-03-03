let currentIndex = 0;

const carousel      = document.getElementById('projectsCarousel');
const prevBtn       = document.getElementById('carouselPrev');
const nextBtn       = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');
const cards         = carousel.querySelectorAll('.project-card');

/* ── Build dots ── */
cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to project ${i + 1}`);
  dot.addEventListener('click', () => goToCard(i));
  dotsContainer.appendChild(dot);
});

/* ── Sync dot UI without scrolling ── */
function setActiveDot(n) {
  currentIndex = n;
  dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === n);
  });
}

/* ── Scroll to a card and update dots ── */
function goToCard(n) {
  if (n >= cards.length) n = cards.length - 1;
  if (n < 0) n = 0;

  const card   = cards[n];
  const target = card.offsetLeft - (carousel.offsetWidth - card.offsetWidth) / 2;
  carousel.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });

  setActiveDot(n);
}

/* ── Click on any card to bring it into focus ── */
cards.forEach((card, i) => {
  card.addEventListener('click', () => goToCard(i));
});

/* ── Prev / Next buttons ── */
prevBtn.addEventListener('click', () => goToCard(currentIndex - 1));
nextBtn.addEventListener('click', () => goToCard(currentIndex + 1));

/* ── IntersectionObserver: update dots when a card scrolls into view ──
   This fires on native scroll AND on programmatic scrollTo, covering
   both touch/swipe on mobile and mouse-drag on desktop.               */
const io = new IntersectionObserver(
  (entries) => {
    // Find the most-visible card among all entries
    let best = null;
    let bestRatio = 0;

    entries.forEach(entry => {
      if (entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        best = entry.target;
      }
    });

    if (best && bestRatio > 0.5) {
      const idx = [...cards].indexOf(best);
      if (idx !== -1 && idx !== currentIndex) {
        setActiveDot(idx);
      }
    }
  },
  {
    root: carousel,
    threshold: [0.5, 0.75, 1.0],
  }
);

cards.forEach(card => io.observe(card));

/* ── Drag-to-scroll (desktop mouse) ── */
let isDragging = false;
let startX     = 0;
let scrollLeft = 0;

carousel.addEventListener('mousedown', (e) => {
  isDragging = true;
  carousel.classList.add('dragging');
  startX     = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseleave', () => {
  isDragging = false;
  carousel.classList.remove('dragging');
});

carousel.addEventListener('mouseup', () => {
  isDragging = false;
  carousel.classList.remove('dragging');
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x    = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.5;
  carousel.scrollLeft = scrollLeft - walk;
});