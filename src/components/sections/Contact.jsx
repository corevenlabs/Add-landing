import { whatsappUrl } from '../../services/catalogService';

export default function Contact() {
  return <section className="contact section" id="contacto"><div className="eyebrow" data-reveal="fade">EL SIGUIENTE DETALLE EMPIEZA CONTIGO</div><div className="contact-row"><h2 data-reveal="up">Elevemos<br />tu <em>proyecto.</em></h2><div data-reveal="up" data-reveal-delay="1"><p>Cuéntanos qué necesita tu edificio.<br />Te ayudamos a encontrar la solución.</p><a className="btn red" href={whatsappUrl('Hola ADDA, quiero cotizar letreros para ascensores.')} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp <span>↗</span></a><a className="email" href="mailto:adda@adda.cl">adda@adda.cl ↗</a></div></div><div className="contact-line" data-reveal="fade"><span>SANTIAGO, CHILE</span><span>DISEÑAMOS LA FORMA DE INFORMAR.</span></div></section>;
}
