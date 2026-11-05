import { whatsappUrl } from '../../services/catalogService';

export default function CertificateFormat({ format, index = 0 }) {
  return (
    <article className="certificate-format" data-reveal="up" data-reveal-delay={index} id={format.id} aria-labelledby={`${format.id}-title`}>
      <div className="certificate-format-heading">
        <span className="certificate-format-number">/ {format.number}</span>
        <h3 id={`${format.id}-title`}>{format.name}</h3>
        <p>{format.description}</p>
      </div>
      <div className="certificate-images">{format.images.map((image) => (
        <figure key={image.src}>
          <a className="certificate-image-link" href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar imagen: ${image.alt}`}>
            <img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" />
            <span aria-hidden="true">↗</span>
          </a>
          <figcaption>{image.caption}</figcaption>
        </figure>
      ))}</div>
      <a className="certificate-quote" href={whatsappUrl(`Hola ADDA, quiero cotizar un portacertificado técnico MINVU para ${format.name}.`)} target="_blank" rel="noopener noreferrer">Cotizar formato {format.name.toLowerCase()} <span>↗</span></a>
    </article>
  );
}
