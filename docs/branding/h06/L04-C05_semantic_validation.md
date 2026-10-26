# EVW-CRYPTO-H06-L04-C05 · Validación de gold privado y separación semántica

## Trazabilidad, alcance y resultado

- Base verificada: `develop` en `0ba29607ad71d903ffcaf6047649339814141946`.
- Rama local: `feature/evw-crypto-h06-l04-c05-semantic-validation`.
- Superficies revisadas: Login, shell/sidebar/topbar, Dashboard, Assets, History, Compare y Trading Mode.
- Resultado: **PASS con dos hallazgos MINOR documentales/de mantenibilidad y cero BLOCKER**.
- No se modificó código de producción. La revisión no encontró un defecto cromático, de cascada o accesibilidad que justificara alterar el diseño aprobado.

La inspección cubrió HTML y SCSS de cada superficie, tokens y primitivas globales, orden de carga declarado en `angular.json`, utilidades heredadas, clases calculadas para señales/rendimientos y el SVG canónico. Se reutilizaron las capturas y auditorías runtime de L04-C00 a L04-C04 porque corresponden al código integrado en la base y ya cubren desktop, móvil, teclado, contraste, estados y overflow.

## Cascada y estilos efectivos

La entrada de estilos carga Bootstrap, `styles.scss` y `material-theme.scss`, en ese orden. Dentro de `styles.scss`, los tokens se cargan antes que superficies, movimiento, layout, shell, landing y utilidades.

- Login, Dashboard, Assets, History, Compare y Trading Mode usan estilos encapsulados. Sus selectores locales tienen el atributo de encapsulación de Angular y prevalecen sobre las reglas genéricas de Bootstrap y las primitivas globales cuando ambas coinciden.
- El shell se encuentra en `_crypto-shell.scss`, pero todos sus selectores visuales están acotados por `.ev-shell`; no hay colisión efectiva con el contenido de las vistas.
- History contiene los únicos overrides deliberados mediante `:host ::ng-deep`, limitados a `app-line-chart`: superficie, texto, primer trazo cyan y segundo trazo neutral. No cambian escala, valores, ejes ni significado de series.
- Los `!important` localizados solo fijan texto secundario en Assets, History, Compare y Trading Mode, y el aviso de seguridad de Compare. Ninguno asigna gold ni una semántica financiera.
- Las reglas globales heredadas `.text-accent`, `.btn-ev-gold`, `.evaas-dialog` y el separador `hr` dorado no tienen consumidores en las siete superficies revisadas. Por tanto, no prevalecen ni alteran su render efectivo.

## Inventario de gold y cyan

| Superficie | Gold · identidad/jerarquía/valor | Cyan · interacción/tecnología/selección/foco | Resultado |
| --- | --- | --- | --- |
| Login | Aro decorativo de identidad y numeración de principios. | Eyebrows, énfasis de la promesa, hover/foco de inputs y CTA. | PASS |
| Shell/sidebar/topbar | Firma verbal, rol de sesión y eyebrow del diálogo de cuenta. | Iconos, navegación activa, controles, hover y foco. | PASS |
| Dashboard | Eyebrows, kickers y disclaimer editorial. | Selector/refresh, estados informativos, iconos técnicos, disclosure y foco. | PASS |
| Assets | Eyebrow y kicker de la matriz. | Marca técnica, nombre de activo y scrollbar interno. | PASS |
| History | Eyebrow y kicker. | Foco, botones de tabla y primer trazo como identificador de serie; no codifica subida, precio positivo ni recomendación. | PASS |
| Compare | Eyebrow y kickers. | Chips activos, foco, contexto, correlación alta como relación analítica y aviso de no ejecución. | PASS |
| Trading Mode | Eyebrow y kickers. | Foco, actualización, rutas externas, contexto y aviso de seguridad. | PASS |

No se localizaron usos efectivos de `--crypto-accent-value` o `--crypto-accent-value-strong` sobre precio, rendimiento, BUY, tendencia, confianza, recomendación o condición premium.

## Separación financiera y operacional

| Dominio | Implementación efectiva | Clasificación |
| --- | --- | --- |
| BUY | `--crypto-success` en Compare y Trading Mode; tono verde accesible derivado en Dashboard. | PASS |
| SELL | `--crypto-danger` en Compare y Trading Mode; tono rojo accesible derivado en Dashboard. | PASS |
| HOLD | neutral/texto secundario en Compare y Trading Mode; tono neutral derivado en Dashboard. | PASS |
| Rendimiento positivo/negativo/neutral | Success, danger y neutral/text-muted según clase calculada; ninguna rama usa gold. | PASS |
| Confianza | Texto principal o secundario; no recibe gold ni una clase de identidad. | PASS |
| Ready | `--crypto-success`, con badge y punto explícitos. | PASS |
| No ready | `--crypto-warning`, con badge, punto y texto explícitos. El token es distinto de gold. | PASS |
| Loading/refreshing | Superficie informativa, texto y spinner; no usa gold. | PASS |
| Warning/error/success | Tokens operacionales `--crypto-warning`, `--crypto-danger` y `--crypto-success`, además de texto/rol contextual. | PASS |

Las clases se originan en `signal-reading.utils.ts`: señal y tono de rendimiento se calculan por ramas independientes. La revisión no alteró cálculos, umbral HOLD, precisión ni porcentajes.

