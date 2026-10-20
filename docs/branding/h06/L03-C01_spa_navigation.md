# EVW-CRYPTO-H06-L03-C01 · Navegación SPA y experiencia móvil

## Trazabilidad

- Base verificada: `develop` en `757f613a9a363e17251689bb8cd2358dddc49c93`.
- Rama: `feature/evw-crypto-h06-l03-c01-spa-navigation`.
- Alcance: navegación de la portada pública `/` y continuidad hacia `/login`.
- Fuera de alcance y sin cambios: autenticación, API, backend, gráficos, dashboard, hero, copy, monograma y tokens del Brand System v1.0.

## Implementación

- Se conservaron las anclas de desktop `Analiza`, `Compara`, `Sigue` y `Flujo`.
- En móvil se reemplazó la navegación oculta por un botón compacto `Menú` y un panel de dos columnas con los cuatro destinos.
- El botón comunica estado y relación mediante `aria-expanded`, etiqueta dinámica y `aria-controls`.
- El menú cierra al elegir una sección, pulsar `Escape`, hacer clic fuera o ampliar el viewport a desktop.
- `Escape` devuelve el foco al botón. Al elegir una sección, el destino recibe foco programático después del scroll para conservar el contexto de teclado y lector de pantalla.
- Se mantuvieron los enlaces SPA existentes a `/` y `/login`.

## Evidencia visual

| Vista | Antes | Después |
|---|---|---|
| Desktop 1440 × 1000 | [before-desktop-1440.png](screenshots/L03-C01/before-desktop-1440.png) | [after-desktop-1440.png](screenshots/L03-C01/after-desktop-1440.png) |
| Móvil 390 × 844 | [before-mobile-390.png](screenshots/L03-C01/before-mobile-390.png) | [after-mobile-390.png](screenshots/L03-C01/after-mobile-390.png) |

La captura móvil posterior muestra deliberadamente el menú abierto para evidenciar la alternativa de navegación. Las capturas `before` se generaron desde un archivo de trabajo temporal de la base exacta; las `after`, desde la rama de implementación. Se usó emulación de viewport mediante Chrome DevTools Protocol, evitando el ancho mínimo de ventana de Chrome headless.

Hashes SHA-256:

- `before-desktop-1440.png`: `535c1b530bc5cd8b53b4fbab86b2465e2c73c75f1dbaf067205f02e8bc66584b`
- `after-desktop-1440.png`: `535c1b530bc5cd8b53b4fbab86b2465e2c73c75f1dbaf067205f02e8bc66584b`
- `before-mobile-390.png`: `9f6aa0a96671b699a8836e8631535fc7580f70af2fb7184c7007f49be977c37c`
- `after-mobile-390.png`: `1aa6a57b956df43527d12438913df62c7190e9d70c5469300c77c6fb77736b50`

La igualdad de hashes desktop confirma que el cambio no altera el render visible a 1440 px.

## Validación

- `npm run build`: PASS. Persisten únicamente cuatro warnings de presupuesto SCSS preexistentes en `login`, `home`, `compare` y `trading-mode`; la landing no genera warnings.
- `npm test -- --watch=false --browsers=ChromeHeadless`: PASS, 26/26 pruebas.
- `git diff --check`: PASS.
- Responsive 390 × 844: PASS. `innerWidth=390`, `scrollWidth=390`, sin overflow horizontal; botón visible de `81.48 × 44 px`.
- Responsive 1440 × 1000: PASS. Navegación desktop visible, control móvil oculto y `scrollWidth=clientWidth=1425 px` (el resto de los 1440 px corresponde a la barra vertical del navegador).
- Anclas: PASS. Las cuatro actualizan `location.hash`, desplazan el documento y dejan foco en `#analiza`, `#compara`, `#sigue` o `#flujo`; el destino queda visible entre 103 y 173 px desde el borde superior.
- Cierre: PASS por selección, `Escape`, clic exterior y transición a desktop. `Escape` devuelve foco a `.landing__menu-toggle`.
- Continuidad `/ → /login`: PASS. La ruta final es `/login` y el formulario se renderiza.
- Accesibilidad: PASS en semántica, teclado y árbol AX de Chrome. El navegador expone el botón `Cerrar navegación`, la región `Navegación móvil de la portada` y cuatro enlaces con nombre accesible.
- Identidad: PASS. El recurso sigue siendo `/brand/CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg`; hero, copy y tokens no se modificaron.

## Estado administrativo

- Commit local de implementación; sin merge, push, limpieza ni despliegue.
- L03-C02 no fue iniciado.
