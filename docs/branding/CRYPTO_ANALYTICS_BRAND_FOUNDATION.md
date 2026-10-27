# Crypto Analytics Brand Foundation

**Estado:** Brand System v1.0 implementado en H06; validación y liberación tienen alcances separados.

**Versión documental:** 1.0 · actualización de cierre EVW-CRYPTO-H06-L05-C05.

**Trazabilidad:** esta foundation viva sucede al documento v0.4; preserva su historial y las decisiones experimentales originales. El acta [L05-C05](h06/L05-C05_brand_foundation_closure.md) reúne evidencias, límites y deuda.

## Esencia y promesa

Crypto Analytics es una experiencia de lectura analítica y contextual del mercado. Organiza datos, indicadores, predicciones, señales interpretativas e histórico para facilitar su comprensión y apoyar una decisión humana informada.

**Promesa:** «Lee el mercado con contexto.»

El producto no promete rentabilidad, certeza ni señales infalibles. Trading Mode es una interfaz analítica: no ejecuta órdenes y no constituye recomendación financiera.

## Principios

Claridad, lectura, contexto, explicabilidad, valor, control humano y continuidad. El diseño ayuda a observar y comprender; la interpretación y cualquier decisión financiera corresponden a la persona usuaria.

## Paleta y roles cromáticos

La identidad de interfaz usa cuatro familias. Los valores canónicos de Brand System v1.0 y sus roles se mantienen distintos de los colores financieros y de los colores internos del activo de marca.

| Familia / token canónico | Valor | Rol |
| --- | --- | --- |
| DARK · `--crypto-bg` | `#09121d` | Profundidad del mercado y fondo principal. |
| DARK · `--crypto-surface` | `#101c29` | Paneles y cards; la capa elevada y suave se implementan con `--crypto-bg-elevated` (`#0d1824`) y `--crypto-surface-soft` (`#152535`). |
| LIGHT · `--crypto-text` | `#f2f7fb` | Lectura primaria; `--crypto-text-muted` (`#a9bac8`) corresponde a lectura secundaria. |
| CYAN · `--crypto-accent-tech` | `#52d5d3` | Tecnología, interacción, enlaces, navegación y actividad. `--crypto-accent-tech-strong` (`#96f2df`) es énfasis técnico implementado. |
| GOLD · `--crypto-accent-value` | `#d6b35a` | Valor, acento editorial y jerarquía puntual. `--crypto-accent-value-strong` (`#f0d889`) es un énfasis gold controlado. |

Los tokens de bordes, foco, sombras, radios y espacio completan la implementación en `src/styles/_crypto-tokens.scss`. Sus extensiones técnicas no amplían por sí solas la norma cromática corporativa; su inventario está en [L01-C03](h06/L01-C03_token_map.md).

### Semántica separada de identidad

- **CYAN** describe tecnología e interacción. **GOLD** aporta valor editorial o jerarquía visual puntual. Su separación permite que navegación/foco y énfasis de valor se entiendan con responsabilidades diferentes.
- Gold no significa BUY, éxito financiero, ganancia, rentabilidad, alza, señal premium ni predicción exitosa.
- BUY/SELL/HOLD, signo de retorno, confianza y rendimiento conservan su semántica financiera propia. Éxito, warning, peligro, neutralidad, carga, error, vacío y disponibilidad conservan roles operacionales con texto y señales accesibles; no se deducen de cyan o gold.
- Series, ejes, unidades, escalas, timestamps y colores de datos conservan su significado analítico.

## Marca gráfica y tipografía

El monograma CA maestro integrado es `public/brand/CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg`. Su SVG conserva los colores internos blanco `#FDFCFB`, turquesa `#00F9FA` y azul `#008CFD`; son colores del logo, no los tokens CYAN/GOLD de UI. El activo se consume como SVG y no se recolorea mediante CSS.

La interfaz usa **Inter** cuando está disponible, con la pila de sistema como fallback. Los títulos son compactos y de peso alto; el texto prioriza legibilidad. No se declara una tipografía institucional exclusiva más allá de esta aplicación.

## Superficies y componentes

Fondos DARK y paneles sobrios, bordes sutiles, radios implementados de 8–20 px y sombras bajas definen la superficie. La foundation compartida aporta tokens, tipografía, cards/paneles, formularios, botones, foco visible, alertas, contenedor, utilidades y movimiento reducido. Los componentes existentes mantienen su estructura y contratos.

El Brand System se aplica y valida en estas superficies:

