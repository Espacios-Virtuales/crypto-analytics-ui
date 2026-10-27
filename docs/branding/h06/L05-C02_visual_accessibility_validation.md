# EVW-CRYPTO-H06-L05-C02 · Validación visual y accesible integral

## Trazabilidad, alcance y resultado

- Base obligatoria: `develop` / `HEAD` en `b56488a87bc83c003e41bbc95155af370da57422`.
- Rama: `feature/evw-crypto-h06-l05-c02-visual-accessibility`.
- Alcance: landing, login, shell/sidebar/topbar, Dashboard, Assets, History, Compare, Trading Mode, diálogo de cuenta y estados documentados.
- Resultado: **PASS sobre la evidencia existente y las capturas tablet inspeccionadas; sin BLOCKER ni hallazgos visuales/accesibles nuevos.** La validación queda parcial en dos puntos explícitos: hero/header de landing a 768 px y estados vacíos, que no tienen evidencia suficiente. Ver `NOT_VALIDATED`.
- No se modificó lógica, contratos, servicios, funcionalidades financieras, configuración ni dependencias. Sólo se incorporan esta acta y nueve capturas tablet.
- Sesión de evidencia: datos ficticios (`analyst@example.com`, `ROLE_ANALYST`) y fixtures locales según actas L04. No se almacenaron credenciales, tokens ni datos sensibles.

## Evidencia reutilizada

Se reutilizaron las actas y capturas integradas en esta base, sin repetir sus pruebas exhaustivas:

| Acta | Evidencia reaprovechada |
| --- | --- |
| [L03-C01 · Navegación SPA](L03-C01_spa_navigation.md) | Landing, navegación móvil, teclado, apertura/cierre, Escape, retorno de foco y continuidad `/` → `/login`. |
| [L03-C02 · Reveal y movimiento](L03-C02_reveal_motion.md) y [L03-C03 · Reduced motion](L03-C03_reduced_motion.md) | Contenido visible con movimiento normal/reducido, navegación por teclado y comportamiento reducido en desktop/móvil. |
| [L03-C05 · Jerarquía cyan/gold](L03-C05_cyan_gold_hierarchy.md) | Roles de color y contraste de landing; Lighthouse y evidencia visual desktop/móvil. |
| [L04-C00 · Login](L04-C00_login_brand.md) | Formulario, labels, estados, teclado, foco, contraste, overflow y vistas desktop/móvil. |
| [L04-C01 · Shell](L04-C01_shell_brand.md) | Sidebar expandido/colapsado, drawer móvil, topbar, cuenta, foco, retorno de foco, reduced motion y overflow. |
| [L04-C02 · Dashboard](L04-C02_dashboard_brand.md) | Jerarquía, controles, loading/error, teclado, foco, reduced motion, contraste y responsive. |
| [L04-C03 · Vistas de datos](L04-C03_data_views_brand.md) | Assets, History y Compare; tablas internas, gráficos, filtros, teclado, contraste y overflow. |
| [L04-C04 · Trading Mode](L04-C04_trading_brand.md) | Formularios, señales, estados, nombres accesibles, teclado, foco, contraste y responsive. |
| [L04-C05 · Semántica](L04-C05_semantic_validation.md) | Continuidad de roles cyan/gold y estados financieros/operacionales en superficies privadas. |
| [L05-C01 · Baseline técnico](L05-C01_technical_validation.md) | Bundle, warnings, suite y los cuatro MINOR ya registrados. Se conservan sin reclasificarlos como hallazgos de C02. |

## Matriz de superficies y viewport

`PASS` significa que existe evidencia visual/runtime previa adecuada y, para tablet, la inspección de la captura indicada. Las capturas tablet son viewport `768 × 1024`; los pares de comparación previos son `1440 × 1000` y `390 × 844`.

