# EVW-CRYPTO-H06-L03-C05 · Jerarquía visual cyan + gold

## Trazabilidad y resultado

- Base verificada: `develop` y `origin/develop` en `f9af8561408664fa9b93ee35d4280e381a5966cb`.
- Rama local: `feature/evw-crypto-h06-l03-c05-cyan-gold-hierarchy`.
- Resultado: la landing pública distingue interacción/tecnología en cyan y valor/jerarquía puntual en gold sin asociar el segundo acento a BUY, rendimiento, prima, tendencia o predicción.
- Alcance preservado: identidad, contenido, previews conceptuales, navegación SPA, CTA, rutas, reveal, reduced motion, autenticación, API, backend y superficies privadas.

## Cambios y decisiones

### Jerarquía de recorrido

Los hitos `01 · Analiza`, `02 · Compara` y `03 · Sigue` incorporan numeración gold y una guía vertical del mismo rol. La señal sirve para orientarse en la narrativa; no codifica el contenido financiero de la sección. Las tarjetas técnicas conservan títulos y bordes cyan.

### Decisión humana

El endpoint “Humano”, el principio “Decisión humana” y el cierre editorial reciben el énfasis gold. Se eliminó el tratamiento gold arbitrario sobre “Explicabilidad”: los dos primeros principios permanecen en cyan y el tercer principio concentra el énfasis de valor porque expresa control humano, no un resultado de mercado.

### Interacción y accesibilidad

CTA, links, foco, badges y relaciones conceptuales continúan en cyan. Lighthouse detectó que el nombre accesible del botón móvil omitía su texto visible “Menú”; se corrigió a “Menú: abrir/cerrar navegación”. El nombre de la marca incluye también sus textos visibles para cumplir WCAG 2.5.3.

Los pares principales mantienen contraste holgado: gold fuerte sobre fondo base `13.34:1` y superficie `12.20:1`; cyan fuerte sobre fondo base `14.40:1` y superficie `13.16:1`; texto oscuro sobre CTA cyan `9.19:1`.

## Evidencia antes/después

| Viewport | Antes | Después |
| --- | --- | --- |
| Desktop 1440 × 1000 | [Captura](screenshots/L03-C05/before-desktop-1440.png) | [Captura](screenshots/L03-C05/after-desktop-1440.png) |
| Móvil 390 × 844 | [Captura](screenshots/L03-C05/before-mobile-390.png) | [Captura](screenshots/L03-C05/after-mobile-390.png) |

Las cuatro capturas son páginas completas con `prefers-reduced-motion: reduce`, para comparar el layout estable. No se detectó overflow horizontal: `scrollWidth=clientWidth=1440` en desktop y `390` en móvil.

## Validación

- `npm run build`: PASS. Bundle inicial 791.66 kB; permanecen únicamente cuatro warnings SCSS preexistentes en `home`, `login`, `trading-mode` y `compare`.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 35/35.
- Lighthouse Accessibility: `100/100` en móvil y desktop, sin auditorías fallidas.
- Inspección visual de capturas completas: PASS en desktop y móvil.
- `git diff --check`: PASS.
- `package.json` y `package-lock.json`: sin cambios; no se añadieron dependencias.

## Archivos modificados

- `src/app/features/public-landing/public-landing.component.html`
- `src/app/features/public-landing/public-landing.component.spec.ts`
- `src/styles/_crypto-public-landing.scss`
- `docs/branding/h06/L03-C05_cyan_gold_hierarchy.md`
- `docs/branding/h06/screenshots/L03-C05/*.png`

No se realizó push, merge, despliegue ni limpieza de ramas.
