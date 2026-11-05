import { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { usePageMotion } from '../../hooks/usePageMotion';
import Header from './Header';
import Footer from './Footer';

export default function SiteLayout({ solidHeader = false }) {
  const mainRef = useRef(null);
  const { pathname } = useLocation();
  usePageMotion(mainRef, pathname);
  return <><Header solid={solidHeader} /><main ref={mainRef}><Outlet /></main><Footer /></>;
}
