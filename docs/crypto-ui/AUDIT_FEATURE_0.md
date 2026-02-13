# Auditoría Feature 0 --- Baseline UI

## Propósito

Congelar el estado inicial del prototipo UI con evidencia reproducible:

-   Evidencia técnica (logs unix)
-   Evidencia de dependencias y build
-   Evidencia visual (capturas)

------------------------------------------------------------------------

## Evidencia técnica

-   `audits/00_env.txt`
-   `audits/00_install.txt`
-   `audits/00_dependencies_snapshot.txt`
-   `audits/00_build.txt`
-   `audits/00_tests.txt`

------------------------------------------------------------------------

## Evidencia visual

Ubicación: `docs/baseline/screenshots/`

Capturas sugeridas:

-   `00_first_load.png`
-   `01_login.png`
-   `02_dashboard.png`
-   `03_table.png`
-   `04_modal.png`
-   `05_layout.png`

------------------------------------------------------------------------

## Resultado

-   UI levanta localmente: ✅
-   Build producción: ✅
-   Tests: ❌

------------------------------------------------------------------------

## Hallazgos Técnicos

### 1. Entorno

-   Node: v22.16.0
-   npm: 10.9.2

Observación: El `package.json` declara compatibilidad con `node 20.x`.\
Se ejecutó correctamente con Node 22, pero se generan warnings
`EBADENGINE`.

------------------------------------------------------------------------

### 2. Build

-   Compilación exitosa.
-   Advertencia de presupuesto de bundle:

Initial bundle: 908.24 kB\
Budget configurado: 500 kB

No bloquea el build, pero representa deuda de optimización futura.

------------------------------------------------------------------------

### 3. Tests

Los tests fallan por inconsistencias entre specs y código actual:

-   `SoftwareService` no contiene método `createProject`.
-   Referencias a `API.provisions` inexistentes.
-   Parámetro con tipo implícito `any`.

Conclusión: Los tests están desalineados respecto al estado real del
servicio.

------------------------------------------------------------------------

## Deuda Técnica Identificada

-   Ajustar engines de Node en `package.json` o estandarizar versión del
    equipo.
-   Reducir tamaño inicial del bundle.
-   Actualizar o estabilizar suite de tests antes de nuevas features.

------------------------------------------------------------------------

## Estado del Baseline

El baseline queda técnicamente reproducible para build de producción. La
suite de tests requiere estabilización antes de integrar nuevas
capacidades críticas.
