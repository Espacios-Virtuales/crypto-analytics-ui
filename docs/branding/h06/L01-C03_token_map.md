# EVW-CRYPTO-H06-L01-C03 · Mapa de tokens visuales

- **Resultado:** mapa documental de tokens y rutas de migración; no se cambia la implementación.
- **Base:** `develop` en `47410930ebc9af879682ed2fbf012582e2edc122`, merge C02. C02 es ancestro de esta rama.
- **Rama:** `feature/evw-crypto-h06-l01-c03-token-map`.
- **Alcance:** orientar L02/L03/L04; no declara que un token esté validado visualmente ni autoriza migrar superficies.

## 1. Fuentes y método

| Fuente | Referencia e integridad | Uso en C03 |
|---|---|---|
| C01 · inventario visual | `docs/branding/h06/L01-C01_visual_inventory.md`; merge `609a77c3ba16bade3e86cda9d3a3203b1e8effa6`; SHA-256 `5897b66794e90a252f54641ecfede124190612a2ef696ee6ac566172947d25bb` | Superficies, selectores, consumidores y contrato visible de gráficas. |
| C02 · semántica visual | `docs/branding/h06/L01-C02_visual_semantics.md`; merge/base `47410930ebc9af879682ed2fbf012582e2edc122`; SHA-256 `c68a5e7ea00a7e9b27be0906915d2dc5ed8c40833d51713bb678fc53dfb0f96e` | Matriz de 30 filas, siete familias, deuda y decisiones pendientes. |
| Brand System v1.0 FINAL | Drive `1W81halb3lPVRML_focAVrUNbLhqBoqb_`, §§6–8; SHA-256 registrado en C02: `01d35f4251bf9199424f638b8b3ca6b4468a4bbfac38073bc64147fa4d6f4e86` | Autoridad de identidad, roles UI y separación de estados/datos. El documento se volvió a leer; no se recalculó el hash. |
| Tech Book v1.0 | Drive `1o3CSERWJZJgLova7aMIvvMUkPKo8A5C3`, §§7.1–7.3 y 12 L01/L02; SHA-256 registrado en C02: `fa3edc68240d663a76440716890f19efce897fc32c7cdcf860c3c3f5c7107f0a` | Valores de referencia de implementación, estructura existente y orden futuro. El documento se volvió a leer; no se recalculó el hash. |
| Asset Library Register v1.0 FINAL | Drive `1lWxYIQRy0NAX9BjQwzUgXsTZmyVAIe9M`; registros `CA-LOGO-01/02` | Confirmar maestros vigentes color/mono. No se importaron ni transformaron. |
| Maestros CA color/mono | Drive `1R35ShruEXm4wkIaJYWdtzqhaKfehEbk1` / `1CD7NErVxuFAsO8FjIhnXgfBlg1yeI8Zr`; hashes raw registrados en C02: `f763b386a2ead6e1214c5af6047c65c2cc298764b8b4065691baef009afdb5f1` / `e3903268c28b173aa17435507bd694ea44d892e9e66b2b939ad3c9570305d9c0` | Referencia de `BRAND_LOGO`; los hashes se heredan del registro C02 y no se recalcularon. |
| Foundation y antecedente | `src/styles/_crypto-tokens.scss`, `_crypto-surfaces.scss`, `_crypto-typography.scss`, `_crypto-motion.scss`, `_crypto-layout.scss`, `_crypto-utilities.scss`, `src/styles.scss`, `src/material-theme.scss`; `docs/branding/CRYPTO_ANALYTICS_BRAND_FOUNDATION.md` v0.4 | Fuente de implementación actual. v0.4 es histórico, no autoridad normativa. |

Se releen los artefactos cerrados C01/C02 y se buscaron declaraciones/consumidores en el árbol de fuente de la base C03. La inspección de cascada es estática: no se midieron estilos computados, contraste renderizado, foco ni variantes de overlay. “Consumidor no localizado” significa que la búsqueda de `var(...)` en `src/` no encontró una referencia; no demuestra que una dependencia externa o CSS generado nunca lo use.

