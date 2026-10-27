# EVW-CRYPTO-H06-L05-C05 · Consolidación Brand Foundation y cierre de H06

## Trazabilidad y conclusión

- Base obligatoria: `develop` sincronizado con `origin/develop` en `1d9f710f0c6411622f2791a097b56b9762c9880d`.
- C04: `d80368f903d1a33f396b14d6c39f6ac9addcd944` es ancestro de `develop`.
- Rama C05: `feature/evw-crypto-h06-l05-c05-brand-foundation-closure`.
- Resultado: **cierre documental de H06 con FOUNDATION v1.0 y limitaciones explícitas**. Sólo cambian esta acta y la foundation; el código/configuración/dependencias y la evidencia integrada permanecen intactos.
- Interpretación de estado: H06 está **IMPLEMENTED** en `develop`; está **VALIDATED** según el alcance y pendientes de esta acta; H06 **no está acreditado como RELEASED**.

## Estado de producción comprobado

Comprobación pública el `2026-10-27 21:37–21:38 UTC`:

| Recurso | Verificación actual | Evidencia y límite |
| --- | --- | --- |
| Frontend `https://crypto-analytics-ui.vercel.app/` | `HTTP/2 200`, `text/html`, `server: Vercel`; `last-modified: Sun, 18 Oct 2026 00:59:05 GMT`; `x-vercel-cache: HIT`; `age: 851928`. | La página pública está disponible, pero la respuesta no identifica SHA. La antigüedad de caché impide usar esos headers para inferir una revisión o despliegue actual. |
| API `https://crypto.evaas.space/api/v1/health` | GET JSON con `service=crypto-pilot-api`, `status=ok`, `version=v1`. | Dirección de API, no frontend. Endpoint de lectura/health responde con estado OK. |
| API `https://crypto.evaas.space/api/v1/ready` | GET JSON con `status=READY`; checks reportan `ok` y coherencia temporal `OK`. | Ruta segura de readiness ya descubierta y acreditada en L05-C03; respuesta sanitizada. |

La última identificación del proveedor documentada en [L05-C03](L05-C03_production_smoke.md) atribuyó el alias de producción de Vercel al deployment `dpl_CCe1zZ6bRPmKePMbfb5yTwS2ZXt5`, fuente `master@c55c444595300e95c8ee4c2a0ce82fa335331d42`, listo el 18-oct-2026. En C05 se volvió a comprobar la disponibilidad del alias y la API, pero no se pudo consultar el panel/API de Vercel: Vercel CLI no está disponible en este entorno. La evidencia pública tampoco expone el SHA. Por tanto, `master@c55c444…` queda como **última versión identificada por proveedor, no confirmación nueva del deployment vigente**. No se afirma que la producción haya cambiado ni que H06 esté publicado.

La configuración `src/environments/environment.production.ts` confirma que `https://crypto.evaas.space/api/v1` es la base de API; no es el dominio frontend. Las diferencias de marca documentadas por C03 corresponden a la versión entonces inspeccionada, no se elevan aquí a regresión ni a comparación visual actual de H06.

## Matriz de cierre L01–L05

La disponibilidad se verificó en el árbol de la base C05. Los estados resumen las actas existentes; esta cápsula no repite pruebas, auditorías ni capturas.

| Tramo | Actas disponibles | Cierre/evidencia acreditada |
| --- | --- | --- |
| L01 · Inventario y decisiones | [C01](L01-C01_visual_inventory.md), [C02](L01-C02_visual_semantics.md), [C03](L01-C03_token_map.md) | Inventario de superficies y deuda, semántica visual, mapa de 30 tokens, fuentes y decisiones de migración. Base documental de la implementación. |
| L02 · Foundation y landing | [C01](L02-C01_foundation_consolidation.md), [C02](L02-C02_visual_primitives.md), [C03](L02-C03_branded_landing.md) | Foundation SCSS y primitivas, landing con promesa y SVG CA, inspecciones visuales desktop/móvil, navegación y validaciones técnicas por acta. |
| L03 · Navegación y lenguaje de producto | [C01](L03-C01_spa_navigation.md), [C02](L03-C02_reveal_motion.md), [C03](L03-C03_reduced_motion.md), [C04](L03-C04_product_visual.md), [C05](L03-C05_cyan_gold_hierarchy.md) | Navegación SPA/teclado, movimiento normal y reducido, visuales de producto, jerarquía cyan/gold y continuidad desktop/móvil. |
| L04 · Superficies autenticadas | [C00](L04-C00_login_brand.md), [C01](L04-C01_shell_brand.md), [C02](L04-C02_dashboard_brand.md), [C03](L04-C03_data_views_brand.md), [C04](L04-C04_trading_brand.md), [C05](L04-C05_semantic_validation.md) | Login, shell/sidebar/topbar, Dashboard, Assets, History, Compare y Trading Mode; evidencia visual y pruebas funcionales/accesibles, estados y separación financiera. |
| L05 · Validación y deuda | [C01](L05-C01_technical_validation.md), [C02](L05-C02_visual_accessibility_validation.md), [C03](L05-C03_production_smoke.md), [C04](L05-C04_technical_cleanup.md), C05 (esta acta) | Build y 52 pruebas, visual/accessibilidad con pendientes, smoke público y API en production con auth no validado, limpieza documental sin código; foundation y cierre aquí. |

