# EVW-CRYPTO-H06-L05-C04 · Limpieza técnica y control de deuda residual

## Trazabilidad, alcance y resultado

- Base obligatoria verificada: `develop` / `HEAD` inicial `1ec417627f386914ad22f4cfadf2d7bdeaf6b6aa`.
- Rama: `feature/evw-crypto-h06-l05-c04-technical-cleanup`.
- Inventario de cambios H06: se comparó el código desde el baseline previo a H06 registrado en L05-C01 (`c55c444595300e95c8ee4c2a0ce82fa335331d42`) hasta la base obligatoria de C04. El alcance incluye 29 rutas bajo `src/` y el SVG oficial incorporado bajo `public/brand/`.
- Resultado: **PASS documental, sin eliminación de código.** No se encontró una eliminación que fuera simultáneamente segura, necesaria y acotada; se priorizó conservar la implementación estable.
- Producción, componentes, estilos, assets, dependencias, configuración, pruebas y evidencias permanecen intactos. El único archivo nuevo de C04 es esta acta.

## Método de revisión

1. Se enumeraron todos los archivos bajo `src/`, `public/` y scripts que difieren entre los dos SHAs anteriores.
2. Se buscaron en el repositorio rastreado referencias a clases CSS, tokens, clases asignadas desde TypeScript, propiedades Angular, directivas, imports, trazas `console.*`, `debugger`, mocks y datos de fixture. La búsqueda cubrió plantillas, TypeScript, SCSS/CSS, estilos globales y scripts; las pruebas se separaron del código productivo.
3. Se revisaron los selectores de estilos H06 compilados en memoria con las versiones ya disponibles de Sass/PostCSS para distinguir reglas repetidas de responsive/estado de repeticiones en el mismo contexto. No se generaron artefactos ni se añadieron dependencias.
4. Se contrastaron los candidatos con las actas L04-C05 y L05-C01–C03, sin reabrir los cuatro MINOR ni los controles pendientes.

## Inventario de candidatos

| Elemento | Referencias encontradas | Decisión |
| --- | --- | --- |
| `loading-inline` / `loading-spinner` | Usados por Dashboard, Assets, History, Compare y Trading Mode; los spinners también aparecen dentro de sus estados de actualización/carga. | Conservar; son utilidades activas. |
| `--ev-shadow` | El alias incorporado en H06 respalda `var(--ev-shadow)` del helper global `.ev-surface`. | Conservar; no es token huérfano. |
| `.evaas-dialog` | `resources-dashboard.component.ts` asigna `panelClass: 'evaas-dialog'`; `create-project.dialog.scss` y `styles.scss` contienen sus reglas. | Conservar; existe un consumidor fuera de las siete superficies privadas revisadas por C05. Esto precisa la trazabilidad previa de MINOR-02. |
| `.text-accent` / `.btn-ev-gold` | Las definiciones globales existen, pero la búsqueda completa no encontró usos en plantillas, TypeScript ni scripts rastreados. | Conservar como deuda heredada MINOR-02. No se retiran helpers globales en una cápsula documental, aunque no tengan consumidores estáticos actuales. |
| Alias `--ev-gold`, `--ev-gold-2`, `--ev-gold-glow` | No se encontraron lecturas rastreadas fuera de sus definiciones. Son aliases de compatibilidad del sistema heredado. | Conservar por MINOR-02 y por compatibilidad; no hay cambio de token aprobado para esta cápsula. |
| `--crypto-accent-value-deep` | Sin lecturas rastreadas. Ya estaba definido en el baseline previo a H06 (`c55c444…`); no fue añadido por los cambios auditados. | Registrar como residuo preexistente y conservar; no ampliar el alcance de C04 a la foundation existente. |
| `.fade-in`, `.fade-out`, `.slide-up` | Sus reglas están en el módulo global de movimiento; no se encontraron usos estáticos en plantillas, TypeScript o scripts. | Conservar. Son utilidades globales preexistentes trasladadas/consolidadas por H06; no se puede descartar consumo dinámico o externo con evidencia suficiente para retirarlas. |
| `.compare-preview tbody th` | El selector aparece dos veces en el mismo contexto: una regla asigna borde/radio; otra, display y separación del contenido. Ambas propiedades tienen propósito distinto. | Conservar. La consolidación sería sólo cosmética y no justifica tocar el CSS aprobado. |
| Selectores repetidos en media queries | Los duplicados que aparecen en los módulos globales y de componentes se limitan a breakpoints o variantes responsive/estado; no son reglas duplicadas en el mismo contexto. El módulo del shell no presenta selectores duplicados en un mismo contexto. | Conservar los overrides responsive. |

