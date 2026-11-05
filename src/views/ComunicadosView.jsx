import PageLayout from '../components/layout/PageLayout';
import CatalogContent from '../components/layout/CatalogContent';
import OriginalImage from '../components/products/OriginalImage';
import QuoteCallout from '../components/sections/QuoteCallout';
import { whatsappUrl } from '../services/catalogService';
import '../styles/interior-pages.css';

export default function ComunicadosView() {
  return (
    <PageLayout title="Comunicado de Administración">
      <CatalogContent name="communicationsPage">{(content) => <div className="interior-content communications-page">
        <section className="interior-intro">
          <div data-reveal="up"><div className="eyebrow dark">INFORMACIÓN PARA TU COMUNIDAD</div><h2>Un mensaje claro.<br /><span>Una comunidad informada.</span></h2><p className="interior-lead">{content.introduction}</p><a className="btn red" href={whatsappUrl('Hola ADDA, quiero cotizar un portaaviso para comunicados de administración.')} target="_blank" rel="noopener noreferrer">Cotizar portaaviso <span>↗</span></a></div>
          <OriginalImage image={content.images[0]} eager delay={1} />
        </section>

        <section className="interior-section communications-guide" aria-label="Información y recomendaciones para comunicados">
          <div data-reveal="up"><div className="eyebrow dark">01 / QUÉ SE PUEDE COMUNICAR</div><h2>Lo importante,<br /><span>a la vista.</span></h2><ul className="interior-list communication-topics">{content.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></div>
          <div className="communication-principles"><div className="eyebrow dark">02 / CLAVES DE UN BUEN COMUNICADO</div>{content.principles.map((principle, index) => <article key={principle.title} data-reveal="up" data-reveal-delay={index}><span className="interior-number">0{index + 1}</span><div><h3>{principle.title}</h3><p>{principle.description}</p></div></article>)}</div>
        </section>

        <section className="interior-section communications-product" aria-labelledby="interchangeable-title">
          <OriginalImage image={content.images[1]} />
          <div data-reveal="up"><div className="eyebrow dark">03 / PORTAAVISOS INTERCAMBIABLES</div><h2 id="interchangeable-title">Cambia el aviso.<br /><span>Conserva el orden.</span></h2><p>{content.interchangeable}</p><p className="communications-closing">{content.closing}</p></div>
        </section>
        <QuoteCallout eyebrow="EL PRÓXIMO AVISO EMPIEZA AQUÍ" title={<>La información cambia.<br /><span>La presentación permanece.</span></>} message="Hola ADDA, quiero consultar medidas y materiales de portaavisos para comunicados de administración." label="Consultar medidas y materiales" />
      </div>}</CatalogContent>
    </PageLayout>
  );
}
