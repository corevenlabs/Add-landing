# ADDA · React

Conversión del diseño https://adda-ascensores-concepto.corevenlabs.chatgpt.site/ a React con Vite y React Router.

## Ejecutar

```sh
npm install
npm start
```

Vite muestra la dirección local en la terminal. Para generar producción: `npm run build`. Para revisar ese resultado: `npm run preview`.

`npm test` comprueba carga de datos, filtros, materiales, menú móvil, rutas, navegación atrás, conservación del estado y destinos de contacto con un DOM de pruebas. No sustituye una comparación visual en navegador.

## Organización

```text
src/
  components/
    layout/        # Cabecera, pie y estructura compartida
    products/      # Tarjeta y SVG original de cada placa
    sections/      # Secciones de la página y carrusel del hero
  data/            # Configuración de las dos diapositivas
  views/           # Vistas asociadas a rutas
  routes/          # Configuración de React Router
  context/         # Estado global, carga y selección de catálogo
  services/        # Acceso a datos y enlaces de cotización
  styles/          # CSS original, incluidos sus breakpoints
public/
  assets/          # Imágenes locales del hero y video original conservado
  data/            # Catálogo JSON local
```

## Rutas

`/`, `/certificados-tecnicos-minvu`, `/comunicado-de-administracion`, `/materiales`, `/quienes-somos`, `/politica-de-privacidad`, `/soluciones`, `/como-cotizar` y `/contacto`.

El navbar enlaza Inicio, Certificados Técnicos MINVU, Comunicado de Administración, Materiales y Quiénes somos. Las cuatro páginas interiores tienen archivos independientes en `src/views/`: `CertificadosView.jsx`, `ComunicadosView.jsx`, `MaterialesView.jsx` y `QuienesSomosView.jsx`. Cada una usa `PageLayout` con título y enlace de regreso al inicio. Comparten cabecera oscura y pie de página.

La vista Certificados Técnicos MINVU incorpora el contenido y las cuatro fotografías de https://letrerosascensores.cl/certificados-tecnicos-minvu/. Se organiza en presentación, explicación del certificado, información visible, formatos Primer piso y Cabina, y actualización de documentos. Los datos están centralizados en `certificatePage` dentro de `public/data/catalog.json` y se consumen desde el contexto global. Las imágenes se sirven localmente, se muestran completas y se pueden abrir a tamaño original. Cada formato tiene su enlace de cotización por WhatsApp. No se inventan medidas ni precios; los textos sobre certificación se presentan con carácter descriptivo, sin prometer ausencia de fallas.

Comunicado de Administración incorpora los cinco tipos de avisos, cuatro recomendaciones, la explicación de portaavisos intercambiables y las dos fotografías de https://letrerosascensores.cl/comunicado-de-administracion/. Se consume desde `communicationsPage` en el catálogo global.

Materiales incorpora los cinco materiales, referencias de 3 mm para acrílico y 1 mm para acero inoxidable, fijación sin perforaciones y las tres fotografías de https://letrerosascensores.cl/materiales/. Se consume desde `materialsPage`. La fotografía del portaaviso tamaño carta se comparte con Comunicados.

Quiénes somos presenta a Grupo Adda Chile y su fundación en 1990, información publicada en https://letrerosascensores.cl/pagina-de-politica-de-privacidad/. Incluye una descripción de las soluciones de ADDA, tres principios de atención, el proceso de cotización, una fotografía real del producto y teléfono, correo y dirección de contacto. Se consume desde `aboutPage` y mantiene los datos corporativos publicados, sin inventar testimonios, reconocimientos ni certificaciones.

La política de privacidad está separada en `PrivacidadView.jsx`, ruta `/politica-de-privacidad`, con enlace en el pie de página y un índice de sus ocho secciones. Su contenido se conserva en `privacyPage`, fuera de `aboutPage`, identificado como política del sitio original; no atribuye a la nueva aplicación funciones de registro, comentarios o cookies que aún no existen.

`CatalogContent`, `OriginalImage` y `QuoteCallout` comparten carga de datos, presentación de imágenes y llamadas de cotización entre estas tres vistas. Sus estilos están en `src/styles/interior-pages.css`.

En Inicio, la cabecera es fija y transparente al inicio; al superar 24 px de scroll muestra un fondo oscuro. En pantallas de hasta 1050 px, usa un menú desplegable que también se cierra con Escape.

Las rutas `/soluciones`, `/como-cotizar` y `/contacto` muestran Inicio y desplazan a la sección correspondiente. También funcionan los enlaces originales `/#soluciones`, `/#materiales`, `/#proceso`, `/#contacto` y `/#inicio`. Las rutas desconocidas redirigen al inicio. En producción, configura el servidor para devolver `index.html` en las rutas de React Router.

