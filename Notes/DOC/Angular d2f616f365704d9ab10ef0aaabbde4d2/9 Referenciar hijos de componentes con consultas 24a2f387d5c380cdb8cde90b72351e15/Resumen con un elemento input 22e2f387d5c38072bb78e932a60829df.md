# Resumen con un elemento input

En Angular, puedes referenciar por ejemplo un `<input>` y obtener su valor de varias formas, dependiendo de si usas **template-driven forms**, **reactive forms**, o simplemente necesitas un valor puntual desde el template. Aquí te muestro las formas más comunes y directas:

---

### ✅ Opción 1: Usando `@ViewChild` (desde el componente TypeScript)

### HTML:

```html

<input #miInput type="text" />
<button (click)="mostrarValor()">Mostrar valor</button>

```

### TypeScript:

```tsx

import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  templateUrl: './ejemplo.component.html',
})
export class EjemploComponent {
  @ViewChild('miInput') miInputRef!: ElementRef<HTMLInputElement>;

  mostrarValor() {
    const valor = this.miInputRef.nativeElement.value;
    console.log('Valor del input:', valor);
  }
}

```

---

### ✅ Opción 2: Usando `template reference variable` directamente en el HTML

### HTML:

```html

<input #miInput type="text" />
<button (click)="mostrarValor(miInput.value)">Mostrar valor</button>

```

### TypeScript:

```tsx

mostrarValor(valor: string) {
  console.log('Valor del input:', valor);
}

```

👉 Esta opción es sencilla y directa. No accedes al DOM, sólo al valor del input.

---

### ✅ Opción 3: Usando `[(ngModel)]` (template-driven)

### HTML:

```html

<input [(ngModel)]="nombre" type="text" name="nombre" />
<button (click)="mostrarValor()">Mostrar valor</button>

```

### TypeScript:

```tsx

nombre = '';

mostrarValor() {
  console.log('Nombre:', this.nombre);
}

```

> Recuerda importar FormsModule en tu módulo para usar ngModel.
> 

---

### ✅ Opción 4: Reactive Forms

Si estás usando `FormControl` o `FormGroup`, sería así:

### TypeScript:

```tsx

import { FormControl } from '@angular/forms';

nombreControl = new FormControl('');

```

### HTML:

```html

<input [formControl]="nombreControl" type="text" />
<button (click)="mostrarValor()">Mostrar valor</button>

```

### TypeScript:

```tsx

import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  nombreControl = new FormControl('');
  mostrarValor() {
    console.log('Valor:', this.nombreControl.value);
  }
}

```