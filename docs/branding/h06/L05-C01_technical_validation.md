# EVW-CRYPTO-H06-L05-C01 · Validación técnica integral

## Trazabilidad y alcance

- Base obligatoria verificada: `develop` en `6007b432ccd984b7887fe32fe4ab85a2686c9c1b`.
- `develop` y `origin/develop` coincidían exactamente con la base al abrir la cápsula.
- Rama local: `feature/evw-crypto-h06-l05-c01-technical-validation`.
- Árbol inicial: limpio.
- Alcance ejecutado: versiones efectivas, integridad local, build de producción, suite completa, presupuesto, warnings, whitespace e invariantes funcionales.
- Código de producción, configuración, budgets y dependencias: sin cambios.
- No se ejecutó lint porque `package.json` no define ese script.

## Entorno efectivo

| Herramienta | Versión observada | Referencia del proyecto | Resultado |
| --- | --- | --- | --- |
| Node.js | `v24.21.0` | `^20.19.0 || ^22.12.0` | MINOR-03: runtime fuera del rango declarado |
| npm | `11.19.0` | sin rango declarado | PASS |
| Angular CLI | `20.3.16` | lock `20.3.16` | PASS |
| Angular framework | `20.3.16` | lock `20.3.16` | PASS |
| Angular CDK / Material | `20.2.14` | lock `20.2.14` | PASS |
| TypeScript | `5.9.3` | `~5.9.2`; lock `5.9.3` | PASS |
| RxJS | `7.8.2` | `~7.8.0`; lock `7.8.2` | PASS |
| Chrome Headless | `137.0.0.0` | launcher existente | PASS |

Angular CLI se resolvió desde la instalación local; no se descargaron herramientas ni se modificó el manifiesto.

## Integridad de dependencias

- `package-lock.json` usa `lockfileVersion: 3`.
- Comprobación directa de dependencias: **24/24 PASS**. Cada paquete declarado existe, satisface el rango de `package.json` y coincide exactamente con la versión registrada en `package-lock.json`.
- `package.json`, `package-lock.json` y `angular.json` permanecieron sin cambios.
- SHA-256: `package.json` `de4dd3b24d636898a63d20df294e2e7aa446644f338015092f2ea26abc8a2817`; `package-lock.json` `0864ec3c1d02f086eecfa901b0405fa98e0e684ac15a318951864a873c61393b`; `angular.json` `f3dfd329e70fc28fa87344ac4b40d009fd5d5c4f6344b9d03295704db1d76869`.
- `npm ls --depth=0` terminó con `ELSPROBLEMS` porque existe `node_modules/node_modules`, un enlace simbólico autorreferente hacia el mismo `node_modules`. npm lo reporta como paquete extraneous y presenta los directos como missing, aunque sus directorios y manifiestos están presentes y son los que usan Angular, build y tests. Se clasifica como MINOR-04 del entorno local.
- No se ejecutó `npm install`, `npm ci`, auditoría con mutación ni limpieza de `node_modules`.

## Comandos y resultados

| Comando solicitado | Resultado autoritativo | Tiempo real | CPU usuario / sistema | Memoria máxima |
| --- | --- | ---: | ---: | ---: |
| `npm run build` | PASS · exit `0` | `7.81 s` | `16.64 s / 0.95 s` | `897080 kB` |
| `npm test -- --watch=false --browsers=ChromeHeadless` | PASS · 52/52 · exit `0` | `6.88 s` | `9.43 s / 1.12 s` | `875872 kB` |
| `git diff --check` | PASS · exit `0` | `0.00 s` | `0.00 s / 0.00 s` | `4608 kB` |

El primer intento aislado de build no pudo resolver `fonts.googleapis.com`, enlazado por `src/index.html` y requerido por la integración de fuentes de Angular. El primer intento aislado de tests no pudo enlazar Karma en `0.0.0.0:9876`. Ambos comandos se repitieron sin el aislamiento de red y completaron correctamente, sin cambios de fuente o configuración. Clasificación: PASS; estos fallos corresponden a restricciones del ejecutor y no a defectos del repositorio.

