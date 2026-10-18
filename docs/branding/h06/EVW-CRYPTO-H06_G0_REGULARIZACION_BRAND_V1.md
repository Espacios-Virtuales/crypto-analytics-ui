# EVW-CRYPTO-H06 · Regularización G0 para Brand System v1.0

- **Estado:** `G0=PASS_FOR_C01` · autorización operativa registrada.
- **Alcance aprobado:** solo `EVW-CRYPTO-H06-L01-C01`; no aprueba cápsulas posteriores ni promoción a producción.
- **Fecha:** 2026-10-18.
- **Registro de decisión:** Technical Operations → `Decisions!2`, `DEC-CRYPTO-H06-L01-C01-G0-20261018`.
- **Evidencia de autorización:** `Evidence!1722`, `EVD-CRYPTO-H06-L01-C01-G0-20261018`.

## Decisión

El usuario autorizó explícitamente comenzar C01 sobre la base de que Brand System v1.0 FINAL, Tech Book v1.0 y los SVG maestros ya habían sido verificados. La autorización incluye crear la rama desde `develop`, auditar e inventariar las superficies existentes, ejecutar las validaciones y entregar un commit documental.

C01 queda limitado a documentación de auditoría. No se autorizó cambiar CSS, TypeScript, HTML, activos, comportamiento, modelos ni contratos. C02 en adelante permanece fuera de esta autorización. No hay autorización para publicar, desplegar o promover a producción.

La decisión Workboard registra `APPROVED_FOR_C01` y estado `RESOLVED`. Esto acredita la aprobación operativa solicitada; los datos administrativos que no fueron proporcionados no se inventan ni bloquean el trabajo.

## Campos G0 y regularización administrativa

| Campo | Evidencia y estado |
| --- | --- |
| Aprobación para C01 | Aprobación explícita del usuario en la conversación del 2026-10-18; registrada como `DEC-CRYPTO-H06-L01-C01-G0-20261018`. La identidad nominal no está expuesta en el registro de conexión. |
| Responsable técnico | El milestone legado conserva `David Utreras`, pero no se recibió confirmación para esta carga. Seguimiento administrativo no bloqueante. |
| Revisor | No se nombró revisor en la autorización. Revisión ordinaria pendiente antes de integrar. |
| Rama base | `develop`, sincronizada con `origin/develop` después de `fetch` y `pull --ff-only`. SHA: `c55c444595300e95c8ee4c2a0ce82fa335331d42`. |
| Rama de trabajo | `feature/evw-crypto-h06-l01-c01-style-audit`, creada desde el SHA anterior y registrada en `Branches!70` como `BR-EVW-CRYPTO-H06-L01-C01-01`. |
| Referencia de producto | No se proporcionó una URL runtime. Para esta auditoría de fuentes se usaron los enlaces normativos de Drive y el baseline versionado `docs/baseline/screenshots/`; se documenta la limitación de inspección runtime en el inventario C01. |
| Acceso normativo | Brand System v1.0 FINAL y Tech Book v1.0 fueron recuperados y verificados durante el preflight; esta ejecución no repitió su recuperación. Hashes y URI quedaron registrados en `Evidence!1723:1724`. |
| SVG maestros | Ambos activos verificados previamente como maestros vigentes; los SHA-256 de sus bytes raw quedaron registrados en `Evidence!1725:1726`. |

Los campos de responsable confirmado, revisor nominal y URL runtime quedan pendientes de regularización. La autorización operativa del usuario indica expresamente que esas regularizaciones históricas no deben detener C01.

## Fuentes normativas y activos

Los hashes de documentos corresponden a SHA-256 del texto UTF-8 recuperado en el preflight. Los hashes SVG corresponden a SHA-256 de los bytes raw recuperados, sin modificar los maestros.