## 2. Reglas y familias

- **`BRAND_LOGO`:** los colores `#FDFCFB`, `#00F9FA` y `#008CFD` viven dentro de los SVG maestros CA. No son tokens de interfaz ni se derivan de los valores cyan/gold de UI. No reabrir la identidad aprobada ni reconstruir el monograma.
- **`BRAND_UI`:** conservar los roles y valores exactos del Brand System §6: `--crypto-bg` `#09121d`, `--crypto-text` `#f2f7fb`, `--crypto-text-muted` `#a9bac8`, `--crypto-accent-tech` `#52d5d3`, `--crypto-accent-value` `#d6b35a`. Cyan es tecnología/interacción. Gold es valor o jerarquía puntual; no BUY, venta, ganancia, rentabilidad, premium ni alza.
- **`OPERATIONAL_STATE`:** éxito, warning, danger, neutral, loading, error, empty, stale/readiness. Se mantienen distintos de marca y de desempeño financiero; estado y etiqueta/texto no dependen únicamente del color.
- **`FINANCIAL_SIGNAL`:** BUY/SELL/HOLD, signo de retorno, confidence y expectedReturn conservan sus clases y colores propios. No se trasladan a cyan/gold ni a tokens de disponibilidad.
- **`CHART_DATA`:** series, ticks, ejes, grilla, leyenda, unidades, escalas, fechas y zona horaria conservan significado y código actual. C03 no propone aplicarles tokens cromáticos.
- **`ILLUSTRATIVE`:** previews de landing pueden consumir roles UI solo mientras sigan identificables como esquemas, no como datos de mercado.

El Tech Book §7.1 define valores adicionales como **referencias técnicas**: superficies elevadas, acentos fuertes y colores operacionales. Su presencia en el Tech Book no convierte cada valor en un color de marca corporativo. Los valores implementados que no aparecen de forma exacta en Brand System/Tech Book se registran como extensiones existentes, no se elevan a norma ni se sustituyen por valores inventados.

## 3. Inventario de tokens existentes

Se cuentan **30 declaraciones `--crypto-*`** en `_crypto-tokens.scss`. “Norma BS” indica coincidencia exacta con Brand System §6; “ref. TB” significa valor/rol listado por Tech Book §7.1; “extensión” identifica una declaración existente sin valor corporativo explícito. La columna de uso refleja coincidencias localizadas en fuente, no una validación de cascada.