La suite emitió el aviso ya observado de `bootstrap-icons.woff2` no disponible bajo `/base/media/` en el servidor de Karma; las 52 pruebas completaron correctamente y el build generó `browser/media/bootstrap-icons-CVBWLLHT.woff2`. Clasificación: PASS para producción; el aviso queda acotado al servidor del harness.

## Presupuesto del bundle

| Métrica | Referencia L04-C05 | Resultado L05-C01 | Diferencia |
| --- | ---: | ---: | ---: |
| Bundle inicial raw | `799.79 kB` | `799.79 kB` | `0.00 kB` |
| Transferencia estimada | `158.05 kB` | `158.05 kB` | `0.00 kB` |
| Umbral warning | `800 kB` | `800 kB` | sin cambio |
| Umbral error | `1 MB` | `1 MB` | sin cambio |

El bundle permanece bajo el umbral de advertencia, con aproximadamente `0.21 kB` de margen. No existe incremento respecto de la referencia, pero la proximidad al límite se conserva como condición de seguimiento.

### Warnings SCSS

Los cuatro warnings son idénticos al baseline:

| Componente | Tamaño | Exceso sobre 4 kB |
| --- | ---: | ---: |
| Login | `6.42 kB` | `2.42 kB` |
| Home | `7.98 kB` | `3.98 kB` |
| Compare | `7.81 kB` | `3.81 kB` |
| Trading Mode | `6.79 kB` | `2.79 kB` |

No se modificaron budgets, SCSS ni configuración Angular.

## Integridad funcional

La comparación desde la base de auditoría H06 `c55c444595300e95c8ee4c2a0ce82fa335331d42` hasta la base actual no muestra cambios en `core/auth`, servicios, modelos/contratos, rutas, utilidades de señal/técnicas/timestamps ni `app-line-chart`. Tampoco muestra cambios en los archivos TypeScript de Login, Dashboard, Assets, History, Compare o Trading Mode.

La evidencia L04 integrada y las 52 pruebas confirman:

- Autenticación, payload, guards, rutas, sesiones y delegación de logout: PASS.
- Servicios, API, endpoints, contratos, RxJS y caché: PASS.
- Cálculos financieros, FX, moneda, precisión, formatos y timestamps Chile: PASS.
- BUY/SELL/HOLD, rendimiento esperado y umbral HOLD `±0,10%`: PASS.
- Series, ejes, escalas, unidades, gráficos, orden y correlaciones: PASS.
- Refresh manual, selección compartida, loading, errores parciales, caché y comportamiento asíncrono: PASS.

No se repitieron auditorías visuales de L03/L04; L05-C02 conserva ese alcance.

## Hallazgos y deuda residual

### Deuda preservada

- `MINOR-01`: Dashboard mantiene tonos financieros físicos accesibles para BUY/positivo, SELL/negativo y HOLD/neutral. Sin cambio en esta cápsula.
- `MINOR-02`: helpers gold heredados permanecen sin consumidores en las superficies auditadas. Sin cambio en esta cápsula.

### Hallazgos nuevos

- `MINOR-03`: Node `v24.21.0` no satisface el rango `engines.node` del proyecto. Build y tests pasan, pero una reproducción canónica debe usar Node 20.19+ o 22.12+ según el manifiesto.
- `MINOR-04`: symlink autorreferente ignorado en `node_modules/node_modules` hace fallar `npm ls --depth=0`. Las 24 dependencias directas coinciden con lock y todas las validaciones del producto pasan. Debe resolverse al preparar un entorno limpio, sin convertir esta cápsula documental en limpieza local.

### BLOCKER

Ninguno.

## Conclusión

La base técnica de H06 es apta para continuar a L05-C02: build, bundle, suite y whitespace pasan; los invariantes permanecen trazados; no hay regresiones ni warnings nuevos. Los cuatro MINOR no bloquean la siguiente validación y quedan explícitos para reproducibilidad y deuda futura.

No se realizó push, merge, despliegue ni limpieza de ramas, y no se inició L05-C02.
