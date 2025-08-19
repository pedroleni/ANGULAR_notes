# Data resolvers

Permiten obtener datos **antes** de navegar a una ruta, garantizando que los componentes reciban la información necesaria **antes de renderizarse**. Esto evita estados vacíos, mejora la experiencia de usuario y elimina la necesidad de mostrar indicadores de carga en datos críticos.

---

### ✅ ¿Qué son los data resolvers?

Un **resolver** es un servicio que implementa la función `ResolveFn`. Se ejecuta **antes de que se active una ruta** y puede obtener datos de APIs, bases de datos u otras fuentes.

Los datos obtenidos estarán disponibles en el componente mediante `ActivatedRoute`.

---

### 🎯 ¿Por qué usar resolvers?

- ❌ Evita estados vacíos: el componente ya tiene los datos al cargar.
- ✅ Mejor UX: elimina *spinners* para datos esenciales.
- ⚠️ Manejo de errores: puedes gestionar fallos **antes** de que el usuario vea el componente.
- 🔄 Consistencia: asegura que todos los datos estén listos, útil también para SSR (Server Side Rendering).

---

### ✏️ Crear un resolver

Un resolver es una función que implementa `ResolveFn`, y recibe `ActivatedRouteSnapshot` y `RouterStateSnapshot`.

```tsx

import { inject } from '@angular/core';
import { UserStore, SettingsStore } from './user-store';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import type { User, Settings } from './types';
export const userResolver: ResolveFn<User> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId);
};
export const settingsResolver: ResolveFn<Settings> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const settingsStore = inject(SettingsStore);
  const userId = route.paramMap.get('id')!;
  return settingsStore.getUserSettings(userId);
};

```

---

### ⚙️ Configurar rutas con resolvers

Se asignan en el campo `resolve` dentro de la definición de ruta:

```tsx

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetail,
    resolve: {
      user: userResolver,
      settings: settingsResolver
    }
  }
];

```

---

### 📥 Acceder a los datos resueltos en el componente

### 1. **Usando `ActivatedRoute`**

```tsx

import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import type { User, Settings } from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  user = computed(() => this.data().user as User);
  settings = computed(() => this.data().settings as Settings);
}

```

---

### 2. **Usando `withComponentInputBinding()`**

Permite **pasar directamente** los datos resueltos como *inputs* del componente.

```tsx

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
});

```

Y en el componente:

```tsx

import { Component, input } from '@angular/core';
import type { User, Settings } from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `
})
export class UserDetail {
  user = input.required<User>();
  settings = input.required<Settings>();
}

```

✅ Más limpio, con tipado fuerte y sin necesidad de `ActivatedRoute`.

---

## ⚠️ Manejo de errores en resolvers

Si un resolver falla y no se maneja bien, se lanza un `NavigationError` y la navegación se detiene.

### 🔁 Tres formas de manejar errores:

---

### 1. **Con `withNavigationErrorHandler()` (centralizado)**

```tsx

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withNavigationErrorHandler((error) => {
      const router = inject(Router);
      if (error?.message) {
        console.error('Error de navegación:', error.message);
      }
      router.navigate(['/error']);
    }))
  ]
});

```

Esto centraliza el manejo de errores de navegación/resolvers, sin duplicar código.

```tsx

export const userResolver: ResolveFn<User> = (route) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId); // sin manejo manual de error
};

```

---

### 2. **Suscribirse a eventos de navegación**

```tsx

import { Component, inject, signal } from '@angular/core';
import { Router, NavigationError } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="retryNavigation()">Reintentar</button>
      </div>
    }
    <router-outlet />
  `
})
export class App {
  private router = inject(Router);
  private lastFailedUrl = signal('');
  private navigationErrors = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationError => event instanceof NavigationError),
      map(event => {
        this.lastFailedUrl.set(event.url);
        console.error('Navigation error', event.error);
        return 'Error de navegación. Inténtalo de nuevo.';
      })
    ),
    { initialValue: '' }
  );
  errorMessage = this.navigationErrors;

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}

```

---

### 3. **Manejar errores directamente dentro del resolver**

```tsx

import { inject } from '@angular/core';
import { ResolveFn, RedirectCommand, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UserStore } from './user-store';
import type { User } from './types';

export const userResolver: ResolveFn<User | RedirectCommand> = (route) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId).pipe(
    catchError(error => {
      console.error('Fallo al cargar usuario:', error);
      return of(new RedirectCommand(router.parseUrl('/users')));
    })
  );
};

```

---

## 🧠 Consideraciones de carga en la navegación

Los resolvers **bloquean la navegación** hasta que terminan. Si son lentos, puede percibirse un retardo.

### 💡 Sugerencia: indicar al usuario que se está cargando

```tsx

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Cargando...</div>
    }
    <router-outlet />
  `
})
export class App {
  private router = inject(Router);
  isNavigating = toSignal(this.router.events.pipe(
    map(() => !!this.router.getCurrentNavigation())
  ));
}

```

---

## ✅ Buenas prácticas con resolvers

- 🎯 **Ligeros**: solo traer lo esencial.
- 🛡️ **Maneja errores** siempre.
- 🔁 **Usa caché** si es posible.
- 🕓 **Indica carga** si se tarda en resolver.
- ⏱️ **Evita bloqueos infinitos** (timeouts).
- 🔐 **Usa tipado fuerte** con interfaces de TypeScript.