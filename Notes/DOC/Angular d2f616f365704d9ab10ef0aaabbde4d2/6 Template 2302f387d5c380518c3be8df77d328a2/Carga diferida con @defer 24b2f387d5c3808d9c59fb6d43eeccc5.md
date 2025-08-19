# Carga diferida con @defer

Las **vistas diferibles** (*deferrable views*), también conocidas como **bloques `@defer`**, reducen el tamaño inicial del *bundle* de tu aplicación retrasando la carga del código que no es estrictamente necesario para el renderizado inicial de una página.

Esto normalmente se traduce en una carga inicial más rápida y en una mejora de las **Core Web Vitals (CWV)**, especialmente en **Largest Contentful Paint (LCP)** y **Time to First Byte (TTFB)**.

Para usar esta funcionalidad, puedes envolver declarativamente una sección de tu plantilla en un bloque `@defer`:

```html

@defer {
  <large-component />
}

```

El código de cualquier componente, directiva o pipe dentro de un bloque `@defer` se divide en un archivo JavaScript separado y se carga solo cuando es necesario, **después** de que el resto de la plantilla haya sido renderizada.

Las vistas diferibles admiten varios **disparadores** (*triggers*), opciones de **prefetch** y sub-bloques para gestionar **placeholders**, estados de **carga** y **error**.

---

## ¿Qué dependencias se diferencian?

Los **componentes**, **directivas**, **pipes** y cualquier **CSS** de componentes pueden diferirse al cargar una aplicación.

Para que las dependencias dentro de un `@defer` se carguen de forma diferida, deben cumplir dos condiciones:

1. **Ser independientes (*standalone*)**. Las dependencias no independientes no pueden diferirse y se cargan de inmediato, incluso si están dentro de un `@defer`.
2. **No estar referenciadas fuera del bloque `@defer`** en el mismo archivo. Si se usan fuera del bloque o en queries como `ViewChild`, se cargarán inmediatamente.

> Las dependencias transitivas de los elementos dentro de @defer no tienen que ser standalone; pueden estar en un NgModule y aun así cargarse de forma diferida.
> 

El compilador de Angular genera una **importación dinámica** para cada componente, directiva o pipe dentro del `@defer`. El contenido principal del bloque se renderiza después de que todas las importaciones se resuelven. Angular **no garantiza** un orden específico de carga.

---

## Cómo gestionar las etapas de la carga diferida

Un bloque `@defer` puede tener varios **sub-bloques** para manejar las distintas fases de la carga diferida:

### `@defer`

Define la sección que se cargará de forma diferida.

No se renderiza inicialmente; su contenido se carga y muestra cuando se cumple el **trigger** o la condición **when**.

Por defecto, un bloque `@defer` se dispara cuando el navegador entra en estado **idle**.

```html

@defer {
  <large-component />
}

```

---

### Mostrar contenido provisional con `@placeholder`

Por defecto, un `@defer` no muestra nada antes de activarse.

El bloque opcional `@placeholder` define el contenido que se muestra **antes** de que se dispare el `@defer`.

```html

@defer {
  <large-component />
} @placeholder {
  <p>Contenido provisional</p>
}

```

Cuando la carga termina, Angular reemplaza el placeholder por el contenido real.

Las dependencias usadas en el placeholder **se cargan inmediatamente**.

### Duración mínima del placeholder

Puedes indicar un tiempo mínimo para que el placeholder permanezca visible:

```html

@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Contenido provisional</p>
}

```

El tiempo se especifica en milisegundos (`ms`) o segundos (`s`). Esto evita que el placeholder parpadee si la carga es demasiado rápida.

---

### Mostrar contenido de carga con `@loading`

El bloque opcional `@loading` se muestra **mientras** se cargan las dependencias diferidas.

Reemplaza al `@placeholder` cuando comienza la carga.

```html

@defer {
  <large-component />
} @loading {
  <img alt="cargando..." src="loading.gif" />
} @placeholder {
  <p>Contenido provisional</p>
}

```

Las dependencias de `@loading` también se cargan inmediatamente.

### Parámetros opcionales de `@loading`:

- **`minimum`** → tiempo mínimo que debe mostrarse el contenido de carga.
- **`after`** → tiempo de espera después de que empiece la carga antes de mostrarlo.

```html

@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="cargando..." src="loading.gif" />
}

```

---

### Mostrar error con `@error`

El bloque opcional `@error` se muestra si la carga diferida falla.

Sus dependencias también se cargan inmediatamente.

```html

@defer {
  <large-component />
} @error {
  <p>No se pudo cargar el componente.</p>
}

```

---

## Controlar la carga diferida con *triggers*

Puedes indicar **cuándo** Angular debe cargar y mostrar el contenido diferido.

Los triggers disponibles se configuran así:

```html

@defer (on tipoTrigger) { ... }

```

Puedes combinar varios triggers separándolos con `;` (evaluados como condición OR).

### Tipos de triggers (`on`)

| Trigger | Descripción |
| --- | --- |
| **idle** | Cuando el navegador está inactivo (*idle*). **Por defecto**. |
| **viewport** | Cuando el contenido entra en el *viewport*. |
| **interaction** | Cuando el usuario interactúa con un elemento. |
| **hover** | Cuando el ratón pasa sobre un área. |
| **immediate** | Inmediatamente después de renderizar el contenido no diferido. |
| **timer** | Después de un tiempo específico. |

---

### Idle

```html

@defer (on idle) {
  <large-cmp />
} @placeholder {
  <div>Placeholder del componente grande</div>
}

```

