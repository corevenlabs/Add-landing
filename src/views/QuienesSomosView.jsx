import PageLayout from '../components/layout/PageLayout';
import CatalogContent from '../components/layout/CatalogContent';
import QuoteCallout from '../components/sections/QuoteCallout';
import OriginalImage from '../components/products/OriginalImage';
import '../styles/interior-pages.css';

export default function QuienesSomosView() {
  return (
    <PageLayout title="Quiénes somos">
      <CatalogContent name="aboutPage">{(content) => <div className="interior-content about-page">
        <section className="interior-intro about-intro">
          <div data-reveal="up"><div className="eyebrow dark">SOMOS PARTE DE GRUPO ADDA CHILE</div><h2>Diseñamos señales.<br /><span>Cuidamos tu espacio.</span></h2><p className="interior-lead">{content.introduction}</p><p className="about-description">{content.description}</p></div>
          <div className="about-founded" data-reveal="up" data-reveal-delay="1"><div className="eyebrow">GRUPO ADDA CHILE / FUNDADO EN</div><span className="about-year">{content.founded}</span><p>Una historia que forma parte de nuestra identidad.</p><div className="about-signature">DISEÑO · FABRICACIÓN · INSTALACIÓN</div></div>
        </section>

        <section className="interior-section about-approach" aria-labelledby="about-approach-title">
          <OriginalImage image={content.image} />
          <div><div className="eyebrow dark">01 / NUESTRA FORMA DE TRABAJAR</div><h2 id="about-approach-title" data-reveal="up">La confianza está<br /><span>en los detalles.</span></h2><p data-reveal="fade">{content.approach}</p>
            <div className="about-principles">{content.principles.map((principle, index) => <article key={principle.title} data-reveal="up" data-reveal-delay={index}><span className="interior-number">0{index + 1}</span><div><h3>{principle.title}</h3><p>{principle.description}</p></div></article>)}</div>
          </div>
        </section>

        <section className="interior-section about-process" aria-labelledby="about-process-title">
          <div className="eyebrow dark">02 / CONVERSEMOS SOBRE TU PROYECTO</div><h2 id="about-process-title" data-reveal="up">De tu idea<br /><span>a una propuesta clara.</span></h2>
          <div className="about-process-grid">{content.process.map((step, index) => <article key={step.title} data-reveal="up" data-reveal-delay={index}><span className="interior-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
        </section>

        <QuoteCallout eyebrow="HABLEMOS DE TU EDIFICIO" title={<>Tu proyecto,<br /><span>nuestro siguiente detalle.</span></>} message="Hola ADDA, quiero conversar sobre un proyecto de letreros para mi edificio." label="Contactar a ADDA" />
        <section className="about-contact" data-reveal="up" aria-label="Datos de contacto de ADDA">
          <div><span>LLÁMANOS</span><a href={content.contact.phoneLink}>{content.contact.phone}</a></div>
          <div><span>ESCRÍBENOS</span><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a></div>
          <div><span>ENCUÉNTRANOS</span><p>{content.contact.address}</p></div>
        </section>
      </div>}</CatalogContent>
    </PageLayout>
  );
}
