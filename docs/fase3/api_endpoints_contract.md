# Crypto Analytics API — UI Integration Contract (Fase 3)

Base URL producción:

```text
https://crypto.evaas.lat/api/v1
```

---

# 🌐 Visión Operacional

La plataforma ya no trabaja como un único flujo lineal por activo.

El backend opera como:

```text
multi-activo
×
multi-timeframe
×
multi-horizon
```

Cada combinación contiene un estado independiente de madurez operacional.

La interfaz debe interpretar estos estados y no asumir que un activo completo está “ready” o “not ready”.

---

# 🧭 Arquitectura Viva del Pipeline

```text
scheduler
→ ingestion
→ features
→ predictions
→ signals
→ alerts
```

Workers desacoplados vía Redis.

El frontend nunca debe asumir sincronía perfecta entre etapas.

---

# 🔐 Seguridad

## Públicos

```text
/api/v1/health
/api/v1/ready
/api/v1/auth/login
/api/v1/auth/refresh
/api/v1/exchange/routes
```

## Protegidos

Todos los demás requieren:

```http
Authorization: Bearer <token>
```

---

# 🧩 Modelo Operacional Actual

## Modelo ML

```text
MODEL_VERSION=m2
```

## Estado actual producción

```text
Exchange base:
kraken
```

## Timeframes activos

```text
1m
```

## Horizons activos

```text
5m
```

---

# 🔑 Authentication

## POST `/auth/login`

### Payload

```json
{
  "email": "admin@email.com",
  "password": "******"
}
```

### Retorna

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {}
}
```

---

# 📦 Assets Discovery

## GET `/assets`

## Sentido

Contrato principal para construir:

* selectores
* dashboard
* estados operacionales
* matrices readiness

La UI NO debe hardcodear:

* activos
* timeframes
* horizons

Todo debe derivarse desde este endpoint.

---

## Respuesta Esperada

```json
{
  "data": [
    {
      "asset": "BTC",

      "timeframes": ["1m", "5m", "15m"],

      "horizons": ["5m", "10m", "15m"],

      "ready": true,

      "status_summary": {
        "total": 9,
        "ok": 3,
        "stale": 4,
        "partial": 1,
        "missing": 1
      },

      "matrix": {
        "1m": {
          "5m": {
            "status": "OK",
            "confidence": 0.82,
            "signal": "BUY",
            "age_seconds": 24
          }
        }
      }
    }
  ]
}
```

---

# 📊 Estados Operacionales

## OK

Toda la cadena existe y está fresca.

```text
price
features
prediction
signal
```

dentro de:

```text
READY_MAX_AGE_SECONDS
```

---

## STALE

Existe información pero está envejecida.

Ejemplo:

* worker detenido
* scheduler pausado
* cola atrasada

---

## PARTIAL

Existe price pero faltan:

* features
* prediction
* signal

---

## MISSING

No existe información suficiente para la combinación.

---

# 📈 Latest Snapshot Endpoints

## GET `/latest/price`

### Query

```text
asset
timeframe
display_quote (optional)
```

---

## GET `/latest/feature`

### Query

```text
asset
timeframe
```

---

## GET `/latest/prediction`

### Query

```text
asset
timeframe
horizon
display_quote (optional)
```

### Retorna

```json
{
  "data": {
    "asset": "BTC",
    "y_hat": 76822.52,
    "confidence": 0.82,
    "model_version": "m2",
    "explanation": "..."
  }
}
```

---

## GET `/latest/signal`

### Query

```text
asset
timeframe
horizon
```

### Retorna

```json
{
  "signal": "BUY",
  "strength": 0.42,
  "confidence": 0.76,
  "reason": "...",
  "components": {}
}
```

---

# 📚 Históricos

## GET `/history/prices`

## GET `/history/features`

## GET `/history/predictions`

Uso:

* gráficos
* backtesting
* overlays
* comparación temporal
* visualización de tendencia

---

# 🧠 Predicción M2

El modelo actual:

```text
m2
```

incluye:

* confidence heurística conservadora
* volatility cap
* horizon calibration
* fit quality
* indicator alignment
* expected error hint

La interfaz debe entender que:

```text
confidence != probabilidad garantizada
```

---

# 🌊 Pipeline Status

## GET `/pipeline/status`

## Sentido

Estado operacional por combinación:

```text
asset
+
timeframe
+
horizon
```

---

## Query Params

```text
asset (optional)
timeframe (optional)
horizon (optional)
status (optional)
include_stale=true|false
```

---

## Respuesta

```json
{
  "summary": {
    "total": 9,
    "ok": 3,
    "stale": 4,
    "partial": 1,
    "missing": 1
  },

  "entries": [
    {
      "asset": "BTC",
      "timeframe": "1m",
      "horizon": "5m",
      "status": "OK",
      "confidence": 0.82,
      "signal": "BUY"
    }
  ]
}
```

---

# 🌍 FX

## GET `/fx/latest`

### Ejemplo

```text
/fx/latest?base=USD&quote=CLP
```

---

# 🔔 Alerts

Las alertas operan desacopladas vía Redis.

Pipeline:

```text
signals
→ alerts queue
→ alerts worker
→ SMTP provider
```

La UI aún no consume alert streams en tiempo real.

---

# 🔗 Exchange Router

## GET `/exchange/routes`

### Ejemplo

```text
/exchange/routes?asset=BTC&quote=USD
```

### Retorna

```json
{
  "asset": "BTC",
  "quote": "USD",
  "routes": [
    {
      "exchange": "kraken",
      "pair": "BTC/USD",
      "url": "https://www.kraken.com/prices/btc-usd"
    }
  ]
}
```

## Importante

La plataforma:

* NO ejecuta órdenes
* NO custodia activos
* NO conecta wallets

Solo entrega rutas externas.

---

# 🧭 Reglas UI Recomendadas

## La UI debe:

✅ derivar selectores desde `/assets`

✅ interpretar estados por combinación

✅ mostrar stale/partial visualmente

✅ permitir fallback de combinaciones

✅ tratar prediction y signal como capas distintas

---

## La UI NO debe:

❌ asumir un único timeframe

❌ asumir un único horizon

❌ asumir sincronía perfecta del pipeline

❌ hardcodear activos

❌ tratar confidence como certeza

---

# 🌱 Dirección Evolutiva

El backend ya se aproxima a:

```text
market intelligence orchestration
```

más que solo “predicción de precios”.

La interfaz futura debería poder visualizar:

* madurez operacional
* estados pipeline
* coherencia multi-timeframe
* correlaciones
* consenso de señales
* presión de volatilidad
* convergencia/divergencia temporal
