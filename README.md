# Crypto Analytics UI

Interfaz web oficial del ecosistema **Crypto Analytics**.\
Este proyecto representa la capa de visualización, interacción y
análisis para los datos procesados por la API de analítica y predicción
de criptomonedas.

------------------------------------------------------------------------

## 🎯 Propósito del Proyecto

Crypto Analytics UI permite:

-   Visualizar precios históricos y datos en tiempo real
-   Analizar indicadores técnicos (RSI, EMA, MACD, volatilidad, etc.)
-   Explorar predicciones generadas por modelos
-   Comparar activos digitales
-   Preparar la evolución hacia un entorno de trading inteligente

Esta UI consume datos desde la API backend desarrollada en Flask y
conectada a PostgreSQL / TimescaleDB.

------------------------------------------------------------------------

## 🧩 Rol dentro del Ecosistema

Arquitectura general:

Frontend (Angular / Web UI) ↓ API Flask (crypto-analytics-api) ↓
PostgreSQL + TimescaleDB ↓ Motor de features + predicción

Este repositorio contiene exclusivamente la capa frontend.

------------------------------------------------------------------------

## 🛠️ Stack Tecnológico

-   Angular
-   TypeScript
-   RxJS
-   SCSS
-   Docker (para despliegue)
-   Nginx (opcional para producción)

------------------------------------------------------------------------

## 📦 Instalación Local

### 1. Clonar repositorio

``` bash
git clone https://github.com/tu-org/crypto-analytics-ui.git
cd crypto-analytics-ui
```

### 2. Instalar dependencias

``` bash
npm install
```

### 3. Ejecutar en entorno local

``` bash
npm start
```

Por defecto se levantará en:

    http://localhost:4200

------------------------------------------------------------------------

## ⚙️ Configuración de Entorno

Las variables de entorno pueden configurarse en:

    src/environments/environment.ts

Ejemplo:

``` ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://crypto.evaas.lat/api/v1'
};
```

Para producción:

    src/environments/environment.prod.ts

------------------------------------------------------------------------

## 🧪 Comandos Útiles

### Build producción

``` bash
npm run build
```

### Tests

``` bash
npm test
```

### Lint

``` bash
npm run lint
```

------------------------------------------------------------------------

## 🐳 Docker (Opcional)

Build de imagen:

``` bash
docker build -t crypto-analytics-ui .
```

Run:

``` bash
docker run -p 80:80 crypto-analytics-ui
```

------------------------------------------------------------------------

## 🔐 Integración Técnica Inicial

La UI consume los siguientes endpoints principales:

-   `/history/prices`
-   `/history/features`
-   `/history/predictions`
-   `/latest`
-   `/assets`

Todos requieren parámetros como:

-   asset
-   timeframe
-   from / to
-   limit
-   order

Ejemplo:

    GET /api/v1/history/prices?asset=BTC&timeframe=1m&limit=100

------------------------------------------------------------------------

## 📁 Estructura Base Recomendada

    src/
      app/
        core/
        services/
        features/
        shared/
      assets/
      environments/

------------------------------------------------------------------------

## 🚀 Roadmap Evolutivo

-   Consolidación dashboard analítico
-   Módulo compare multi-asset
-   Señales visuales interpretables
-   Trading mode
-   Integración con motor predictivo avanzado

------------------------------------------------------------------------

## 🧠 Filosofía Técnica

Este proyecto no es solo una interfaz visual. Es la capa donde los datos
se vuelven comprensión.

Cada módulo debe: - Ser explicable - Ser auditable - Mantener separación
clara entre UI y lógica de datos - Facilitar escalabilidad futura

------------------------------------------------------------------------

## 📄 Licencia

Proyecto privado -- uso interno / cliente.
