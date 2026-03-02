(function () {
  const items = document.querySelectorAll('.timeline-item');

  function openItem(item) {
    const trigger = item.querySelector('.timeline-trigger');
    const panel = item.querySelector('.timeline-panel');
    item.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.querySelector('.timeline-panel-inner').scrollHeight + 'px';
  }

  function closeItem(item) {
    const trigger = item.querySelector('.timeline-trigger');
    const panel = item.querySelector('.timeline-panel');
    item.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
  }

  // Init: open the first item, close the rest
  items.forEach((item, i) => {
    const panel = item.querySelector('.timeline-panel');
    if (i === 0) {
      panel.style.maxHeight = panel.querySelector('.timeline-panel-inner').scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  });

  items.forEach(item => {
    item.querySelector('.timeline-trigger').addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all items first
      items.forEach(closeItem);
      // If it wasn't already open, open it
      if (!isActive) openItem(item);
    });
  });
})();