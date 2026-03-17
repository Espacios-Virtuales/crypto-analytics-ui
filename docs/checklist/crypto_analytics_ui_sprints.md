# Crypto Analytics UI --- Roadmap de Sprints

Este documento organiza los **sprints de desarrollo de la interfaz
(Angular)** para el proyecto **Crypto Analytics UI**.\
El objetivo es tener un mapa claro de progreso desde el **baseline del
prototipo** hasta un **dashboard analítico funcional**.

------------------------------------------------------------------------

# Sprint 0 --- Baseline y Auditoría

## Objetivo

Congelar el estado inicial del prototipo UI antes de comenzar
transformaciones.

## Checklist

-   [x] Crear repositorio `crypto-analytics-ui`
-   [x] Importar prototipo base
-   [x] Crear ramas `master` y `develop`
-   [x] Ejecutar auditoría con script unix

### Evidencias

-   [x] `audits/00_env.txt`
-   [x] `audits/00_install.txt`
-   [x] `audits/00_dependencies_snapshot.txt`
-   [x] `audits/00_build.txt`
-   [x] `audits/00_tests.txt`

### Evidencia visual

Guardar en:

    docs/baseline/screenshots/

Archivos sugeridos:

-   `00_first_load.png`
-   `01_login.png`
-   `02_dashboard.png`
-   `03_table.png`
-   `04_modal.png`
-   `05_layout.png`

### Resultado

-   [x] UI levanta localmente
-   [x] Build exitoso
-   [x] Tests revisados

------------------------------------------------------------------------

# Sprint 1 --- Rebranding del Proyecto

## Objetivo

Renombrar el proyecto y limpiar referencias heredadas.

## Cambios

-   [x] Renombrar proyecto Angular
-   [x] Renombrar `package.json`
-   [x] Renombrar docker image
-   [x] Limpiar `dist` antiguos

### Archivos impactados

-   `package.json`
-   `angular.json`
-   `docker-compose.yml`
-   `Dockerfile`

### Validaciones

-   [x] `npm install`
-   [x] `npm run build`
-   [x] `ng serve`
-   [x] docker build

------------------------------------------------------------------------

# Sprint 2 --- Sistema de Autenticación

## Objetivo

Integrar autenticación básica con el backend.

## Endpoints

POST /api/v1/auth/login\
GET /api/v1/auth/me

## Checklist

-   [x] LoginComponent funcional
-   [x] AuthService implementado
-   [x] AuthStore persistente
-   [x] Interceptor Authorization
-   [x] Manejo de errores
-   [x] Redirección a dashboard

### Validaciones

-   [x] Login correcto
-   [x] Token guardado en sesión
-   [x] Navegación protegida

------------------------------------------------------------------------

# Sprint 3 --- Conexión con API de Datos

## Objetivo

Consumir endpoints reales del motor de analítica.

## Endpoints

GET /api/v1/assets\
GET /api/v1/latest\
GET /api/v1/history/prices\
GET /api/v1/history/features\
GET /api/v1/history/predictions

## Checklist

-   [x] AssetsService
-   [x] LatestService
-   [x] HistoryService
-   [x] Interfaces TypeScript
-   [x] Manejo de errores API

### Evidencia

-   [x] JSON examples guardados en `docs/api/`
-   [x] Logs de respuesta

------------------------------------------------------------------------

# Sprint 4 --- Dashboard Analítico

## Objetivo

Construir el dashboard principal de monitoreo.

## Componentes

-   [x] Asset selector
-   [x] Timeframe selector
-   [x] Horizon selector
-   [x] Cards de estado
-   [x] Señal de trading
-   [x] Timestamp de datos

### Visualización

Cards ejemplo:

-   Precio actual
-   Señal ML
-   Confianza
-   Horizonte predicción

------------------------------------------------------------------------

# Sprint 5 --- Vista de Activos

## Objetivo

Permitir explorar datos históricos por activo.

## Funciones

-   [ ] Tabla dinámica
-   [ ] Selección de activo
-   [ ] Selección de timeframe
-   [ ] Indicadores calculados

### Datos mostrados

-   Precio
-   Features
-   Predicciones

------------------------------------------------------------------------

# Sprint 6 --- Comparador de Activos

## Objetivo

Comparar múltiples activos simultáneamente.

## Funcionalidades

-   [ ] Multi asset selector
-   [ ] Tabla comparativa
-   [ ] Correlación básica
-   [ ] Diferencia de señal

### Vista

Comparación ejemplo:

  Asset   Signal   Confidence   Horizon
  ------- -------- ------------ ---------
  BTC     BUY      0.82         5m
  ETH     HOLD     0.55         5m
  SOL     SELL     0.77         5m

------------------------------------------------------------------------

# Sprint 7 --- Despliegue

## Objetivo

Desplegar en Vercel

## Elementos

-   [x] Configurar
-   [x] Construir 
-   [x] Testear

------------------------------------------------------------------------

# Sprint 8 --- Preparación para Trading Mode (placeholder)

## Objetivo

Preparar arquitectura para integración futura de trading.

## Elementos

-   [ ] Trading mode flag
-   [ ] Señales explicables
-   [ ] Risk score
-   [ ] Hooks para ejecución futura

------------------------------------------------------------------------

# Estado actual esperado

  Sprint     Estado
  ---------- -------------
  Sprint 0   Completado
  Sprint 1   Completado
  Sprint 2   Completado
  Sprint 3   Completado
  Sprint 4   Completado
  Sprint 5   Pendiente
  Sprint 6   Pendiente
  Sprint 7   Completado
  Sprint 8   Futuro

------------------------------------------------------------------------


