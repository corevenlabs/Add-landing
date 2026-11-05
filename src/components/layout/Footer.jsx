import { Link } from 'react-router-dom';
import Brand from './Brand';

export default function Footer() {
  return <footer><Brand /><p>Huérfanos 886, Oficina 724 · Santiago de Chile<br /><a href="tel:+56966186466">+56 9 6618 6466</a></p><div className="footer-meta"><span>ADDA / Letreros para ascensores</span><Link to="/politica-de-privacidad">Política de privacidad</Link></div><Link to="/#inicio">Volver arriba ↑</Link></footer>;
}
