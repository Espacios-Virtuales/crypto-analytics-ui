# EVW-CRYPTO-H06-L03-C02 · Consolidar reveal y motion existente

## Trazabilidad y decisión

- Base verificada: `develop` en `eee46dc1bbdea7959fdedb7a1594209c91060d1a`.
- Rama: `feature/evw-crypto-h06-l03-c02-reveal-motion`.
- Archivos auditados: `src/app/shared/directives/crypto-reveal.directive.ts` y `src/styles/_crypto-motion.scss`.
- Resultado de la auditoría: no se encontró un defecto reproducible ni una segunda implementación de reveal.
- Decisión: conservar intacta la implementación de producción y consolidar su contrato mediante pruebas unitarias dirigidas. No se modificaron composición, navegación, foco, estilos, desplazamiento de 14 px ni duración aprobada de 420 ms.

## Lifecycle del observer

La directiva crea como máximo un `IntersectionObserver` por instancia y lo hace fuera de Angular mediante `NgZone.runOutsideAngular`. Mantiene el umbral vigente de `0.12` y observa únicamente el nodo host.

- Una entrada no intersectante mantiene el nodo pendiente y el observer activo.
- La primera entrada intersectante agrega `crypto-revealed` y ejecuta `disconnect()`.
- `ngOnDestroy()` ejecuta `disconnect()` de forma segura si se había creado un observer.
- Los caminos de fallback no crean observers, por lo que no dejan recursos activos.

Las pruebas nuevas verifican creación, configuración, observación, desconexión tras intersección y desconexión durante destrucción.

## Fallback y accesibilidad

- `prefers-reduced-motion: reduce`: la directiva revela inmediatamente y no crea observer. La hoja de motion fuerza opacidad `1`, elimina el desplazamiento y reduce las transiciones globales a `0.01ms`.
- `IntersectionObserver` no disponible: el contenido recibe `crypto-revealed` inmediatamente.
- Render fuera del navegador: el contenido se revela sin consultar `matchMedia` ni crear observer.

La validación en Chrome confirmó 13/13 nodos visibles para movimiento reducido y 13/13 visibles al eliminar `IntersectionObserver` antes de cargar Angular.

## Validación runtime

Se recorrieron todos los elementos `[data-crypto-reveal]` con desplazamiento instantáneo y espera suficiente para superar el umbral y completar la transición.

| Vista | Nodos | Revelados | Opacidad final 1 | Overflow horizontal | Navegación C01 |
|---|---:|---:|---:|---|---|
| Desktop 1440 × 1000 | 13 | 13 | 13 | No | `#analiza`, `#compara`, `#sigue`, `#flujo` presentes |
| Móvil 390 × 844 | 13 | 13 | 13 | No | `#analiza`, `#compara`, `#sigue`, `#flujo` presentes |

Como no cambió ningún archivo de producción, la experiencia visual vigente y la evidencia de C01 se conservan sin diferencias.

## Pruebas y dependencias

- Se añadió `crypto-reveal.directive.spec.ts` con seis casos específicos: configuración/zone, entrada no intersectante, revelado y desconexión, destrucción, movimiento reducido, ausencia de API y SSR (los dos estados de intersección se cubren en un mismo caso).
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 32/32.
- `npm run build`: PASS. Persisten los cuatro warnings de presupuesto SCSS preexistentes en `login`, `trading-mode`, `compare` y `home`; reveal/motion no generan warnings.
- `git diff --check`: PASS.
- `package.json` y `package-lock.json`: sin cambios. No se añadió AOS ni ninguna dependencia de animación.

## Límites

- No se modificaron navegación, autenticación, API, gráficos, backend ni superficies privadas.
- No se inició L03-C03.
- Sin merge, push, limpieza de ramas ni despliegue.
