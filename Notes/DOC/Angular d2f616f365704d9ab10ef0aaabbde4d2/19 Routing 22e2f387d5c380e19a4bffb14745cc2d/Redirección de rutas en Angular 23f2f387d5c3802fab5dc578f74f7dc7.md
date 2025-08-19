# Redirección de rutas en Angular

Las **rutas de redirección** te permiten navegar automáticamente de una ruta a otra. Es como reenviar el correo: lo que iba a una dirección, se manda a otra. Esto es útil para:

- Reemplazar URLs antiguas (rutas legacy)
- Establecer rutas por defecto
- Controlar accesos o flujos de navegación

---

## 🛠️ Cómo configurar redirecciones

Las redirecciones se definen en el arreglo de rutas con la propiedad `redirectTo`, que acepta una cadena o función.

```tsx

import { Routes } from '@angular/router';

const routes: Routes = [
  // Redirección simple
  { path: 'marketing', redirectTo: 'newsletter' },

  // Redirección con parámetros
  { path: 'legacy-user/:id', redirectTo: 'users/:id' },

  // Redirección comodín (wildcard)
  { path: '**', redirectTo: '/login' }
];

```

### Resultado:

- `/marketing` → se redirige a `/newsletter`
- `/legacy-user/42` → se redirige a `/users/42`
- cualquier ruta no reconocida → se redirige a `/login`

---

## 📏 Cómo funciona `pathMatch`

La propiedad `pathMatch` controla **cómo Angular decide aplicar una redirección**.

| Valor | Descripción |
| --- | --- |
| `'full'` | Coincide solo si la URL completa es exacta |
| `'prefix'` | Coincide si la URL comienza con el valor dado |

Por defecto, Angular usa `'prefix'`.

---

### 📘 Ejemplo con `pathMatch: 'prefix'`

```tsx

export const routes: Routes = [
  { path: 'news', redirectTo: 'blog' },
  { path: 'news', redirectTo: 'blog', pathMatch: 'prefix' },
];

```

### Resultado:

- `/news` → `/blog`
- `/news/article` → `/blog/article`
- `/news/article/1` → `/blog/article/1`

---

### 📙 Ejemplo con `pathMatch: 'full'`

```tsx

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

```

Esto redirige solo cuando la URL es exactamente la raíz (`/`).

> ⚠️ Si omites pathMatch: 'full' en rutas vacías (''), Angular redirigirá todas las rutas, lo que suele ser un error común.
> 

---

## 🧠 Redirecciones condicionales

A partir de Angular 15+, `redirectTo` también puede aceptar una **función** que devuelva:

- una cadena (`string`)
- un árbol de rutas (`UrlTree`)
- una `Promise`
- o un `Observable`

### Ejemplo: redirigir por hora del día

```tsx

import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
  {
    path: 'restaurant/:location/menu',
    redirectTo: (route) => {
      const location = route.params['location'];
      const meal = route.queryParams['meal'];
      const hour = new Date().getHours();

      if (meal) {
        return `/restaurant/${location}/menu/${meal}`;
      }

      if (hour >= 5 && hour < 11) {
        return `/restaurant/${location}/menu/breakfast`;
      } else if (hour >= 11 && hour < 17) {
        return `/restaurant/${location}/menu/lunch`;
      } else {
        return `/restaurant/${location}/menu/dinner`;
      }
    }
  },
  { path: 'restaurant/:location/menu/breakfast', component: MenuComponent },
  { path: 'restaurant/:location/menu/lunch', component: MenuComponent },
  { path: 'restaurant/:location/menu/dinner', component: MenuComponent },
  { path: '', redirectTo: '/restaurant/downtown/menu', pathMatch: 'full' }
];

```

---

### ✅ Resultado:

- El usuario es redirigido a desayuno, comida o cena automáticamente, dependiendo de la hora del sistema o del parámetro `?meal=`.
- También puedes definir destinos fijos por defecto o usar lógica más compleja según el contexto.