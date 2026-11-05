import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, mock, test } from 'node:test';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import { act } from 'react';

let server;
let dom;
let catalog;
const originals = {};
const exposed = ['window', 'document', 'navigator', 'HTMLElement', 'requestAnimationFrame', 'cancelAnimationFrame', 'fetch', 'IS_REACT_ACT_ENVIRONMENT'];

before(async () => {
  catalog = JSON.parse(await readFile(new URL('../public/data/catalog.json', import.meta.url)));
  dom = new JSDOM(await readFile(new URL('../index.html', import.meta.url), 'utf8'), { url: 'http://localhost/' });
  for (const key of exposed) originals[key] = Object.getOwnPropertyDescriptor(globalThis, key);
  const values = {
    window: dom.window, document: dom.window.document, navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    requestAnimationFrame: (callback) => setTimeout(callback, 0), cancelAnimationFrame: clearTimeout,
    fetch: async () => ({ ok: true, json: async () => catalog }), IS_REACT_ACT_ENVIRONMENT: true,
  };
  for (const [key, value] of Object.entries(values)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  dom.window.matchMedia = () => ({ matches: false });
  dom.window.scrollTo = () => {};
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  mock.timers.enable({ apis: ['setInterval'] });
  dom.window.setInterval = (...args) => globalThis.setInterval(...args);
  dom.window.clearInterval = (...args) => globalThis.clearInterval(...args);
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false }, appType: 'custom' });
  await act(async () => { await server.ssrLoadModule('/src/main.jsx'); });
});

after(async () => {
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 30)); });
  await server?.close();
  mock.timers.reset();
  dom?.window.close();
  for (const key of exposed) {
    if (originals[key]) Object.defineProperty(globalThis, key, originals[key]);
    else delete globalThis[key];
  }
});

async function click(element) {
  assert.ok(element, 'El elemento debe existir');
  await act(async () => { element.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, button: 0 })); });
}

test('catálogo original, filtros y cotizaciones por producto', async () => {
  assert.equal(document.querySelectorAll('.product').length, 6);
  assert.equal(document.querySelectorAll('.steps article').length, 3);
  assert.equal(document.querySelectorAll('.questions details').length, 4);
  for (const category of catalog.categories) {
    await click(document.querySelector(`[data-filter="${category.id}"]`));
    const expected = category.id === 'all' ? 6 : catalog.products.filter((product) => product.category === category.id).length;
    assert.equal(document.querySelectorAll('.product:not([hidden])').length, expected);
    assert.equal(document.querySelector('.filters .active').getAttribute('aria-pressed'), 'true');
  }
  const link = document.querySelector('.product-info a');
  assert.equal(new URL(link.href).searchParams.get('text'), 'Hola ADDA, quiero cotizar: Placa de certificación');
  await click(document.querySelector('[data-filter="all"]'));
});

test('material seleccionado actualiza descripción y estado accesible', async () => {
  for (const material of catalog.materials) {
    await click(document.querySelector(`[data-mat="${material.name}"]`));
    assert.equal(document.querySelector('#matText').textContent, material.description);
    assert.equal(document.querySelector('.material-tabs .selected').textContent, material.name);
  }
});

test('menú móvil, rutas, navegación atrás y estado compartido', async () => {
  await click(document.querySelector('#menu'));
  assert.equal(document.querySelector('#menu').getAttribute('aria-expanded'), 'true');
  await click(document.querySelector('.actions a[href="/soluciones"]'));
  assert.equal(dom.window.location.pathname, '/soluciones');
  assert.equal(document.querySelector('#menu').getAttribute('aria-expanded'), 'false');
  await click(document.querySelector('[data-filter="seguridad"]'));
  await click(document.querySelector('nav a[href="/materiales"]'));
  assert.equal(dom.window.location.pathname, '/materiales');
  assert.equal(document.querySelector('#page-title').textContent, 'Materiales');
  assert.equal(document.querySelector('.hero'), null);
  await click(document.querySelector('nav a[href="/quienes-somos"]'));
  assert.equal(dom.window.location.pathname, '/quienes-somos');
  await click(document.querySelector('.navcta'));
  assert.equal(dom.window.location.pathname, '/contacto');
  await act(async () => { dom.window.history.back(); await new Promise((resolve) => setTimeout(resolve, 30)); });
  assert.equal(dom.window.location.pathname, '/quienes-somos');
  await click(document.querySelector('footer .brand'));
  assert.equal(dom.window.location.pathname, '/');
  assert.equal(dom.window.location.hash, '#inicio');
  assert.equal(document.querySelectorAll('.product:not([hidden])').length, 3);
  assert.equal(document.querySelector('.material-tabs .selected').textContent, 'Aluminio');
});