Capturas L02–L05 permanecen en [`screenshots/`](screenshots/); L05-C02 contiene las nueve evidencias tablet y las L03/L04 preservan los pares antes/después. C05 no altera ni duplica activos de evidencia.

## Decisiones de identidad consolidadas

- La foundation v0.4 se actualiza a **Brand Foundation v1.0**, preservando el historial de versiones y el carácter experimental original de `BRAND-DEC-001` y `BRAND-DEC-002`.
- La promesa es «Lee el mercado con contexto.»; la esencia es lectura analítica y contextual del mercado.
- DARK, CYAN, GOLD y LIGHT conservan los valores y roles descritos en [la foundation](../CRYPTO_ANALYTICS_BRAND_FOUNDATION.md). Se distinguen los cinco valores canónicos UI, los tokens de soporte, las extensiones técnicas y los tres colores propios del SVG.
- **Cyan = tecnología/interacción; gold = valor/jerarquía editorial puntual.** La división preserva una lectura consistente de navegación/foco y énfasis sin usurpar señales de producto. Gold no representa BUY, éxito financiero, ganancia, rentabilidad, alza ni éxito predictivo.
- Señales BUY/SELL/HOLD, rendimiento, estados operacionales y datos de gráficas mantienen sus familias semánticas independientes. La separación está acreditada en [L04-C05](L04-C05_semantic_validation.md).
- Trading Mode presenta análisis, señales, contexto e información externa, pero no ejecuta órdenes ni constituye recomendación financiera.
- Se añade `BRAND-DEC-003` como adopción de H06: `IMPLEMENTED` y validada con limitaciones. No se declara aprobación comercial, societaria o legal. Tipografía/escala extendida, iconografía complementaria, ilustración/fotografía y evolución institucional quedan abiertos a decisiones futuras controladas.

## Evidencia y validaciones reutilizadas

| Aspecto | Resultado consolidado | Fuente y alcance |
| --- | --- | --- |
| Build producción | PASS; bundle inicial raw `799.79 kB`, referencia de seguimiento y bajo el límite de warning `800 kB`. | L05-C01/C02. C04 y C05 sólo documentales; baseline reutilizado, sin rebuild. |
| Pruebas unitarias | PASS, `52/52`. | L05-C01/C02; mismo baseline integrado. C05 no repite la suite. |
| Warnings | Cuatro warnings de presupuesto SCSS conocidos en login, home, compare y trading-mode; sin evidencia de warnings nuevos en el baseline. | L05-C01/C02. El harness de Karma también registró un 404 de fuente Bootstrap Icons, sin impedir el PASS. |
| Whitespace | C05 `git diff --check`: PASS. | Ejecutado para los documentos de esta cápsula. |
| Semántica financiera | PASS en superficies cubiertas: cyan/gold no sustituye BUY/SELL/HOLD, rendimiento ni disponibilidad. | L03-C05 y L04-C05; fórmulas y servicios sin cambios. |
| Accesibilidad y responsive | PASS en combinaciones con evidencia. Contraste WCAG AA de los pares medidos; teclado/foco y reduced-motion acreditados por L03/L04. | C02 y actas L03/L04. No significa cobertura total; pendientes abajo. |
| Limpieza C04 | PASS documental, ninguna eliminación de código productivo. | L05-C04. Assets de marca y validación permanecen intactos. |
| Producción | Frontend Vercel `200`; health/ready API GET responden con estado válido en la comprobación actual. SHA frontend actual no expuesto por respuesta pública. | L05-C03 conserva el último SHA atribuido por Vercel; C05 comprueba disponibilidad, no una nueva versión de deployment. |

