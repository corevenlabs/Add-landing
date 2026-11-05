import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HERO_INTERVAL_MS, heroSlides } from '../../data/heroSlides';

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroSlides.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return <>
    <section className="hero" id="inicio" style={{ '--hero-cycle': `${HERO_INTERVAL_MS}ms` }} aria-label="Soluciones ADDA" aria-roledescription="carrusel">
      <div className="hero-slides" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <img key={slide.id} className={`hero-slide hero-slide--${slide.id}${index === activeIndex ? ' is-active' : ''}`} src={slide.image} width={slide.width} height={slide.height} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
        ))}
      </div>
      <div className="shade" />
      <div className="hero-inner">
        <div className="hero-copy" key={activeSlide.id} aria-live="off">
          <div className="eyebrow"><i /> {activeSlide.eyebrow}</div>
          <h1>{activeSlide.title.map((line, index) => (
            <Fragment key={line}>{index > 0 && <br />}{index === 2 ? <em>{line}</em> : line}</Fragment>
          ))}</h1>
          <p>{activeSlide.description.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}</p>
        </div>
        <div className="actions"><Link className="btn red" to="/soluciones">Explorar soluciones <span>↗</span></Link><Link className="textlink" to="/contacto">Cotizar mi proyecto <span>→</span></Link></div>
      </div>
      <div className="hero-bottom"><span>DISEÑO · MATERIALIDAD · PRECISIÓN</span><Link to="/soluciones">DESCUBRE MÁS ↓</Link></div>
      <span className="vertical">ADDA / SOLUCIONES GRÁFICAS PARA EMPRESAS</span>
    </section>
    <div className="ribbon"><span>Para comunidades y edificios</span><b>✳</b><span>Para administradores</span><b>✳</b><span>Para empresas de mantención</span><b>✳</b><span>Hecho para tu espacio</span></div>
  </>;
}
