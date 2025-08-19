# Crear fragmentos de plantilla con ng-template

[Resumen ](Crear%20fragmentos%20de%20plantilla%20con%20ng-template%2024b2f387d5c3805db9ffe232bfc5d602/Resumen%2024b2f387d5c38031b29af0e20cc52017.md)

## Crear fragmentos de plantilla con `ng-template`

Inspirado en el elemento nativo `<template>`, el elemento `<ng-template>` te permite declarar un **fragmento de plantilla**: una sección de contenido que puedes renderizar de forma dinámica o programática.

---

### Crear un fragmento de plantilla

Puedes crear un fragmento de plantilla dentro de cualquier plantilla de componente usando el elemento `<ng-template>`:

```html

<p>Este es un elemento normal</p>
<ng-template>
  <p>Este es un fragmento de plantilla</p>
</ng-template>

```

Cuando se renderiza lo anterior, el contenido del elemento `<ng-template>` **no** se renderiza en la página.

En su lugar, puedes obtener una referencia al fragmento de plantilla y escribir código para renderizarlo dinámicamente.

---

### Enlazar contexto para fragmentos

Los fragmentos de plantilla pueden contener enlaces (*bindings*) con expresiones dinámicas:

```tsx

@Component({
  /* ... */,
  template: `<ng-template>Has seleccionado {{count}} elementos.</ng-template>`,
})
export class ItemCounter {
  count: number = 0;
}

```

Las expresiones o sentencias en un fragmento de plantilla se evalúan contra el componente **en el que el fragmento fue declarado**, sin importar **dónde** se renderice el fragmento.

---

### Obtener una referencia a un fragmento de plantilla

Puedes obtener una referencia a un fragmento de plantilla de **tres maneras**:

1. Declarando una **variable de referencia de plantilla** en el elemento `<ng-template>`.
2. Consultando el fragmento con una **query** desde un componente o directiva.
3. Inyectando el fragmento en una directiva aplicada directamente a un `<ng-template>`.

En los tres casos, el fragmento está representado por un objeto **`TemplateRef`**.

---

### Referenciar un fragmento con una variable de referencia de plantilla

Puedes añadir una variable de referencia de plantilla a un elemento `<ng-template>` para referenciar ese fragmento en otras partes del **mismo archivo de plantilla**:

```html

<p>Este es un elemento normal</p>
<ng-template #miFragmento>
  <p>Este es un fragmento de plantilla</p>
</ng-template>

```

Luego puedes referenciar este fragmento en cualquier otra parte de la misma plantilla usando la variable `miFragmento`.

---

### Referenciar un fragmento con queries

Puedes obtener una referencia a un fragmento usando cualquier API de consulta de componentes o directivas.

Por ejemplo, si tu plantilla tiene exactamente **un** fragmento de plantilla, puedes obtenerlo directamente con `@ViewChild` consultando por el objeto `TemplateRef`:

```tsx

@Component({
  /* ... */,
  template: `
    <p>Este es un elemento normal</p>
    <ng-template>
      <p>Este es un fragmento de plantilla</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  @ViewChild(TemplateRef) miFragmento: TemplateRef<unknown> | undefined;
}

```

Podrás usar esta referencia en el código del componente o en su plantilla como cualquier otra propiedad de clase.

---

Si la plantilla contiene **varios** fragmentos, puedes asignar un nombre a cada uno añadiendo una variable de referencia de plantilla en cada `<ng-template>`, y luego consultarlos por nombre:

```tsx