test('enlaces de contacto originales', () => {
  assert.equal(document.querySelector('.email').href, 'mailto:adda@adda.cl');
  assert.equal(document.querySelector('footer a[href^="tel:"]').href, 'tel:+56966186466');
  assert.equal(new URL(document.querySelector('.contact .red').href).pathname, '/56966186466');
});

test('cabecera y pie usan el logotipo oficial y la pestaña usa el isotipo original', async () => {
  for (const selector of ['.site-header .brand', 'footer .brand']) {
    const brand = document.querySelector(selector);
    assert.equal(brand.getAttribute('href'), '/#inicio');
    const image = brand.querySelector('img');
    const isHeader = selector.startsWith('.site-header');
    assert.equal(image.getAttribute('src'), isHeader ? '/assets/brand/adda-logo-transparent.png' : '/assets/brand/adda-logo.png');
    assert.equal(image.getAttribute('width'), isHeader ? '2043' : '1041');
    assert.equal(image.getAttribute('height'), isHeader ? '770' : '392');
    assert.equal(brand.classList.contains('brand--on-dark'), isHeader);
    assert.match(image.alt, /ADDA/);
    assert.equal(brand.querySelector('.brandmark'), null);
  }
  assert.equal(document.querySelector('link[rel="icon"]').getAttribute('href'), '/assets/brand/adda-icon.png');
  for (const filename of ['adda-logo.png', 'adda-logo-transparent.png', 'adda-icon.png']) {
    assert.ok((await readFile(new URL(`../public/assets/brand/${filename}`, import.meta.url))).length > 0);
  }
});

test('navbar contiene las cinco secciones originales y cambia con el scroll', async () => {
  assert.deepEqual([...document.querySelectorAll('nav a')].map((link) => link.textContent), [
    'Inicio', 'Certificados Técnicos MINVU', 'Comunicado de Administración', 'Materiales', 'Quiénes somos',
  ]);
  const header = document.querySelector('.site-header');
  assert.equal(header.classList.contains('is-scrolled'), false);
  await act(async () => {
    dom.window.scrollY = 80;
    dom.window.dispatchEvent(new dom.window.Event('scroll'));
  });
  assert.equal(header.classList.contains('is-scrolled'), true);
  await act(async () => {
    dom.window.scrollY = 0;
    dom.window.dispatchEvent(new dom.window.Event('scroll'));
  });
  assert.equal(header.classList.contains('is-scrolled'), false);
});

test('las cuatro rutas del navbar muestran vistas independientes', async () => {
  for (const [path, title] of [
    ['/certificados-tecnicos-minvu', 'Certificados Técnicos MINVU'],
    ['/comunicado-de-administracion', 'Comunicado de Administración'],
    ['/materiales', 'Materiales'],
    ['/quienes-somos', 'Quiénes somos'],
  ]) {
    await click(document.querySelector(`.site-header nav a[href="${path}"]`));
    assert.equal(dom.window.location.pathname, path);
    assert.equal(document.querySelector('#page-title').textContent, title);
    assert.equal(document.title, `${title} — ADDA`);
    assert.equal(document.querySelector('.page-content').childElementCount, 1);
    assert.equal(document.querySelector('.site-header nav a[aria-current="page"]').textContent, title);
    assert.equal(document.querySelectorAll('header').length, 1);
    assert.equal(document.querySelectorAll('footer').length, 1);
    assert.equal(document.querySelector('.site-header').classList.contains('is-solid'), true);
    assert.equal(document.querySelector('.hero'), null);
    assert.equal(document.querySelector('.product'), null);
    assert.equal(document.querySelector('.page-heading').dataset.reveal, 'up');
    assert.ok(document.querySelectorAll('.page-content [data-reveal]').length > 0);
  }
  await click(document.querySelector('.page-breadcrumb a'));
  assert.equal(dom.window.location.pathname, '/');
  assert.equal(document.querySelector('.site-header').classList.contains('is-solid'), false);
  assert.equal(document.title, 'ADDA — Letreros para ascensores');
});