## Logo CA

Login y shell cargan directamente `/brand/CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg`. No existen `filter`, `fill`, `stroke`, `mix-blend-mode` ni recoloración CSS aplicados a esos `<img>`.

- Colores internos conservados: blanco `#FDFCFB`, turquesa `#00F9FA` y azul `#008CFD`.
- SHA-256 del maestro integrado: `f763b386a2ead6e1214c5af6047c65c2cc298764b8b4065691baef009afdb5f1`.
- Clasificación: **PASS**.

## Resultado por superficie

| Superficie | Semántica cromática | Estados/interacción | Responsive y legibilidad | Resultado |
| --- | --- | --- | --- | --- |
| Login | Identidad y CTA separados de success/error. | Hover, focus, active, disabled y loading cubiertos. | Lighthouse 100/100 y sin overflow en evidencia L04-C00. | PASS |
| Shell/sidebar/topbar | Gold editorial/rol; cyan navegación y controles; danger para logout. | Foco, drawer, diálogo y retorno de foco cubiertos. | Desktop expandido/colapsado y móvil abierto/cerrado sin overflow. | PASS |
| Dashboard | Gold solo editorial; métricas, señales y rendimiento independientes. | Loading, refreshing, error, foco y disclosure cubiertos. | Métricas legibles y sin overflow en ambos viewports. | PASS con MINOR-01 |
| Assets | Gold editorial; Ready/No ready usan success/warning. | Estados legibles por texto, forma y color. | Tabla contenida con scroll interno; sin overflow de página. | PASS |
| History | Gold editorial; datos y trazos no usan gold. | Selects, tabs, paginación y foco cubiertos. | Tablas con scroll interno y métricas legibles. | PASS |
| Compare | Gold editorial; señales, rendimiento y correlación mantienen dominios separados. | Chips, selects, foco y aviso de no ejecución cubiertos. | Tablas contenidas y sin overflow de página. | PASS |
| Trading Mode | Gold editorial; señal, rendimiento, confianza y estados no usan gold. | Selects, actualización, rutas, foco, loading/error y disabled cubiertos. | Layout 4/2/1 columnas y sin overflow. | PASS |

## Accesibilidad y evidencia reutilizada

Los pares representativos ya medidos sobre `--crypto-surface` son: texto `15.96:1`, texto secundario `8.64:1`, cyan fuerte `13.16:1`, gold fuerte `12.20:1`, success `8.23:1`, warning `9.22:1` y danger `6.04:1`. Texto oscuro sobre CTA cyan alcanza `9.19:1`. Todos superan WCAG AA.

- [Login · L04-C00](L04-C00_login_brand.md): contraste, hover/focus/active/disabled, teclado, Lighthouse y desktop/móvil.
- [Shell · L04-C01](L04-C01_shell_brand.md): navegación activa, drawer, diálogo, teclado, reduced motion y responsive.
- [Dashboard · L04-C02](L04-C02_dashboard_brand.md): estados, métricas, controles, contraste y responsive.
- [Assets, History y Compare · L04-C03](L04-C03_data_views_brand.md): tablas, señales, gráficas, foco, contraste y overflow.
- [Trading Mode · L04-C04](L04-C04_trading_brand.md): señales, rutas, controles, teclado, contraste y responsive.

No se repitieron capturas porque no existe cambio visual en C05 y la evidencia anterior corresponde exactamente a la base auditada.

## Hallazgos, correcciones y deuda residual

### MINOR-01 · Tonos financieros accesibles físicos en Dashboard

Dashboard usa `#8be8b6`, `#ffaaaa` y `#c0ccd6` para el texto de BUY/positivo, SELL/negativo y HOLD/neutral. Los bordes y fondos sí derivan de `--crypto-success`, `--crypto-danger` y `--crypto-neutral`; los tonos físicos mantienen contraste alto y no coinciden con gold.

- Impacto: mantenibilidad/tokenización, sin ambigüedad financiera ni defecto WCAG.
- Corrección: ninguna. Sustituirlos alteraría el diseño aprobado y requeriría una decisión de tokenización fuera de esta cápsula de validación.

### MINOR-02 · Helpers gold heredados y dormidos

`styles.scss` conserva `.text-accent`, `.btn-ev-gold`, reglas físicas antiguas de `.evaas-dialog` y un separador `hr` dorado. No tienen consumidores en las superficies revisadas, por lo que no afectan la cascada efectiva.

- Impacto: deuda global fuera del render auditado.
- Corrección: ninguna. Su retiro requiere inventario de consumidores fuera del alcance privado definido y no debe hacerse como limpieza incidental.

### BLOCKER

Ninguno.

## Validación técnica

- `npm run build`: **PASS**. Bundle inicial `799.79 kB`, sin incremento frente a la base.
- Warnings SCSS: los mismos cuatro del baseline (`login`, `home`, `compare` y `trading-mode`); no hay warnings nuevos.
- `npm test -- --watch=false --browsers=ChromeHeadless`: **PASS, 52/52**.
- `git diff --check`: **PASS**.
- `package.json` y `package-lock.json`: sin cambios.
- Código de producción: sin cambios.

No se realizó push, merge, despliegue ni limpieza de ramas, y no se inició L05.
