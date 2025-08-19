# ¿Cómo se utilizan los componentes?

## 🧱 1. Crear el componente (ejemplo: `SaludoComponent`)

```bash

ng g c saludo

```

Esto genera:

- `saludo.component.ts`
- `saludo.component.html`
- `saludo.component.css`

---

## 👋 2. Código del componente: `saludo.component.ts`

```tsx

import { Component } from '@angular/core';

@Component({
  selector: 'app-saludo',
  templateUrl: './saludo.component.html',
  styleUrls: ['./saludo.component.css'],
  standalone: true // ← esto es clave en Angular 20
})
export class SaludoComponent {
  nombre = 'Aristóteles';
}

```

Y en `saludo.component.html`:

```html

<h2>Hola, {{ nombre }} 👋</h2>

```

---

## 📦 3. Usarlo en otro componente (por ejemplo, en `AppComponent`)

### Opción A: Importando en el componente principal (`app.component.ts`)

```tsx

import { Component } from '@angular/core';
import { SaludoComponent } from './saludo/saludo.component'; // importa el componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SaludoComponent], // registra el componente hijo
  template: `
    <h1>Bienvenido a la app</h1>
    <app-saludo></app-saludo> <!-- aquí lo usas -->
  `
})
export class AppComponent {}

```

🔍 Esto solo funciona porque ambos son *standalone*. Si tu `SaludoComponent` no tiene `standalone: true`, deberás usar `NgModules`.

---

## 🛠️ Opción B: Usarlo con un NgModule clásico (si vienes de Angular <=14)

1. Declara `SaludoComponent` en el `AppModule`.

```tsx

@NgModule({
  declarations: [AppComponent, SaludoComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

```

1. Y luego en `app.component.html`:

```html

<app-saludo></app-saludo>

```

---

## 🧪 4. Componentes con input/output

### `mensaje.component.ts`

```tsx

@Component({
  selector: 'app-mensaje',
  template: `<p>{{ texto }}</p>`,
  standalone: true,
  inputs: ['texto']
})
export class MensajeComponent {
  texto = '';
}

```

### Usarlo en `AppComponent`

```tsx

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MensajeComponent],
  template: `
    <app-mensaje [texto]="'¡Angular 20 está brutal!'"></app-mensaje>
  `
})
export class AppComponent {}

```