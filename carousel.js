let currentIndex = 0;

const carousel      = document.getElementById('projectsCarousel');
const prevBtn       = document.getElementById('carouselPrev');
const nextBtn       = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');
const cards         = carousel.querySelectorAll('.project-card');

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to project ${i + 1}`);
  dot.addEventListener('click', () => goToCard(i));
  dotsContainer.appendChild(dot);
});

// Click on any card to bring it into focus
cards.forEach((card, i) => {
  card.addEventListener('click', () => goToCard(i));
});

function goToCard(n) {
  if (n >= cards.length) n = cards.length - 1;
  if (n < 0) n = 0;
  currentIndex = n;

  const card = cards[n];
  const target = card.offsetLeft - (carousel.offsetWidth - card.offsetWidth) / 2;
  carousel.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });

  dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === n);
  });
}

prevBtn.addEventListener('click', () => goToCard(currentIndex - 1));
nextBtn.addEventListener('click', () => goToCard(currentIndex + 1));