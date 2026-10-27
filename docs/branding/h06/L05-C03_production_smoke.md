# EVW-CRYPTO-H06-L05-C03 · Smoke productivo controlado

## Trazabilidad y conclusión

- Base obligatoria verificada: `develop` / `HEAD` inicial `81bffa2e7542827b863b4f699d452a219d327077`.
- Rama: `feature/evw-crypto-h06-l05-c03-production-smoke`.
- Fecha de comprobación: `2026-10-27 20:43 UTC`.
- Resultado: **PRODUCTION_PASS para el smoke público y la conectividad de API; NOT_VALIDATED_AUTH para el recorrido autenticado.** No se encontró un bloqueante en las superficies públicas evaluadas.
- H06 **no está desplegado** en el production deployment identificado. El runtime sirve un commit de `master` anterior a los cambios H06 integrados en `develop`.
- Esta cápsula es documental. No se modificó código, configuración, datos, servicios, contratos ni infraestructura; no se ejecutaron operaciones comerciales ni de escritura.

## Entorno productivo identificado

Vercel identifica el proyecto `crypto-analytics-ui`, con dominio de producción verificado `https://crypto-analytics-ui.vercel.app`. La aplicación responde bajo el alias público y el HTML se renderiza en Chrome Headless.

| Dato | Evidencia |
| --- | --- |
| Proveedor | Vercel; proyecto Angular `crypto-analytics-ui`. |
| URL frontend de producción | `https://crypto-analytics-ui.vercel.app/` |
| Alias | `crypto-analytics-ui.vercel.app` asignado al último deployment `target=production`, `state=READY`. |
| Deployment efectivo | `dpl_CCe1zZ6bRPmKePMbfb5yTwS2ZXt5`; deployment URL `crypto-analytics-f70vgupum-davids-projects-2b733fec.vercel.app`. |
| Fuente | Repositorio `Espacios-Virtuales/crypto-analytics-ui`, rama `master`, SHA `c55c444595300e95c8ee4c2a0ce82fa335331d42`, mensaje `update url`. |
| Creación / listo según Vercel | `2026-10-18 00:50:30 UTC` / `2026-10-18 00:50:55 UTC`. |
| Observación HTTP/runtime | `2026-10-27 20:43 UTC`; Chrome Headless `137.0.7151.55`. |

La versión productiva difiere de la base de esta cápsula (`develop`, `81bffa2…`). `c55c444…` es ancestro de `develop`, pero los cambios H06 relevantes aparecen después de ese SHA. No se infiere equivalencia ni publicación de H06 por la sola presencia de una landing funcional.

## Frontend y navegación pública

Las solicitudes directas y recargas entregaron `HTTP 200 text/html` para las rutas. La aplicación Angular ejecutó el router tras la respuesta inicial.

| Ruta | HTTP directo | Resultado observado en navegador | Clasificación |
| --- | --- | --- | --- |
| `/` | 200 | Landing renderizada; ocho encabezados de sección, navegación Analiza/Compara/Sigue/Flujo e ingreso visibles. El enlace Ingresar se pulsó; navegó a `/login`, donde apareció el formulario. | PRODUCTION_PASS |
| `/login` | 200 | Título `Ingresar`, formulario y botón `Entrar` renderizados en acceso directo/recarga. | PRODUCTION_PASS · versión anterior a H06 |
| `/health` | 200 | Diagnóstico UI renderizado. Al pulsar `Probar conexión`, respondió `API READY` y `Conexión exitosa`. | PRODUCTION_PASS |
| `/dashboard` | 200 inicial | El router navegó a `/login` sin sesión. | PRODUCTION_PASS · protección sin sesión comprobada |
| `/dashboard/assets` | 200 inicial | El router navegó a `/login` sin sesión. | PRODUCTION_PASS · protección sin sesión comprobada |
| `/dashboard/history` | 200 inicial | El router navegó a `/login` sin sesión. | PRODUCTION_PASS · protección sin sesión comprobada |
| `/dashboard/compare` | 200 inicial | El router navegó a `/login` sin sesión. | PRODUCTION_PASS · protección sin sesión comprobada |
| `/dashboard/trading` | 200 inicial | El router navegó a `/login` sin sesión. | PRODUCTION_PASS · protección sin sesión comprobada |

Las rutas privadas responden inicialmente con el fallback SPA de Vercel (`text/html`, 200), y luego el guard cliente redirige a `/login`. Por eso el 200 HTTP por sí solo no se interpretó como acceso a una vista privada.

### Recursos, consola y rutas SPA

- JS y CSS de la app, `favicon.ico`, `/logo.png`, fuentes Roboto y Bootstrap Icons respondieron `200`; recursos repetidos con caché respondieron `304`.
- En el Chrome aislado usado para esta cápsula no hubo requests fallidos, errores de consola del sitio ni excepciones JavaScript.
- Landing y login cargaron por URL directa; los deep links privados conservaron fallback HTTP y el guard llevó a login. `/health` cargó por URL directa y permaneció en esa ruta tras la consulta de API.
- Se detectó un resultado contaminado al inicio porque el puerto CDP `9222` ya pertenecía a otro Chrome y abrió `localhost/leadsun`. Ese resultado no se atribuyó al producto. El recorrido final se repitió en un perfil y puerto CDP aislados: no reprodujo la navegación ajena; sus resultados son los de esta acta.

