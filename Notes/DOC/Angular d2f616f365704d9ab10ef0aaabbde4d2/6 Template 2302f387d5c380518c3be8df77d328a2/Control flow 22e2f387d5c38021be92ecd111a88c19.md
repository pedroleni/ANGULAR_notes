# Control flow

Aquí tienes **todos los tipos con ejemplos funcionales**:

---

### 1. **`@if` / `@else` – Condicionales**

```html

@if (user.isAdmin) {
  <p>Bienvenido, administrador</p>
} @else {
  <p>Acceso restringido</p>
}

```

📌 Equivale a `*ngIf` de toda la vida pero más legible y reutilizable.

---

### 2. **`@for` – Bucles iterativos**

```html

@for (producto of productos; track producto.id) {
  <li>{{ producto.nombre }}</li>
}

```

✅ Reemplaza a `*ngFor`, ahora con sintaxis más clara. Puedes usar `track` para mejorar rendimiento.

Puedes acceder a varias variables útiles **dentro del `@for`**:

| Variable | Significado |
| --- | --- |
| `index` | Índice actual |
| `first` | Es el primer elemento (true/false) |
| `last` | Es el último elemento (true/false) |
| `even` | Índice par (true/false) |
| `odd` | Índice impar (true/false) |
| `count` | Número total de elementos |

### 🔍 Ejemplo completo:

```html

@for (user of users; track user.id) {
  <div>
    <p>{{ user.nombre }}</p>
    <small>
      Index: {{ index }},
      First: {{ first }},
      Last: {{ last }},
      Par: {{ even }},
      Total: {{ count }}
    </small>
  </div>
}

```

Estas variables están disponibles **dentro del bloque `@for`**, no necesitas declarar nada adicional.

Ejemplo visual de lógica de iteración:

```tsx

productos = ['Pan', 'Vino', 'Aceite'];

```

Esto es lo que verías para cada ciclo:

| `index` | `count` | `first` | `last` | `even` | `odd` |
| --- | --- | --- | --- | --- | --- |
| 0 | 3 | true | false | true | false |
| 1 | 3 | false | false | false | true |
| 2 | 3 | false | true | true | false |

---

### 3. **`@switch` / `@case` / `@default` – Condicional múltiple**

```html

@switch (estadoPedido) {
  @case ('pendiente') {
    <p>Tu pedido está pendiente</p>
  }
  @case ('enviado') {
    <p>En camino...</p>
  }
  @default {
    <p>Estado desconocido</p>
  }
}

```

📦 Alternativa elegante al clásico `*ngIf + else if + else`.

---

### 4. **`@defer` – Carga diferida (lazy loading visual)**

```html

@defer (when cargando) {
  <app-loading></app-loading>
} @placeholder {
  <p>Esperando a iniciar carga...</p>
} @error {
  <p>Error al cargar</p>
} @loading {
  <p>Cargando...</p>
} @done {
  <p>Contenido cargado</p>
}

```

🚀 Ideal para **render diferido** y mejorar rendimiento. Carga vistas solo cuando se cumplen condiciones.

---

### 5. **`@empty` – Para listas vacías**

```html

@for (item of lista) {
  <li>{{ item }}</li>
} @empty {
  <li>No hay datos</li>
}

```

🧹 Reemplaza el típico `*ngIf="lista.length === 0"` con algo más limpio.

---

### 6. **Combinaciones anidadas**

```html

@if (usuario) {
  <h2>Hola {{ usuario.nombre }}</h2>

  @switch (usuario.rol) {
    @case ('admin') {
      <p>Acceso total</p>
    }
    @default {
      <p>Acceso limitado</p>
    }
  }
} @else {
  <p>No has iniciado sesión</p>
}

```

---

## 🧪 Requisitos para usar esta sintaxis (Angular v17+)

Debes tener activado el **Control Flow Syntax** en tu `tsconfig.app.json`:

```json

{
  "compilerOptions": {
    "enableNgNewControlFlow": true}
}

```

---

## ⚠️ OJO: Estas directivas (`@if`, `@for`, etc.) no funcionan en versiones <17.

Si estás en v16 o inferior, tienes que usar:

- `ngIf`
- `ngFor`
- `[ngSwitch]`, `ngSwitchCase`, etc.

[Control flow antes de angular v17](Control%20flow%2022e2f387d5c38021be92ecd111a88c19/Control%20flow%20antes%20de%20angular%20v17%2022f2f387d5c3802c971fc058ea5ce779.md)

| Estructura | Propósito | Sintaxis básica | Características clave | Casos especiales |
| --- | --- | --- | --- | --- |
| **`@if` / `@else-if` / `@else`** | Muestra u oculta contenido según una condición | `@if (condición) { ... } @else { ... }` | Permite anidar condiciones con `@else-if` y un bloque final `@else`; se puede guardar el resultado en una variable con `as` | Ideal para condiciones simples o múltiples alternativas |
| **`@for`** | Repite contenido para cada elemento de una colección | `@for (item of items; track item.id) { ... }` | Soporta cualquier iterable; `track` optimiza el rendimiento manteniendo el vínculo datos-DOM; variables contextuales (`$index`, `$first`, `$last`, `$even`, `$odd`, `$count`) | Se puede usar `@empty` para mostrar contenido si no hay elementos |
| **`@switch` / `@case` / `@default`** | Renderiza un bloque en función de un valor evaluado | `@switch (expresión) { @case ('valor') { ... } @default { ... } }` | Similar a `switch` en JavaScript pero sin *fallthrough*; compara con `===`; opcional `@default` | Útil para elegir entre múltiples bloques mutuamente excluyentes |

En el contexto de `@switch` en Angular (y también en el `switch` clásico de JavaScript), **"no hay fallthrough"** significa que **cuando un `@case` coincide, se ejecuta solo ese bloque y no continúa ejecutando los siguientes casos**.

En JavaScript tradicional, si no pones `break`, el flujo “cae” (*fall through*) y sigue ejecutando el código de los siguientes casos, incluso si no coinciden:

```tsx

switch (x) {
  case 1:
    console.log("Caso 1");
  case 2:
    console.log("Caso 2"); // ← Se ejecuta también si no hay break
}

```

En Angular con `@switch`:

```html

@switch (x) {
  @case (1) { Caso 1 }
  @case (2) { Caso 2 }
  @default { Caso por defecto }
}

```

➡ Aquí **solo se ejecuta el bloque que coincide** y luego termina, **sin necesidad de `break`** y sin riesgo de que se ejecute el siguiente caso accidentalmente.

Si quieres, puedo hacerte un mini ejemplo visual comparando el *fallthrough* de JavaScript con el comportamiento de `@switch` en Angular.