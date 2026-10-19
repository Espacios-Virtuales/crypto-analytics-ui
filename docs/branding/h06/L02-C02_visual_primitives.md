# EVW-CRYPTO-H06-L02-C02 · Primitivas visuales mínimas

## Identificación, fuentes y resultado

- **Base real:** `develop` en `9289f9945f3832a4d591b2d0cfbdc735fc85ca63`; la verificación de ancestro fue satisfactoria.
- **Rama:** `feature/evw-crypto-h06-l02-c02-visual-primitives`.
- **Resultado:** `IMPLEMENTATION=MINIMAL_REFACTOR`. Se consolidó una sola familia de alto valor y bajo riesgo: card/panel de datos para History y Compare.
- **Fuentes de repositorio:** `docs/branding/h06/L02-C01_foundation_consolidation.md`, `L01-C01_visual_inventory.md`, `L01-C02_visual_semantics.md` y `L01-C03_token_map.md`.
- **Fuentes normativas:** Brand System v1.0 FINAL, Drive `1W81halb3lPVRML_focAVrUNbLhqBoqb_`, SHA-256 acreditado `01d35f4251bf9199424f638b8b3ca6b4468a4bbfac38073bc64147fa4d6f4e86`; Tech Book v1.0 §12 L02-C02, Drive `1o3CSERWJZJgLova7aMIvvMUkPKo8A5C3`, SHA-256 acreditado `fa3edc68240d663a76440716890f19efce897fc32c7cdcf860c3c3f5c7107f0a`. La semántica normativa usada aquí está trazada en los informes L01 integrados. En esta ejecución, el acceso directo anónimo a ambos archivos devolvió la pantalla de autenticación de Drive; no se inventó contenido ausente.
- **Workboard:** se identificó `Capsules!506` como único registro autorizado. Su escritura queda pendiente porque no existe una sesión de Google Drive/Sheets conectada en esta ejecución.

## Auditoría de duplicación efectiva

