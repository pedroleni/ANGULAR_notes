# Hidratación incremental

La **hidratación incremental** es un tipo avanzado de hidratación que puede dejar secciones de tu aplicación sin hidratar y activar la hidratación de esas secciones de forma incremental, según se necesiten.

### En esta página

- Por qué usar hidratación incremental
- Cómo habilitar la hidratación incremental en Angular
- Cómo funciona la hidratación incremental
- Controlar la hidratación del contenido con *triggers*
    - `hydrate on`
    - `hydrate when`
    - `hydrate never`
- *Triggers* de hidratación junto a *triggers* regulares
- Cómo funciona la hidratación incremental con bloques `@defer` anidados
- Restricciones
- ¿Todavía necesito especificar bloques `@placeholder`?

---

### ¿Por qué usar hidratación incremental?

La hidratación incremental es una mejora de rendimiento que se construye sobre la hidratación completa de la aplicación.

Puede producir paquetes iniciales más pequeños, manteniendo una experiencia de usuario comparable a la de una hidratación completa.

Paquetes iniciales más pequeños mejoran los tiempos de carga y reducen métricas como **FID** (*First Input Delay*) y **CLS** (*Cumulative Layout Shift*).

También permite usar *deferrable views* (`@defer`) para contenido que antes no era diferible, como contenido *above the fold*. Antes, poner un bloque `@defer` *above the fold* provocaba que se mostrara un `@placeholder` y luego fuera reemplazado por el contenido principal, causando un cambio de diseño.

Con hidratación incremental, el contenido principal del bloque `@defer` se renderiza sin cambios de diseño durante la hidratación.

---

### ¿Cómo habilitar la hidratación incremental en Angular?

Solo puede usarse en aplicaciones que ya tengan **SSR** y **hidratación** habilitada.

Primero, sigue la **Guía de SSR** y la **Guía de Hidratación**.

Luego, añade la función `withIncrementalHydration()` al *provider* `provideClientHydration`:

```tsx

import {
  bootstrapApplication,
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withIncrementalHydration())]
});

```

**NOTA:** La hidratación incremental habilita automáticamente **event replay**. Si ya tenías `withEventReplay()`, puedes quitarlo.

---

### ¿Cómo funciona la hidratación incremental?

La hidratación incremental combina:

- Hidratación completa de la aplicación
- Vistas diferibles (`@defer`)
- *Event replay*

Puedes añadir *triggers* de hidratación a bloques `@defer` para definir límites de hidratación.

Estos *triggers* indican a Angular que debe **cargar las dependencias durante SSR** y renderizar la plantilla principal (no el `@placeholder`).

En cliente, el contenido sigue **deshidratado** hasta que se dispare el *trigger*, momento en el que se cargan las dependencias y se hidrata el contenido.

Los eventos del usuario que ocurran antes de hidratarse se **almacenan** y se **reproducen** después de la hidratación.

---

### Controlar la hidratación del contenido con *triggers*

Cada bloque `@defer` puede tener **múltiples triggers** separados por `;`.

Existen tres tipos:

### `hydrate on`

Hidrata cuando ocurre un evento predefinido:

| Trigger | Descripción |
| --- | --- |
| `hydrate on idle` | Cuando el navegador está inactivo. |
| `hydrate on viewport` | Cuando el contenido entra en el viewport. |
| `hydrate on interaction` | Al interactuar con el elemento (click, keydown). |
| `hydrate on hover` | Al pasar el ratón o enfocar el área. |
| `hydrate on immediate` | Inmediatamente tras renderizar contenido no diferido. |
| `hydrate on timer` | Tras un tiempo específico. |

Ejemplos:

```tsx

@defer (hydrate on idle) {
  <large-cmp />
} @placeholder { <div>Placeholder</div> }

```

```tsx

@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder { <div>Placeholder</div> }

```

```tsx
@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder { <div>Placeholder</div> }

```

---

### `hydrate when`

Permite usar una **expresión booleana personalizada** para hidratar:

```tsx

@defer (hydrate when condition) {
  <large-cmp />
} @placeholder { <div>Placeholder</div> }

```

**NOTA:** Solo funciona si el bloque `@defer` padre ya está hidratado.

---

### `hydrate never`

Indica que el bloque no debe hidratarse nunca en la carga inicial, convirtiéndose en contenido estático.

En renderizados posteriores en cliente, sí se cargaría según su trigger normal.

```tsx

@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder { <div>Placeholder</div> }

```

---

### *Triggers* de hidratación junto a *triggers* normales

Los *hydrate triggers* son solo para la **carga inicial** con SSR.

En renderizados posteriores en cliente, se aplican los triggers normales.

```tsx
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder { <div>Placeholder</div> }

```

---

### Hidratación incremental con `@defer` anidados

Si se hidrata un bloque hijo, primero se hidrata **el bloque padre más alto que aún esté deshidratado**, y luego se hidrata el hijo.

```tsx

@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder { <div>Child placeholder</div> }
} @placeholder { <div>Parent Placeholder</div> }

```

---

### Restricciones

Las mismas que la hidratación completa:

- No manipulación directa del DOM
- HTML válido

---

### ¿Todavía necesito `@placeholder`?

Sí.

Aunque **no se usan durante la hidratación inicial**, siguen siendo necesarios para renderizados posteriores en cliente, por ejemplo, al navegar a una ruta que no formó parte de la carga inicial.

---