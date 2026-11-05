import { whatsappUrl } from '../../services/catalogService';

export default function QuoteCallout({ eyebrow, title, description, message, label = 'Cotizar por WhatsApp' }) {
  return (
    <section className="interior-callout" data-reveal="up" aria-label={eyebrow}>
      <div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>
      <a className="btn red" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">{label}<span>↗</span></a>
    </section>
  );
}
