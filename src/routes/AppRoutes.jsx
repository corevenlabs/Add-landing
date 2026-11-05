import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from '../components/layout/SiteLayout';
import HomeView from '../views/HomeView';
import CertificadosView from '../views/CertificadosView';
import ComunicadosView from '../views/ComunicadosView';
import MaterialesView from '../views/MaterialesView';
import QuienesSomosView from '../views/QuienesSomosView';
import PrivacidadView from '../views/PrivacidadView';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomeView />} />
        <Route path="soluciones" element={<HomeView section="soluciones" />} />
        <Route path="como-cotizar" element={<HomeView section="proceso" />} />
        <Route path="contacto" element={<HomeView section="contacto" />} />
      </Route>
      <Route element={<SiteLayout solidHeader />}>
        <Route path="certificados-tecnicos-minvu" element={<CertificadosView />} />
        <Route path="comunicado-de-administracion" element={<ComunicadosView />} />
        <Route path="materiales" element={<MaterialesView />} />
        <Route path="quienes-somos" element={<QuienesSomosView />} />
        <Route path="politica-de-privacidad" element={<PrivacidadView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
