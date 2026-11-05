import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Brand from './Brand';

const navigation = [
  { to: '/', label: 'Inicio' },
  { to: '/certificados-tecnicos-minvu', label: 'Certificados Técnicos MINVU' },
  { to: '/comunicado-de-administracion', label: 'Comunicado de Administración' },
  { to: '/materiales', label: 'Materiales' },
  { to: '/quienes-somos', label: 'Quiénes somos' },
];

export default function Header({ solid = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);
  const location = useLocation();

  useEffect(() => {
    const syncScroll = () => setScrolled(window.scrollY > 24);
    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    return () => window.removeEventListener('scroll', syncScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.key]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        document.getElementById('menu')?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className={`site-header${solid ? ' is-solid' : ''}${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
      <Brand onDark />
      <nav id="nav" aria-label="Navegación principal" className={menuOpen ? 'open' : ''} onClick={() => setMenuOpen(false)}>
        {navigation.map(({ to, label }) => <NavLink key={to} to={to} end>{label}</NavLink>)}
      </nav>
      <Link className="navcta" to="/contacto">Hablemos de tu proyecto <span>↗</span></Link>
      <button id="menu" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-controls="nav" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>☰</button>
    </header>
  );
}