`hr` se conserva como selector de elemento global: aunque `.ev-divider` no tenga referencias estáticas detectadas, `<hr>` puede aparecer como separador semántico. No se elimina ni se cambia su tratamiento cromático en esta limpieza.

## Imports, logs, fixtures y archivos

- **Imports:** los imports de `dashboard-shell.component.ts` (`Component`, señales, `ElementRef`, `HostListener`, `ViewChild`, router, filtro, servicios y `UserSession`) y `public-landing.component.ts` (`ElementRef`, `HostListener`, `ViewChild`, `signal`, `RouterLink` y `CryptoRevealDirective`) tienen usos en sus respectivos componentes. Los demás módulos de producción que aportaron cambios visuales no incorporaron imports TypeScript nuevos.
- **Logs introducidos por H06:** ninguno en el diff de producción H06; tampoco se encontraron `debugger` nuevos.
- **Logs preexistentes:** la búsqueda global sigue encontrando `console.log` en `src/app/core/auth/auth.service.ts` y `src/app/features/dashboard/resources/resources-dashboard.component.ts`. Ambos archivos son idénticos al baseline pre-H06; no se alteran aquí. Los del servicio de autenticación imprimen objetos del flujo de login/sesión, por lo que se registran como deuda previa fuera del cambio C04 y no como residuo introducido por H06.
- **Fixtures/mocks:** los datos de `analyst@example.com`, `secret1`, `fixture-token`, `fixture-refresh` y las respuestas de prueba aparecen en archivos `*.spec.ts`; no se encontraron credenciales, tokens ni fixtures accidentales en código productivo.
- **Archivos experimentales:** el diff H06 añade el SVG oficial, módulos de estilos/componentes y especificaciones, además de actas/capturas bajo `docs/branding/h06/`. No aparecen archivos de experimento fuera de la documentación H06. No se retira ni modifica evidencia, pruebas o activos de marca.

## Cambios realizados y descartados

- Cambios productivos realizados: **ninguno**.
- Candidato `.compare-preview tbody th`: descartada la fusión por ser cosmética; las dos reglas son complementarias y el CSS aprobado no necesita reordenarse.
- Helpers y tokens legacy sin referencias estáticas: descartados como eliminación en C04 por su alcance global y compatibilidad histórica, además de quedar trazados bajo MINOR-02.
- `node_modules`, dependencias, budgets Angular y archivos de configuración: sin cambios.
- Actas, capturas, pruebas y SVG oficial: intactos.

## Validación y deuda preservada

Esta cápsula sólo añade documentación, por lo que no se repitieron build ni pruebas. Se reutiliza el baseline integrado: `npm run build` PASS y `npm test -- --watch=false --browsers=ChromeHeadless` PASS, 52/52 (L05-C01/L05-C02). `git diff --check`: PASS. No hay variación de bundle C04; referencia de seguimiento `799.79 kB`. No se ejecutó lint porque no existe ese script.

Se mantienen sin modificaciones los cuatro MINOR de L05-C01:

1. **MINOR-01:** tonos financieros físicos accesibles de Dashboard.
2. **MINOR-02:** helpers gold heredados. C04 confirma que `evaas-dialog` sí se consume en el flujo de creación de recursos; `.text-accent` y `.btn-ev-gold` no tienen referencias estáticas rastreadas. La deuda no se vuelve a clasificar ni se retiran los helpers.
3. **MINOR-03:** Node local fuera del rango declarado por `package.json`.
4. **MINOR-04:** symlink autorreferente local en `node_modules`; no inspeccionado para reparación ni modificado.

También siguen pendientes, sin reabrirse como tareas nuevas:

- L05-C02: evidencia del header/hero y navegación de Landing a 768 px, medición DOM de overflow a 768 px y estados vacíos.
- L05-C03: recorrido autenticado, logout y comprobación de protección de rutas después de una sesión real.

## Conclusión

La búsqueda completa no mostró regresiones de limpieza atribuibles a H06 ni una eliminación inequívocamente segura que aporte valor suficiente. Las reglas de carga, aliases de compatibilidad, diálogo de recursos, activos de marca y evidencia conservan consumidores o una justificación documentada. Los helpers sin referencias estáticas y logs anteriores quedan señalados con su contexto y fuera del diff de C04.

C04 se cierra sólo con inventario documental: núcleo estable, implementación aprobada, validaciones y deuda residual permanecen intactos. No se realizó push, merge, despliegue, limpieza de ramas ni se inició L05-C05.
