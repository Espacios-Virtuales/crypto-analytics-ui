# EVW-CRYPTO-H06-L02-C03 · Landing con Brand System v1.0

## Trazabilidad

- Base verificada: `develop` en `0f0d56949f3644151acc10b7722dd66f194ac8f9`.
- Rama: `feature/evw-crypto-h06-l02-c03-branded-landing`.
- Alcance: portada pública `/`; no se modificaron login, dashboard, autenticación, rutas protegidas, contratos ni datos.
- Estado de integración: commit de implementación, sin merge ni despliegue.

## Activo maestro

Se incorporó sin reconstrucción ni edición `public/brand/CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg`.

- Fuente acreditada: Google Drive, archivo `CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg`, ID `1R35ShruEXm4wkIaJYWdtzqhaKfehEbk1`.
- Tamaño del original acreditado y del archivo incorporado: 2.210 bytes.
- SHA-256 del original acreditado y del archivo incorporado: `f763b386a2ead6e1214c5af6047c65c2cc298764b8b4065691baef009afdb5f1`.
- La sesión actual no dispone del conector de Drive. La verificación se realizó contra la evidencia autenticada conservada localmente de la descarga anterior del mismo archivo (ID, nombre, MIME, longitud, bytes y hash). La descarga anónima exige autenticación y no se usó como fuente sustitutiva.
- Los colores internos del SVG permanecen intactos y no se promovieron a tokens de interfaz.

## Implementación visible

- El `CA` tipográfico del encabezado fue reemplazado por el monograma oficial; se conserva el nombre Crypto Analytics.
- El hero aplica la frase rectora exacta: «Lee el mercado con contexto.» y explica datos, indicadores, señales interpretativas, histórico y decisión humana.
- Encabezado, hero, jerarquía tipográfica, CTA y panel de firma se recompusieron con los tokens `--crypto-*` existentes.
- Se conservaron las secciones y anclas `analiza`, `compara`, `sigue` y `flujo`, además de los enlaces SPA `/` y `/login`.
- Los colores locales de la landing se sustituyeron por tokens y `color-mix` derivado de tokens. Cyan/gold de interfaz no reutilizan los colores internos del SVG; gold no representa compra, rentabilidad ni señal financiera.
- Los estilos BEM de la landing se integraron como `styles/_crypto-public-landing.scss`, cargado por `styles.scss` y acotado a sus clases/elementos. Esto mantiene el presupuesto por componente sin cambiar el render ni elevar límites de compilación.

## Evidencia visual

| Vista | Antes (base) | Después |
|---|---|---|
| Desktop 1440 × 1000 | [before-desktop-1440.png](screenshots/L02-C03/before-desktop-1440.png) | [after-desktop-1440.png](screenshots/L02-C03/after-desktop-1440.png) |
| Móvil 390 × 844 | [before-mobile-390.png](screenshots/L02-C03/before-mobile-390.png) | [after-mobile-390.png](screenshots/L02-C03/after-mobile-390.png) |

La comparación confirma un cambio de marca visible en el render: el monograma aparece en encabezado y hero, la frase rectora pasa a ser la jerarquía principal y la composición adopta una lectura geométrica/analítica. En ambos viewports el ancho de documento coincide con el viewport (1440/1440 y 390/390), sin overflow horizontal.

Hashes SHA-256 de las capturas:

- `before-desktop-1440.png`: `e5e95106a2d8bf1a94c2cdcff6a278e9a5933c96ebf2a3b0d4edb59efaf91930`
- `after-desktop-1440.png`: `b2460537d621b36855f0a11d0bf3f499f7a2e34f2479f8ec39d1a6acd4cee262`
- `before-mobile-390.png`: `e76857bffde10f791583db7897cf749d32c4376be3390f29fc2be1cf8ec6f076`
- `after-mobile-390.png`: `9f6aa0a96671b699a8836e8631535fc7580f70af2fb7184c7007f49be977c37c`

## Validación

- `npm run build`: PASS. Persisten únicamente cuatro warnings SCSS ya conocidos en login, home, compare y trading-mode; la landing no genera warning.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 21/21.
- `git diff --check`: PASS.
- Responsive: PASS en 1440 × 1000 y 390 × 844; monogramas cargados y sin overflow horizontal.
- Teclado/foco: PASS. El orden alcanza marca, navegación visible y CTA; cada enlace enfocado presenta el anillo `--crypto-focus`.
- Reduced motion: PASS. Con `prefers-reduced-motion: reduce`, reveal queda visible y transición/animación se reduce a `0.00001s` por la foundation existente.
- Cascada: PASS. El render se recapturó después de integrar la hoja global; los selectores son específicos de la landing y no alteran Bootstrap/Material ni superficies privadas.

## Límites y estado administrativo

- No se modificaron login/dashboard ni se inició L03.
- No se realizó merge, publicación a rama remota ni despliegue.
- Workboard/Capsules no está disponible en la sesión actual: `WORKBOARD=PENDING_EXTERNAL_SYNC`. La falta de sincronización administrativa no bloquea la implementación.
- L02 permanece `IN_PROGRESS` y H06 permanece `ACTIVE` hasta revisión e integración autorizadas.