## Backend y URL de API

La referencia `https://crypto.evaas.space/api/v1` pertenece a la API configurada en `src/environments/environment.production.ts`; no es el frontend. El endpoint respondió en el momento de la prueba y el botón de `/health` realizó un GET real a `/ready`.

| Endpoint seguro de lectura | HTTP | Respuesta sanitizada | Resultado |
| --- | ---: | --- | --- |
| `https://crypto.evaas.space/api/v1/health` | 200 | `service=crypto-pilot-api`, `status=ok`, `version=v1` | PRODUCTION_PASS |
| `https://crypto.evaas.space/api/v1/ready` | 200 | `status=READY`; database, features, predictions y prices `ok`; coherencia temporal `OK` | PRODUCTION_PASS |
| GET ejecutado por el UI `/health` → `/api/v1/ready` | 200 | UI cambió de `Idle` a `Online`, `API READY` y `Conexión exitosa` | PRODUCTION_PASS |

El contrato histórico [api_endpoints_contract.md](../../fase3/api_endpoints_contract.md) también enumera `https://crypto.evaas.lat/api/v1`. Esta cápsula no asumió que esa referencia fuese vigente ni la utilizó: la referencia `.space` está en la configuración productiva y se confirmó desde el runtime desplegado y con respuestas JSON de health/ready. No se probaron endpoints protegidos ni se enviaron payloads.

## Comparación visual observable: producción y H06

La inspección del DOM renderizado evidencia una versión anterior al Brand System H06 integrado en `develop`:

- Landing productiva presenta el monograma tipográfico `CA`, el titular «Lectura analítica del mercado, con contexto para decidir.» y el CTA actual `Ingresar`. El landing H06 integrado usa el activo SVG de marca y la promesa «Lee el mercado con contexto.»; la navegación móvil y motion de H06 tampoco quedan demostrados en este smoke de producción.
- Login productivo aún expone el encabezado `Crypto Analytics UI` y el texto `Anliza, predice y acciona.`. Login H06 integrado usa la identidad `Crypto Analytics` y el copy aprobado «Lee el mercado con contexto.».
- No se pudo comparar shell/dashboard/tablas/trading en estado autenticado. Esos componentes de H06 se clasifican `DEVELOP_VALIDATED` según actas L04/L05 anteriores, no como producción validada.

Estas son diferencias de versión verificadas, no regresiones atribuibles a H06 ni bloqueantes del smoke público. No se promovió ni desplegó ningún cambio.

## Recorrido autenticado y protección post-logout

No había una sesión de prueba autorizada proporcionada para esta ejecución. No se intentó autenticar, crear usuarios, recuperar credenciales ni persistir tokens/datos.

- `/ → /login`: PRODUCTION_PASS, CTA pulsado y formulario visible.
- `/login → /dashboard → /dashboard/assets → /dashboard/history → /dashboard/compare → /dashboard/trading → logout`: `NOT_VALIDATED_AUTH` por ausencia de sesión autorizada.
- Protección privada con contexto sin sesión: PRODUCTION_PASS; cada ruta privada directa comprobada regresó al login.
- Protección después de un logout autenticado: `NOT_VALIDATED_AUTH`; no equivale a afirmar que el logout productivo haya fallado.

## Hallazgos y pendientes preservados

### BLOCKER

Ninguno comprobado en el smoke público.

### MINOR

No se crea ningún MINOR nuevo. Se mantienen los cuatro hallazgos de L05-C01 (MINOR-01–04) sin reabrirlos.

### Controles pendientes de L05-C02

Se conservan los tres `NOT_VALIDATED` previos sin convertirlos en tareas nuevas: Landing tablet (header/hero/navegación), medición DOM de overflow a 768 px y estados vacíos. Este smoke no cambia su alcance.

### NOT_VALIDATED

- Smoke autenticado de Dashboard, Assets, History, Compare y Trading Mode; cuenta/controles autenticados y logout.
- Reintento de ruta privada después de un logout real. Sólo se verificó la redirección al login sin sesión.
- Comparación de comportamiento/branding de superficies privadas productivas frente a H06; el guard impidió llegar a ellas sin sesión autorizada.

## Validación técnica y conclusión

- `git diff --check`: PASS (acta documental únicamente).
- Build/test: no repetidos; se reutiliza el baseline `npm run build` PASS y `npm test` 52/52 de L05-C01/L05-C02. No hubo cambio de código que justificara repetirlos.
- Dependencias, contratos, configuración y servicios: sin cambios.
- No hubo registros, órdenes, mutaciones, push, merge, despliegue ni limpieza de ramas.

El estado comprobado es **PRODUCTION_PASS del recorrido público, deep links, recursos estáticos y salud/ready de API; NOT_VALIDATED_AUTH para toda actividad que requiere sesión**. El deployment productivo identificado sirve `master@c55c444…`, anterior a H06 en `develop@81bffa2…`; por tanto, H06 no se declara productivo. No se encontró un bloqueante en el ámbito público evaluado.
