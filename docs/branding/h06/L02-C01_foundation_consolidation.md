# EVW-CRYPTO-H06-L02-C01 · Consolidación de foundation SCSS

## Identificación y fuentes

- **Base sincronizada:** `develop` en `73a53148eca7956fb544dcc37b2bbcd36fff7517` (incluye el merge de L01-C03).
- **Rama:** `feature/evw-crypto-h06-l02-c01-scss-foundation`.
- **Alcance:** consolidar la foundation existente; sin cambios en vistas, comportamiento, assets, contratos o datos.
- **Fuentes de auditoría:** `docs/branding/h06/L01-C01_visual_inventory.md`, `L01-C02_visual_semantics.md` y `L01-C03_token_map.md`.
- **Fuentes de implementación revisadas:** `angular.json`, `src/styles.scss`, `src/material-theme.scss` y los seis parciales `src/styles/_crypto-*.scss`.
- **Regla:** Brand System v1.0 FINAL conserva como valores UI exactos `#09121d`, `#f2f7fb`, `#a9bac8`, `#52d5d3` y `#d6b35a`; estados, señales financieras y colores internos del SVG permanecen en sus familias separadas.

## Cambios y trazabilidad

| Antes | Después | Consumidor comprobado | Razón | Validación |
|---|---|---|---|---|
| `--ev-shadow` estaba declarado en un `:root` aislado en `src/styles.scss:58`; el resto de aliases estaba agrupado en `_crypto-tokens.scss`. | Se mueve la misma asignación `--ev-shadow: var(--crypto-shadow)` al bloque de aliases de `_crypto-tokens.scss`. No se elimina ni cambia el valor. | `.ev-surface`, snackbar y `.evaas-dialog` referenciaban el alias antes de migrar los consumidores comprobados. | Reunir la declaración de compatibilidad con la ownership de tokens y evitar otra declaración global separada. | Build; búsqueda de declaraciones/consumidores; capturas antes/después idénticas en landing y login. |
| `.snack-error` leía `--ev-text` y `--ev-shadow`. | Lee `--crypto-text` y `--crypto-shadow`; conserva fondo y borde propios. | `src/app/core/http/error-interceptor.ts:30` asigna `panelClass: ['snack-error']`. | La correspondencia alias→token es exacta en `_crypto-tokens.scss`; el consumidor global usa ahora el token canónico sin retirar aliases públicos. | Build/tests; los valores referenciados mantienen el mismo origen; el snackbar no se forzó durante el smoke visual. |
| `.evaas-dialog` consumía `--ev-surface`, `--ev-text`, `--ev-muted`, `--ev-border` y `--ev-shadow`. | Cambia esas referencias a `--crypto-surface`, `--crypto-text`, `--crypto-text-muted`, `--crypto-border` y `--crypto-shadow`. Se conservan MDC, forma, padding y borde gold actuales. | `src/app/features/dashboard/resources/resources-dashboard.component.ts:123` asigna la clase; `create-project.dialog.scss:53,60` contiene overrides del mismo overlay. | El mapa C03 propone migrar consumidores globales cuando la equivalencia está demostrada; los aliases señalan directamente a esos tokens crypto. | Build y tests; CSS de producción compilado contiene los tokens canónicos en las reglas `.evaas-dialog`. El overlay privado no se abrió durante este smoke. |
| Reglas `.fade-in`, `.fade-out`, `.slide-up`, keyframes, `.loading-inline`, `.loading-spinner` y su bloque reduced-motion vivían al final de `styles.scss`; `[data-crypto-reveal]` y otro bloque reduced-motion vivían en `_crypto-motion.scss`. | Las reglas de movimiento y loading quedan juntas en `_crypto-motion.scss`; sus selectores reduced-motion se agregan al `@media (prefers-reduced-motion: reduce)` ya existente. | Loading visible en Home, Assets, History, Compare y Trading Mode; `.fade-*`/`.slide-up` son helpers globales. | Elimina ownership fragmentada y consolida las reglas reduced-motion sin cambiar declaraciones ni duraciones. | Build y tests; reglas verificadas en CSS compilado; SHA-256 de capturas iguales antes/después. |
| `.ev-surface` conserva `--ev-surface`, `--ev-border` y `--ev-shadow`. | Sin cambio. | No se encontró uso de la clase en templates/TS/SCSS de `src/`; una posible asignación dinámica o externa no está probada. | No migrar un helper sin consumidor confirmado; mantener aliases hasta una búsqueda y validación más amplia. | Búsqueda estática; deuda diferida, sin eliminación. |

## Ownership, cascada e invariantes

- Orden efectivo sin cambio: `angular.json` carga Bootstrap CSS, luego `src/styles.scss` y finalmente `src/material-theme.scss`; el orden `@use` permanece tokens → typography → surfaces → motion → layout → utilities.
- `src/material-theme.scss` se inspeccionó y no se modificó. Los estilos `--ev-radius`, `--ev-shadow-1/2`, `.ev-card` y el prefijo del tema Material siguen separados; no se afirma que la cascada de todos los overlays haya quedado resuelta.
- Los 30 valores existentes `--crypto-*` no cambian. No se agrega una escala, componente ni token de color. Los 11 aliases originales se conservan; `--ev-shadow` conserva su valor y solo cambia de archivo de declaración.
- No se cambian tipografía, formularios, selectores de foco, alerts, layout, colores de series/ejes, superficies locales, rutas ni código funcional. Tampoco se modifican landing/login, shell, dashboard, auth, gráficos, SVG o PNG.
- No se fusionan `--crypto-text-inverse`/`--crypto-on-accent`, ni se asignan cyan/gold a estados operacionales o señales financieras.

## Validación y limitaciones

- `npm run build`: **PASS**. Se mantienen los mismos seis warnings de presupuesto SCSS preexistentes: landing, login, compare, history, home y trading mode; no hay warning nuevo.
- `npm test -- --watch=false --browsers=ChromeHeadless`: **21/21 PASS**.
- `git diff --check`: **PASS**.
- Smoke visual local a 1440×1200, landing `/` y login `/`, antes y después. Las capturas de cada par son byte a byte idénticas: landing SHA-256 `2911ebf368662a7a521c9dff86c97c970fb12297dc2b6d868b799fd603cb7eea`; login SHA-256 `bb8935e7b5ca6104996be5173982b6810b60c72abda75c16b98de2642f665c03`. Archivos temporales: `/tmp/h06-l02-c01-before-landing.png`, `after-landing.png`, `before-login.png`, `after-login.png`.
- El runner visual necesitó iniciar Angular fuera del sandbox después de `listen EPERM` en `127.0.0.1:4200`; el servidor local y Chrome Headless completaron capturas correctamente.
- No se abrió el snackbar de error ni el diálogo Material: el primero requiere provocar un error de API y el segundo está en superficie privada. Sus referencias se migraron únicamente donde el alias y el token canónico tienen asignación exacta; se recomienda validar overlays durante la revisión de L04. No se afirma una auditoría de contraste completa.

## Deuda diferida y resultado

- Mantener en L04 la reconciliación del helper `.ev-surface` sin consumer localizado, aliases restantes en vistas y posibles estilos dinámicos/externalizados.
- Mantener el contraste/foco renderizado de diálogos y snackbar pendiente de smoke visual con sus overlays abiertos. No alterar la paleta Material, Bootstrap ni reglas locales de vistas dentro de C01.
- **Resultado:** consolidación mínima de ownership de aliases y motion. Invariantes preservadas; sin cambio del contrato visible de datos ni de apariencia verificable en las dos superficies públicas observadas.