@Component({
  /* ... */,
  template: `
    <p>Este es un elemento normal</p>
    <ng-template #fragmentoUno>
      <p>Este es un fragmento de plantilla</p>
    </ng-template>
    <ng-template #fragmentoDos>
      <p>Este es otro fragmento de plantilla</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  // Cuando consultas por nombre, puedes usar la opción `read`
  // para indicar que quieres obtener el TemplateRef asociado.
  @ViewChild('fragmentoUno', {read: TemplateRef}) fragmentoUno: TemplateRef<unknown> | undefined;
  @ViewChild('fragmentoDos', {read: TemplateRef}) fragmentoDos: TemplateRef<unknown> | undefined;
}

```

De nuevo, podrás usar estas referencias en el código del componente o en su plantilla como cualquier otra propiedad.

## Inyectar un fragmento de plantilla

Una directiva puede inyectar un `TemplateRef` si la directiva se aplica directamente a un elemento `<ng-template>`:

```tsx

@Directive({
  selector: '[myDirective]'
})
export class MyDirective {
  private fragment = inject(TemplateRef);
}

```

```html

<ng-template myDirective>
  <p>Este es un fragmento de plantilla</p>
</ng-template>

```

Luego puedes usar esta referencia al fragmento dentro del código de tu directiva como cualquier otra propiedad de clase.

---

## Renderizar un fragmento de plantilla

Una vez que tienes una referencia al objeto `TemplateRef` de un fragmento, puedes renderizarlo de dos maneras:

1. En la plantilla, con la directiva **`NgTemplateOutlet`**.
2. En el código TypeScript, con **`ViewContainerRef`**.

---

### Usando `NgTemplateOutlet`

La directiva `NgTemplateOutlet` de `@angular/common` acepta un `TemplateRef` y renderiza el fragmento como un hermano del elemento que tiene el *outlet*.

Generalmente se recomienda usar `NgTemplateOutlet` sobre un elemento `<ng-container>`.

Primero, importa `NgTemplateOutlet`:

```tsx

import { NgTemplateOutlet } from '@angular/common';

```

Ejemplo:

```html

<p>Este es un elemento normal</p>
<ng-template #miFragmento>
  <p>Este es un fragmento</p>
</ng-template>
<ng-container *ngTemplateOutlet="miFragmento"></ng-container>

```

Salida en el DOM:

```html

<p>Este es un elemento normal</p>
<p>Este es un fragmento</p>

```

---

### Usando `ViewContainerRef`

Un *view container* es un nodo en el árbol de componentes de Angular que puede contener contenido.

Cualquier componente o directiva puede inyectar `ViewContainerRef` para obtener una referencia al contenedor de vista correspondiente a su ubicación en el DOM.

Puedes usar el método `createEmbeddedView` de `ViewContainerRef` para renderizar un fragmento de plantilla de forma dinámica.

Cuando renderizas un fragmento con `ViewContainerRef`, Angular lo añade al DOM como el siguiente hermano del componente o directiva que inyectó el `ViewContainerRef`.

Ejemplo:

```tsx

@Component({
  /* ... */,
  selector: 'component-with-fragment',
  template: `
    <h2>Componente con un fragmento</h2>
    <ng-template #miFragmento>
      <p>Este es el fragmento</p>
    </ng-template>
    <my-outlet [fragment]="miFragmento" />
  `,
})
export class ComponentWithFragment { }

@Component({
  /* ... */,
  selector: 'my-outlet',
  template: `<button (click)="mostrarFragmento()">Mostrar</button>`,
})
export class MyOutlet {
  private viewContainer = inject(ViewContainerRef);
  fragment = input<TemplateRef<unknown> | undefined>();

  mostrarFragmento() {
    if (this.fragment()) {
      this.viewContainer.createEmbeddedView(this.fragment());
    }
  }
}

```

Al hacer clic en **"Mostrar"**, el resultado sería:

```html

<component-with-fragment>
  <h2>Componente con un fragmento</h2>
  <my-outlet>
    <button>Mostrar</button>
  </my-outlet>
  <p>Este es el fragmento</p>
</component-with-fragment>

```

---

## Pasar parámetros al renderizar un fragmento de plantilla

Cuando declaras un fragmento con `<ng-template>`, puedes definir parámetros que acepte dicho fragmento.

Cuando lo renderizas, puedes pasar opcionalmente un **objeto de contexto** con esos parámetros.

Los datos de este objeto se pueden usar en expresiones y sentencias de *binding*, además de poder acceder a datos del componente donde se declaró el fragmento.

Cada parámetro se escribe como un atributo con el prefijo `let-`, cuyo valor coincide con una propiedad del objeto de contexto:

```html

<ng-template let-pizzaTopping="topping">
  <p>Has seleccionado: {{pizzaTopping}}</p>
</ng-template>

```

---

### Usando `NgTemplateOutlet`

Puedes vincular un objeto de contexto al *input* `ngTemplateOutletContext`:

```html
html
CopiarEditar
<ng-template #miFragmento let-pizzaTopping="topping">
  <p>Has seleccionado: {{pizzaTopping}}</p>
</ng-template>

<ng-container
  [ngTemplateOutlet]="miFragmento"
  [ngTemplateOutletContext]="{topping: 'cebolla'}">
</ng-container>

```

---

### Usando `ViewContainerRef`

Puedes pasar un objeto de contexto como segundo argumento de `createEmbeddedView`:

```tsx
typescript
CopiarEditar
this.viewContainer.createEmbeddedView(this.miFragmento, {topping: 'cebolla'});

```

---

## Directivas estructurales

Una **directiva estructural** es cualquier directiva que:

- Inyecta `TemplateRef`.
- Inyecta `ViewContainerRef` y renderiza programáticamente el `TemplateRef` inyectado.

Angular ofrece una **sintaxis especial** para las directivas estructurales:

Si aplicas la directiva a un elemento y el selector de la directiva está precedido por un asterisco (`*`), Angular interpreta todo el elemento y su contenido como un fragmento de plantilla:

```html

<section *myDirective>
  <p>Este es un fragmento</p>
</section>

```

Esto es equivalente a:

```html

<ng-template myDirective>
  <section>
    <p>Este es un fragmento</p>
  </section>
</ng-template>

```

Los desarrolladores suelen usar directivas estructurales para renderizar fragmentos **condicionalmente** o para renderizar fragmentos **múltiples veces**.

Para más detalles, consulta la documentación de **Directivas estructurales**.

---

Si quieres, puedo ahora unificar **todo el bloque de documentación de `<ng-template>`** (incluyendo lo que ya te traduje antes) en un único documento en castellano, limpio y ordenado para que lo tengas como guía de referencia.