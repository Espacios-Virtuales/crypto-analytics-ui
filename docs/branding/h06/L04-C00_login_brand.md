# EVW-CRYPTO-H06-L04-C00 · Branding del inicio de sesión

## Trazabilidad y resultado

- Base verificada: `develop` y `origin/develop` en `3f3a60dbb5bf73e0d930c1b4c280eaa4352c3afa`.
- Rama local: `feature/evw-crypto-h06-l04-c00-login-brand`.
- Resultado: `/login` comparte identidad, roles cromáticos, superficies y jerarquía con la landing pública; la autenticación conserva su contrato y comportamiento.
- Alcance preservado: formulario reactivo, validadores, `AuthService`, payload, navegación a `/dashboard`, mensajes del servidor, API, guards, roles, sesiones, registro, dashboard y shell.

## Implementación

### Identidad y composición

- Se sustituyó `/logo.png` por el maestro `CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg` disponible en `public/brand/`.
- La identidad verbal ahora usa “Crypto Analytics” y “Lee el mercado con contexto.”; se eliminaron “Crypto Analytics UI” y la frase antigua con errata.
- Desktop usa una composición de marca y acceso en dos paneles. Móvil conserva monograma, nombre, promesa y formulario en una sola columna, sin ocultar la identidad.
- Se retiraron las clases Bootstrap de layout, el estilo inline y el bloque Noir/Gold completo. El nuevo SCSS es una única implementación basada en tokens `--crypto-*`, sin una segunda capa de overrides ni colores físicos nuevos.

### Formulario y accesibilidad

- Los campos tienen `label` visible, `id`, `autocomplete`, `aria-invalid` y asociación dinámica con sus mensajes de error.
- El error del servidor conserva literalmente su mensaje y se anuncia con `role="alert"`; el aviso de registro conserva su contenido y usa `role="status"`.
- El botón comunica disabled y loading mediante texto, spinner decorativo y `aria-busy`, manteniendo las mismas condiciones del formulario.
- La secuencia de teclado verificada es correo → contraseña → botón. Los tres controles muestran foco visible.
- Contraste de pares principales: texto/superficie `15.96:1`, muted/superficie `8.64:1`, danger/superficie `6.04:1`, texto oscuro/CTA cyan `9.19:1` y gold/fondo `13.34:1`.

## Invariantes de autenticación

`login.component.ts` y los servicios de autenticación no fueron modificados. Las pruebas dirigidas confirman que:

- un formulario inválido no invoca `AuthService.login` y marca los controles;
- un formulario válido envía exactamente `{ email, password }`;
- una respuesta exitosa conserva la navegación a `/dashboard`;
- un error conserva el mensaje del backend y restaura el estado de envío;
- los estados loading y registered siguen siendo visibles y anunciables.

## Evidencia antes/después

| Viewport | Antes | Después |
| --- | --- | --- |
| Desktop 1440 × 1000 | [Captura](screenshots/L04-C00/before-desktop-1440.png) | [Captura](screenshots/L04-C00/after-desktop-1440.png) |
| Móvil 390 × 844 | [Captura](screenshots/L04-C00/before-mobile-390.png) | [Captura](screenshots/L04-C00/after-mobile-390.png) |

Las capturas usan el viewport solicitado y movimiento reducido. No existe overflow horizontal ni contenido recortado: `scrollWidth=clientWidth` en ambos tamaños; desktop mide `1440 × 1000` y móvil `390 × 844`.

## Validación

- `npm run build`: PASS. Se mantienen los mismos cuatro warnings SCSS del baseline (`login`, `home`, `compare` y `trading-mode`); no se añadió ninguno.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 41/41; seis pruebas nuevas cubren identidad, accesibilidad y comportamiento del formulario.
- Lighthouse Accessibility: `100/100` en desktop y móvil, sin auditorías fallidas.
- Validación runtime de teclado, foco, disabled/loading, autocomplete y overflow: PASS en desktop y móvil.
- Inspección visual de capturas: PASS.
- `git diff --check`: PASS.
- `package.json` y `package-lock.json`: sin cambios; no se añadieron dependencias.

## Archivos modificados

- `src/app/features/auth/login/login.component.html`
- `src/app/features/auth/login/login.component.scss`
- `src/app/features/auth/login/login.component.spec.ts`
- `docs/branding/h06/L04-C00_login_brand.md`
- `docs/branding/h06/screenshots/L04-C00/*.png`

No se inició L04-C01 ni se realizó push, merge, despliegue o limpieza de ramas.