| Superficie | Aplicación |
| --- | --- |
| Landing `/` | Identidad, promesa, navegación, contenido editorial e ilustraciones de lectura analítica. |
| Login `/login` | Monograma, promesa, formulario y estados de autenticación. |
| Shell, sidebar y topbar | Continuidad de marca, orientación, navegación, cuenta y estados del menú. |
| Dashboard | Jerarquía de métricas, filtros y lectura de señales contextualizadas. |
| Assets | Identidad editorial, disponibilidad y tabla con desplazamiento interno. |
| History | Controles, gráficas e histórico, preservando la semántica de los datos. |
| Compare | Selección, correlación y tablas; sin convertir la relación analítica en recomendación. |
| Trading Mode | Lectura de señal, indicadores, contexto y enlaces externos; interfaz analítica sin ejecución de órdenes. |

La evidencia y los límites por viewport están consolidados en L03, L04 y L05; no implican que las vistas privadas estén publicadas en producción.

## Movimiento y accesibilidad

La landing usa reveal breve mediante `IntersectionObserver` sólo para contenido no crítico. No se utiliza parallax ni movimiento permanente. Con `prefers-reduced-motion: reduce`, todo el contenido permanece visible, los desplazamientos suaves se eliminan y las transiciones decorativas se reducen. La navegación SPA conserva su funcionalidad.

La implementación validada incluye jerarquía semántica y landmarks, etiquetas/nombres accesibles, navegación por teclado, foco visible, diálogos y menú móvil con cierre y retorno de foco, contraste WCAG AA en pares medidos y estados de interacción documentados. El estado de accesibilidad es **validado con límites**: siguen pendientes la evidencia tablet del header/hero/navegación de landing a 768 px, medición DOM de overflow a 768 px, estados vacíos y el recorrido autenticado real en producción con protección después de logout. Los detalles están en [L05-C02](h06/L05-C02_visual_accessibility_validation.md) y [L05-C03](h06/L05-C03_production_smoke.md).

## Voz y relación institucional

La voz es analítica, clara, sobria, tecnológica y precisa. Habla de lectura, contexto, observación y explicación; evita presentar predicciones como certeza, rendimiento garantizado o ejecución.

Crypto Analytics tiene identidad de producto propia. Espacios Virtuales es su origen y relación institucional. EVAAS se menciona como ecosistema cuando el contexto lo requiere, sin sustituir el nombre ni diluir la identidad de Crypto Analytics. Este documento registra decisiones de producto e implementación; no declara aprobaciones comerciales, societarias o legales.

## Evolución de decisiones

### BRAND-DEC-001 · Cyan provisional

**Estado de origen:** EXPERIMENTAL. **Origen:** landing H05. Se introdujo `#52d5d3` como acento tecnológico provisional. La decisión no se reescribe retrospectivamente. H06 conserva ese valor como token canónico de interacción del Brand System v1.0.

### BRAND-DEC-002 · Gold provisional

**Estado de origen:** EXPERIMENTAL. **Origen:** exploración landing. Se introdujo `#D6B35A` como hipótesis de acento de valor, con la restricción expresa de no equivaler a BUY, ganancia o rentabilidad. H06 conserva el color con rol editorial/jerárquico acotado; su estado experimental histórico permanece trazable.

### BRAND-DEC-003 · Adopción de H06

**Estado:** IMPLEMENTED en `develop`; validación documentada con límites. H06 adopta los valores y roles de interfaz, el monograma CA SVG v1.0 con colores propios, la tipografía y superficies implementadas, el patrón de movimiento reducido, la voz de producto y la aplicación en las ocho superficies enumeradas arriba. Las actas de L01–L05 respaldan implementación, pruebas técnicas y evidencia visual/accesible. La producción identificada en L05-C03 aún sirve una versión anterior a H06; por eso esta decisión no marca H06 como RELEASED.

Cyan y gold conservan responsabilidades diferentes: cyan comunica tecnología e interacción; gold organiza valor y énfasis editorial. Ninguno sustituye estados operacionales ni señales financieras. Gold no representa BUY, éxito financiero, ganancia ni rentabilidad. Trading Mode mantiene lectura analítica, enlaces externos y contexto, sin ejecución de órdenes.

Continúan abiertos a evolución controlada la escala tipográfica/espacial y tokens extendidos, la iconografía complementaria, fotografía/ilustración, nomenclatura para futuros productos, composición institucional con Espacios Virtuales y relación de marca de Trading Mode. Su evolución requiere evidencia y una decisión posterior; no reabre los roles aprobados de v1.0 ni constituye alcance de C05.

## Registro histórico

- **v0.1:** extracción desde H05.
- **v0.2:** cyan + gold como decisiones experimentales.
- **v0.3:** landing SPA.
- **v0.4:** transposición al dashboard; documento vivo anterior a H06.
- **v1.0:** consolidación documental del Brand System implementado en H06; decisiones previas preservadas y límites de validación/producción explícitos.