| Token | Valor actual | Rol semántico | Estado / consumidor localizado |
|---|---|---|---|
| `--crypto-bg` | `#09121d` | `BRAND_UI` · fondo principal | Norma BS. `body`, `.landing`, `.ev-shell`; superficies base. |
| `--crypto-bg-elevated` | `#0d1824` | `BRAND_UI` · capa elevada | Ref. TB. `.ev-sidebar`, `.ev-topbar`. |
| `--crypto-surface` | `#101c29` | `BRAND_UI` · panel/card | Ref. TB. `.crypto-card`, `.card`, landing y componentes privados tokenizados. |
| `--crypto-surface-soft` | `#152535` | `BRAND_UI` · controles/superficie suave | Ref. TB. `.form-control`, `.form-select`, menús y superficies landing. |
| `--crypto-text` | `#f2f7fb` | `BRAND_UI` · texto principal | Norma BS. `body`, shell y componentes tokenizados. |
| `--crypto-text-muted` | `#a9bac8` | `BRAND_UI` · texto secundario | Norma BS. Placeholder y utilidades `.crypto-muted`, subtítulos/locales. |
| `--crypto-text-inverse` | `#06232d` | Texto sobre superficie/acento claro | Extensión; sin `var()` consumidor localizado. Comparte valor con `--crypto-on-accent`, pero no se fusionan roles por igualdad de hex. |
| `--crypto-accent-tech` | `#52d5d3` | `BRAND_UI` · tecnología/interacción | Norma BS. Links hover, botones, bordes de foco, navegación y previews ilustrativos. No es el turquesa del logo. |
| `--crypto-accent-tech-strong` | `#96f2df` | `BRAND_UI` · énfasis tecnológico | Ref. TB. Links, CTA, foco, `.crypto-eyebrow` y textos destacados. |
| `--crypto-accent-value` | `#d6b35a` | `BRAND_UI` · valor/jerarquía puntual | Norma BS. Ícono BTC y decoraciones/previews landing. No señal financiera. |
| `--crypto-accent-value-strong` | `#f0d889` | `BRAND_UI` · énfasis gold controlado | Ref. TB. `.crypto-value`, texto decorativo y `.btn-ev-gold`. Revisar contexto de CTA antes de uso. |
| `--crypto-accent-value-deep` | `#8f7130` | Extensión gold profunda | Extensión; consumidor `var()` no localizado. No presentar como tono aprobado por la marca. |
| `--crypto-on-accent` | `#06232d` | Texto sobre acento | Extensión; usado por botones en `_crypto-surfaces.scss`, landing y Trading Mode. Valor compartido con `text-inverse`, rol distinto. |
| `--crypto-border` | `rgba(174, 204, 223, 0.16)` | Borde UI | Extensión; tarjetas, controles, shell y tablas tokenizadas. |
| `--crypto-glow-tech` | `rgba(82, 213, 211, 0.13)` | Efecto decorativo de tecnología | Extensión; landing, navegación y hover de `.btn-ev`. No es estado ni foco por sí solo. |
| `--crypto-ring-tech` | `rgba(82, 213, 211, 0.11)` | Anillo decorativo | Extensión; `.landing__orb`. No sustituye el token de foco interactivo. |
| `--crypto-focus` | `rgba(150, 242, 223, 0.62)` | Anillo visible de foco | Extensión; foco global de forms/links/botones y overrides de vistas privadas. Requiere contraste renderizado. |
| `--crypto-shadow` | `0 16px 42px rgba(0, 0, 0, 0.28)` | Elevación/sombra nocturna | Extensión; botones, cards, modales y landing. No equivale a las sombras light de Material. |
| `--crypto-success` | `#4fc987` | `OPERATIONAL_STATE` · éxito | Ref. TB. Definido; `var()` consumidor directo no localizado fuera de la declaración/alias. |
| `--crypto-warning` | `#e2b85c` | `OPERATIONAL_STATE` · advertencia | Ref. TB. Definido; alert global usa RGBA con el mismo RGB, sin consumir el token. |
| `--crypto-danger` | `#ef7373` | `OPERATIONAL_STATE` · peligro/error | Ref. TB. Definido; alert global usa RGBA con el mismo RGB, sin consumir el token. |
| `--crypto-neutral` | `#8194a5` | `OPERATIONAL_STATE` · neutral | Ref. TB. Definido; consumidor directo no localizado. |
| `--crypto-radius-sm` | `0.5rem` | Geometría · radio pequeño | Extensión; landing mark/controles. |
| `--crypto-radius` | `0.875rem` | Geometría · radio base | Extensión; landing feature cards y componentes relacionados. |
| `--crypto-radius-lg` | `1.25rem` | Geometría · radio grande | Extensión; previews/cards de landing. |
| `--crypto-space-1` | `0.5rem` | Geometría · espacio 1 | Extensión; consumidor `var()` no localizado. |
| `--crypto-space-2` | `0.75rem` | Geometría · espacio 2 | Extensión; consumidor `var()` no localizado. |
| `--crypto-space-3` | `1rem` | Geometría · espacio 3 | Extensión; consumidor `var()` no localizado. |
| `--crypto-space-4` | `1.5rem` | Geometría · espacio 4 | Extensión; consumidor `var()` no localizado. |
| `--crypto-space-5` | `2.25rem` | Geometría · espacio 5 | Extensión; consumidor `var()` no localizado. |

