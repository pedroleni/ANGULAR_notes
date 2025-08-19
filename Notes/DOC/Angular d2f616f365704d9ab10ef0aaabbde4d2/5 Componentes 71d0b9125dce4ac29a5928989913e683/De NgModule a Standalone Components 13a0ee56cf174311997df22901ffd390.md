# De NgModule a Standalone Components

---

## 🚨 ¿Qué cambió? — De `NgModule` a `Standalone Components`

Durante años, Angular se basó **sí o sí** en `NgModule` para organizar los componentes, directivas, pipes y servicios. Pero eso cambió con la llegada de los **Standalone Components**.

---

## 📆 ¿Desde cuándo?

El gran cambio llegó **con Angular 14**, en **junio de 2022**.

Se estabilizó más yse empujó como práctica preferente a partir de **Angular 15** y 16.

---

## ✅ ¿Qué son los Standalone Components?

Son componentes **que no necesitan** declararse en un `NgModule`.

Esto simplifica el desarrollo, mejora la modularidad y aligera el arranque de apps.

---

## 🔧 Ejemplos

### Antes (con `NgModule`)

```tsx

// app.module.ts
@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

```

```tsx

// home.component.ts
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {}

```

---

### Ahora (con `Standalone Component`)

```tsx

// home.component.ts
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule], // se importan directamente
  templateUrl: './home.component.html'
})
export class HomeComponent {}

```

Y se puede arrancar la app **sin NgModule**:

```tsx

// main.ts
bootstrapApplication(AppComponent, {
  providers: []
});

```

## 🔧 EJEMPLO CON `NgModule` (modelo viejo)

### 📁 Estructura:

```

src/
├── app/
│   ├── app.component.ts
│   ├── home.component.ts
│   └── app.module.ts
└── main.ts

```

### ✅ `app.component.ts`

```tsx

@Component({
  selector: 'app-root',
  template: `<h1>Bienvenido</h1><app-home></app-home>`
})
export class AppComponent {}

```

### ✅ `home.component.ts`

```tsx

@Component({
  selector: 'app-home',
  template: `<p>Este es el componente Home</p>`
})
export class HomeComponent {}

```

### ✅ `app.module.ts`

```tsx

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

```

### ✅ `main.ts`

```tsx

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

```

💬 **Resultado:** Todo funciona, pero hay demasiada ceremonia con los módulos.

---

## 🌟 2. EJEMPLO CON `Standalone Components` (modelo nuevo)

### 📁 Estructura:

```

src/
├── app/
│   ├── app.component.ts
│   └── home.component.ts
└── main.ts

```

### ✅ `home.component.ts`

```tsx

import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `<p>Este es el componente Home (standalone)</p>`
})
export class HomeComponent {}

```

### ✅ `app.component.ts`

```tsx

import { Component } from '@angular/core';
import { HomeComponent } from './home.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [HomeComponent],
  template: `<h1>Bienvenido</h1><app-home></app-home>`
})
export class AppComponent {}

```

### ✅ `main.ts`

```tsx

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));

```

💬 **Resultado:** Sin `NgModule`, todo se define directamente en el componente. **Más directo, más limpio, menos archivos.**

---

## 🧠 ¿Qué ganamos?

| Concepto | Con NgModule | Standalone |
| --- | --- | --- |
| Declaraciones | En `NgModule` | Dentro del componente |
| Importaciones | En `NgModule` | En el componente directamente |
| Arranque (`main.ts`) | Usa `bootstrapModule` | Usa `bootstrapApplication` |
| Estructura del proyecto | Módulos everywhere | Componentes autocontenidos |

---

## 🥇 Consejo práctico

Para proyectos nuevos, **usa standalone desde el principio**.

Para proyectos antiguos, Angular te permite mezclar ambos enfoques durante la migración.

¿Quieres que te arme un ejemplo con rutas (`RouterModule`) o formularios (`ReactiveFormsModule`) usando standalone?

---

## 🎯 ¿Por qué este cambio importa?

- Menos código innecesario.
- Mejor integración con herramientas modernas (Vite, ESBuild, etc.).
- Más parecido a React en filosofía (componentes autocontenidos).
- Mejora la carga diferida (`lazy loading`) y el tree shaking.

---

## ⚠️ ¿NgModule desaparece?

No todavía. Sigue siendo **totalmente compatible**, pero ya **no es obligatorio**.

Google y el core team de Angular están **transicionando** hacia un enfoque 100% standalone.

---

## 📚 Lectura recomendada

Si te interesa entender más, revisa en la doc oficial:

https://angular.io/guide/standalone-components

---

[Crear un componente y utilizarlo en un módulo](De%20NgModule%20a%20Standalone%20Components%2013a0ee56cf174311997df22901ffd390/Crear%20un%20componente%20y%20utilizarlo%20en%20un%20m%C3%B3dulo%2033b356aea6324bdcb0aa69c353114578.md)

[Primer  componente Contador tradicional → `standalone:` `false`](De%20NgModule%20a%20Standalone%20Components%2013a0ee56cf174311997df22901ffd390/Primer%20componente%20Contador%20tradicional%20%E2%86%92%20standalon%20d4ad9102c8d14fcead732e1c0d8797da.md)

## 🔮 Conclusión rápida

| Tipo de componente | Forma de uso |
| --- | --- |
| Clásico (con módulo) | Declarar en `@NgModule` y usar el selector en templates |
| Standalone (Angular 20) | Importarlo directamente en `imports: []` del componente |