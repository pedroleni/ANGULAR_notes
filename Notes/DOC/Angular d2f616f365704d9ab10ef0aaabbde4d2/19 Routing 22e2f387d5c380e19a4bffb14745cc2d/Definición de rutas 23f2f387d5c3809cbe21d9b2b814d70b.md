# Definición de rutas

## 📌 ¿Qué son las rutas en Angular?

En Angular, una **ruta** es un objeto que define **qué componente debe renderizarse** para una URL específica o un patrón de ruta. También puede incluir configuraciones adicionales sobre qué hacer cuando el usuario navega a esa URL.

### Ejemplo básico:

```tsx

import { AdminPage } from './app-admin/app-admin.component';

const adminPage = {
  path: 'admin',
  component: AdminPage
};

```

👉 Cuando el usuario visita `/admin`, Angular mostrará el componente `AdminPage`.

---

## 🛠️ Cómo gestionar las rutas

Normalmente, las rutas se definen en un archivo aparte, por ejemplo `app.routes.ts`.

### Ejemplo:

```tsx

import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page.component';
import { AdminPage } from './about-page/admin-page.component';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'admin', component: AdminPage }
];

```

💡 Si creaste el proyecto con Angular CLI, las rutas están en `src/app/app.routes.ts`.

---

## 🔌 Añadir el router a la aplicación

Al inicializar una app Angular sin `NgModule`, se hace con `provideRouter()` en la configuración:

```tsx

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // otros providers
  ]
};

```

---

## 🔗 Tipos de rutas

### 🔸 Rutas estáticas:

Coinciden exactamente con una cadena de texto:

```

/admin
/blog
/settings/account

```

---

### 🔸 Rutas con parámetros:

Permiten pasar datos dinámicos en la URL:

```tsx

{ path: 'user/:id', component: UserProfile }

```

Ejemplos válidos: `/user/leeroy`, `/user/jenkins`

Los parámetros deben comenzar con una letra y pueden contener letras, números, guiones y guiones bajos.

También puedes usar múltiples parámetros:

```tsx

{ path: 'user/:id/:socialMedia', component: SocialMediaFeed }

```

---

### 🔸 Rutas comodín (`*`)

Capturan cualquier ruta no definida:

```tsx

{ path: '**', component: NotFound }

```

💡 Siempre se coloca al final del arreglo de rutas.

---

## 📏 ¿Cómo Angular decide qué ruta usar?

Usa el principio **"primera coincidencia gana"**, así que debes ordenar tus rutas de más específicas a más genéricas.

```tsx

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users/new', component: NewUserComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'users', component: UsersComponent },
  { path: '**', component: NotFoundComponent }
];

```

---

## ⚡ Estrategias de carga de componentes

### 🔹 Carga anticipada (eager loading):

El componente se incluye en el bundle inicial:

```tsx

{ path: '', component: HomePage }

```

👍 Más rápido al navegar, pero carga más JS al inicio.

---

### 🔹 Carga diferida (lazy loading):

Carga el componente solo cuando se necesita:

```tsx

{
  path: 'login',
  loadComponent: () => import('./components/auth/login-page').then(m => m.LoginPage)
}

```

Ideal para mejorar el rendimiento inicial. Divide el JS en "chunks".

---

## 🔁 Redirecciones

En vez de renderizar un componente, rediriges a otra ruta:

```tsx

{ path: 'articles', redirectTo: '/blog' }

```

---

## 🧭 Títulos de páginas

Puedes asignar títulos directamente:

```tsx

{ path: '', component: HomeComponent, title: 'Página principal' }

```

O usar una función resolutiva:

```tsx

const titleResolver: ResolveFn<string> = (route) => route.queryParams['id'];
{ path: 'products', component: ProductsComponent, title: titleResolver }

```

---

## 💉 Providers a nivel de ruta

Puedes inyectar dependencias que solo vivan dentro de una ruta y sus hijas:

```tsx

{
  path: 'admin',
  providers: [
    AdminService,
    { provide: ADMIN_API_KEY, useValue: '12345' },
  ],
  children: [
    { path: 'users', component: AdminUsersComponent }
  ]
}

```

---

## 📦 Datos asociados a rutas

### 🔸 Datos estáticos:

```tsx

{
  path: 'about',
  component: AboutComponent,
  data: { analyticsId: '456' }
}

```

### 🔸 Datos dinámicos (resolvers):

Se configuran usando funciones que se ejecutan antes de activar la ruta.

---

## 🧩 Rutas anidadas (Nested Routes)

Permiten vistas secundarias dentro de un componente padre:

```tsx

{
  path: 'product/:id',
  component: ProductComponent,
  children: [
    { path: 'info', component: ProductInfoComponent },
    { path: 'reviews', component: ProductReviewsComponent }
  ]
}

```

El componente padre debe incluir `<router-outlet />`.