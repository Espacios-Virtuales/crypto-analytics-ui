# EVW-CRYPTO-H06-L04-C01 · Unificación de shell y navegación con marca v1.0

## Trazabilidad y resultado

- Base verificada: `develop` y `origin/develop` en `6f0e7afef2a6b911c647192a39cbb3d68d9290ed`.
- Rama local: `feature/evw-crypto-h06-l04-c01-shell-brand`.
- Resultado: el shell autenticado comparte la identidad, superficies, jerarquía y roles cromáticos de la landing y el login, sin modificar las vistas de contenido privadas.
- Alcance preservado: `AuthService`, `AuthFacade`, guards, roles, permisos, sesiones, rutas, endpoints, contratos y comportamiento de logout.

## Implementación

### Identidad y sidebar

- El icono de casa se sustituyó por `CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg`, manteniendo el enlace a `/dashboard` y un nombre accesible explícito.
- La identidad completa se conserva en modo expandido; el monograma permanece reconocible en modo colapsado.
- Los destinos, etiquetas e iconos funcionales existentes se mantienen: Resumen, Trading, Históricos, Comparador y Activos.
- El estado activo usa cyan técnico, mientras el gold queda limitado a identidad y rol editorial.
- Los estilos del shell se consolidaron en un único módulo `crypto-shell`, acotado a sus clases y consumido por la entrada global. Esto evita una segunda capa de overrides y el warning de presupuesto que produciría el mismo bloque como CSS encapsulado.

### Topbar y cuenta

- La topbar diferencia navegación, contexto de área privada, correo, rol y acceso a cuenta con controles de 44 × 44 px.
- El correo y rol conservan literalmente los valores de la sesión existente.
- El diálogo nativo tiene título asociado, estructura semántica para sus datos, superficies oscuras de marca y acciones secundaria/destructiva claramente diferenciadas.
- `logout()` continúa delegando sin argumentos en `AuthFacade.logout()`; no se alteró el servicio ni su finalización de sesión.

### Responsive, teclado y movimiento

- Desktop conserva sidebar expandido de 272 px y colapsado de 76 px, con títulos disponibles en los destinos colapsados.
- Móvil usa un drawer de hasta 304 px. Cuando está cerrado se aplica `inert` y `aria-hidden`, evitando que enlaces fuera de pantalla entren en la secuencia de teclado.
- Al abrir el drawer, el foco pasa al enlace de identidad. Backdrop y Escape cierran el drawer y devuelven el foco al disparador.
- Los controles exponen `aria-controls` y `aria-expanded`; el diálogo expone `aria-labelledby` y devuelve el foco al botón de cuenta al cerrarse mediante las acciones.
- `prefers-reduced-motion: reduce` elimina las transiciones del shell; runtime reportó `0.01 ms`.

## Evidencia antes/después

Las capturas se generaron con una sesión ficticia local (`analyst@example.com`, `ROLE_ANALYST`) y respuestas API simuladas. No se usaron ni registraron credenciales o tokens reales.

| Superficie | Antes | Después |
| --- | --- | --- |
| Desktop 1440 × 1000 · expandido | [Captura](screenshots/L04-C01/before-desktop-expanded-1440.png) | [Captura](screenshots/L04-C01/after-desktop-expanded-1440.png) |
| Desktop 1440 × 1000 · colapsado | [Captura](screenshots/L04-C01/before-desktop-collapsed-1440.png) | [Captura](screenshots/L04-C01/after-desktop-collapsed-1440.png) |
| Desktop 1440 × 1000 · cuenta | [Captura](screenshots/L04-C01/before-desktop-account-1440.png) | [Captura](screenshots/L04-C01/after-desktop-account-1440.png) |
| Móvil 390 × 844 · cerrado | [Captura](screenshots/L04-C01/before-mobile-closed-390.png) | [Captura](screenshots/L04-C01/after-mobile-closed-390.png) |
| Móvil 390 × 844 · abierto | [Captura](screenshots/L04-C01/before-mobile-open-390.png) | [Captura](screenshots/L04-C01/after-mobile-open-390.png) |

La inspección visual confirmó jerarquía, alineación y contenido sin recortes. `scrollWidth - clientWidth = 0` en desktop y móvil, con drawer abierto y cerrado.

## Accesibilidad y validación funcional

- Navegación y ruta activa: PASS; `/dashboard` quedó activo en runtime y una prueba dirigida valida `/dashboard/history`.
- Sidebar expandido/colapsado y drawer abierto/cerrado: PASS.
- Teclado y foco: PASS mediante pruebas de entrada al drawer, cierre con Escape y retorno desde el diálogo.
- Información de cuenta y delegación de logout: PASS.
- Nombres y relaciones accesibles: PASS para navegación principal, disparadores, iconos decorativos y diálogo.
- Contraste de pares principales: texto/superficie `15.96:1`, muted/elevated `8.99:1`, cyan/superficie `13.16:1` y gold/superficie `12.20:1`; todos superan WCAG AA.
- Reduced motion: PASS.
- Overflow horizontal: PASS en 1440 × 1000 y 390 × 844.

## Validación técnica

- `npm run build`: PASS. Permanecen exclusivamente los cuatro warnings SCSS del baseline (`login`, `home`, `compare` y `trading-mode`); el shell no añade warnings.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 48/48.
- Se añadieron siete pruebas específicas del shell: identidad y destinos, sesión y rol, exclusión del drawer cerrado, estados del control móvil, traslado y retorno de foco, diálogo/logout y ruta activa.
- `git diff --check`: PASS.
- `package.json` y `package-lock.json`: sin cambios; no se añadieron dependencias.

## Archivos intervenidos

- `src/app/features/dashboard/layout/dashboard-shell.component.html`
- `src/app/features/dashboard/layout/dashboard-shell.component.ts`
- `src/app/features/dashboard/layout/dashboard-shell.component.spec.ts`
- `src/styles/_crypto-shell.scss` (traslado y reemplazo del SCSS heredado del componente)
- `src/styles.scss` (carga del módulo acotado del shell)
- `docs/branding/h06/L04-C01_shell_brand.md`
- `docs/branding/h06/screenshots/L04-C01/*.png`

No se modificaron Dashboard, Assets, History, Compare, Trading Mode, autenticación, rutas ni contratos. No se inició L04-C02 ni se realizó push, merge, despliegue o limpieza de ramas.
