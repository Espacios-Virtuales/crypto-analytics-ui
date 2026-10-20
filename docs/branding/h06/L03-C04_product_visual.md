# EVW-CRYPTO-H06-L03-C04 · Alinear representación pública del producto

## Trazabilidad y resultado

- Base verificada: `develop` en `ede8caaaae800b7e6a6395fbd808f55265d6dccf`.
- Rama: `feature/evw-crypto-h06-l03-c04-product-visual`.
- Resultado: Product Pulse, Comparador e Histórico comunican una demostración conceptual sin aparentar cotizaciones, cálculos, rendimiento o predicciones reales.
- Alcance preservado: monograma CA, hero, narrativa, navegación, CTA, reveal, reduced motion, autenticación, rutas, API, backend y gráficos del dashboard.

## Cambios y decisiones

### Product Pulse

Se reemplazó la falsa lectura de mercado (`BTC / USD`, `4h`, `$—` y barras variables) por una composición de tres capas: datos disponibles, contexto aplicado y lectura asistida. Los rótulos “Demo de interfaz” y “Contenido ilustrativo · sin cotizaciones ni señales” aclaran su naturaleza antes del detalle. La salida indica expresamente que no es una orden, recomendación ni resultado calculado.

### Comparador

La muestra BTC/ETH/SOL ahora es una tabla semántica con encabezados y filas identificadas como ejemplos. Cada fila muestra “Ficha ilustrativa” y “Sin cálculo”; ningún valor puede interpretarse como métrica calculada. En móvil, las mismas filas se reorganizan como tarjetas de dos columnas sin perder la semántica de tabla ni requerir scroll horizontal.

### Histórico

Las barras ascendentes y el último estado dorado se sustituyeron por cuatro momentos de igual valor visual. La secuencia representa orden, no magnitud, e incluye el texto “no representa precio, rendimiento, tendencia o predicción”. No se usa gold para codificar subida, rentabilidad, compra o premium.

### Brand System y accesibilidad

- Se reutilizaron exclusivamente tokens v1.0 para superficies, texto, bordes, radios, sombras y acento técnico; no se añadieron colores ni dependencias.
- Los textos explican el estado sin depender del color. Product Pulse y los previews usan `article`, encabezados asociados, descripciones por `aria-describedby`, tabla con `scope` y una lista ordenada con nombre accesible.
- Contraste de los pares relevantes: texto muted sobre superficies, 7.82:1–8.64:1; texto principal, 15.96:1; acento técnico, 13.16:1–13.69:1.

## Validación responsive y funcional

Chrome Headless se ejecutó con viewports emulados de 1440 × 1000 y 390 × 844, tanto con movimiento normal como con `prefers-reduced-motion: reduce`.

| Comprobación | Desktop | Móvil |
|---|---|---|
| Product Pulse, Comparador e Histórico visibles | PASS | PASS |
| Ancho de documento | `scrollWidth=clientWidth=1425` | `scrollWidth=clientWidth=390` |
| Etiquetas ilustrativas y ausencia de lectura live | PASS | PASS |
| Comparador / histórico | 3 filas / 4 momentos | 3 filas / 4 momentos |
| Reduced motion | previews visibles | previews visibles |
| Navegación | Analiza, Compara, Sigue y Flujo presentes | menú abre, cierra con Escape, restaura foco y navega |
| CTA `/ → /login` | preservado | PASS |

No se detectó overflow horizontal. El recorrido normal activa los previews mediante el reveal existente; con movimiento reducido son visibles desde la carga. No se modificó la directiva ni el sistema de motion.

## Evidencia antes/después

| Área | Desktop | Móvil |
|---|---|---|
| Product Pulse | [Antes](screenshots/L03-C04/before-desktop-pulse.png) · [Después](screenshots/L03-C04/after-desktop-pulse.png) | [Antes](screenshots/L03-C04/before-mobile-pulse.png) · [Después](screenshots/L03-C04/after-mobile-pulse.png) |
| Comparador | [Antes](screenshots/L03-C04/before-desktop-compare.png) · [Después](screenshots/L03-C04/after-desktop-compare.png) | [Antes](screenshots/L03-C04/before-mobile-compare.png) · [Después](screenshots/L03-C04/after-mobile-compare.png) |
| Histórico | [Antes](screenshots/L03-C04/before-desktop-history.png) · [Después](screenshots/L03-C04/after-desktop-history.png) | [Antes](screenshots/L03-C04/before-mobile-history.png) · [Después](screenshots/L03-C04/after-mobile-history.png) |

Las capturas son recortes del ancho completo de cada sección dentro de los viewports solicitados. Se tomó la evidencia con movimiento reducido para eliminar estados intermedios del reveal y comparar el layout estable.

## Pruebas

- `npm run build`: PASS. Bundle inicial 790.93 kB; permanecen únicamente los cuatro warnings de presupuesto SCSS preexistentes en `home`, `login`, `trading-mode` y `compare`.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 34/34. Se añadieron dos pruebas dirigidas a las etiquetas ilustrativas y a la estructura semántica de los previews.
- `git diff --check`: PASS.
- `package.json` y `package-lock.json`: sin cambios; no se añadieron dependencias.

## Archivos modificados

- `src/app/features/public-landing/public-landing.component.html`
- `src/app/features/public-landing/public-landing.component.spec.ts`
- `src/styles/_crypto-public-landing.scss`
- `docs/branding/h06/L03-C04_product_visual.md`
- `docs/branding/h06/screenshots/L03-C04/*.png`

No se inició L03-C05 ni se realizó push, merge, despliegue o limpieza de ramas.