| Fuente | URI Drive | Identificador | SHA-256 |
| --- | --- | --- | --- |
| `BRAND_SYSTEM_CRYPTO_ANALYTICS_v1.0_FINAL.md` | [Brand System v1.0 FINAL](https://drive.google.com/file/d/1W81halb3lPVRML_focAVrUNbLhqBoqb_/view) | `1W81halb3lPVRML_focAVrUNbLhqBoqb_` | `01d35f4251bf9199424f638b8b3ca6b4468a4bbfac38073bc64147fa4d6f4e86` |
| `CRYPTO_ANALYTICS_TECH_BOOK_BRANDING_IMPLEMENTATION_v1.0.md` | [Tech Book v1.0](https://drive.google.com/file/d/1o3CSERWJZJgLova7aMIvvMUkPKo8A5C3/view) | `1o3CSERWJZJgLova7aMIvvMUkPKo8A5C3` | `fa3edc68240d663a76440716890f19efce897fc32c7cdcf860c3c3f5c7107f0a` |
| `CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg` | [Maestro color](https://drive.google.com/file/d/1R35ShruEXm4wkIaJYWdtzqhaKfehEbk1/view) | `1R35ShruEXm4wkIaJYWdtzqhaKfehEbk1` | `f763b386a2ead6e1214c5af6047c65c2cc298764b8b4065691baef009afdb5f1` · 2,210 bytes |
| `CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0_MONO.svg` | [Maestro monocromo](https://drive.google.com/file/d/1CD7NErVxuFAsO8FjIhnXgfBlg1yeI8Zr/view) | `1CD7NErVxuFAsO8FjIhnXgfBlg1yeI8Zr` | `e3903268c28b173aa17435507bd694ea44d892e9e66b2b939ad3c9570305d9c0` · 1,069 bytes |

Referencias de gobernanza ya verificadas: el registro de activos v1.0 clasifica ambos SVG como `Maestro vigente`; la decisión de release indica `RELEASE DOCUMENTAL APROBADO · IMPLEMENTACIÓN TÉCNICA PENDIENTE`; la traza de adopción dice `REFERENCIA CANÓNICA ADOPTADA · MAESTRO VECTORIAL GENERADO · SIN INTEGRACIÓN EN GIT`. Estas referencias documentales no sustituyen la autorización técnica G0 de C01.

## Baseline Git

| Dato | Evidencia |
| --- | --- |
| Repositorio | `https://github.com/Espacios-Virtuales/crypto-analytics-ui` |
| Estado antes de crear la rama | `git status --short` vacío en `develop`. |
| `develop` local y `origin/develop` | Ambos en `c55c444595300e95c8ee4c2a0ce82fa335331d42` después de `git fetch origin --prune` y `git pull --ff-only origin develop`. |
| Commit base de C01 | `c55c444595300e95c8ee4c2a0ce82fa335331d42`; no se congela para cápsulas futuras. |

## Registros Workboard actualizados

Workboard: [EVAAS Workboard · Technical Operations](https://docs.google.com/spreadsheets/d/1MU-iRQKXiy_spP5-EBFYzf7uNaTB6VBwljAtHLV1urE/edit).

| Hoja y fila | Actualización |
| --- | --- |
| `Repositories!16` · `REP-CRYPTO-UI` | Registrado SHA base observado de `develop`. |
| `Milestones!57` · `EVW-CRYPTO-H06` | Sustituido alcance heredado por implementación incremental del Brand System v1.0 FINAL; H06 activo y producción condicionada a validación/revisión. Se preservan los campos históricos de responsable y fechas para regularización posterior. |
| `Loads!180` · `EVW-CRYPTO-H06-L01` | Baseline y alcance actualizados; L01 en curso y la autorización se limita a C01. |
| `Capsules!502` · `EVW-CRYPTO-H06-L01-C01` | Título, alcance, referencia normativa, estado y fecha de inicio actualizados. |
| `Decisions!2` | Aprobación operativa G0 para C01 solamente. |
| `Evidence!1722:1727` | Aprobación, Brand System, Tech Book, SVG color, SVG monocromo y baseline Git con sus URI/hashes. |
| `Branches!70` | Rama, base SHA, target `develop` y estado activo; el commit final de C01 queda como dato de cierre en Workboard. |

No se ejecutaron ni actualizaron C02/C03, Branding Operations u otros hitos de H06.
