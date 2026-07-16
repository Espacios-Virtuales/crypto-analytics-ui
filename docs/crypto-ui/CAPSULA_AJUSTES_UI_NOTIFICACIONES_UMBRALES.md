# Capsula UI, notificaciones y umbrales

Fecha: 2026-07-16

## Hallazgos frontend

- La UI consume `/assets`, `/latest/price`, `/latest/feature`, `/latest/prediction` y `/latest/signal`.
- La seleccion compartida vive en `MarketSelectionService`.
- El dashboard y Trading Mode resolvian el activo inicial desde `/assets`, pero parcheaban el formulario con `emitEvent: false`. Si la seleccion inicial estaba vacia, la carga de `latest` podia no dispararse hasta que el usuario volviera a seleccionar un activo.
- No se encontro cache HTTP en `ApiService`. El cache observable estaba en cada componente con `shareReplay(1)`.
- No se encontro backend ni servicio de correo en este repositorio frontend.

## Cambios aplicados

- Se agrego refresh manual controlado en Dashboard y Trading Mode.
- El refresh vuelve a consultar `/assets` y los endpoints `latest` sin exigir re-seleccion del activo.
- La seleccion actual de activo, timeframe y horizon se conserva mientras siga existiendo en las opciones del activo.
- Se agrego indicador de refresh manual y se mantiene visible el timestamp `asof_ts_utc` devuelto por API.
- El umbral local de HOLD queda expuesto como constante `SIGNAL_HOLD_THRESHOLD` y label `SIGNAL_HOLD_THRESHOLD_LABEL`.
- La UI muestra `Umbral HOLD aplicado: +/-0,10%`.

## Notificaciones por correo

No hay servicio de correo ni templates en este repositorio. La mejora debe aplicarse en el backend o worker de alertas. Estructura recomendada:

```text
Asunto: Crypto Analytics | {SIGNAL} {ASSET} | {TIMEFRAME}/{HORIZON} | Confianza {CONFIDENCE}

Activo:
Instrumento:
Senal:
Confianza:
Fuerza:
Umbral aplicado:
Temporalidad:
Precio de referencia:
Hora de lectura:
Razon:
Observacion:
```

Recomendaciones:

- Incluir timestamp de generacion y timestamp de lectura de mercado si son distintos.
- Distinguir lectura diaria y semanal con un campo `Temporalidad` o `Perfil de umbral`.
- Mantener los destinatarios actuales y cambiar solo asunto/cuerpo.
- Enviar el umbral aplicado desde el backend para evitar que correo y UI diverjan.

## Umbrales diarios y semanales

En este frontend solo existe un umbral local para convertir retorno esperado a HOLD: `0.001`, equivalente a `0,10%`. No se encontro separacion diaria/semanal en UI.

Pendiente backend:

- Confirmar si `/latest/signal` aplica thresholds propios.
- Exponer `threshold`, `threshold_profile` y `threshold_timeframe` en la respuesta de senal.
- Evitar que el frontend infiera thresholds si el backend ya decide la senal final.

## Diagnostico Binomo

Las diferencias visuales frente a Binomo pueden venir de:

- Fuente de datos distinta.
- Broker/exchange distinto.
- Spread o precio bid/ask/last diferente.
- Temporalidad distinta.
- Desfase horario.
- Frecuencia de actualizacion menor en Crypto Analytics.
- Instrumento equivalente con denominacion distinta.
- Precio de referencia distinto para la vela o lectura.

No se implemento integracion, scraping ni sincronizacion con Binomo.

## Actualizacion casi en tiempo real

Recomendacion tecnica futura:

- Definir primero SLA de frescura por instrumento y timeframe.
- Exponer `asof_ts_utc`, edad del dato y fuente en todas las respuestas.
- Para una primera iteracion, usar polling moderado y configurable por vista, por ejemplo 30 a 60 segundos, con pausa al perder foco.
- Para latencias menores, mover senales a canal push con SSE o WebSocket, pero solo despues de estabilizar contratos de datos, thresholds y observabilidad.
- Evitar polling agresivo desde Angular porque multiplica llamadas por usuario y por endpoint.

## Instrumentos con denominaciones especiales

La normalizacion visible actual conserva los nombres de activo recibidos desde `/assets`. JPY, EUR y otros instrumentos siguen dependiendo de que el backend los liste con `timeframes` y `horizons` compatibles.

Recomendacion:

- Mantener labels visibles iguales al contrato de backend.
- Agregar alias/display name desde API si se requiere una denominacion comercial.
- Mostrar errores claros cuando un activo no tenga rutas o datos `latest`.
