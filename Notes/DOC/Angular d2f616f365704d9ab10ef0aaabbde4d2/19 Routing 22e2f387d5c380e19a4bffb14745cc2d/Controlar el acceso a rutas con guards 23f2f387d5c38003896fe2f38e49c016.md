# Controlar el acceso a rutas con guards

> ⚠️ IMPORTANTE: Nunca confíes únicamente en los guards del lado cliente para controlar el acceso. Todo el JavaScript que se ejecuta en el navegador puede ser manipulado por el usuario. La autorización siempre debe reforzarse desde el servidor, además de los guards en Angular.
> 

---

## ¿Qué son los guards de ruta?

Los **guards** son funciones que determinan si un usuario puede **entrar o salir de una ruta**. Funcionan como “puestos de control” para gestionar el acceso a rutas específicas. Casos típicos incluyen:

- Autenticación
- Control de roles o permisos
- Prevención de pérdida de datos

---

## 🔨 Crear un guard

Puedes generarlo con Angular CLI:

```bash

ng generate guard nombre

```

También puedes crearlo manualmente como un archivo `.ts` con sufijo `-guard.ts`.

---

## ✅ Tipos de retorno de un guard

Todos los guards pueden devolver:

| Tipo de retorno | Descripción |
| --- | --- |
| `boolean` | `true` permite navegar, `false` bloquea |
| `UrlTree` o `RedirectCommand` | Redirecciona a otra ruta |
| `Promise<T>` o `Observable<T>` | Usa el primer valor emitido y luego se desuscribe |

> ⚠️ Nota sobre CanMatch: si devuelve false, Angular prueba otras rutas coincidentes, en vez de bloquear directamente.
> 

---

## 🧩 Tipos de guards en Angular

| Guard | Función principal |
| --- | --- |
| `CanActivate` | Controla si se puede **entrar** en una ruta |
| `CanActivateChild` | Controla si se puede entrar en rutas **hijas** |
| `CanDeactivate` | Controla si se puede **salir** de una ruta |
| `CanMatch` | Decide si una ruta puede **coincidir** durante el match |

---

### 🔐 `CanActivate`

Evita que se entre en una ruta sin cumplir condiciones (como estar autenticado).

```tsx

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};

```

> ✅ Para redireccionar, devuelve un UrlTree. No uses false seguido de una navegación manual.
> 

---

### 🧒 `CanActivateChild`

Protege todas las rutas hijas de una ruta principal.

```tsx

export const adminChildGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};

```

---

### 🚪 `CanDeactivate`

Controla si un usuario puede **salir de una ruta**, por ejemplo si tiene un formulario sin guardar.

```tsx

export const unsavedChangesGuard: CanDeactivateFn<FormComponent> = (component: FormComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};

```

---

### 🎯 `CanMatch`

Decide si una ruta debe coincidir, sin bloquear por completo. Útil para:

- Features condicionales
- A/B testing
- Rutas duplicadas con condiciones

```tsx

export const featureToggleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const featureService = inject(FeatureService);
  return featureService.isFeatureEnabled('newDashboard');
};

```

Y puedes hacer rutas condicionales así:

```tsx

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboard,
    canMatch: [adminGuard]
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canMatch: [userGuard]
  }
];

```

---

## ⚙️ Aplicar guards a las rutas

Se asignan como **arreglos** en la definición de rutas. Angular los evalúa **en orden**.

```tsx

const routes: Routes = [
  // CanActivate simple: requiere login
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // CanActivate múltiple: login + rol admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard]
  },

  // CanActivate + CanDeactivate
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard]
  },

  // CanActivateChild: protege todas las rutas hijas
  {
    path: 'users',
    canActivateChild: [authGuard],
    children: [
      { path: 'list', component: UserListComponent },
      { path: 'detail/:id', component: UserDetailComponent }
    ]
  },

  // CanMatch con feature flags
  {
    path: 'beta-feature',
    component: BetaFeatureComponent,
    canMatch: [featureToggleGuard]
  },

  // Ruta alternativa si la feature está desactivada
  {
    path: 'beta-feature',
    component: ComingSoonComponent
  }
];

```