Además, `_crypto-typography.scss` asigna Inter y fallbacks directamente, `_crypto-layout.scss` define `.crypto-container`, `_crypto-motion.scss` conserva reveal y `prefers-reduced-motion`, y `_crypto-utilities.scss` consume tech/value/text tokens. No se encontraron variables `--crypto-font-*`, `--crypto-leading-*` ni una escala tipográfica/espacial adicional que justifique inventar tokens en C03.

## 4. Matriz principal token → consumidor → deuda → destino

La acción afecta usos futuros, no los valores de los tokens en C03. Los grupos de tokens de cada fila comparten acción y destino; sus valores y estado individuales constan en el inventario anterior.

| TOKEN / VALOR ACTUAL | ROL / ESTADO | USO O CONSUMIDOR EXISTENTE | DECLARACIÓN HEREDADA A RECONCILIAR | ACCIÓN PROPUESTA | DESTINO | RIESGO / INVARIANTE · FUENTE |
|---|---|---|---|---|---|---|
| `--crypto-bg` `#09121d`; `--crypto-text` `#f2f7fb`; `--crypto-text-muted` `#a9bac8`; `--crypto-accent-tech` `#52d5d3`; `--crypto-accent-value` `#d6b35a` | Valores exactos Brand System §6; roles `BRAND_UI` | `_crypto-typography.scss` `body`; landing, shell, dashboard/Assets y utilidades; C02 matriz de foundation | Login/register `$bg/$surface/$text`; History/Compare/Trading Mode blancos, slate, foco gold; azul EVAAS de cards/dialogs | **CONSERVAR** tokens existentes; **MIGRAR_USO** solo las declaraciones con el mismo rol semántico | L02-C01; landing L02-C03/L03; auth/superficies privadas L04 | Reutilizar el valor existente, sin añadir equivalentes por nombre. No migrar estado financiero, logo ni colores de gráfica. C01 §3.1–3.4; C02 filas de foundation/login/history/compare/trading. |
| `--crypto-bg-elevated` `#0d1824`; `--crypto-surface` `#101c29`; `--crypto-surface-soft` `#152535` | Roles de superficie; referencias Tech Book §7.1, no colores internos del logo | Shell sidebar/topbar; `.crypto-card`, `.card`, forms y landing ya tokenizados | `bg-white`, `#fff`, `#f8fafc`, neutrales slate locales de login/register, History, Compare, Trading Mode, cards y diálogos | **CONSERVAR** valores existentes; **MIGRAR_USO** donde la superficie corresponda y el contraste se valide | L02-C01; L04 | La cascada global/Bootstrap/Material y los overrides locales pueden cambiar el resultado efectivo. C01 §3; C02 login, registro, modal cuenta, History, Compare, Trading Mode y Material. |
| `--crypto-accent-tech` / `--crypto-focus`; `--crypto-accent-tech-strong` | Cyan UI/foco y énfasis; base exacta más tono fuerte de referencia Tech Book | `_crypto-surfaces.scss:15–45`, links/buttons globales, `.landing__*`, `.ev-sidebar`, forms de Home/History/Compare/Trading Mode | `--ev-accent #2bd4e0`; `#2BD4E0` EVAAS en register/Material; foco gold `#d4af37` y glow `rgba(212,175,55,...)` en login/History/Compare/Trading Mode | **MIGRAR_USO:** azul/cyan heredado de interacción → `--crypto-accent-tech`; borde de foco gold → `--crypto-accent-tech`; halo de foco gold → `--crypto-focus`. **REVISAR** contraste/foco por componente | L02-C01; landing L02-C03/L03; L04 | `#2bd4e0` no es el logo `#00f9fa`; no cambiar color ni forma de señales. El token `--crypto-focus` no se sustituye por `--crypto-ring-tech`. C01 §3–4; C02 landing, login, shell, History/Compare/Trading. |
| `--crypto-accent-value` `#d6b35a`; `--crypto-accent-value-strong` `#f0d889`; `--crypto-accent-value-deep` `#8f7130` | Valor/jerarquía; fuerte según Tech Book; deep es extensión | Ícono BTC, `.crypto-value`, landing decorativa y `.btn-ev-gold` stylesheet | Gold local `#d4af37/#f1d27a`, RGBA decorativo; comentario global “CTA premium” en `src/styles.scss:89–96` | **CONSERVAR** semántica; **REVISAR** consumidores del CTA/clase gold antes de migrar o retirar; **MIGRAR_USO** solo acentos que sean realmente jerárquicos | L02-C01; landing L02-C03/L03; L04 | v1.0 resuelve que gold no significa premium, BUY, ganancia, retorno ni alza. El selector `.btn-ev-gold` existe y login tiene una regla SCSS, pero no se encontró llamada HTML/TS; no afirmar efecto en runtime. C02 landing, login, History/Compare/Trading y regla explícita §6. |
| `--crypto-border`, `--crypto-glow-tech`, `--crypto-ring-tech`, `--crypto-shadow` | Efectos y límites de superficie; extensiones existentes | Foundation global, landing, shell, cards/controles | Bordes/sombras físicos en componentes light; overlays `.ev-backdrop`, dialog cuenta y sombras Material `--ev-shadow-1/2` | **CONSERVAR** usos actuales; **REVISAR** ownership/cascada y duplicación antes de centralizar | L02-C01; L02-C02 solo si reduce duplicación idéntica; L04 | Mantener separados glow decorativo, foco, borde y sombra. Los valores extendidos no se declaran paleta normativa ni se normalizan sin render. C01 §3.3–3.4; C02 modales/frameworks. |
| `--crypto-success`, `--crypto-warning`, `--crypto-danger`, `--crypto-neutral` | `OPERATIONAL_STATE`; referencias Tech Book §7.1 | Tokens declarados; aplicaciones usan clases Bootstrap, estados textuales y clases locales | `_crypto-surfaces.scss:47–49` usa RGBA para alert warning/danger (mismo RGB, alpha local); readiness Assets usa `alert-*`/`text-bg-*`; el token no aparece como variable consumida | **CONSERVAR** significado; **MIGRAR_USO** de los RGBA de alert solo a los tokens correspondientes conservando alpha tras validación; **REVISAR** tokens sin consumidor localizado | L02-C01; L02-C02 solo si se demuestra duplicación de badges/alerts; estados privados L04 | No mapear loading/error/empty/stale, BUY/SELL/HOLD ni rendimiento a cyan/gold. El color no es canal único. C02 Dashboard/Assets, signals, Foundation estados y estilos globales. |
| `--crypto-text-inverse` / `--crypto-on-accent` `#06232d` | Roles distintos con valor físico compartido; el primero sin uso localizado, el segundo aplicado en texto sobre cyan | `--crypto-on-accent`: botones globales, landing y Trading Mode. `--crypto-text-inverse`: sin consumidor localizado | No fusionar nombres por igualdad de hex; referencias de texto oscuro y botones heredados deben conservar contraste | **CONSERVAR** `--crypto-on-accent`; **REVISAR** el token inverse y su owner/uso antes de retirarlo | L02-C01; botones privados L04 | Una coincidencia de valor no prueba equivalencia semántica. Verificar contraste de texto y estado hover/disabled. C01 §3.4; C02 controles y tokens base. |
| `--crypto-radius-sm`, `--crypto-radius`, `--crypto-radius-lg`; `--crypto-space-1…5` | Geometría existente, no valores corporativos expresamente fijados en Brand System | Radios usados en landing; ningún consumidor de spacing token encontrado en `src/` | Muchos gaps/paddings físicos; `src/material-theme.scss:49–55` declara `--ev-radius:12px` y sombras propias consumidas por `.ev-card` | Radios **CONSERVAR** provisionalmente; spacing **REVISAR** uso antes de introducir en cascadas; no crear escala nueva. **REVISAR** duplicación Material/crypto | L02-C01; L02-C02 solo al confirmar componente repetido | No equiparar `--ev-radius` 12px a `--crypto-radius` 0.875rem (14px) ni unificar sombras de contexto distinto por nombre. No expandir escala. C01 §3.3–3.4; C02 tarjetas/Material. |
| Aliases `--ev-bg/surface/surface-2/text/muted/border/gold/gold-2/gold-glow/success/danger` | Compatibilidad `--ev-*` en `_crypto-tokens.scss:38–49` | Consumidores comprobados: surface/text/muted/border en helpers globales y `evaas-dialog`; demás aliases sin consumidor `var()` localizado | Usos globales `src/styles.scss:98–113, 161–193`; `--ev-shadow` declarado aparte | **MIGRAR_USO** a `--crypto-*` en consumidores concretos; **REVISAR** aliases sin consumidor. No retirar en bloque | L02-C01 | Preservar snackbar, dialog y superficies existentes; borrar alias solo con búsqueda de consumidores en repo + CSS generado y build. C02 fila de aliases y modales. |
| `--crypto-*` aplicados a `app-line-chart` | `CHART_DATA`, separado de tokens de marca | `line-chart.component.html/.scss`: serie A `#111827`, B `#2563eb`, puntos, grilla y leyenda; contrato C01 §5 | La tarjeta, ticks, ejes, escala y colores actuales están descritos en C01/C02 | **DEJAR_INTACTO** | Ninguna migración automática en C03/L02; revisión analítica posterior si se autoriza | No recolorear series/ticks/ejes/grilla ni alterar unidad USD/CLP, `fxRateUsdClp`, timestamps, orden, escalas, `ts_utc` o `America/Santiago`. C01 §5; C02 fila chart/contrato. |
| Tokens UI usados en previews landing | `ILLUSTRATIVE`; no es `CHART_DATA` de mercado | `.pulse-panel__chart`, `.compare-preview`, `.history-preview`; consumen tech/value en CSS | Decoración local gold `rgba(214,179,90,...)`; History no explicita etiqueta esquemática según C02 | **REVISAR** contexto/rotulado; **CONSERVAR** placeholder y tokens UI cuando no sugieran señal financiera | Landing L02-C03/L03 | Mantener claramente ilustrativo; no introducir valores, cotizaciones o leyendas financieras ficticias. C02 fila de previews/decisiones. |

