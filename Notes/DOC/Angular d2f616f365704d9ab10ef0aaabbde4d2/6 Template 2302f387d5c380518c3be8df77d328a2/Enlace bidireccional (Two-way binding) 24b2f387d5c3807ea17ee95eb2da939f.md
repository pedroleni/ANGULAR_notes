# Enlace bidireccional (Two-way binding)

El **enlace bidireccional** es una forma abreviada de enlazar simultáneamente un valor a un elemento, permitiendo además que ese elemento propague cambios de nuevo a través de este enlace.

---

## **Sintaxis**

La sintaxis para el enlace bidireccional es una combinación de corchetes y paréntesis:

```html

[()]

```

Combina la sintaxis de **enlace de propiedades** `[]` con la de **escucha de eventos** `()`.

La comunidad de Angular se refiere informalmente a esta sintaxis como **"banana-in-a-box"** (plátano en una caja).

---

## **Enlace bidireccional con controles de formulario**

Los desarrolladores suelen usar el enlace bidireccional para mantener sincronizados los datos del componente con un control de formulario mientras el usuario interactúa con él.

Por ejemplo, cuando un usuario rellena un campo de texto, este debería actualizar el estado en el componente.

Ejemplo:

```tsx

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <main>
      <h2>Hello {{ firstName }}!</h2>
      <input type="text" [(ngModel)]="firstName" />
    </main>
  `
})
export class AppComponent {
  firstName = 'Ada';
}

```

✅ En este ejemplo, el atributo `firstName` se actualiza dinámicamente en la página a medida que el usuario escribe.

---

### **Para usar el enlace bidireccional con controles de formulario nativos necesitas:**

1. **Importar** `FormsModule` desde `@angular/forms`.
2. Usar la **directiva** `ngModel` con la sintaxis de enlace bidireccional `[(ngModel)]`.
3. Asignarle el estado que quieres actualizar (por ejemplo, `firstName`).

Una vez configurado, Angular se asegura de que cualquier cambio en el campo de texto se refleje automáticamente en el estado del componente.

📌 Más información: Documentación oficial de NgModel

---

## **Enlace bidireccional entre componentes**

Usar el enlace bidireccional entre un componente padre y uno hijo requiere algo más de configuración que con elementos de formulario.

Ejemplo:

El componente `AppComponent` define el estado inicial (`initialCount`), pero la lógica para actualizar y mostrar el contador está principalmente en el componente hijo `CounterComponent`.

```tsx

// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <h1>Counter: {{ initialCount }}</h1>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}

```

```tsx

// ./counter/counter.component.ts
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="updateCount(-1)">-</button>
    <span>{{ count() }}</span>
    <button (click)="updateCount(+1)">+</button>
  `,
})
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}

```

---

## **Habilitar el enlace bidireccional entre componentes**

Si analizamos el ejemplo anterior, cada enlace bidireccional para componentes requiere lo siguiente:

### **En el componente hijo:**

- Debe contener una **propiedad `model`**.

Ejemplo simplificado:

```tsx

// ./counter/counter.component.ts
import { Component, model } from '@angular/core';

@Component({ /* Omitido para brevedad */ })
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}

```

---

### **En el componente padre:**

- Envolver el nombre de la propiedad `model` en la sintaxis de enlace bidireccional `[()]`.
- Asignar una **propiedad** o una **signal** al `model`.

Ejemplo simplificado:

```tsx

// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}

```

---

Aquí tienes un **cuadro comparativo** claro y resumido sobre el **two-way binding** en Angular v20:

| Característica | Binding de Propiedad (`[ ]`) | Binding de Evento (`( )`) | Two-Way Binding (`[()]`) |
| --- | --- | --- | --- |
| **Dirección de datos** | **Unidireccional** → de componente a vista | **Unidireccional** → de vista a componente | **Bidireccional** ↔ vista y componente |
| **Sintaxis** | `[propiedad]="valor"` | `(evento)="handler()"` | `[(propiedad)]="variable"` |
| **Ejemplo HTML** | `<input [value]="nombre" />` | `<input (input)="actualizarNombre($event)" />` | `<input [(ngModel)]="nombre" />` |
| **Necesita FormsModule** | ❌ No | ❌ No | ✅ Sí (para controles nativos con `ngModel`) |
| **Actualización automática** | ✅ De componente a DOM | ✅ De DOM a componente | ✅ Ambas direcciones |
| **Uso típico** | Mostrar datos | Capturar eventos | Formularios y comunicación entre componentes |
| **Ventaja principal** | Control preciso de lo que se muestra | Control preciso de lo que se captura | Sincronización automática de estado y vista |
| **Inconveniente** | No actualiza al cambiar en vista | No actualiza al cambiar en componente | Menos control granular, más acoplamiento |

![image.png](Enlace%20bidireccional%20(Two-way%20binding)%2024b2f387d5c3807ea17ee95eb2da939f/image.png)