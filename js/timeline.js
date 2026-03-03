(function () {
  const items = document.querySelectorAll('.timeline-item');

  function getScrollHeight(panel) {
    panel.style.overflow = 'visible';
    panel.style.maxHeight = 'none';
    const h = panel.querySelector('.timeline-panel-inner').scrollHeight;
    panel.style.overflow = '';
    panel.style.maxHeight = '';
    return h;
  }

  function openItem(item) {
    const trigger = item.querySelector('.timeline-trigger');
    const panel = item.querySelector('.timeline-panel');
    item.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = (getScrollHeight(panel) + 2) + 'px';
  }

  function closeItem(item) {
    const trigger = item.querySelector('.timeline-trigger');
    const panel = item.querySelector('.timeline-panel');
    item.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
  }

  function init() {
    // Disable all transitions during init
    items.forEach((item, i) => {
      const panel = item.querySelector('.timeline-panel');
      panel.style.transition = 'none';

      if (i === 0) {
        panel.style.maxHeight = (getScrollHeight(panel) + 2) + 'px';
      } else {
        panel.style.maxHeight = '0px';
      }
    });

    // Re-enable transitions after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        items.forEach(item => {
          item.querySelector('.timeline-panel').style.transition = '';
        });
      });
    });
  }

  // Wait for fonts to load before measuring, so scrollHeight is accurate
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    // Fallback for browsers without Font Loading API
    window.addEventListener('load', init);
  }

  items.forEach(item => {
    item.querySelector('.timeline-trigger').addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(closeItem);
      if (!isActive) openItem(item);
    });
  });
})();