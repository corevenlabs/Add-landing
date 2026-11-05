import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Process() {
  const { data } = useApp();
  return <section className="process section" id="proceso"><div className="section-head" data-reveal="up"><div><div className="eyebrow dark">03 / DE LA IDEA A TU EDIFICIO</div><h2>Tu proyecto,<br /><span>sin complicaciones.</span></h2></div><Link className="btn outline" to="/contacto">Empezar una cotización ↗</Link></div>
    <div className="steps">{data.steps.map((step, index) => <article key={step.id} data-reveal="up" data-reveal-delay={index}><span>{step.id}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></section>;
}
