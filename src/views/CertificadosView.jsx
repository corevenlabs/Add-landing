import PageLayout from '../components/layout/PageLayout';
import { useApp } from '../context/AppContext';
import { whatsappUrl } from '../services/catalogService';
import CertificateFormat from '../components/products/CertificateFormat';
import '../styles/certificates.css';

export default function CertificadosView() {
  const { data, status, error, retry } = useApp();
  const content = data.certificatePage;

  return (
    <PageLayout title="Certificados Técnicos MINVU">
      {status === 'loading' && <p className="certificate-loading" role="status">Cargando información de certificados…</p>}
      {status === 'error' && <p role="alert">{error} <button onClick={retry}>Reintentar</button></p>}
      {content && <div className="certificates">
        <section className="certificate-intro" aria-label="Presentación de los certificados">
          <div data-reveal="up">
            <p className="certificate-lead">{content.introduction}</p>
            <a className="btn red" href={whatsappUrl('Hola ADDA, quiero cotizar un portacertificado técnico MINVU para mi ascensor.')} target="_blank" rel="noopener noreferrer">Cotizar portacertificado <span>↗</span></a>
          </div>
          <aside className="certificate-summary" data-reveal="up" data-reveal-delay="1">
            <div className="eyebrow">DOCUMENTACIÓN A LA VISTA</div>
            <p>Información vigente.<br /><span>Presentación cuidada.</span></p>
            <div className="certificate-jump-links"><a href="#primer-piso">01 / Primer piso <span>↙</span></a><a href="#cabina">02 / Cabina <span>↙</span></a></div>
          </aside>
        </section>

        <section className="certificate-guide" aria-labelledby="certificate-guide-title">
          <div className="certificate-section-heading" data-reveal="up"><div className="eyebrow dark">01 / INFORMACIÓN TÉCNICA</div><h2 id="certificate-guide-title">Claridad que transmite<br /><span>confianza.</span></h2></div>
          <div className="certificate-guide-grid">
            <div className="certificate-explanation" data-reveal="up"><h3>¿Qué es el certificado técnico?</h3><p>{content.definition}</p><h3>¿Por qué es importante?</h3><p>{content.importance}</p></div>
            <div className="certificate-information" data-reveal="up" data-reveal-delay="1"><h3>¿Dónde debe estar?</h3><p>{content.location}</p><ul>{content.information.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </section>

        <section className="certificate-formats-section" aria-labelledby="certificate-formats-title">
          <div className="certificate-section-heading" data-reveal="up"><div className="eyebrow dark">02 / FORMATOS DISPONIBLES</div><h2 id="certificate-formats-title">Una solución para<br /><span>cada ubicación.</span></h2><p>{content.formatsIntroduction}</p></div>
          <div className="certificate-formats">{content.formats.map((format, index) => <CertificateFormat key={format.id} index={index} format={format} />)}</div>
        </section>

        <section className="certificate-closing" data-reveal="up" aria-labelledby="certificate-closing-title">
          <div><div className="eyebrow">EL LETRERO TAMBIÉN CUMPLE UN ROL</div><h2 id="certificate-closing-title">Actualiza la información.<br /><span>Conserva la placa.</span></h2><p>{content.signage}</p></div>
          <a className="btn red" href={whatsappUrl('Hola ADDA, quiero consultar medidas y valores de portacertificados para Cabina y Primer piso.')} target="_blank" rel="noopener noreferrer">Consultar medidas y valores <span>↗</span></a>
        </section>
      </div>}
    </PageLayout>
  );
}
