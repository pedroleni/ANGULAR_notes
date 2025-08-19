# Control flow antes de angular v17

| Tipo | **Antes de Angular 17** | **Desde Angular 17+ (Nuevo Control Flow)** |
| --- | --- | --- |
| ✅ `if` / `else` | `*ngIf="condición"; else template` + `<ng-template>` | `@if (condición) { ... } @else { ... }` |
| 🔁 `for` | `*ngFor="let item of items; let i = index; let first = first"` | `@for (item of items; track item.id) { ... } @empty { ... }` |
| 🔁 `for` + variables contextuales | `index`, `first`, `last`, `even`, `odd`, `count` dentro de `*ngFor` | mismas variables disponibles de forma directa |
| 🔀 `switch` | `[ngSwitch]`, `*ngSwitchCase`, `*ngSwitchDefault` | `@switch (valor) { @case (...) { ... } @default { ... } }` |
| 💤 `defer` (carga diferida) | Se hacía manualmente con `*ngIf` + lógica en el componente | `@defer (when condición) { ... } @loading { ... } @error { ... } @done { ... }` |
| ❌ `empty` para arrays vacíos | Se hacía con `*ngIf="array.length > 0"` y `<ng-template>` | `@empty { ... }` dentro del `@for` |
| 🧱 Anidamiento | Con `*ngIf`, `*ngFor` y `ng-template`, se complicaba | Permite anidar `@if`, `@for`, `@switch` fácilmente |

---

## 📘 EJEMPLOS COMPLETOS: Antes vs Ahora

---

### ✅ 1. `if` + `else`

**Antes Angular 17**

```html

<div *ngIf="isAdmin; else noAcceso">
  <p>Bienvenido administrador</p>
</div>
<ng-template #noAcceso>
  <p>No tienes permiso</p>
</ng-template>

```

**Desde Angular 17+**

```html

@if (isAdmin) {
  <p>Bienvenido administrador</p>
} @else {
  <p>No tienes permiso</p>
}

```

---

### 🔁 2. `for` con contexto

**Antes Angular 17**

```html

<li *ngFor="let item of items; let i = index; let first = first; let last = last">
  {{ i + 1 }} - {{ item.nombre }}
  <span *ngIf="first">[primero]</span>
  <span *ngIf="last">[último]</span>
</li>

```

**Desde Angular 17+**

```html

@for (item of items; track item.id) {
  <li>
    {{ index + 1 }} - {{ item.nombre }}
    @if (first) { [primero] }
    @if (last) { [último] }
  </li>
}

```

---

### 🔁 3. `for` con manejo de lista vacía

**Antes Angular 17**

```html

<div *ngIf="items.length > 0; else vacio">
  <li *ngFor="let item of items">{{ item }}</li>
</div>
<ng-template #vacio>
  <p>Lista vacía</p>
</ng-template>

```

**Desde Angular 17+**

```html

@for (item of items) {
  <li>{{ item }}</li>
} @empty {
  <p>Lista vacía</p>
}

```

---

### 🔀 4. `switch` completo

**Antes Angular 17**

```html

<div [ngSwitch]="estado">
  <p *ngSwitchCase="'activo'">Activo</p>
  <p *ngSwitchCase="'inactivo'">Inactivo</p>
  <p *ngSwitchDefault>Desconocido</p>
</div>

```

**Desde Angular 17+**

```html

@switch (estado) {
  @case ('activo') {
    <p>Activo</p>
  }
  @case ('inactivo') {
    <p>Inactivo</p>
  }
  @default {
    <p>Desconocido</p>
  }
}

```

---

### 💤 5. `defer` (carga perezosa o lazy load)

**Antes Angular 17**

```html

<div *ngIf="!cargando; else loader">
  <p>Contenido cargado</p>
</div>
<ng-template #loader>
  <p>Cargando...</p>
</ng-template>

```

**Desde Angular 17+**

```html

@defer (when !cargando) {
  <p>Contenido cargado</p>
} @loading {
  <p>Cargando...</p>
} @error {
  <p>Error cargando datos</p>
}

```

---

### 🧱 6. `if` anidado dentro de `for` (ejemplo complejo)

**Antes Angular 17**

```html

<div *ngFor="let usuario of usuarios">
  <h3>{{ usuario.nombre }}</h3>
  <p *ngIf="usuario.rol === 'admin'">Administrador</p>
  <p *ngIf="usuario.rol !== 'admin'">Usuario normal</p>
</div>

```

**Desde Angular 17+**

```html

@for (usuario of usuarios) {
  <h3>{{ usuario.nombre }}</h3>
  @if (usuario.rol === 'admin') {
    <p>Administrador</p>
  } @else {
    <p>Usuario normal</p>
  }
}

```

---

## 🧪 Habilitar el nuevo control flow

En `tsconfig.app.json`:

```json

{
  "angularCompilerOptions": {
    "enableNgNewControlFlow": true}
}

```

---

## 🧠 Ventajas del nuevo sistema

✅ Sintaxis clara y limpia

✅ Sin `ng-template` innecesarios

✅ Mejor legibilidad en componentes complejos

✅ Soporte nativo para `@empty`, `@defer`, etc.

✅ Fácil de mantener en equipos grandes