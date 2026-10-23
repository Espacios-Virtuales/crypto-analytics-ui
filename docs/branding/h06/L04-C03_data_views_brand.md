# EVW-CRYPTO-H06-L04-C03 · Alineación de Assets, History y Compare al Brand System v1.0

## Trazabilidad y alcance

- Base verificada: `develop` en `796599b64a24b751877b181b9208b2526a99417e`.
- Rama local: `feature/evw-crypto-h06-l04-c03-data-views-brand`.
- Alcance: HTML/SCSS de Assets, History y Compare, documentación y evidencia visual.
- Fuera de alcance y sin cambios: TypeScript, servicios, API, endpoints, contratos, routing, autenticación, RxJS, caché, cálculos, conversiones, ordenamiento y renderizado asíncrono.
- `app-line-chart` no fue modificado. History aplica únicamente un ajuste visual localizado desde su propio SCSS para integrar sus superficies y trazos al tema oscuro.

## Implementación

### Assets · `/dashboard/assets`

- Encabezado editorial, matriz operacional y jerarquía tipográfica alineados con Landing, Login, Shell y Dashboard.
- Se conservaron las seis columnas, sus valores y su orden.
- Temporalidades y horizontes se presentan como ventanas técnicas compactas; timestamps y resumen técnico usan numerales tabulares.
- `Ready` usa la semántica de éxito y `No ready` la semántica de advertencia. Ninguno usa gold.
- La tabla mantiene scroll horizontal contenido en móvil, sin provocar overflow del documento.

### History · `/dashboard/history`

- Los cinco filtros se agruparon en una superficie compartida, con etiquetas programáticamente asociadas y foco cyan visible.
- Contexto monetario, tres métricas, dos gráficos, selector de tabla, paginación y tablas adoptan superficies oscuras coherentes.
- Se preservaron series, ejes, escalas, unidades, precisión, conversión USD/CLP, zona horaria y paginación.
- Los trazos del gráfico usan cyan técnico y neutral; gold no representa precio, predicción ni desempeño.

### Compare · `/dashboard/compare`

- Selector de activos, chips, parámetros, resumen comparativo, correlaciones y Trading Mode comparten jerarquía y contraste.
- BUY, SELL, HOLD y rendimiento mantienen sus roles semánticos positivo, negativo y neutral.
- Las correlaciones usan una semántica visual propia: alta en cyan técnico, neutral en gris e inversa en rojo, sin reinterpretar su clasificación.
- Se preservaron selección, ordenamiento, confianza, resultados y activo líder.
- El panel mantiene visible `Sin ejecución automática` y no añade controles de ejecución.

## Evidencia antes/después

Las capturas se obtuvieron con una sesión local ficticia (`analyst@example.com`, `ROLE_ANALYST`) y fixtures de QA interceptados fuera de la aplicación. No se introdujeron datos de prueba en el código ni se usaron credenciales reales.

| Vista | 1440 × 1000 · Antes | 1440 × 1000 · Después | 390 × 844 · Antes | 390 × 844 · Después |
| --- | --- | --- | --- | --- |
| Assets | [Captura](screenshots/L04-C03/before-assets-1440.png) | [Captura](screenshots/L04-C03/after-assets-1440.png) | [Captura](screenshots/L04-C03/before-assets-390.png) | [Captura](screenshots/L04-C03/after-assets-390.png) |
| History | [Captura](screenshots/L04-C03/before-history-1440.png) | [Captura](screenshots/L04-C03/after-history-1440.png) | [Captura](screenshots/L04-C03/before-history-390.png) | [Captura](screenshots/L04-C03/after-history-390.png) |
| Compare | [Captura](screenshots/L04-C03/before-compare-1440.png) | [Captura](screenshots/L04-C03/after-compare-1440.png) | [Captura](screenshots/L04-C03/before-compare-390.png) | [Captura](screenshots/L04-C03/after-compare-390.png) |

## Invariantes controlados

La comparación runtime antes/después confirmó:

- Assets: 6 columnas, 3 filas, BTC/ETH/SOL, dos `Ready`, un `No ready`, ventanas `1m, 5m, 15m`, horizontes `5m, 10m, 15m`, estados `ok/partial`, timestamps Chile y resúmenes `OK/stale/parcial/missing` idénticos.
- History: cierre `65.840,00 USD`, predicción `67.025,12 USD`, RSI `58.25`, contexto `BTC / 1m`, horizonte `5m`, paginación `1-6 de 72`, seis fechas y volúmenes idénticos.
- Charts: 2 instancias, 4 polylines y los mismos ticks X/Y, nombres `Close`, `Prediction`, `RSI`, `MACD` y series de seis puntos. No cambió ningún archivo de `app-line-chart`.
- Compare: orden BTC, ETH, SOL; precios `65.840,00`, `3.440,00`, `168,00`; predicciones `67.486,00`, `3.378,08`, `168,67`; rendimientos `+2,50%`, `-1,80%`, `+0,40%`; señales BUY/SELL/BUY; confianza 92%/84%/62%; correlaciones `1,00`; recuentos BUY 2, SELL 1, HOLD 0.

## Responsive y accesibilidad

- `document.scrollWidth === document.clientWidth` en las tres rutas a 1440 × 1000 y 390 × 844.
- Las tablas anchas conservan todas sus columnas mediante scroll interno, sin overflow horizontal de página.
- Los siete selects de History/Compare tienen etiqueta asociada; los chips conservan checkbox nativo y nombre accesible.
- Navegación por teclado verificada. Compare expone un outline cyan sólido de 3 px y History un outline cyan explícito de 3 px en `:focus-visible`.
- Contraste sobre `--crypto-surface`: texto `15.96:1`, texto secundario `8.64:1`, cyan `13.16:1`, gold editorial `12.20:1`, éxito `8.23:1`, advertencia `9.22:1` y peligro `6.04:1`; todos cumplen WCAG AA.

## Validación técnica

- `npm run build`: PASS. Solo permanecen las cuatro advertencias SCSS del baseline (`login`, `home`, `compare`, `trading-mode`); Assets e History permanecen bajo el presupuesto y no hay advertencias nuevas.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 52/52.
- `git diff --check`: PASS.
- Dependencias: sin cambios.

## Archivos intervenidos

- `src/app/features/dashboard/assets/assets.component.html`
- `src/app/features/dashboard/assets/assets.component.scss`
- `src/app/features/dashboard/history/history.component.html`
- `src/app/features/dashboard/history/history.component.scss`
- `src/app/features/dashboard/compare/compare.component.html`
- `src/app/features/dashboard/compare/compare.component.scss`
- `docs/branding/h06/L04-C03_data_views_brand.md`
- `docs/branding/h06/screenshots/L04-C03/*.png`

No se realizó push, merge, despliegue ni limpieza, y no se inició L04-C04.
