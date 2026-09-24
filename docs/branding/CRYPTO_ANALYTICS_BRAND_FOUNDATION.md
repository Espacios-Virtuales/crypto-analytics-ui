# Crypto Analytics Brand Foundation

Status: Living document
Version: 0.4
Source: product-derived

## Esencia

Crypto Analytics es un producto de lectura analítica del mercado. Convierte datos, indicadores, predicciones, señales e histórico en una interfaz que prioriza contexto y comprensión. No es una plataforma de ejecución automática, una promesa de rentabilidad, un servicio de señales infalibles ni una campaña comercial.

## Principios

Claridad, lectura, contexto, explicabilidad, valor, control humano y continuidad guían las decisiones visuales. El producto debe ayudar a observar y comprender; una decisión financiera siempre corresponde a la persona usuaria.

## Paleta y roles

| Token | Valor | Rol |
| --- | --- | --- |
| `--crypto-bg` | `#09121d` | Profundidad del mercado y fondo base. |
| `--crypto-surface` | `#101c29` | Paneles, tarjetas y capas legibles. |
| `--crypto-text` | `#f2f7fb` | Lectura primaria. |
| `--crypto-text-muted` | `#a9bac8` | Metadatos y lectura secundaria. |
| `--crypto-accent-tech` | `#52d5d3` | Tecnología, interacción y estados activos. |
| `--crypto-accent-tech-strong` | `#96f2df` | Énfasis tecnológico y foco. |
| `--crypto-accent-value` | `#d6b35a` | Valor, activo y jerarquía decorativa. |
| `--crypto-accent-value-strong` | `#f0d889` | Énfasis selectivo de valor. |
| `--crypto-accent-value-deep` | `#8f7130` | Profundidad del acento de valor. |

DARK representa profundidad de mercado; CYAN análisis, tecnología e interacción; GOLD valor, activo y jerarquía; LIGHT claridad de lectura. Los colores de marca no sustituyen colores operacionales: éxito, advertencia, peligro y neutral siguen siendo semánticos. En particular, gold nunca equivale a BUY, ganancia, rentabilidad ni predicción exitosa.

## Tipografía, superficies y componentes

La tipografía implementada es `Inter` cuando está disponible, con la pila de sistema como fallback. Los títulos son compactos y de peso alto; el texto de interfaz prioriza legibilidad. Las superficies usan fondo oscuro, borde sutil, radios de 8–20 px y sombras bajas.

Primitivas compartidas: tokens CSS, superficies de cards/paneles, controles de formulario, botones, foco visible, alertas, utilidades de contenedor y eyebrow. Las implementaciones privadas conservan sus componentes actuales y consumen esos roles mediante tokens; no se introdujeron cambios de lógica.

## Motion

La landing usa una primitiva de reveal basada en `IntersectionObserver`, limitada a entradas cortas de contenido no crítico. No hay parallax ni movimiento permanente. Con `prefers-reduced-motion: reduce` todo contenido permanece inmediatamente visible y las transiciones se reducen; la SPA conserva navegación y lectura completas.

## Voz

La voz es analítica, clara, sobria, tecnológica y precisa. No es especulativa ni agresivamente comercial. Se habla de lectura, contexto y observación, no de certeza, rendimiento o ejecución.

## Relación institucional

Crypto Analytics es un producto con identidad propia. Espacios Virtuales es su origen y relación institucional. EVAAS se menciona como ecosistema cuando el contexto lo requiere, sin diluir la identidad del producto.

## Open Brand Questions

- Isotipo, símbolo y logo definitivo.
- Tipografía institucional.
- Escala gold y escala cyan.
- Iconografía, fotografía e ilustración.
- Nomenclatura y relación con futuros productos.
- Relación con Trading Mode.
- Composición con Espacios Virtuales.

## Decision log

### BRAND-DEC-001

Estado: EXPERIMENTAL

Decisión: Mantener `#52d5d3` como acento tecnológico provisional.

Origen: Landing H05.

Revisar cuando: Comience el estudio cromático formal.

### BRAND-DEC-002

Estado: EXPERIMENTAL

Decisión: Introducir `#D6B35A` como acento de valor.

Hipótesis: Distinguir análisis tecnológico de valor/activo.

Restricción: No usar como equivalencia de BUY, ganancia o rentabilidad.

Revisar cuando: Se ejecute estudio formal de branding.

## Evolución

- v0.1: extracción desde H05.
- v0.2: cyan + gold.
- v0.3: landing SPA.
- v0.4: transposición al dashboard.
- v0.5+: estudio formal.
- v1.0: identidad validada.
