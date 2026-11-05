import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PageLayout({ title, children, headingMotion = 'up' }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const previousTitle = document.title;
    document.title = `${title} — ADDA`;
    return () => { document.title = previousTitle; };
  }, [title]);

  return (
    <article className="page-view" aria-labelledby="page-title">
      <div className="page-heading" data-reveal={headingMotion}>
        <nav className="page-breadcrumb" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
        </nav>
        <div className="eyebrow dark">ADDA / LETREROS PARA ASCENSORES</div>
        <h1 id="page-title">{title}</h1>
      </div>
      <div className="page-content">{children}</div>
    </article>
  );
}