## 5. Compatibilidad y cascada

### Aliases `--ev-*`

| Declaración | Valor o alias actual | Referencia encontrada | Condición para retirar o migrar |
|---|---|---|---|
| `--ev-bg` | `var(--crypto-bg)` | Solo declaración localizada | Migrar cualquier consumer que aparezca en búsqueda ampliada; luego probar cascada/build. |
| `--ev-surface` | `var(--crypto-surface)` | `.ev-surface`; Material `evaas-dialog` container/surface | Migrar esos selectores a `--crypto-surface` en la cápsula que los alinee; comprobar modal y helpers antes de retirar. |
| `--ev-surface-2` | `var(--crypto-surface-soft)` | Solo declaración localizada | Revisar consumidores CSS/HTML generados antes de retirar. |
| `--ev-text` | `var(--crypto-text)` | `.snack-error`, `evaas-dialog` title | Mantener texto de error/dialog legible; cambiar a token canónico junto con la regla consumidora. |
| `--ev-muted` | `var(--crypto-text-muted)` | `evaas-dialog` content | Migrar con validación de contraste en modal. |
| `--ev-border` | `var(--crypto-border)` | `.ev-surface`, acciones de `evaas-dialog` | Migrar junto al componente, verificando borde visible y foco. |
| `--ev-gold`, `--ev-gold-2`, `--ev-gold-glow` | Alias de value/strong y RGBA duplicado `0.22` | Consumidor `var()` no localizado | No conservar como una segunda API gold por inercia; buscar consumers, resolver contexto semántico y retirar solo con prueba de no uso. |
| `--ev-success`, `--ev-danger` | Alias de tokens de estado | Consumidor `var()` no localizado | Mantener estado semántico separado; revisar imports/consumidores antes de retirar. |
| `--ev-primary` | `#003e6b` en `dashboard-shell.component.scss:2` | `object-card.component.scss:26,29` usa `var(--ev-primary, #003E6B)` en icono/título | Resolver ownership y rol del fallback en L04. No asumir que el azul es equivalente a un color del SVG ni que el `:root` local gana la cascada. |
| `--ev-accent` | `#2bd4e0` en shell `:root` | Consumidor no localizado por `var(--ev-accent)` | Revisar; si la intención es interacción, migrar a `--crypto-accent-tech` en shell/registro y eliminar alias solo tras búsqueda y prueba. |
| `--ev-sidebar-width`, `--ev-sidebar-collapsed`, `--ev-topbar-height` | `260px`, `72px`, `56px` | `.ev-sidebar`, estado collapsed y `.ev-topbar` del shell | Son geometría/layout, no tokens de color. Preservar navegación responsive; no renombrar en una migración cromática. |
| `--ev-shadow` | `var(--crypto-shadow)` en `src/styles.scss:58` | `.snack-error`, `.ev-surface`, `evaas-dialog` | Migrar consumidor y alias coordinadamente; distinguir elevación dark del tema Material. |
| `--ev-radius`, `--ev-shadow-1/2` | `12px`, sombras light | `src/material-theme.scss:49–55`, `.ev-card` | Comparar consumidores con radios/sombras crypto antes de consolidar; no unificar si cambia densidad o elevación del contexto. |