## Estado y datos

`AppProvider` usa Context y `useReducer`. Centraliza productos, categorías, materiales, pasos, preguntas frecuentes, estado de carga, errores, filtro activo y material seleccionado. Se consume con `useApp()`.

`getCatalog()` en `src/services/catalogService.js` consulta `/data/catalog.json`. Para conectar el backend, cambia ese servicio conservando el contrato del JSON. La selección vive en memoria durante la sesión y vuelve a sus valores iniciales al recargar.

El menú móvil y el carrusel usan estado local. El hero tiene dos diapositivas: cambia imagen, título y descripción cada 4000 ms, sin controles de pausa, flechas ni indicadores. Los enlaces de cotización permanecen fijos. Se edita desde `src/data/heroSlides.js`. Las preguntas conservan el comportamiento nativo de `details`. Los filtros, materiales y enlaces de WhatsApp reproducen las interacciones originales. No se realiza ningún envío automático.

El carrusel usa la imagen original `public/assets/hero.jpg` y la fotografía real `public/assets/hero-certificados.png`, tomada de https://letrerosascensores.cl/wp-content/uploads/2026/10/porta-certificado-ascensor-cabina-ADDA-1.png. Las imágenes se cargan localmente y respetan `prefers-reduced-motion` desactivando las animaciones y fundidos. El video original queda conservado, pero ya no se descarga ni se renderiza en la página.

## Animaciones

El home y las vistas de producto usan entradas suaves al entrar en pantalla, de 520 ms y con secuencias de 60 ms entre elementos. El hero combina el fundido de sus dos imágenes con un acercamiento leve durante los 4 segundos de cada diapositiva. Los botones, fotografías y tarjetas responden al cursor; los espesores conservan sus cifras y reciben un énfasis visual breve. El año 1990 permanece fijo. En Privacidad solo aparece el encabezado con un fundido; el texto se mantiene estático.

`data-reveal="up"` o `data-reveal="fade"` activa la entrada de un elemento. `data-reveal-delay` admite valores de 0 a 3. `src/utils/revealMotion.js` usa IntersectionObserver para animar cada elemento una vez por vista, y MutationObserver para incluir contenido que llega desde el catálogo. El hook de `SiteLayout` desconecta los observadores al cambiar de ruta; cambiar filtros o anclas no vuelve a animar los elementos ya vistos.

El contenido permanece visible sin IntersectionObserver y con movimiento reducido. Activar esa preferencia durante la navegación también revela los elementos pendientes. El foco de teclado hace visible cualquier bloque pendiente. `src/styles/motion.css` concentra tiempos, transiciones y excepciones. No se agregan dependencias. Las pruebas de movimiento están en `tests/motion.test.mjs`.

## Fidelidad

Se parte del CSS de origen, sus tipografías de Google Fonts, textos, SVG, video e imagen. La actualización del navbar incorpora estilos para transparencia, fondo al hacer scroll, navegación móvil y espacio para el contenido del hero. «Quiénes somos» incorpora el dato de Grupo Adda Chile, fundada en 1990, publicado en la página original. No se incluyen los scripts de infraestructura del alojamiento original. Las tipografías requieren acceso a Google Fonts.

La comparación visual en navegador queda pendiente si la sesión no dispone de un navegador conectado.

## Marca oficial

La cabecera y el pie comparten `src/components/layout/Brand.jsx`, que muestra el logotipo oficial en sus proporciones y colores originales, incluyendo su fondo blanco. Se sirve desde `public/assets/brand/adda-logo.png`, descargado de https://letrerosascensores.cl/wp-content/uploads/2026/10/logotipo-adda.png. El isotipo de la web original se usa como favicon: `public/assets/brand/adda-icon.png`, fuente https://letrerosascensores.cl/wp-content/uploads/2026/10/cropped-isotipo-adda-1-192x192.png. Los archivos originales se conservan sin alteraciones. El tamaño del logo se ajusta para escritorio y móvil.

El navbar usa `adda-logo-transparent.png`, una variante con fondo alfa obtenida mediante la herramienta integrada de edición de imágenes a partir del archivo oficial. El prompt final fue: «Remove only the white background of this logo to transparency. Leave the logo itself completely unchanged: black ADDA letters, black small Spanish tagline, and red geometric mosaic symbol. Do NOT recolor any letters to white. Preserve the original solid black letters and solid red symbol exactly. Remove the white background both outside and inside the holes of the letters. No new textures, no noise, no decorative changes. This is only background removal of the attached original logo.» El componente `Brand` aplica en CSS letras blancas en el navbar y mantiene el símbolo rojo. El pie conserva el archivo oficial original.
