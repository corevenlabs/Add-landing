import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Hero from '../components/sections/Hero';
import Products from '../components/sections/Products';
import Materials from '../components/sections/Materials';
import Process from '../components/sections/Process';
import Faq from '../components/sections/Faq';
import Contact from '../components/sections/Contact';
import About from '../components/sections/About';

export default function HomeView({ section, collection }) {
  const location = useLocation();
  const { status } = useApp();
  useEffect(() => {
    if (status === 'loading') return;
    const id = location.hash.slice(1) || section;
    const frame = requestAnimationFrame(() => {
      if (id) document.getElementById(id)?.scrollIntoView();
      else window.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.hash, section, status]);
  return <><Hero /><Products collection={collection} /><Materials /><Process /><Faq /><About /><Contact /></>;
}
