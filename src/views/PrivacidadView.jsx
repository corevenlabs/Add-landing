import PageLayout from '../components/layout/PageLayout';
import CatalogContent from '../components/layout/CatalogContent';
import '../styles/interior-pages.css';

export default function PrivacidadView() {
  return (
    <PageLayout title="Política de privacidad" headingMotion="fade">
      <CatalogContent name="privacyPage">{(content) => <div className="interior-content privacy-page">
        <div className="privacy-layout">
          <div className="privacy-content">
            <p className="privacy-source-note">Esta información reproduce la política publicada en letrerosascensores.cl y describe el funcionamiento de ese sitio.</p>
            <a className="privacy-source-link" href={content.sourceUrl} target="_blank" rel="noopener noreferrer">Consultar la política original ↗</a>
            {content.sections.map((section, index) => <section id={`privacidad-${index + 1}`} key={section.title} className="privacy-section"><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
          </div>
          <aside className="privacy-index" aria-label="Contenido de la política"><div className="eyebrow dark">EN ESTA PÁGINA</div>{content.sections.map((section, index) => <a key={section.title} href={`#privacidad-${index + 1}`}>{section.title}<span aria-hidden="true">↙</span></a>)}</aside>
        </div>
      </div>}</CatalogContent>
    </PageLayout>
  );
}
