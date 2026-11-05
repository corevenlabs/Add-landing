import { useApp } from '../../context/AppContext';
import ProductCard from '../products/ProductCard';

const collections = {
  certificados: { ids: ['01'], title: <>Certificados técnicos<br /><span>MINVU.</span></>, description: 'Placas de certificación para ascensores.' },
  comunicados: { ids: ['05'], title: <>Comunicados de<br /><span>administración.</span></>, description: 'Portahojas para la información de tu edificio.' },
};

export default function Products({ collection }) {
  const { data, status, error, filter, setFilter, retry } = useApp();
  const selectedCollection = collections[collection];
  const products = selectedCollection ? data.products.filter((product) => selectedCollection.ids.includes(product.id)) : data.products;
  return <section className="products section" id="soluciones"><div className="section-head" data-reveal="up"><div><div className="eyebrow dark">01 / NUESTRAS SOLUCIONES</div><h2>{selectedCollection?.title ?? <>Cada señal tiene<br />un <span>propósito.</span></>}</h2></div><p>{selectedCollection?.description ?? <>Información clara. Terminaciones cuidadas.<br />Encuentra la solución que tu edificio necesita.</>}</p></div>
    {!selectedCollection && <div className="filters" data-reveal="fade" role="group" aria-label="Filtrar productos">{data.categories.map((category) => <button key={category.id} className={filter === category.id ? 'active' : ''} aria-pressed={filter === category.id} data-filter={category.id} onClick={() => setFilter(category.id)}>{category.name}</button>)}</div>}
    {status === 'error' && <p role="alert">{error} <button onClick={retry}>Reintentar</button></p>}
    <div className="grid" id="productGrid" aria-busy={status === 'loading'}>{products.map((product, index) => <ProductCard key={product.id} index={index} product={product} hidden={!selectedCollection && filter !== 'all' && filter !== product.category} />)}</div>
    <p className="caption">Visualizaciones referenciales de producto. Materiales, medidas y valores se confirman al cotizar.</p>
  </section>;
}