| Candidato | Selectores y archivos | Consumidores comprobados | Similitud física | Equivalencia semántica | Impacto de cascada | Decisión | Evidencia |
|---|---|---:|---|---|---|---|---|
| Acciones | `.btn-ev`, `.btn-ev-gold`, `.btn-*` en `src/styles.scss`, Login, Register y Health | 3 botones `.btn-ev`; Bootstrap en vistas privadas | Parcial: comparten nombre, pero difieren fondo, borde, hover, foco y disabled | No: submit auth, acción diagnóstica y variantes Bootstrap no tienen un contrato idéntico | Alto: reglas globales, encapsuladas y Bootstrap compiten por especificidad/orden | `NO_EXTRAER` | Login y Register redefinen `.btn-ev`; Health mantiene otra apariencia. Unificar cambiaría estados o abriría L04. |
| Card/panel de datos | `.history-card`, `.compare-card`, `.crypto-card` en History, Compare y `_crypto-surfaces.scss` | 7 cards History + 5 cards Compare = 12 | Exacta en contenedor, header, body y breakpoint móvil; los overrides finales ya resolvían los mismos tokens | Sí: ambos son contenedores de lectura de datos con la misma estructura visual | Bajo y comprobable: Bootstrap carga antes de `styles.scss`; Material no selecciona `.crypto-card`; se retiran las reglas locales competidoras | `EXTRAER` | Los dos bloques duplicaban borde, radio, overflow, fondo, sombra, header y body; ambos repetían radio `0.85rem` a `767.98px`. |
| Otras cards/paneles | `.dashboard-card`, `.tm-card`, `.ev-card`, `.line-chart-card`, `.asset-table-card`, landing panels | múltiples | Parcial o solo cromática | No: cambian densidad, hover, interacción, layout o dominio de gráfica | Medio/alto; Material `.ev-card`, Bootstrap `.card` y encapsulación local | `NO_EXTRAER` | `tm-card` usa radio/padding compactos; `.ev-card` tiene hover/translate y ownership Material; `line-chart-card` pertenece a `CHART_DATA`. |
| Badges y estados | `.signal-*`, `.compare-badge-*`, `.tm-badge-*`, readiness Bootstrap y alerts | Home, Compare, Trading Mode y Assets | Los tripletes BUY/SELL/HOLD repiten valores físicos | No de forma segura: Compare reutiliza esas clases también para correlación; readiness es `OPERATIONAL_STATE` | Medio: mover colores globalmente mezclaría señales, datos y Bootstrap | `NO_EXTRAER` | `correlationBadgeClass()` devuelve `compare-badge-buy/hold/sell`; no se fusiona `FINANCIAL_SIGNAL` con `CHART_DATA` ni readiness. |
| Encabezados | `*-hero`, `*-title`, `*-subtitle` en Assets, History, Compare, Trading Mode y Home | 5 vistas privadas | History/Compare son cercanos; max-width/márgenes y responsive difieren; Assets/Trading usan otra densidad | Parcial | Medio: requeriría una clase nueva en superficies reservadas a L04 | `NO_EXTRAER` | La semejanza nominal no alcanza para retirar reglas sin normalizar apariencia. |
| Métricas | `.metric-*`, `.tm-summary-item`, `.tm-label`, `.tm-value`, `.trading-panel`, expected return | Home, Trading Mode y Compare | Parcial | Parcial: resumen, retorno y señal tienen roles distintos; Trading usa otros tonos positivo/negativo | Medio | `NO_EXTRAER` | No se fuerza equivalencia por color o nombre; no se alteran cálculos ni representación. |
| Loading/empty/error/stale | `.loading-inline`, `.loading-spinner`, alerts y templates locales | loading en Home, Assets, History, Compare y Trading Mode | Loading sí es idéntico y ya está centralizado; empty/error difieren en markup/contexto; stale no tiene consumidor visual localizado | Loading sí; resto no probado | Bajo para loading, incierto para los demás | `REUTILIZAR` | `_crypto-motion.scss` ya centraliza loading y reduced-motion desde L02-C01. No se duplica ni se crea una segunda primitiva. |
| Tablas | `.history-table`, `.compare-table`, `.asset-table` | 3 vistas | History/Compare comparten cabecera y gran parte de celdas; Compare fuerza `white-space`, Assets usa otra superficie y variables Bootstrap | Parcial | Medio: selectors de `.table` y `table-hover` dependen de Bootstrap | `NO_EXTRAER` | No se tocaron presentación, responsive ni estados vacíos de tablas. |
| Gráficos | `.line-chart-*` y SVG inline | 2 instancias en History | Ya existe un único componente compartido | Sí, pero ya consolidada | Alto si se mezclan series/ejes con cards genéricas | `REUTILIZAR` | No hay duplicación entre consumidores; series, ejes, escalas, leyenda, colores y datos quedan intactos. |
| Modal/overlay | `.evaas-dialog`, Material MDC, `.ev-dialog`, `.full-dialog`, snackbar | diálogos Material, `<dialog>` del shell y snackbar | Solo coincidencias superficiales | No: tecnología, foco, lifecycle y overlay distintos | Alto; overlays privados no abiertos | `NO_EXTRAER` | No se afirma equivalencia visual ni se altera Material, `<dialog>`, foco o snackbar. |

**Resumen cuantitativo:** 9 candidatos/familias inspeccionados, 1 equivalencia completa comprobada, 1 familia consolidada.

## Implementación y API visual estable

La API existente `.crypto-card` pasa de aportar únicamente `border-color` a definir el contrato mínimo ya compartido por History y Compare:

- contenedor: `overflow`, borde, radio, superficie y sombra existentes;
- `.card-header`: padding, borde inferior, superficie soft y texto existentes;
- `.card-body`: padding y texto existentes;
- responsive: radio `0.85rem` bajo `767.98px`, idéntico al de ambos consumidores.

