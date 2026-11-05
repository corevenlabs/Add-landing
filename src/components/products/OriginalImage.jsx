export default function OriginalImage({ image, eager = false, delay = 0 }) {
  return (
    <figure className="original-image" data-reveal="up" data-reveal-delay={delay}>
      <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar imagen: ${image.alt}`}>
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        <span aria-hidden="true">↗</span>
      </a>
      <figcaption>{image.caption}</figcaption>
    </figure>
  );
}