| Superficie | Desktop 1440 × 1000 | Tablet 768 × 1024 | Móvil 390 × 844 | Resultado / límite |
| --- | --- | --- | --- | --- |
| Landing `/` | PASS · L02-C03/L03-C01/L03-C05 | NOT_VALIDATED · la captura nueva muestra el cierre de página, no el header/hero | PASS · L02-C03/L03-C01/L03-C05 | Cierre y jerarquía transversal inspeccionados en tablet; falta evidencia del primer viewport y navegación tablet. |
| Login `/login` | PASS · L04-C00 | PASS · [captura tablet](screenshots/L05-C02/tablet-login-768.png) | PASS · L04-C00 | Composición de dos paneles legible; errores visibles y primer campo enfocado. |
| Shell, sidebar y topbar | PASS · L04-C01 | PASS · [drawer abierto](screenshots/L05-C02/tablet-shell-drawer-open-768.png) | PASS · L04-C01 | Drawer, destinos, overlay, topbar y foco visibles; teclado/retorno cubiertos en C01. |
| Dashboard | PASS · L04-C02 | PASS · [captura tablet](screenshots/L05-C02/tablet-dashboard-768.png) | PASS · L04-C02 | Composición y loading visibles; error documentado en L04-C02. |
| Assets | PASS · L04-C03 | PASS · [captura tablet](screenshots/L05-C02/tablet-assets-768.png) | PASS · L04-C03 | Tabla desplaza internamente; no se exige que todas las columnas quepan a 768 px. |
| History | PASS · L04-C03 | PASS · [captura tablet](screenshots/L05-C02/tablet-history-768.png) | PASS · L04-C03 | Gráficos, controles de tabla y tabla legibles en la captura; evidencia previa completa desktop/móvil. |
| Compare | PASS · L04-C03 | PASS · [captura tablet](screenshots/L05-C02/tablet-compare-768.png) | PASS · L04-C03 | Tabla amplia mantiene scroll interno; selección y resumen permanecen visibles. |
| Trading Mode | PASS · L04-C04 | PASS · [captura tablet](screenshots/L05-C02/tablet-trading-768.png) | PASS · L04-C04 | Layout adaptable y métricas legibles en la captura; no se ve recorte de controles. |
| Diálogo de cuenta | PASS · L04-C01 | PASS · [captura tablet](screenshots/L05-C02/tablet-account-dialog-768.png) | PASS · retorno de foco cubierto en L04-C01 | Modal centrado, acciones visibles y foco visible en “Cerrar”. |

La matriz reutiliza las capturas de cada acta L04 en las superficies privadas. Se inspeccionaron las nueve capturas tablet nuevas: Landing (captura parcial), Login, Dashboard, Assets, History, Compare, Trading Mode, diálogo de cuenta y drawer. Las vistas privadas preservan el lenguaje común de fondos, bordes, escala tipográfica, jerarquía editorial y roles cromáticos de la landing/login/shell. No se aprecia una ruptura de continuidad que impida comprender o utilizar las superficies.

## Controles ejecutados y resultados

| Control | Resultado | Base de evidencia |
| --- | --- | --- |
| Composición, alineación, legibilidad y adaptación | PASS en las vistas cubiertas | Capturas desktop/móvil de L02/L04; inspección visual de capturas tablet anteriores. Landing tablet parcial queda acotada arriba. |
| Overflow horizontal de página | PASS en 1440 y 390 px para las rutas cubiertas; scroll interno permitido en tablas | Mediciones runtime documentadas por L02/L04. A 768 px las capturas no muestran desbordamiento de página y Assets/Compare exhiben scroll dentro de tabla; no se dispone de medición DOM `scrollWidth` para tablet. |
| Títulos, landmarks, etiquetas y nombres accesibles | PASS según revisiones DOM/árbol AX y pruebas documentadas | L03-C01, L04-C00, L04-C01, L04-C03 y L04-C04. No se repitió Lighthouse como sustituto de teclado. |
| Teclado y foco visible | PASS en rutas y controles cubiertos | Landing menú/anclas y login; drawer, diálogo y retorno de foco; controles de dashboard/vistas/trading. Capturas tablet evidencian foco en login, dashboard, Compare, diálogo y drawer. |
| Contraste WCAG AA | PASS para pares de tokens y estados medidos | Mediciones reutilizadas de L03-C05 y L04-C00–C04: texto/superficie `15.96:1`, secundario/superficie `8.64:1`, cyan/superficie `13.16:1`, gold/superficie `12.20:1`, success `8.23:1`, warning `9.22:1`, danger `6.04:1`; texto oscuro/CTA cyan `9.19:1`. Todos exceden AA. |
| Hover, active, disabled y loading | PASS donde el acta de la superficie lo documenta | Login L04-C00; shell y controles privados L04-C01–C04; loading/error de Dashboard L04-C02. No se interpreta un estado no capturado como validado. |
| Preferencia `prefers-reduced-motion` | PASS | L03-C02/C03 para landing, L04-C01 para shell y L04-C02 para Dashboard; movimiento reducido mantiene contenido visible y elimina transiciones decorativas. |
| Navegación móvil / sidebar colapsado | PASS | Drawer cerrado/fuera de secuencia de teclado, apertura, Escape, backdrop y retorno de foco; estados desktop expandido/colapsado en L04-C01. Captura tablet muestra drawer abierto. |
| Loading y error | PASS en estados documentados | Login: envío/error; Dashboard: loading/error; restantes vistas conservan estados según L04-C03/C04. Evidencia en actas y capturas enlazadas allí. |
| Estado vacío | NOT_VALIDATED | Las actas/capturas reutilizadas no documentan un fixture vacío representativo por cada superficie. No se fabricó un resultado para cerrar esta verificación. |

