import { useApp } from '../../context/AppContext';

export default function CatalogContent({ name, children }) {
  const { data, status, error, retry } = useApp();
  if (status === 'loading') return <p className="interior-status" role="status">Cargando información…</p>;
  if (status === 'error') return <p className="interior-status" role="alert">{error} <button onClick={retry}>Reintentar</button></p>;
  if (!data[name]) return <p className="interior-status" role="status">La información no está disponible.</p>;
  return children(data[name]);
}
