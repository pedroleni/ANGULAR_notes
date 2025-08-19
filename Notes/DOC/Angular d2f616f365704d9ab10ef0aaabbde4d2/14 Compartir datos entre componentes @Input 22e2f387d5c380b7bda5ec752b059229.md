# 14. Compartir datos entre componentes: @Input

Es un decorador que Angular usa para **recibir datos** desde el componente padre hacia el hijo.

> El padre "le pasa" datos al hijo usando propiedades en el HTML, y el hijo las recibe con @Input().
> 

---

## 🧩 Ejemplo básico

### 🧒 Componente Hijo

```tsx

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hijo',
  template: `<p>Nombre recibido: {{ nombre }}</p>`,
  standalone: true
})
export class HijoComponent {
  @Input() nombre: string = '';
}

```

### 👨‍🏫 Componente Padre

```tsx

import { Component } from '@angular/core';
import { HijoComponent } from './hijo.component';

@Component({
  selector: 'app-root',
  template: `
    <app-hijo [nombre]="nombreDelPadre"></app-hijo>
  `,
  standalone: true,
  imports: [HijoComponent]
})
export class AppComponent {
  nombreDelPadre = 'Aristóteles';
}

```

---

### 🔍 ¿Qué pasa aquí?

1. `AppComponent` (padre) tiene una propiedad `nombreDelPadre`.
2. Se la pasa al hijo con `[nombre]="nombreDelPadre"`.
3. El hijo la recibe vía `@Input()` y la muestra.

---

## 🔄 Reactividad con `@Input()` + `signals` (Angular 20)

Los `@Input()` ahora pueden conectarse con `signals` usando `input()` (Angular 16+).

```tsx

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hijo',
  template: `<p>Nombre: {{ nombre() }}</p>`,
  standalone: true
})
export class HijoComponent {
  nombre = input<string>();  // input signal
}

```

Esto hace que la propiedad `nombre()` sea un signal reactivo.

**Ventajas**:

- Funciona igual que otros `signals`.
- Puedes usar `computed()`, `effect()`, etc., con ese valor.

---

## 🧠 ¿Cómo se pasan objetos o arrays?

Igual que strings, pero ojo con las referencias:

```tsx

@Input() usuario!: { nombre: string; edad: number };

```

```html

<app-hijo [usuario]="usuarioDelPadre"></app-hijo>

```

Angular detecta los cambios si cambias la **referencia** del objeto.

Cuando pasás un **objeto o array** a un componente hijo mediante `@Input()`, Angular **solo detecta cambios si cambias la referencia del objeto**, **no** si cambias sus propiedades internas directamente.

### 1. Padre pasa un objeto al hijo:

```tsx

@Input() usuario!: { nombre: string; edad: number };

```

```html

<app-hijo [usuario]="usuarioDelPadre"></app-hijo>

```

Y en el padre:

```tsx

usuarioDelPadre = { nombre: 'Aristóteles', edad: 30 };

```

### 2. Modificas **una propiedad del objeto**, sin cambiar su referencia:

```tsx

this.usuarioDelPadre.nombre = 'Sócrates';  // ❌ misma referencia

```

➡️ Angular **no detecta este cambio automáticamente**, porque el objeto es el mismo en memoria (misma dirección de referencia).

### 3. Modificas el objeto **creando una nueva referencia**:

```tsx

this.usuarioDelPadre = { ...this.usuarioDelPadre, nombre: 'Sócrates' };  // ✅ nueva referencia

```

➡️ Ahora Angular **sí detecta** el cambio y lo propaga al hijo.

### 🧪 ¿Por qué ocurre esto?

Angular, para detectar cambios en inputs, compara así:

```tsx

if (this.usuario !== previousValue) {
  // Hay cambio, actualiza la vista
}

```

🧠 Pero si modificás una propiedad interna (`usuario.nombre = 'X'`) **sin cambiar el objeto**, `this.usuario === previousValue` sigue siendo `true`, y Angular no hace nada.

### ✅ ¿Cómo evitar este problema?

| Situación | Recomendación |
| --- | --- |
| Cambias objetos o arrays | Siempre crear una nueva referencia (`{ ...obj }`, `array.slice()`, etc.) |
| Estás usando signals o `OnPush` | Es aún más importante cambiar referencias |
| Quieres modificar datos internos | Usa `@Output()` para comunicar cambios al padre |

---

## 🎯 En resumen

> Angular detecta cambios de inputs cuando cambia la referencia del valor, no si solo cambias algo adentro del objeto.
> 

---

## 🛠 Ejemplo final:

### Componente padre:

```tsx

usuarioDelPadre = { nombre: 'Aristóteles', edad: 30 };

actualizarNombre() {
  // ❌ Esto no se refleja automáticamente:
  // this.usuarioDelPadre.nombre = 'Platón';

  // ✅ Esto sí:
  this.usuarioDelPadre = { ...this.usuarioDelPadre, nombre: 'Platón' };
}

```

---

## ❗ Buenas prácticas

✅ Usar nombres claros y descriptivos.

✅ Declarar tipos explícitos.

✅ Evitar lógica compleja dentro de los setters de `@Input()`.

⚠️ No modificar directamente un `@Input()` dentro del hijo (mejor clonar o emitir eventos si es necesario cambiar algo).

---

### 🚀 Bonus: Detectar cambios con `ngOnChanges`

Puedes reaccionar a cambios en inputs usando `ngOnChanges`:

```tsx

ngOnChanges(changes: SimpleChanges) {
  if (changes['nombre']) {
    console.log('Nuevo nombre:', changes['nombre'].currentValue);
  }
}

```

---

## ✅ En resumen

| Qué | Para qué sirve | Cómo se usa |
| --- | --- | --- |
| `@Input()` | Pasar datos del padre al hijo | `[propiedad]="valor"` → `@Input() propiedad` |
| `input()` | Signal reactivo para `@Input()` | `nombre = input<string>()` |
| `ngOnChanges` | Detectar cambios de inputs manualmente | Implementar en el hijo (`OnChanges`) |