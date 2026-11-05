import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="about section" id="quienes-somos" aria-labelledby="about-title">
      <div data-reveal="up">
        <div className="eyebrow dark">QUIÉNES SOMOS / ADDA CHILE</div>
        <h2 id="about-title">Parte de<br /><span>Grupo Adda Chile.</span></h2>
      </div>
      <div className="about-copy" data-reveal="up" data-reveal-delay="1">
        <p>Somos parte del Grupo Adda Chile, empresa fundada en 1990.</p>
        <p>Letreros y placas para ascensores. Una mejor presentación para tu edificio.</p>
        <Link className="btn outline" to="/contacto">Hablemos de tu proyecto ↗</Link>
      </div>
    </section>
  );
}
