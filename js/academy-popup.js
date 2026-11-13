(function () {
  const modal = document.getElementById('academy-welcome-modal');
  if (!modal) return;

  const closeButtons = modal.querySelectorAll('[data-academy-close]');
  let previousFocus = null;

  function openModal() {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('academy-modal-open');
    const closeButton = modal.querySelector('.academy-welcome-close');
    if (closeButton) closeButton.focus({ preventScroll: true });
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('academy-modal-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
  }

  closeButtons.forEach((button) => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Deliberately opens on every homepage load; closing it only dismisses this visit.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', openModal, { once: true });
  else openModal();
})();