Los 12 consumidores agregan `.crypto-card` y conservan sus clases `history-card` o `compare-card`, además de `.card`, `shadow-sm` y utilidades existentes. No cambia el contrato usado por tests, TypeScript o selectores locales. Se retiraron de cada hoja local un bloque duplicado de card/header/body, una regla responsive duplicada y los miembros redundantes de los overrides finales.

Archivos de implementación:

- `src/styles/_crypto-surfaces.scss`
- `src/app/features/dashboard/history/history.component.{html,scss}`
- `src/app/features/dashboard/compare/compare.component.{html,scss}`

No se crearon componentes Angular, tokens, módulos SCSS ni una biblioteca paralela.

## Diff, cascada y comprobación visual

- Diff de implementación: 5 archivos, 42 inserciones y 66 eliminaciones; reducción neta de 24 líneas contando las clases añadidas al HTML.
- Orden global conservado: Bootstrap → `styles.scss` → `material-theme.scss`; `_crypto-surfaces.scss` sigue cargándose desde `styles.scss` en el mismo lugar.
- El CSS de producción contiene una sola definición `.crypto-card` y sus reglas de header/body/responsive. Los chunks de History y Compare contienen, respectivamente, las clases locales preservadas junto a `.crypto-card`.
- `.shadow-sm` de Bootstrap conserva `box-shadow: var(--bs-box-shadow-sm) !important` antes y después; la extracción no cambia qué sombra gana para estos consumidores.
- No se tomaron capturas: History y Compare son rutas privadas y no hubo credenciales ni datos privados autorizados para abrirlas. No se declara equivalencia renderizada de superficies privadas. La equivalencia se comprobó sobre las declaraciones fuente antes/después, el CSS compilado, el orden de carga y el build.
- El build mantiene únicamente cinco warnings SCSS conocidos: landing, login, Compare, Home y Trading Mode. No aparece ningún warning nuevo; History dejó de exceder el presupuesto por la eliminación de duplicación.

## Invariantes preservadas

- Los valores UI `#09121D`, `#F2F7FB`, `#A9BAC8`, `#52D5D3` y `#D6B35A` no cambian; tampoco se añaden tokens.
- Gold no se usa como BUY, rentabilidad, premium, ganancia ni precio al alza.
- `OPERATIONAL_STATE`, `FINANCIAL_SIGNAL` y `CHART_DATA` permanecen separados. En particular, la colisión semántica de badges de correlación impidió una extracción aparente pero insegura.
- No cambian rutas, auth/guards/API, loading, retries, modelos, workers, notificaciones, `ts_utc`, `America/Santiago`, FX USD/CLP, RSI/MACD, series, ejes, leyenda, unidades, escalas ni cálculos.
- Focus, reduced-motion y responsive se conservan; no se eliminan aliases `--ev-*` ni se reestructura Bootstrap/Material.

## Validación

- `npm run build`: **PASS**; cinco warnings SCSS conocidos, ninguno nuevo.
- `npm test -- --watch=false --browsers=ChromeHeadless`: **21/21 PASS**.
- CSS compilado y orden de cascada: **PASS** para `.crypto-card`, History y Compare.
- `git diff --check`: se registra en la traza final de la cápsula.

## Límites y deuda pospuesta

- El acceso directo actual a Brand System, Tech Book y Workboard requiere conexión autenticada de Google Drive. Los IDs, hashes y reglas normativas ya acreditadas por L01/L02-C01 se preservan; `Capsules!506` no se actualiza hasta disponer de esa conexión.
- Modales, overlays y snackbar privados no se abrieron; quedan para su validación de foco/contraste en L04.
- L02-C03 conserva la migración cromática/foundation de landing. L03 conserva navegación, motion y representación de producto. L04 conserva branding de auth, shell, dashboard, módulos, tablas/gráficas y modales.
- No se ejecutó C03 por anticipación y no se autoriza merge, cierre, publicación o despliegue.
