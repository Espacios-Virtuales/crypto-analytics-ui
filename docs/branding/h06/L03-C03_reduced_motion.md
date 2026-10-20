# EVW-CRYPTO-H06-L03-C03 · Validación de movimiento reducido

## Trazabilidad y decisión

- Base verificada: `develop` en `c78b680f5f8148b7b3fd05391be084ce392eae47`.
- Rama: `feature/evw-crypto-h06-l03-c03-reduced-motion`.
- Ejecución: Chrome Headless mediante Chrome DevTools Protocol, con viewports emulados reales de 1440 × 1000 y 390 × 844.
- Resultado: no se encontró un defecto reproducible. No se modificaron CSS, TypeScript, composición, color, monograma, navegación ni animaciones de la experiencia normal.

## Matriz de visibilidad y movimiento

| Viewport | Preferencia | Reveals visibles | Transformación final | Duración reveal | Animaciones activas | Overflow horizontal |
|---|---|---:|---|---|---:|---|
| Desktop 1440 × 1000 | Normal | 13/13 tras recorrer la página | Identidad | 420 ms | 0 al completar | No (`scrollWidth=clientWidth=1425`) |
| Desktop 1440 × 1000 | Reducida | 13/13 desde la carga | Identidad | 0.01 ms | 0 | No (`scrollWidth=clientWidth=1425`) |
| Móvil 390 × 844 | Normal | 13/13 tras recorrer la página | Identidad | 420 ms | 0 al completar | No (`scrollWidth=clientWidth=390`) |
| Móvil 390 × 844 | Reducida | 13/13 desde la carga | Identidad | 0.01 ms | 0 | No (`scrollWidth=clientWidth=390`) |

Con reducción, `scroll-behavior` es `auto`; no quedan desplazamientos decorativos ni animaciones ejecutándose. En ambos viewports se comprobó layout no nulo y visibilidad para Hero, Product Pulse, Analiza, Compara, Sigue, Flujo, Principios, CTA y Footer.

## Cambio dinámico de preferencia

La página se cargó con movimiento normal antes de que los reveals fuera del viewport intersectaran. Al cambiar a `reduce` sin recargar:

- los 13 elementos pasaron a opacidad `1` y `transform: none` aunque ninguno tuviera todavía `crypto-revealed`;
- las transiciones expuestas por Chrome tuvieron duración de `0.01 ms` y terminaron antes del siguiente paint estable;
- una sonda repetida tres veces confirmó 13/13 visibles, sin animaciones activas, después de dos fotogramas y también a 100 ms y 600 ms;
- al volver a movimiento normal, los observers vigentes revelaron 13/13 al recorrer la página.

Esto confirma que el contenido no depende de que una animación se ejecute y que cambiar la preferencia durante la sesión no deja elementos ocultos.

## Navegación, teclado y rutas

- Desktop reducido: `Enter` sobre Compara actualizó `location.hash` a `#compara`, desplazó el destino al borde superior y transfirió foco a la sección.
- Móvil reducido: `Space` abrió el menú (`aria-expanded=true`) y mantuvo foco visible en el botón.
- `Escape` cerró el menú y devolvió/mantuvo foco en el control.
- Una segunda apertura con `Space` y `Enter` sobre Flujo actualizó el hash a `#flujo`, cerró el menú, desplazó la sección y dejó foco en `#flujo`.
- `Enter` sobre el CTA final navegó de `/` a `/login`; el formulario se renderizó y la preferencia reducida permaneció activa.

No se observaron regresiones de navegación, scroll, teclado, foco, rutas ni autenticación.

## Evidencia visual

- [Landing reducida desktop, página completa](screenshots/L03-C03/reduced-desktop-1440-full.png) — 1425 × 4518 px de contenido renderizado dentro del viewport solicitado de 1440 × 1000.
- [Landing reducida móvil, página completa](screenshots/L03-C03/reduced-mobile-390-full.png) — 390 × 5459 px.
- [Menú móvil reducido, abierto y enfocado](screenshots/L03-C03/reduced-mobile-390-menu.png) — 390 × 844 px.

Hashes SHA-256:

- `reduced-desktop-1440-full.png`: `f6e57e5beb1de37f647532212c527fb31b9d86f06130cf17d455ebf78682bf16`
- `reduced-mobile-390-full.png`: `126860c639b3052a4163620a84d4088ed93b131569d6284571f6f33629c3a118`
- `reduced-mobile-390-menu.png`: `9e8c522f5fd491af02b57bc382b748ffbcd9d5dda1ef508ea8de312e54a5da21`

## Validaciones y límites

- `npm run build`: PASS. Sólo permanecen los cuatro warnings de presupuesto SCSS preexistentes en `home`, `login`, `trading-mode` y `compare`; no hay warnings nuevos.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 32/32.
- `git diff --check`: PASS.
- `package.json` y `package-lock.json`: sin cambios; no se añadieron dependencias.
- Autenticación, rutas, API, contratos, backend y gráficos: sin cambios.
- No se inició L03-C04 ni se realizó merge, push, despliegue o limpieza de ramas.
