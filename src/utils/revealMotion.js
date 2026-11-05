// Progressive enhancement: content stays visible without IntersectionObserver.
export function createRevealMotion(root) {
  const view = root.ownerDocument.defaultView;
  const preference = view.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !view.IntersectionObserver) return () => {};

  const tracked = new Set();
  let frame = null;
  let stopped = false;

  function reveal(element) {
    element.dataset.revealState = 'visible';
    observer.unobserve(element);
  }

  const observer = new view.IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !entry.target.closest('[hidden]')) reveal(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  function scan() {
    frame = null;
    if (stopped) return;
    for (const element of tracked) {
      if (!root.contains(element)) {
        observer.unobserve(element);
        element.removeAttribute('data-reveal-state');
        tracked.delete(element);
      }
    }
    for (const element of root.querySelectorAll('[data-reveal]')) {
      if (tracked.has(element) || element.closest('[hidden]')) continue;
      tracked.add(element);
      if (preference.matches) reveal(element);
      else {
        element.dataset.revealState = 'pending';
        observer.observe(element);
      }
    }
  }

  // Catalog content arrives asynchronously; filters can reveal hidden cards.
  const mutations = new view.MutationObserver(() => {
    if (frame === null) frame = view.requestAnimationFrame(scan);
  });
  mutations.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

  function onPreferenceChange() {
    if (preference.matches) for (const element of tracked) reveal(element);
  }

  function onFocus(event) {
    // Keyboard users should never focus an invisible animated element.
    for (let element = event.target; element && element !== root; element = element.parentElement) {
      if (tracked.has(element)) reveal(element);
    }
  }

  preference.addEventListener?.('change', onPreferenceChange);
  root.addEventListener('focusin', onFocus);
  scan();

  return () => {
    stopped = true;
    if (frame !== null) view.cancelAnimationFrame(frame);
    observer.disconnect();
    mutations.disconnect();
    preference.removeEventListener?.('change', onPreferenceChange);
    root.removeEventListener('focusin', onFocus);
    for (const element of tracked) element.removeAttribute('data-reveal-state');
    tracked.clear();
  };
}
