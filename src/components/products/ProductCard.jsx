import ProductPlate from './ProductPlate';
import { whatsappUrl } from '../../services/catalogService';

export default function ProductCard({ product, hidden, index = 0 }) {
  return <article className="product" data-reveal="up" data-reveal-delay={Math.min(index, 3)} data-category={product.category} hidden={hidden}>
    <div className="product-visual"><span className="index">/ {product.id}</span><ProductPlate product={product} /><span className="tag">{product.tag}</span></div>
    <div className="product-info"><a href={whatsappUrl(`Hola ADDA, quiero cotizar: ${product.name}`)} target="_blank" rel="noopener noreferrer">{product.name} <span>↗</span></a><p>{product.description}</p></div>
  </article>;
}