Los cuatro warnings SCSS y el bundle cercano al umbral no se alteraron. No se agregaron dependencias. Las capturas y mediciones existentes se reutilizaron porque C05 sólo consolidó documentación y no hubo cambio visual.

## Deuda residual preservada

Se mantienen una sola vez los cuatro MINOR de [L05-C01](L05-C01_technical_validation.md); C02–C05 no los vuelven a clasificar como nuevos:

| ID | Deuda | Estado en cierre |
| --- | --- | --- |
| MINOR-01 | Dashboard conserva tonos financieros físicos accesibles para BUY/positivo, SELL/negativo y HOLD/neutral. | Registrado; sin cambio visual ni de semántica. |
| MINOR-02 | Helpers gold heredados; parte de los selectores no tiene consumidor estático localizado. C04 confirmó un consumidor externo para `.evaas-dialog` y retuvo los demás ante dudas de compatibilidad. | Registrado; conservar; sin limpieza en C05. |
| MINOR-03 | Node local `v24.21.0` queda fuera de `engines.node` (`^20.19.0 || ^22.12.0`). | Registrado; build/tests previos pasan; entorno no modificado. |
| MINOR-04 | Enlace simbólico autorreferente `node_modules/node_modules` hace fallar `npm ls --depth=0`. | Registrado; no se modificó `node_modules` ni se instalaron paquetes. |

### Validaciones que siguen NOT_VALIDATED

1. L05-C02: header, hero y navegación de landing a 768 px.
2. L05-C02: medición DOM explícita del overflow horizontal de página a 768 px (la inspección de capturas no reemplaza la medición).
3. L05-C02: estados vacíos mediante fixtures controlados en las superficies que los contemplan.
4. L05-C03: recorrido autenticado en producción y comprobación de que una ruta privada permanece protegida tras logout; no había sesión autorizada. No se crearon ni almacenaron credenciales.
5. C05: SHA/deployment actual de Vercel no confirmado independientemente en este entorno; la respuesta pública no lo expone y Vercel CLI no estaba disponible. Último SHA identificado por proveedor: `master@c55c444…` según L05-C03.

Estos puntos son límites de cobertura y verificación, no defectos demostrados ni motivo para cambiar el alcance de C05. No se reabren como trabajo nuevo.

## Estado y condiciones de la próxima liberación

| Estado | Conclusión |
| --- | --- |
| **IMPLEMENTED** | Sí. La implementación H06 está integrada en `develop`; C04 es ancestro de la base actual. Esto no implica publicación. |
| **VALIDATED** | Sí, para la evidencia técnica, funcional, visual y accesible registrada en L01–L05; validación parcial en los cinco límites `NOT_VALIDATED` anteriores. |
| **RELEASED** | No acreditado para H06. Producción respondió correctamente a checks públicos, pero la última versión atribuida por proveedor es `master@c55c444…`, anterior a H06; C05 no pudo confirmar un SHA actual del alias. |

Estrategia acordada para una operación posterior, fuera de esta cápsula:

1. No crear preview adicional.
2. Integrar manualmente `develop → master`.
3. Antes del push autorizado, ejecutar build y suite, comprobar el SHA de integración y revisar los invariantes/versiones.
4. El push autorizado a `master` inicia la publicación automática de Vercel.
5. Tras publicar, verificar deployment/SHA, ejecutar smoke público y API, y completar el recorrido autenticado con sesión autorizada, incluido logout y protección posterior.
6. Conservar una referencia recuperable al deployment/commit anterior para rollback.

No se ejecutó ninguna integración ni liberación en C05: sin push, merge, preview, deploy o cambios en `master`.

## Cambios y validación de C05

- Archivos: `docs/branding/CRYPTO_ANALYTICS_BRAND_FOUNDATION.md` y este acta.
- Sólo documentación; no cambian código de producción, configuración, contratos, servicios, dependencias, presupuestos ni activos.
- Se reutiliza el baseline build PASS y tests PASS 52/52 de L05-C01/C02. No se repitieron porque no hay cambio ejecutable.
- `git diff --check`: PASS.
- Integridad de capturas, SVG oficial y actas anteriores: intacta.

## Conclusión

La Brand Foundation queda consolidada como versión 1.0 implementada en H06, con identidad, roles, semántica, aplicación de producto y decisiones históricas trazables. El trabajo de H06 está implementado y sus verificaciones disponibles están acreditadas, incluyendo sus límites sin resolver. La salud actual de las URLs públicas no prueba la versión del frontend; H06 no se declara liberado mientras la versión productiva no esté confirmada y publicada mediante la operación manual acordada.
