# EVW-CRYPTO-H06-L04-C04 · Alineación de Trading Mode al Brand System v1.0

## Trazabilidad y alcance

- Base verificada: `ae4aa7a98858cc34c363df5dbe3c9556e9d028fc`.
- Rama local: `feature/evw-crypto-h06-l04-c04-trading-brand`.
- Alcance: plantilla y estilos de Trading Mode, acta y evidencia visual antes/después.
- Sin cambios: TypeScript, servicios, API, endpoints, contratos, selección compartida, caché, cálculos, umbral HOLD, señales, formatos, timestamps, routing, autenticación y shell.
- No se añadieron dependencias ni datos de prueba al código de la aplicación.

## Implementación

- Trading Mode adopta la jerarquía editorial, tipografía, superficies y densidad de Dashboard y las vistas de datos alineadas al Brand System v1.0.
- Los controles se agrupan en una superficie de configuración y conservan sus mismos `FormControl`, opciones y eventos. Los tres `select` ahora tienen etiqueta programáticamente asociada.
- La lectura asistida separa señal consolidada, contexto temporal, umbral y continuidad externa. El aviso de seguridad original se mantiene y se refuerza con `Sin ejecución automática`.
- Gold se limita a jerarquía editorial; cyan identifica interacción y seguridad. BUY, SELL, HOLD y rendimiento esperado conservan sus roles financieros positivo, negativo y neutral.
- El router mantiene las URLs recibidas del backend, abre en una pestaña nueva con `noopener noreferrer` y anuncia ese comportamiento mediante su nombre accesible.
- Loading, refreshing, error, ausencia de rutas y errores parciales conservan sus condiciones y mensajes; las regiones de estado y error exponen semántica accesible.

## Evidencia antes/después

Las capturas se generaron con una sesión local ficticia (`analyst@example.com`, `ROLE_ANALYST`) y fixtures de QA interceptados fuera de la aplicación. No se usaron credenciales reales.

| Viewport | Antes | Después |
| --- | --- | --- |
| Desktop 1440 × 1000 | [Captura](screenshots/L04-C04/before-desktop-1440.png) | [Captura](screenshots/L04-C04/after-desktop-1440.png) |
| Móvil 390 × 844 | [Captura](screenshots/L04-C04/before-mobile-390.png) | [Captura](screenshots/L04-C04/after-mobile-390.png) |

## Invariantes controlados

La comparación runtime antes/después confirmó:

- Selección idéntica: `BTC`, temporalidad `1m` y horizonte `5m`.
- Señal `BUY`, rendimiento `+2,50%`, fuerza `82,00%` y confianza `Muy alta / 92,00%` idénticos.
- Contexto idéntico: actualizado `26-10-2026 / 15:30`, refresh `Sin refresh` y umbral `HOLD ±0,10%`.
- Indicadores idénticos: RSI `Neutral / 58,3`, MACD `Momentum positivo / 1,245` y volatilidad `Alta / 3,40%`.
- El disclaimer permanece exactamente como `No ejecuta órdenes ni constituye recomendación financiera.`.
- Las rutas Binance y Kraken conservaron texto, URL, `target="_blank"` y `rel="noopener noreferrer"`.
- `trading-mode.component.ts` y todos los servicios permanecen sin cambios.

## Responsive y accesibilidad

- `document.scrollWidth === document.clientWidth` en 1440 × 1000 y 390 × 844; no hay overflow horizontal de página.
- Desktop usa cuatro controles y cuatro métricas por fila. El layout pasa a dos columnas en ancho intermedio y a una columna en móvil.
- Auditoría DOM: tres `select` con etiqueta asociada, ningún control sin nombre accesible y ningún `id` duplicado.
- Navegación por teclado verificada desde el shell a los tres selectores, actualización y rutas externas. Todos exponen outline cyan sólido de 3 px.
- Contraste sobre `--crypto-surface`: texto `15.96:1`, secundario `8.64:1`, cyan `13.16:1`, gold `12.20:1`, éxito `8.23:1`, advertencia `9.22:1` y peligro `6.04:1`. Texto oscuro sobre botón cyan: `9.19:1`. Todos superan WCAG AA.
- No se introdujeron animaciones nuevas; loading conserva el mecanismo global de movimiento reducido.

## Validación técnica

- `npm run build`: **PASS**. Permanecen exclusivamente los cuatro warnings SCSS del baseline (`login`, `home`, `compare` y `trading-mode`); no apareció ningún warning nuevo.
- `npm test -- --watch=false --browsers=ChromeHeadless`: **PASS**, 52/52.
- `git diff --check`: **PASS**.
- Dependencias: sin cambios.

## Archivos intervenidos

- `src/app/features/dashboard/trading-mode/trading-mode.component.html`
- `src/app/features/dashboard/trading-mode/trading-mode.component.scss`
- `docs/branding/h06/L04-C04_trading_brand.md`
- `docs/branding/h06/screenshots/L04-C04/*.png`

No se realizó push, merge, despliegue ni limpieza de ramas, y no se inició L04-C05.