## Hallazgos y limitaciones

### BLOCKER

Ninguno encontrado en la evidencia validada.

### MINOR nuevos

Ninguno.

### MINOR preservados de L05-C01

Se conservan los cuatro hallazgos originales de L05-C01 sin volver a clasificarlos: MINOR-01 (tonos financieros físicos en Dashboard), MINOR-02 (helpers gold heredados sin consumidores), MINOR-03 (Node local fuera del rango `engines`) y MINOR-04 (symlink local autorreferente en `node_modules`). No son hallazgos nuevos de esta validación.

### NOT_VALIDATED

1. **Landing tablet, header/hero y navegación:** la captura `tablet-landing-768.png` corresponde al final de la página; no acredita composición inicial, navegación ni CTA en ese viewport. La evidencia desktop/móvil previa sí valida esas zonas en sus respectivos tamaños. Para cerrar este punto haría falta una captura tablet de la parte superior con fixture controlado.
2. **Medición DOM de overflow en tablet:** las capturas a 768 px no muestran desbordamiento horizontal de página y permiten reconocer scroll interno en tablas, pero no incluyen `scrollWidth/clientWidth` medido en runtime. La medición explícita queda acreditada para desktop/móvil en actas anteriores.
3. **Estados vacíos:** no se encontró evidencia de captura o recorrido runtime con un estado vacío controlado. Requiere fixtures autorizados para las rutas que lo contemplen.

Estas limitaciones son de cobertura de evidencia; no son defectos reproducibles. No justifican cambios de código ni refactorización. Sin una reproducción verificable no se asigna un impacto especulativo.

## Validación técnica de C02

Entorno observado: Node `v24.21.0`, npm `11.19.0`, Chrome Headless `137.0.0.0`. Node está fuera de `engines.node` (`^20.19.0 || ^22.12.0`); se mantiene como MINOR-03 preexistente de L05-C01 y no se modificó el entorno.

| Comando | Resultado |
| --- | --- |
| `npm run build` | PASS · bundle inicial raw `799.79 kB`, transferencia estimada `158.05 kB`; referencia de seguimiento preservada. |
| `npm test -- --watch=false --browsers=ChromeHeadless` | PASS · 52/52. El harness reportó el 404 conocido de `bootstrap-icons.woff2`; ya consta en L05-C01 y no impidió pruebas. |
| `git diff --check` | PASS · sin errores de whitespace. |

El build emitió sólo los cuatro warnings SCSS ya registrados en L05-C01 (login `6.42 kB`, home `7.98 kB`, compare `7.81 kB`, trading-mode `6.79 kB`); no aparecieron warnings nuevos. No se añadieron dependencias. No se volvió a ejecutar auditoría de dependencias ni inspecciones funcionales financieras que C01 ya cerró.

## Conclusión

No se identificaron bloqueantes visuales o accesibles verificables en las superficies respaldadas por evidencia. La continuidad transversal del Brand System v1.0 se mantiene y las tablas amplias conservan desplazamiento interno. Los hallazgos MINOR de L05-C01 permanecen registrados sin cambios.

El resultado no equivale a una validación total: el hero/header de Landing a 768 px, la medición DOM de overflow tablet y los estados vacíos quedan `NOT_VALIDATED` por falta de evidencia específica. No se ejecutaron correcciones de producto. El trabajo de esta cápsula se limita a documentación y capturas.

No se realizó push, merge, despliegue ni limpieza de ramas, y no se inició L05-C03.