`src/material-theme.scss:3–10,34–45` declara temas Material claro/oscuro con `system-variables-prefix: 'ev'`; el mismo espacio `--ev-*` contiene aliases del producto y propiedades locales. Es una **colisión potencial de namespace**, no una cascada ganadora confirmada. `angular.json:33–36` carga Bootstrap, `styles.scss` y luego `material-theme.scss`; a ello se suman estilos encapsulados por componente.

Las superposiciones a inspeccionar en la cápsula dueña son:

- Bootstrap `.card`, `.form-control`, `.form-select`, `.alert-*` y `.btn-*` frente a reglas globales de `_crypto-surfaces.scss`.
- Temas/paletas/material system variables frente a `.evaas-dialog` global (`styles.scss:161–193`) y `create-project.dialog.scss:1–48` con variables `--mdc-*` locales.
- `dashboard-shell.component.scss` `.ev-dialog` blanco frente a la regla Material oscura, y `.ev-card` del componente frente a `.ev-card` de `material-theme.scss`.
- History, Compare y Trading Mode conservan reglas light/gold y después overrides `--crypto-*`; login mantiene variables Sass locales y algunas reglas `--crypto-*`; registro conserva variables EVAAS.

C03 no determina precedencia efectiva en navegador ni borra Bootstrap/Material. L02-C01 debe rastrear propiedad/imports; L02-C02 puede extraer únicamente patrones repetidos cuya equivalencia visual/funcional esté probada; L04 valida migraciones privadas con auth, guards y controles intactos.