test('certificados conserva la información y cuatro fotografías originales con cotización por formato', async () => {
  await click(document.querySelector('.site-header nav a[href="/certificados-tecnicos-minvu"]'));
  assert.match(document.querySelector('.certificate-lead').textContent, /documentación técnica vigente/);
  assert.equal(document.querySelectorAll('.certificate-information li').length, 4);
  assert.equal(document.querySelectorAll('.certificate-format').length, 2);
  assert.equal(document.querySelectorAll('.certificate-images img').length, 4);
  for (const format of catalog.certificatePage.formats) {
    const card = document.getElementById(format.id);
    assert.equal(card.querySelector('h3').textContent, format.name);
    const quote = new URL(card.querySelector('.certificate-quote').href);
    assert.equal(quote.pathname, '/56966186466');
    assert.match(quote.searchParams.get('text'), new RegExp(format.name));
    for (const image of format.images) {
      const node = card.querySelector(`img[src="${image.src}"]`);
      assert.equal(node.alt, image.alt);
      assert.equal(Number(node.getAttribute('width')), image.width);
      assert.equal(Number(node.getAttribute('height')), image.height);
      assert.ok((await readFile(new URL(`../public${image.src}`, import.meta.url))).length > 0);
    }
  }
  await click(document.querySelector('.page-breadcrumb a'));
});

test('comunicados incorpora temas, recomendaciones y las dos imágenes originales', async () => {
  await click(document.querySelector('.site-header nav a[href="/comunicado-de-administracion"]'));
  assert.equal(document.querySelectorAll('.communication-topics li').length, 5);
  assert.equal(document.querySelectorAll('.communication-principles article').length, 4);
  assert.match(document.querySelector('.communications-product').textContent, /sin pegar ni despegar papeles/);
  assert.equal(document.querySelectorAll('.communications-page .original-image img').length, 2);
  for (const image of catalog.communicationsPage.images) {
    assert.equal(document.querySelector(`.communications-page img[src="${image.src}"]`).alt, image.alt);
    assert.ok((await readFile(new URL(`../public${image.src}`, import.meta.url))).length > 0);
  }
  const quote = new URL(document.querySelector('.communications-page .interior-callout .btn').href);
  assert.equal(quote.pathname, '/56966186466');
  assert.match(quote.searchParams.get('text'), /comunicados de administración/);
  await click(document.querySelector('.page-breadcrumb a'));
});

test('materiales conserva los cinco materiales, espesores e instalación del contenido original', async () => {
  await click(document.querySelector('.site-header nav a[href="/materiales"]'));
  assert.equal(document.querySelectorAll('.material-options li').length, 5);
  assert.equal(document.querySelectorAll('.material-thicknesses article').length, 2);
  assert.deepEqual([...document.querySelectorAll('.material-measure')].map((node) => node.textContent), ['3mm', '1mm']);
  assert.match(document.querySelector('.materials-page .interior-callout').textContent, /No se perforan las paredes/);
  assert.equal(document.querySelectorAll('.materials-page .original-image img').length, 3);
  for (const image of catalog.materialsPage.images) {
    assert.equal(document.querySelector(`.materials-page img[src="${image.src}"]`).alt, image.alt);
    assert.ok((await readFile(new URL(`../public${image.src}`, import.meta.url))).length > 0);
  }
  await click(document.querySelector('.page-breadcrumb a'));
});

