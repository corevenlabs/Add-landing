import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { createRevealMotion } from '../src/utils/revealMotion.js';

function fixture({ reduced = false, supported = true } = {}) {
  const dom = new JSDOM('<main><section data-reveal="up"><a href="#">Contenido</a></section><article data-reveal="up" hidden>Producto</article></main>');
  const view = dom.window;
  const root = view.document.querySelector('main');
  const preference = new view.EventTarget();
  preference.matches = reduced;
  view.matchMedia = () => preference;
  let frameId = 0;
  const frames = new Map();
  view.requestAnimationFrame = (callback) => { frames.set(++frameId, callback); return frameId; };
  view.cancelAnimationFrame = (id) => frames.delete(id);
  let observer;
  if (supported) view.IntersectionObserver = class {
    targets = new Set();
    disconnected = false;
    constructor(callback) { this.callback = callback; observer = this; }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); this.disconnected = true; }
    notify(target, isIntersecting) { if (this.targets.has(target)) this.callback([{ target, isIntersecting }]); }
  };
  const stop = createRevealMotion(root);
  return {
    root, view, preference, observer, stop,
    async flush() { await Promise.resolve(); for (const [id, callback] of frames) { frames.delete(id); callback(); } },
    close() { stop(); dom.window.close(); },
  };
}

test('las entradas se ejecutan una vez y los elementos salen del observador al revelarse', () => {
  const f = fixture();
  try {
    const section = f.root.querySelector('section');
    assert.equal(section.dataset.revealState, 'pending');
    f.observer.notify(section, false);
    assert.equal(section.dataset.revealState, 'pending');
    f.observer.notify(section, true);
    assert.equal(section.dataset.revealState, 'visible');
    assert.equal(f.observer.targets.has(section), false);
    f.observer.notify(section, false);
    assert.equal(section.dataset.revealState, 'visible');
  } finally { f.close(); }
});

test('los datos que llegan después y los productos que muestra un filtro también se animan', async () => {
  const f = fixture();
  try {
    const card = f.root.querySelector('article');
    assert.equal(card.hasAttribute('data-reveal-state'), false);
    card.hidden = false;
    const image = f.view.document.createElement('figure');
    image.dataset.reveal = 'up';
    f.root.append(image);
    await f.flush();
    assert.equal(card.dataset.revealState, 'pending');
    assert.equal(image.dataset.revealState, 'pending');
    f.observer.notify(card, true);
    card.hidden = true;
    await f.flush();
    card.hidden = false;
    await f.flush();
    assert.equal(card.dataset.revealState, 'visible');
    image.remove();
    await f.flush();
    assert.equal(f.observer.targets.has(image), false);
  } finally { f.close(); }
});

test('el foco por teclado revela el contenido sin esperar al scroll', () => {
  const f = fixture();
  try {
    f.root.querySelector('a').focus();
    assert.equal(f.root.querySelector('section').dataset.revealState, 'visible');
  } finally { f.close(); }
});

test('movimiento reducido o ausencia de soporte dejan todo visible', () => {
  for (const options of [{ reduced: true }, { supported: false }]) {
    const f = fixture(options);
    try { assert.equal(f.root.querySelector('[data-reveal-state]'), null); }
    finally { f.close(); }
  }
});

test('activar movimiento reducido durante la navegación revela los elementos pendientes', async () => {
  const f = fixture();
  try {
    f.preference.matches = true;
    f.preference.dispatchEvent(new f.view.Event('change'));
    assert.equal(f.root.querySelector('section').dataset.revealState, 'visible');
    f.root.querySelector('article').hidden = false;
    await f.flush();
    assert.equal(f.root.querySelector('article').dataset.revealState, 'visible');
    assert.equal(f.observer.targets.size, 0);
  } finally { f.close(); }
});

test('al salir de una vista se desconectan observadores y se eliminan estados transitorios', () => {
  const f = fixture();
  try {
    f.stop();
    assert.equal(f.observer.disconnected, true);
    assert.equal(f.root.querySelector('[data-reveal-state]'), null);
  } finally { f.close(); }
});