## 6. Decisiones abiertas relevantes

1. **Consumidores y retiro de tokens/aliases no usados:** confirmar búsqueda de variables en estilos de dependencias y CSS compilado, especialmente spacing, `text-inverse`, `accent-value-deep`, estados y aliases sin `var()` consumidor. Que no aparezca un consumer en `src/` es evidencia estática limitada, no permiso de eliminación.
2. **Extensiones sin valor corporativo explícito:** `bg-elevated`, surfaces, tonos `*-strong`, `*-deep`, focus/effects, radios y spacing tienen estado técnico documentado según la fuente indicada; solo los valores exactos de Brand System §6 son norma de marca. Definir owner y validar contraste/cascada antes de ajustar valores. No completar con tonos nuevos.
3. **Compatibilidad Material/`--ev-*`:** comprobar si el prefijo de sistema Material y las propiedades EVAAS conviven en output CSS y qué consumidor gana; no se midió estilo computado en C03.
4. **Assets públicos:** la procedencia de `public/logo.png` no está acreditada en C01/C02. Resolver en tarea autorizada de activos; no sustituirlo aquí. La identidad CA aprobada no queda pendiente.
5. **Registro EVAAS y previews:** el endorsement del registro requiere contexto de producto; History preview necesita confirmar rotulado esquemático. No son decisiones de valor de token.
6. **Accesibilidad/cascada:** contraste de foco, hover, disabled, errores y diálogos requiere vista renderizada futura. No se afirma PASS de contraste en fuente estática.
7. **Contrato de gráfica:** C01 registra precios/predicción USD/CLP, stub `fxRateUsdClp=950`, `ts_utc` mostrado en `America/Santiago`, X por índice, Y lineal y escala dinámica compartida RSI/MACD sin unidad visible. Esos límites y la decisión analítica pendiente permanecen sin cambios; cualquier tratamiento cromático requiere revisión analítica explícita.