test('quiénes somos presenta la empresa, su forma de trabajo y contacto directo', async () => {
  await click(document.querySelector('.site-header nav a[href="/quienes-somos"]'));
  assert.match(document.querySelector('.about-intro').textContent, /Grupo Adda Chile/);
  assert.equal(document.querySelector('.about-year').textContent, '1990');
  assert.equal(document.querySelectorAll('.about-principles article').length, 3);
  assert.equal(document.querySelectorAll('.about-process-grid article').length, 3);
  assert.equal(document.querySelector('.about-contact a[href^="tel:"]').href, 'tel:+56966186466');
  assert.equal(document.querySelector('.about-contact a[href^="mailto:"]').href, 'mailto:adda@adda.cl');
  assert.match(document.querySelector('.about-contact').textContent, /Huérfanos 886/);
  assert.equal(document.querySelector('.privacy-section'), null);
  assert.equal(document.querySelector('.about-page img').getAttribute('src'), catalog.aboutPage.image.src);
  assert.ok((await readFile(new URL(`../public${catalog.aboutPage.image.src}`, import.meta.url))).length > 0);
  await click(document.querySelector('.page-breadcrumb a'));
});

test('la política tiene su propia página accesible desde el pie de página', async () => {
  await click(document.querySelector('footer a[href="/politica-de-privacidad"]'));
  assert.equal(dom.window.location.pathname, '/politica-de-privacidad');
  assert.equal(document.querySelector('#page-title').textContent, 'Política de privacidad');
  assert.equal(document.title, 'Política de privacidad — ADDA');
  assert.equal(document.querySelector('.site-header').classList.contains('is-solid'), true);
  assert.equal(document.querySelectorAll('.privacy-section').length, 8);
  assert.equal(document.querySelector('.page-heading').dataset.reveal, 'fade');
  assert.equal(document.querySelector('.privacy-page [data-reveal]'), null);
  assert.equal(document.querySelector('.privacy-source-link').href, catalog.privacyPage.sourceUrl);
  assert.match(document.querySelector('.privacy-source-note').textContent, /describe el funcionamiento de ese sitio/);
  for (const [index, section] of catalog.privacyPage.sections.entries()) {
    const block = document.getElementById(`privacidad-${index + 1}`);
    assert.equal(block.querySelector('h2').textContent, section.title);
    assert.deepEqual([...block.querySelectorAll('p')].map((p) => p.textContent), section.paragraphs);
    assert.ok(document.querySelector(`.privacy-index a[href="#privacidad-${index + 1}"]`));
  }
  assert.equal(document.querySelector('.about-intro'), null);
  assert.equal(document.querySelectorAll('.site-header nav a').length, 5);
  await click(document.querySelector('.page-breadcrumb a'));
  assert.equal(document.title, 'ADDA — Letreros para ascensores');
});

test('hero tiene dos imágenes, sin video ni controles de carrusel', async () => {
  const slides = [...document.querySelectorAll('.hero-slide')];
  assert.equal(slides.length, 2);
  assert.deepEqual(slides.map((slide) => slide.getAttribute('src')), ['/assets/hero.jpg', '/assets/hero-certificados.png']);
  for (const slide of slides) {
    const image = await readFile(new URL(`../public${slide.getAttribute('src')}`, import.meta.url));
    assert.ok(image.length > 0);
  }
  assert.equal(document.querySelectorAll('.hero video, .hero button').length, 0);
  assert.equal(document.querySelectorAll('.hero h1').length, 1);
});

test('imagen y título cambian a los 4000 ms y vuelven al primer slide', async () => {
  const title = () => [...document.querySelector('.hero h1').childNodes].map((node) => node.textContent).join(' ').replace(/\s+/g, ' ').trim();
  assert.equal(title(), 'El detalle que marca la diferencia');
  await act(async () => { mock.timers.tick(3999); });
  assert.equal(title(), 'El detalle que marca la diferencia');
  await act(async () => { mock.timers.tick(1); });
  assert.equal(title(), 'La calidad está en los detalles');
  assert.equal(document.querySelector('.hero-slide.is-active').getAttribute('src'), '/assets/hero-certificados.png');
  assert.match(document.querySelector('.hero-copy p').textContent, /Certificados y comunicados/);
  await act(async () => { mock.timers.tick(4000); });
  assert.equal(title(), 'El detalle que marca la diferencia');
  assert.equal(document.querySelector('.hero-slide.is-active').getAttribute('src'), '/assets/hero.jpg');
});
