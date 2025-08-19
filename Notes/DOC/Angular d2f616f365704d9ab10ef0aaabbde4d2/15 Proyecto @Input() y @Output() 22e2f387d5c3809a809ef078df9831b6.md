# 15. Proyecto: @Input() y @Output()

## 🎯 Escenario

Supongamos que el padre tiene un **objeto usuario** que le pasa al hijo.

El hijo **muestra los datos** en inputs y puede editarlos.

Cuando hace clic en "Guardar", el hijo le envía el nuevo objeto al padre.

---

## 🎯 Objetivo

- El padre pasa un usuario al hijo (`@Input()` usando `input()` como signal).
- El hijo muestra los datos en inputs normales y los guarda en **signals internos**.
- Cuando se hace clic en "Guardar", se emite el usuario actualizado con `@Output()`.

---

## 📁 Estructura del ejemplo

![image.png](15%20Proyecto%20@Input()%20y%20@Output()%2022e2f387d5c3809a809ef078df9831b6/image.png)

---

## 🧩 1. Hijo con `input()` y signals

```tsx
// usuario-form.component.ts
import {
  Component,
  Output,
  EventEmitter,
  input,
  Signal,
  signal,
  effect,
} from '@angular/core';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  styleUrl: './usuario-form.component.css',
  template: `
    <div class="usuario-form">
      <h3>Editar Usuario</h3>
      <label> Nombre: </label>
      <input
        [value]="nombre()"
        (input)="nombre.set($any($event.target).value)"
      />
      <br />

      <label> Edad: </label>
      <input
        type="number"
        [value]="edad()"
        (input)="edad.set(+$any($event.target).value)"
      />
      <br />

      <button (click)="guardar()">Guardar</button>
    </div>
  `,
})
export class UsuarioFormComponent {
  usuario = input<{ nombre: string; edad: number }>();

  /**
   * Evento que se emite cuando el usuario es actualizado.
   * Utilizamos EventEmitter para emitir un objeto con los datos del usuario.
   */
  @Output() usuarioActualizado = new EventEmitter<{
    nombre: string;
    edad: number;
  }>();

  // Signals internos para edición
  nombre = signal('');
  edad = signal(0);

  // Efecto: se ejecuta cuando cambia el input
  constructor() {
    effect(() => {
      const u = this.usuario() ?? { nombre: '', edad: 0 };
      this.nombre.set(u.nombre);
      this.edad.set(u.edad);
    });
  }

  guardar() {
    /**
     * Emitimos el evento con los datos actuales del formulario.
     * Utilizamos los signals para obtener los valores actuales de nombre y edad.
     */
    this.usuarioActualizado.emit({
      nombre: this.nombre(),
      edad: this.edad(),
    });
  }
}

```

---

## 👨‍🏫 2. Componente Padre

```tsx
// app.ts
import { Component, signal } from '@angular/core';
import { UsuarioFormComponent } from './componentes/usuario-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="data-container">
      <h2>Datos del Usuario</h2>
      <p>Nombre: {{ usuario().nombre }}</p>
      <p>Edad: {{ usuario().edad }}</p>
      <hr />
      <app-usuario-form
        class="componente-usuario-form"
        [usuario]="usuario()"
        (usuarioActualizado)="actualizarUsuario($event)"
      >
      </app-usuario-form>
    </div>
  `,
  imports: [UsuarioFormComponent],
})
export class AppComponent {
  usuario = signal({ nombre: 'Aristóteles', edad: 30 });

  actualizarUsuario(nuevoUsuario: { nombre: string; edad: number }) {
    this.usuario.set(nuevoUsuario);
    console.log('Usuario actualizado con signals:', nuevoUsuario);
  }
}

```

## 🧠 Flujo completo

1. El **padre** tiene un `signal()` con los datos del usuario.
2. El padre se lo **pasa al hijo** como un `input()`.
3. El **hijo sincroniza** ese `input()` con sus propios `signals` internos (`nombre`, `edad`).
4. El usuario **edita los campos** del hijo → se actualizan las `signals`.
5. Al hacer clic en "Guardar":
    - El hijo **emite** los nuevos datos con `@Output()`
    - El padre los recibe y **actualiza su `signal()`**
    - La vista del padre **se actualiza automáticamente**
    

---

## ✅ Ventajas de este patrón

- Claridad: separación de responsabilidades entre padre e hijo.
- Reactividad fina: solo se actualiza lo que debe.
- No se necesita FormsModule, ni `ngModel`, ni `FormGroup`.
- Escalable: ideal para componentes reusables, configurables y eficientes.

### Resultado visual del proyecto

[Grabación de pantalla 2025-07-13 a las 1.06.07.mov](15%20Proyecto%20@Input()%20y%20@Output()%2022e2f387d5c3809a809ef078df9831b6/Grabacion_de_pantalla_2025-07-13_a_las_1.06.07.mov)