La regla de gold ya está resuelta por Brand System §6: no se reabre. No se propone identidad, símbolo, color de BUY/SELL/HOLD ni token de gráfico alternativo.

## 7. Orden futuro propuesto para consolidación

1. **L02-C01 · foundation existente:** confirmar ownership de 30 tokens, aliases y consumidores; conservar nombres/valores que ya cumplen; identificar sin consumidor y efectos de import/cascada; no crear una segunda foundation.
2. **L02-C02 · primitivas condicionadas:** revisar duplicación estática de cards, inputs, foco, alertas y diálogos. Consolidar solo si el patrón repetido es realmente equivalente y su cambio reduce duplicación sin degradar Material/Bootstrap, estados, foco o densidad. No abrir una biblioteca general.
3. **L02-C03 / L03 · landing:** migrar únicamente declaraciones locales que deban consumir tokens existentes; revisar cyan/gold decorativo y rotulado esquemático. Mantener rutas, CTA, accesibilidad y reduced-motion.
4. **L04 · superficies privadas:** login/registro, shell, dashboard, Assets, History, Compare, Trading Mode, cards y diálogos. Migrar por rol existente y validar flujos/auth/guards. BUY/SELL/HOLD y estados conservan sus dominios.
5. **Gráficas:** fuera de normalización cromática automática; series, escalas, ejes, unidades, fechas y zona horaria requieren revisión analítica propia y explícita.

## 8. Invariantes, limitaciones y conclusión

- C03 crea solo este Markdown. No edita SCSS/CSS, HTML, TS, assets, configuración, dependencias, tests, Brand Foundation v0.4 ni contratos.
- Se mantienen autenticación, guards, rutas, APIs, señales, métricas, cálculos, comparaciones, FX USD/CLP, timestamps, `ts_utc`, `America/Santiago`, series y pipeline.
- No se importan ni transforman los SVG maestros. Los colores del logo permanecen dentro de `BRAND_LOGO` y separados de UI.
- No se añaden valores ni tokens nuevos. Los valores derivados existentes se identifican como extensiones/referencias de implementación, no como aprobación corporativa.
- No se ejecuta L02, L03 ni L04; no se publica, integra o despliega desde C03.
- La limitación es la ausencia de render/estilos computados en C03. Los consumidores y conflictos descritos son estáticos y señalan dónde debe verificarse la cascada.

**Conclusión:** la foundation ya contiene roles de marca y referencias técnicas suficientes para orientar futuras migraciones sin crear otra paleta. El trabajo inmediato de L02 es verificar ownership, consumidores y aliases; los valores sin uso localizado, geometría, foco/efectos y Material requieren comprobación antes de retirar o normalizar. Las superficies legacy podrán migrar a roles UI existentes cuando corresponda, mientras que estados, señales financieras y datos de gráficas permanecen separados. Este mapa no cierra L01 ni H06.
