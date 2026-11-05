import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Materials() {
  const { data, material, setMaterial } = useApp();
  return <section className="material section" id="materiales"><div className="material-visual" data-reveal="up"><div className="material-label">EXPLORA LOS ACABADOS <span>↙</span></div><div className="sample steel"><span>01<br />ACERO</span></div><div className="sample acrylic"><span>02<br />ACRÍLICO</span></div><div className="sample aluminum"><span>03<br />ALUMINIO</span></div><div className="micro">MATERIALIDAD / ADDA</div></div>
    <div className="material-copy" data-reveal="up" data-reveal-delay="1"><div className="eyebrow">02 / EL VALOR ESTÁ EN LOS DETALLES</div><h2>Se ve bien.<br />Se siente<br /><em>mejor.</em></h2><p>La materialidad cambia cómo se percibe tu espacio. Explora acabados y elige la presentación adecuada para cada aplicación.</p>
      <div className="material-tabs" role="group" aria-label="Seleccionar material">{data.materials.map((item) => <button key={item.name} className={material === item.name ? 'selected' : ''} data-mat={item.name} aria-pressed={material === item.name} onClick={() => setMaterial(item.name)}>{item.name}</button>)}</div>
      <p id="matText" aria-live="polite">{data.materials.find((item) => item.name === material)?.description}</p><Link className="textlink" to="/contacto">Consultar materiales y medidas ↗</Link>
    </div></section>;
}
