# EVW-CRYPTO-H06-L04-C02 · Alineación de Dashboard al Brand System v1.0

## Trazabilidad y resultado

- Base verificada: `develop` en `94a0af0f342d65f862da39882001480de55bc43a`.
- Rama local: `feature/evw-crypto-h06-l04-c02-dashboard-brand`.
- Resultado: `/dashboard` adopta la jerarquía, superficies y roles cromáticos del Brand System v1.0 sin modificar su comportamiento analítico.
- Alcance preservado: `home.component.ts`, servicios, subscriptions, RxJS, API, contratos, fórmulas, formatos, precisión, conversiones FX, señales, timestamps, caché, autenticación, shell y routing.

## Implementación

### Jerarquía, filtros y contexto

- El encabezado diferencia contexto editorial, título, explicación breve y acciones, manteniendo el selector de moneda y la actualización manual existentes.
- Los cuatro filtros conservan sus opciones, bindings y eventos; ahora tienen etiquetas visibles asociadas, superficies oscuras, foco cyan y objetivos táctiles de al menos 48 px.
- Un panel de contexto resume activo, temporalidad, horizonte, moneda y última actualización sin transformar sus valores.
- El SCSS del componente se reconcilió en una sola implementación, eliminando las capas heredadas contradictorias y sin añadir overrides globales.

### Métricas y estados

- Se conservaron exactamente las cuatro tarjetas: Precio actual, Indicadores técnicos, Predicción ML y Señal derivada.
- Se refinó su composición visual, espaciado, iconografía y jerarquía tipográfica sin alterar cálculos, unidades, monedas, precisión ni pipes.
- BUY, SELL, HOLD y los rendimientos mantienen colores semánticos propios. El gold se limita a etiquetas editoriales; no representa precio, ganancia, BUY ni variación positiva.
- Loading, refreshing, error y ausencia de datos conservan las mismas condiciones y mensajes funcionales, con una presentación coherente y regiones accesibles.
- El detalle técnico mantiene su disclosure, y el contexto FX, timestamps y disclaimer conservan sus datos y significado.

## Evidencia antes/después

Las capturas se generaron con una sesión ficticia local (`analyst@example.com`, `ROLE_ANALYST`) y respuestas API controladas. No se usaron ni registraron credenciales o tokens reales.

| Superficie | Antes | Después |
| --- | --- | --- |
| Desktop 1440 × 1000 · vista general | [Captura](screenshots/L04-C02/before-desktop-1440.png) | [Captura](screenshots/L04-C02/after-desktop-1440.png) |
| Móvil 390 × 844 · jerarquía y filtros | [Captura](screenshots/L04-C02/before-mobile-top-390.png) | [Captura](screenshots/L04-C02/after-mobile-top-390.png) |
| Móvil 390 × 844 · métricas superiores | [Captura](screenshots/L04-C02/before-mobile-metrics-390.png) | [Captura](screenshots/L04-C02/after-mobile-metrics-390.png) |
| Móvil 390 × 844 · predicción y señal | [Captura](screenshots/L04-C02/before-mobile-metrics-lower-390.png) | [Captura](screenshots/L04-C02/after-mobile-metrics-lower-390.png) |

Evidencia complementaria: [cuatro tarjetas completas en desktop](screenshots/L04-C02/after-desktop-metrics-1440.png), [loading](screenshots/L04-C02/after-loading-desktop-1440.png) y [error](screenshots/L04-C02/after-error-desktop-1440.png).

La validación runtime confirmó cuatro filtros y cuatro tarjetas en ambas resoluciones, con `scrollWidth - clientWidth = 0`. Los fixtures mostraron `35.000,00 USD`, RSI `55.25`, predicción `35.350,00 USD` y señal `BUY` con rendimiento esperado positivo, preservando sus clases semánticas.

## Accesibilidad y responsive

- Desktop distribuye las cuatro métricas en una fila; el layout pasa a dos columnas en ancho intermedio y a una columna en móvil.
- Los cuatro selects tienen etiquetas visibles asociadas. La actualización expone su estado ocupado y el detalle técnico comunica su estado expandido.
- Teclado y foco: PASS; la comprobación runtime enfocó el selector de activo y confirmó un outline cyan sólido de 3 px.
- Contraste de pares principales: texto/superficie `15.96:1`, secundario/superficie `8.64:1`, cyan/superficie `13.16:1`, gold/superficie `12.20:1`, positivo/superficie `11.73:1`, negativo/superficie `9.49:1` y neutral/superficie `10.53:1`; todos superan WCAG AA.
- `prefers-reduced-motion`: PASS mediante el mecanismo canónico `crypto-motion`.
- Overflow horizontal: PASS en 1440 × 1000 y 390 × 844.

## Validación técnica

- `npm run build`: PASS. Permanecen exclusivamente los cuatro warnings SCSS presentes en el baseline (`login`, `home`, `compare` y `trading-mode`); no se añadieron warnings.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 52/52 (baseline 48/48).
- Se añadieron cuatro pruebas específicas: asociación de etiquetas/foco, contenido y semántica de las cuatro tarjetas, estados loading/error y disclosure técnico accesible.
- `git diff --check`: PASS.
- `package.json` y `package-lock.json`: sin cambios; no se añadieron dependencias.

## Archivos intervenidos

- `src/app/features/dashboard/home/home.component.html`
- `src/app/features/dashboard/home/home.component.scss`
- `src/app/features/dashboard/home/home.component.spec.ts`
- `docs/branding/h06/L04-C02_dashboard_brand.md`
- `docs/branding/h06/screenshots/L04-C02/*.png`

No se modificó `home.component.ts`, ningún servicio, cálculo, contrato, ruta, control de autenticación, shell u otra pantalla privada. No se inició L04-C03 ni se realizó push, merge, despliegue o limpieza de ramas.
