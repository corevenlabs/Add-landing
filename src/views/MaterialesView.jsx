import PageLayout from '../components/layout/PageLayout';
import CatalogContent from '../components/layout/CatalogContent';
import OriginalImage from '../components/products/OriginalImage';
import QuoteCallout from '../components/sections/QuoteCallout';
import '../styles/interior-pages.css';

export default function MaterialesView() {
  return (
    <PageLayout title="Materiales">
      <CatalogContent name="materialsPage">{(content) => <div className="interior-content materials-page">
        <section className="interior-intro materials-intro">
          <div><div className="eyebrow dark" data-reveal="fade">MATERIALIDAD / ADDA</div><h2 data-reveal="up">El acabado también<br /><span>comunica.</span></h2><p className="interior-lead" data-reveal="up">{content.introduction}</p><ul className="material-options" aria-label="Materiales utilizados">{content.materials.map((material, index) => <li key={material} data-reveal="up" data-reveal-delay={Math.min(index, 3)}><span>0{index + 1}</span>{material}</li>)}</ul></div>
          <OriginalImage image={content.images[0]} eager delay={1} />
        </section>

        <section className="interior-section" aria-labelledby="thickness-title">
          <div className="eyebrow dark">01 / ESPESORES DE REFERENCIA</div><h2 id="thickness-title" data-reveal="up">Cada pieza,<br /><span>en su medida.</span></h2><p className="materials-thickness-note" data-reveal="fade">{content.thicknessNote}</p>
          <div className="material-thicknesses">{content.thicknesses.map((item, index) => <article key={item.name} data-reveal="up" data-reveal-delay={index}><h3>{item.name}</h3><p className="material-measure">{item.value}<span>{item.unit}</span></p><p>{item.description}</p></article>)}</div>
        </section>

        <section className="interior-section materials-gallery" aria-label="Aplicaciones y terminaciones de los materiales">{content.images.slice(1).map((image) => <OriginalImage key={image.src} image={image} />)}</section>
        <QuoteCallout eyebrow="02 / INSTALACIÓN EN CABINA" title={<>Una fijación cuidada.<br /><span>Sin perforar las paredes.</span></>} description={content.installation} message="Hola ADDA, quiero consultar materiales, espesores e instalación de letreros para ascensores." label="Consultar para mi proyecto" />
      </div>}</CatalogContent>
    </PageLayout>
  );
}
