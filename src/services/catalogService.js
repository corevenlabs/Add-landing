// Sustituye este endpoint por el de la API cuando esté disponible.
export async function getCatalog({ signal } = {}) {
  const response = await fetch('/data/catalog.json', { signal });
  if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
  return response.json();
}

export function whatsappUrl(message, phone = '56966186466') {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
