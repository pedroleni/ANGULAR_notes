# 13. Evento personalizado: @Output()

## ¿Qué es un evento personalizado?

Es cuando un **componente hijo** necesita **enviar información o notificar al componente padre** de que algo ocurrió (por ejemplo: se hizo clic, se eligió un valor, se cambió un dato…).

Esto se hace con `@Output()` y `EventEmitter`.

---

## 🛠️ Ejemplo paso a paso

### 🎯 Objetivo:

Un componente hijo tiene un botón que, al hacer clic, le **envía un mensaje** al componente padre.

---

### 🧩 1. Componente Hijo: Emite el evento

```tsx

// saludo.component.ts (hijo)
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-saludo',
  template: `<button (click)="emitirSaludo()">Saludar</button>`,
  standalone: true
})
export class SaludoComponent {
  @Output() saludo = new EventEmitter<string>();

  emitirSaludo() {
    this.saludo.emit('¡Hola desde el componente hijo!');
  }
}

```

**Claves:**

- `@Output()` marca una **salida** del componente.
- `new EventEmitter<string>()` define el **tipo de dato** que emitirá.
- `emit(valor)` dispara el evento.

---

### 🧩 2. Componente Padre: Escucha el evento

```tsx

// app.component.ts (padre)
import { Component } from '@angular/core';
import { SaludoComponent } from './saludo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SaludoComponent],
  template: `
    <app-saludo (saludo)="recibirSaludo($event)"></app-saludo>
    <p>{{ mensaje }}</p>
  `
})
export class AppComponent {
  mensaje = '';

  recibirSaludo(texto: string) {
    this.mensaje = texto;
  }
}

```

**Claves:**

- Escuchás el evento como si fuera un evento DOM: `(saludo)="recibirSaludo($event)"`
- `$event` representa el valor que se emitió desde el hijo (`string` en este caso).
- `mensaje` es una propiedad que luego se muestra con interpolación.

---

### 🧪 Resultado:

1. Aparece un botón del hijo.
2. Al hacer clic, el hijo emite el evento.
3. El padre lo **escucha**, ejecuta su método y actualiza la vista.

---

## 🔄 Comunicación hijo → padre con datos

Podés emitir cualquier tipo de dato:

```tsx
@Output() enviarUsuario = new EventEmitter<{ id: number, nombre: string }>();

this.enviarUsuario.emit({ id: 1, nombre: 'Aristóteles' });

```

Y en el padre:

```html

<app-hijo (enviarUsuario)="procesar($event)">

```

```tsx

procesar(usuario: { id: number, nombre: string }) {
  console.log(usuario.nombre);  // Aristóteles
}

```

---

## ⚠️ Buenas prácticas

✅ Usar nombres claros para los eventos (`cambio`, `seleccionado`, `creado`, `cerrado`, etc.)

✅ Definir tipos fuertes en el `EventEmitter<tipo>`

❌ No emitir desde el `constructor` o antes de que el padre se inicialice

❌ No abuses: si el evento es global, considera un servicio compartido

---

## ✅ En resumen

| Parte | Qué hace | Ejemplo |
| --- | --- | --- |
| `@Output()` | Declara un evento en el hijo | `@Output() saludo = new EventEmitter<string>()` |
| `emit()` | Dispara el evento desde el hijo | `this.saludo.emit('Hola')` |
| `$event` | Valor recibido en el padre | `(saludo)="recibir($event)"` |