---

### Viewport

Carga cuando el contenido observado entra en pantalla (usando Intersection Observer API).

```html

@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Placeholder del componente grande</div>
}

```

Por defecto, observa el placeholder. Debe tener un único elemento raíz.

También puedes observar un elemento concreto usando una variable de referencia:

```html

<div #greeting>¡Hola!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}

```

## **Interaction**

El *trigger* **interaction** carga el contenido diferido cuando el usuario interactúa con el elemento especificado mediante eventos de **click** o **keydown**.

Por defecto, el *placeholder* actúa como el elemento de interacción.

Cuando se usa de esta manera, el placeholder debe tener un único elemento raíz.

```html

@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Placeholder del componente grande</div>
}

```

También puedes especificar una **variable de referencia de plantilla** en la misma plantilla que el bloque `@defer` como el elemento que se observará para las interacciones. Esta variable se pasa como parámetro al *trigger* `interaction`:

```html

<div #greeting>¡Hola!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}

```

---

## **Hover**

El *trigger* **hover** carga el contenido diferido cuando el ratón pasa sobre el área activada, a través de eventos **mouseover** y **focusin**.

Por defecto, el placeholder actúa como el elemento de interacción.

Cuando se usa de esta manera, el placeholder debe tener un único elemento raíz.

```html

@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Placeholder del componente grande</div>
}

```

También puedes especificar una **variable de referencia de plantilla** como el elemento observado:

```html

<div #greeting>¡Hola!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}

```

---

## **Immediate**

El *trigger* **immediate** carga el contenido diferido inmediatamente, es decir, tan pronto como todo el contenido no diferido haya terminado de renderizarse.

```html

@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>Placeholder del componente grande</div>
}

```

---

## **Timer**

El *trigger* **timer** carga el contenido diferido después de una duración específica.

```html

@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Placeholder del componente grande</div>
}

```

La duración debe especificarse en milisegundos (`ms`) o segundos (`s`).

---

## **When**

El *trigger* **when** acepta una expresión condicional personalizada y carga el contenido diferido cuando la condición se evalúa como verdadera.

```html

@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Placeholder del componente grande</div>
}

```

> Es una operación de una sola vez: el bloque @defer no vuelve al placeholder si la condición pasa a ser falsa después de haber sido verdadera.
> 

---

## Prefetching de datos con **prefetch**

Además de especificar una condición para mostrar el contenido diferido, puedes definir un **trigger de prefetch**.

Esto permite cargar el JavaScript asociado al bloque `@defer` **antes** de mostrar el contenido diferido.

El *prefetch* permite comportamientos avanzados, como comenzar a precargar recursos antes de que el usuario haya visto o interactuado con el bloque, pero con la expectativa de que lo haga pronto.

Se especifica igual que el *trigger* principal, pero precedido de la palabra clave `prefetch`. El *trigger* principal y el de *prefetch* se separan con punto y coma (`;`).

Ejemplo:

Se precarga cuando el navegador está en estado **idle**, y se muestra el contenido solo cuando el usuario interactúa con el placeholder:

```html

@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Placeholder del componente grande</div>
}

```

---

## Probar bloques `@defer`

Angular proporciona APIs de **TestBed** para facilitar las pruebas de bloques `@defer` y activar manualmente los distintos estados durante las pruebas.

Por defecto, los bloques `@defer` en pruebas se comportan como lo harían en una aplicación real.

Si quieres controlar manualmente sus estados, puedes configurar el comportamiento como **Manual** en `TestBed`:

```tsx

it('debería renderizar un bloque defer en diferentes estados', async () => {
  TestBed.configureTestingModule({deferBlockBehavior: DeferBlockBehavior.Manual});

  @Component({
    template: `
      @defer {
        <large-component />
      } @placeholder {
        Placeholder
      } @loading {
        Loading...
      }
    `
  })
  class ComponentA {}

  const componentFixture = TestBed.createComponent(ComponentA);
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];

  expect(componentFixture.nativeElement.innerHTML).toContain('Placeholder');

  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('Loading');

  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});

```

---

## ¿Funciona `@defer` con NgModule?

Los bloques `@defer` son compatibles tanto con componentes, directivas y pipes *standalone* como con los basados en **NgModule**.

Sin embargo, **solo** los elementos *standalone* pueden diferirse; los que dependen de NgModule se incluyen en el *bundle* cargado inmediatamente.

---

## ¿Cómo funciona `@defer` con SSR y SSG?

Por defecto, al renderizar en el servidor (**SSR** o **SSG**), los bloques `@defer` siempre muestran su `@placeholder` (o nada si no hay placeholder), y **los triggers no se ejecutan**.

En el cliente, el contenido del placeholder se hidrata y los triggers se activan.

Si quieres renderizar el contenido principal de `@defer` en el servidor, puedes habilitar **Incremental Hydration** y configurar *hydrate triggers* para los bloques necesarios.

---

## Buenas prácticas para diferir vistas

1. **Evitar cargas en cascada** con `@defer` anidados
    - Si tienes bloques anidados, usa triggers distintos para evitar que se carguen al mismo tiempo, lo que podría provocar muchas solicitudes simultáneas y degradar el rendimiento.
2. **Evitar cambios de layout (layout shifts)**
    - No difieras componentes visibles en el viewport inicial, ya que esto puede aumentar el **CLS** (Cumulative Layout Shift).
    - Si es inevitable, evita triggers como `immediate`, `timer`, `viewport` y `when` que se ejecutan durante la renderización inicial.