import { Link } from 'react-router-dom';

export default function Brand({ onDark = false }) {
  return (
    <Link className={`brand${onDark ? ' brand--on-dark' : ''}`} to="/#inicio" aria-label="ADDA Inicio">
      <img className="brand-logo" src={onDark ? '/assets/brand/adda-logo-transparent.png' : '/assets/brand/adda-logo.png'} width={onDark ? '2043' : '1041'} height={onDark ? '770' : '392'} alt="ADDA · Soluciones gráficas para empresas" decoding="async" />
    </Link>
  );
}
