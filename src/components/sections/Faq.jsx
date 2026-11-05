import { useApp } from '../../context/AppContext';

export default function Faq() {
  const { data } = useApp();
  return <section className="faq section"><div data-reveal="up"><div className="eyebrow dark">ANTES DE COTIZAR</div><h2>Resolvamos<br />tus dudas.</h2></div><div className="questions">{data.faqs.map((faq, index) => <details key={faq.question} data-reveal="up" data-reveal-delay={Math.min(index, 3)} open={index === 0}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>;
}
