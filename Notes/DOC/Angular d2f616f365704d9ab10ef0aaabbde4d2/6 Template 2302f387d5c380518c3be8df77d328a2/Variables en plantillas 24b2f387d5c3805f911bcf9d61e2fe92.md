# Variables en plantillas

Angular tiene dos tipos de declaración de variables en plantillas:

1. **Variables locales de plantilla** con `@let`
2. **Variables de referencia de plantilla**

---

## 1. Variables locales de plantilla con `@let`

La sintaxis `@let` de Angular te permite definir una **variable local** y reutilizarla dentro de una plantilla, de forma similar a `let` en JavaScript.

### Usar `@let`

Utiliza `@let` para declarar una variable cuyo valor se basa en el resultado de una expresión de plantilla. Angular mantiene automáticamente el valor de la variable actualizado con la expresión dada, igual que en los *bindings*.

```html

@let name = user.name;
@let greeting = 'Hola, ' + name;
@let data = data$ | async;
@let pi = 3.14159;
@let coordinates = {x: 50, y: 100};
@let longExpression = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit '+'sed do eiusmod tempor incididunt ut labore et dolore magna ' +'Ut enim ad minim veniam...';

```

> Cada bloque @let declara exactamente una variable. No se pueden declarar varias en el mismo bloque con comas.
> 

---

### Referenciar el valor de `@let`

Una vez declarada, puedes reutilizar la variable en la misma plantilla:

```html

@let user = user$ | async;
@if (user) {
  <h1>Hola, {{user.name}}</h1>
  <user-avatar [photo]="user.photo"/>
  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{snack.name}}</li>
    }
  </ul>
  <button (click)="update(user)">Actualizar perfil</button>
}

```

---

### Asignabilidad

Una diferencia clave con `let` de JavaScript es que `@let` **no puede reasignarse** después de la declaración.

Angular actualiza automáticamente el valor según la expresión, pero no puedes modificarlo manualmente.

```html

@let value = 1;
<!-- Inválido: ¡esto no funciona! -->
<button (click)="value = value + 1">Incrementar valor</button>

```

---

### Alcance de las variables

Las declaraciones con `@let` tienen **alcance limitado** a la vista actual y sus descendientes.

Angular crea una nueva vista en los límites de componentes y donde haya contenido dinámico (bloques de control de flujo, `@defer`, directivas estructurales…).

Como no se “elevan” (*hoisted*), **no** pueden ser accedidas por vistas padre o hermanas:

```html

@let topLevel = value;
<div>
  @let insideDiv = value;
</div>
{{topLevel}} <!-- Válido -->
{{insideDiv}} <!-- Válido -->

@if (condition) {
  {{topLevel + insideDiv}} <!-- Válido -->
  @let nested = value;
  @if (condition) {
    {{topLevel + insideDiv + nested}} <!-- Válido -->
  }
}
{{nested}} <!-- Error: no se hereda desde el @if -->

```

---

### Sintaxis completa

Formalmente, la sintaxis de `@let` es:

1. La palabra clave `@let`
2. Uno o más espacios en blanco (sin incluir saltos de línea)
3. Un nombre JavaScript válido (y espacios opcionales)
4. El símbolo `=` con espacios opcionales
5. Una expresión Angular (puede ocupar varias líneas)
6. Termina con `;`

---

## 2. Variables de referencia de plantilla

Las **variables de referencia de plantilla** permiten declarar una variable que **referencia** un valor de un elemento en tu plantilla.

Una variable de referencia de plantilla puede referirse a:

- Un elemento del DOM (incluyendo *custom elements*)
- Un componente o directiva de Angular
- Un `TemplateRef` de un `<ng-template>`

Sirven para **leer información** de una parte de la plantilla en otra parte **de la misma plantilla**.

---

### Declarar una variable de referencia de plantilla

Se declara añadiendo un atributo que empieza con `#` seguido del nombre:

```html

<!-- Variable "taskInput" que referencia un HTMLInputElement -->
<input #taskInput placeholder="Introduce el nombre de la tarea">

```

---

### Asignar valores a variables de referencia

Angular asigna un valor según el elemento donde se declare la variable:

1. **En un componente de Angular** → referencia a la **instancia** del componente.

```html

<!-- "startDate" se asigna a la instancia de MyDatepicker -->
<my-datepicker #startDate />

```

1. **En un `<ng-template>`** → referencia a un `TemplateRef` que representa la plantilla.

```html
html
CopiarEditar
<!-- "myFragment" se asigna al TemplateRef de este fragmento -->
<ng-template #myFragment>
  <p>Este es un fragmento de plantilla</p>
</ng-template>

```

1. **En cualquier otro elemento HTML** → referencia al `HTMLElement` correspondiente.

```html

<!-- "taskInput" referencia al HTMLInputElement -->
<input #taskInput placeholder="Introduce el nombre de la tarea">

```

---

### Referenciar directivas con `exportAs`

Las directivas pueden definir un nombre con `exportAs` para ser referenciadas:

```tsx

@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone { /* ... */ }

```

Luego, al declarar la variable, puedes asignarla a la instancia de la directiva:

```html

<!-- "firstZone" referencia la instancia de DropZone -->
<section dropZone #firstZone="dropZone"> ... </section>

```

> No puedes referenciar una directiva que no tenga exportAs.
> 

---

### Usar variables de referencia con consultas (`queries`)

Además de usarlas en la misma plantilla, las variables pueden servir como **marcadores** para que un componente o directiva las localice con `@ViewChild` o `@ViewChildren`.

```html

<input #description value="Descripción original">

```

```tsx

@Component({
  /* ... */,
  template: `<input #description value="Descripción original">`,
})
export class AppComponent {
  @ViewChild('description') input: ElementRef | undefined;
}

```

Consulta **Referenciar elementos hijos con queries** para más detalles.