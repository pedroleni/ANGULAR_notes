# Binding dynamic text, properties and attributes

## En Angular, un **binding** crea una conexión dinámica entre la plantilla de un componente y sus datos.

Esta conexión asegura que los cambios en los datos del componente actualicen automáticamente la plantilla renderizada.

---

### En esta página

- Renderizar texto dinámico con interpolación de texto
- Enlazar propiedades y atributos dinámicos
- Propiedades de elementos nativos
- Propiedades de componentes y directivas
- Atributos
- Interpolación de texto en propiedades y atributos
- Binding de clases y estilos CSS
    - Clases CSS
    - Propiedades de estilo CSS

---

## Renderizar texto dinámico con interpolación de texto

Puedes enlazar texto dinámico en plantillas usando **dobles llaves** `{{ }}`, que le indican a Angular que es responsable de evaluar la expresión interna y mantenerla actualizada.

Esto se llama **interpolación de texto**.

```tsx

@Component({
  template: `
    <p>Tu preferencia de color es {{ theme }}.</p>
  `,
  ...
})
export class AppComponent {
  theme = 'oscuro';
}

```

**Salida renderizada:**

```html

<p>Tu preferencia de color es oscuro.</p>

```

---

Los bindings que cambian con el tiempo deben leer valores desde **signals**.

Angular rastrea los signals leídos en la plantilla y actualiza la página renderizada cuando cambian sus valores.

```tsx

@Component({
  template: `
    <!-- Puede que no se actualice si `welcomeMessage` cambia -->
    <p>{{ welcomeMessage }}</p>

    <!-- Siempre se actualiza cuando el signal `theme` cambia -->
    <p>Tu preferencia de color es {{ theme() }}.</p>
  `
  ...
})
export class AppComponent {
  welcomeMessage = "Bienvenido, disfruta esta aplicación";
  theme = signal('oscuro');
}

```

Si el usuario cambia el `theme` a `'claro'`, la salida sería:

```html

<p>Tu preferencia de color es claro.</p>

```

La interpolación de texto se puede usar en cualquier lugar donde normalmente escribirías texto en HTML.

Todos los valores se convierten a **string**; objetos y arrays usan su método `toString()`.

---

## Enlazar propiedades y atributos dinámicos

Angular permite enlazar valores dinámicos a propiedades de objetos y atributos HTML usando **corchetes** `[ ]`.

Puedes enlazar a propiedades de:

- Elementos HTML nativos (DOM)
- Instancias de componentes
- Instancias de directivas

---

### Propiedades de elementos nativos

Cada elemento HTML tiene una representación en el DOM (por ejemplo, `<button>` → `HTMLButtonElement`).

En Angular, puedes usar **property binding** para asignar valores directamente a esa instancia.

```html

<!-- Enlaza la propiedad `disabled` del botón -->
<button [disabled]="isFormValid()">Guardar</button>

```

Cada vez que `isFormValid()` cambia, Angular actualiza la propiedad `disabled` del `HTMLButtonElement`.

---

### Propiedades de componentes y directivas

En elementos que son componentes Angular, puedes enlazar **inputs** de la misma forma:

```html

<my-listbox [value]="mySelection()" />

```

Cada vez que `mySelection()` cambia, Angular actualiza la propiedad `value` en la instancia de `MyListbox`.

También puedes enlazar propiedades de directivas:

```html

<img [ngSrc]="profilePhotoUrl()" alt="Foto de perfil">

```

---

### Atributos

Para atributos que **no tienen propiedad DOM equivalente** (como `aria-*` o atributos de SVG), usa el prefijo `attr.`:

```html

<ul [attr.role]="listRole()">

```

Si el valor es `null`, Angular elimina el atributo con `removeAttribute`.

---

### Interpolación de texto en propiedades y atributos

Puedes usar `{{ }}` en propiedades y atributos:

```html

<img src="profile.jpg" alt="Foto de {{ firstName() }}">
<button attr.aria-label="Guardar cambios en {{ objectType() }}">

```

---

## Binding de clases y estilos CSS

### Clases CSS

Puedes añadir o quitar clases según un valor sea truthy o falsy:

```html

<ul [class.expanded]="isExpanded()">

```

También puedes enlazar a la propiedad `class` completa:

| Valor aceptado | Tipo |
| --- | --- |
| Cadena con clases separadas por espacios | `string` |
| Array de strings | `string[]` |
| Objeto `{ clase: valor }` | `Record<string, any>` |

Ejemplo:

```tsx

@Component({
  template: `
    <ul [class]="listClasses"></ul>
    <section [class]="sectionClasses()"></section>
    <button [class]="buttonClasses"></button>
  `
})
export class UserProfile {
  listClasses = 'full-width outlined';
  sectionClasses = signal(['expandable', 'elevated']);
  buttonClasses = { highlighted: true, embiggened: false };
}

```

Renderiza:

```html

<ul class="full-width outlined"></ul>
<section class="expandable elevated"></section>
<button class="highlighted"></button>

```

Si combinas clases estáticas, dinámicas y condicionales, Angular las fusiona:

```tsx
@Component({
  template: `<ul class="list" [class]="listType()" [class.expanded]="isExpanded()"> ...`,
  ...
})
export class Listbox {
  listType = signal('box');
  isExpanded = signal(true);
}
```

```tsx

<ul class="list" [class]="listType()" [class.expanded]="isExpanded()">

```

Render:

```html

<ul class="list box expanded"></ul>

```

⚠ Si enlazas un array u objeto, debes crear una **nueva referencia** para que Angular detecte cambios.

---

### Propiedades de estilo CSS

Puedes enlazar estilos directamente:

```html

<section [style.display]="isExpanded() ? 'block' : 'none'"></section>
<section [style.height.px]="sectionHeightInPixels()"></section>

```

También puedes enlazar múltiples estilos:

| Valor aceptado | Tipo |
| --- | --- |
| Cadena con declaraciones CSS | `string` |
| Objeto `{ propiedad: valor }` | `Record<string, any>` |

Ejemplo:

```tsx

@Component({
  template: `
    <ul [style]="listStyles()"></ul>
    <section [style]="sectionStyles()"></section>
  `
})
export class UserProfile {
  listStyles = signal('display: flex; padding: 8px');
  sectionStyles = signal({
    border: '1px solid black',
    'font-weight': 'bold',
  });
}

```

Renderiza:

```html

<ul style="display: flex; padding: 8px"></ul>
<section style="border: 1px solid black; font-weight: bold"></section>

```

⚠ Igual que con clases, si usas un objeto, debes crear uno nuevo para que Angular detecte cambios.

---

## 📊 Tabla comparativa de tipos de *binding* en Angular

| Tipo de *binding* | Sintaxis | Destino | Ejemplo | Observaciones |
| --- | --- | --- | --- | --- |
| **Interpolación de texto** | `{{ expresión }}` | Texto en HTML | `<p>{{ nombre }}</p>` | Convierte el valor a string |
| **Propiedad de elemento nativo** | `[propiedad]` | Propiedad DOM | `<button [disabled]="!formValido()"></button>` | Cambia directamente la instancia del elemento |
| **Propiedad de componente** | `[input]` | Input de componente | `<user-card [user]="usuario()"></user-card>` | El nombre debe coincidir con un `@Input` |
| **Propiedad de directiva** | `[propDirectiva]` | Propiedad de directiva | `<img [ngSrc]="url()" />` | Compatible con directivas personalizadas |
| **Atributo HTML** | `[attr.nombre]` | Atributo HTML sin propiedad DOM | `<ul [attr.role]="rol()"></ul>` | Elimina el atributo si el valor es `null` |
| **Interpolación en propiedad** | `prop="{{ valor }}"` | Propiedad DOM | `<img alt="Foto de {{ nombre() }}">` | Se evalúa como *property binding* |
| **Interpolación en atributo** | `attr.nombre="{{ valor }}"` | Atributo HTML | `<button attr.aria-label="Guardar {{ tipo() }}"></button>` | Útil para accesibilidad (ARIA) |
| **Clase específica** | `[class.nombreClase]` | Clase CSS | `<div [class.activo]="activo()"></div>` | Añade o quita según valor *truthy/falsy* |
| **Lista de clases** | `[class]` | Lista de clases | `<div [class]="clases"></div>` | Puede ser string, array o objeto `{clase: bool}` |
| **Estilo CSS específico** | `[style.prop]` | Propiedad CSS | `<div [style.display]="'block'"></div>` | Puedes añadir unidades: `[style.width.px]` |
| **Lista de estilos** | `[style]` | Varios estilos | `<div [style]="estilos"></div>` | Puede ser string o `{prop: valor}` |

---

## 🖼 Esquema visual de *binding*

```arduino

[ COMPONENTE ]
        │
        ├── Interpolación de texto → {{ variable }}
        │
        ├── Property binding
        │     ├─ Elemento nativo  → [disabled], [value], [checked]
        │     ├─ Componente       → [user], [theme]
        │     └─ Directiva        → [ngSrc], [ngModel]
        │
        ├── Attribute binding → [attr.role], [attr.aria-label]
        │
        ├── CSS binding
        │     ├─ Clases → [class], [class.activo]
        │     └─ Estilos → [style], [style.height.px]
        │
        └── Interpolación en propiedades/atributos
              prop="{{ valor }}"
              attr.nombre="{{ valor }}"

```

---

## 📌 Consejos clave

1. **Usa signals** en bindings que cambien con el tiempo → Angular los rastrea automáticamente.
2. **Objetos y arrays** en bindings de clase o estilo → crea una **nueva referencia** para que Angular detecte cambios.
3. **`attr.`** se usa para atributos que no tienen propiedad DOM (ej: ARIA, SVG).
4. **Interpolación (`{{ }}`)** convierte todo a string, incluso arrays y objetos.
5. Para **clases y estilos**, Angular fusiona valores estáticos y dinámicos sin sobrescribirlos.

---

[Resumen ](Binding%20dynamic%20text,%20properties%20and%20attributes%2024b2f387d5c38095a8c1f6224de9d49a/Resumen%2024b2f387d5c380cbb7d9f04f10719c0c.md)