# Mostrar rutas con router-outlet

La directiva `RouterOutlet` actúa como un marcador de posición que indica **dónde debe renderizar Angular el componente correspondiente a la ruta actual**.

```html

<app-header />
<router-outlet />  <!-- Aquí Angular inserta el contenido de la ruta -->
<app-footer />

```

### Ejemplo:

```tsx

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}

```

---

Si la aplicación define las siguientes rutas:

```tsx

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Página principal'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Nuestros productos'
  }
];

```

Cuando un usuario visita `/products`, Angular renderiza:

```html

<app-header />
<app-products />
<app-footer />

```

Si el usuario vuelve a la página de inicio (`/`), Angular muestra:

```html

<app-header />
<app-home />
<app-footer />

```

> ⚠️ El elemento <router-outlet> permanece en el DOM como punto de anclaje para futuras navegaciones. Angular inserta el componente de la ruta justo después del outlet, como un hermano en el árbol DOM.
> 

---

## 🔁 Rutas anidadas (Child Routes)

Cuando una aplicación se vuelve más compleja, puedes definir rutas que sean relativas a un componente que **no sea el raíz**. Esto permite cambiar solo una parte de la vista cuando la URL cambia, en lugar de recargar toda la interfaz.

Estas se llaman **rutas hijas**, y requieren añadir un segundo `<router-outlet>` en el componente padre.

### Ejemplo:

```html

<!-- settings.component.html -->
<h1>Configuración</h1>
<nav>
  <ul>
    <li><a routerLink="profile">Perfil</a></li>
    <li><a routerLink="security">Seguridad</a></li>
  </ul>
</nav>
<router-outlet />

```

### Definición de rutas:

```tsx

const routes: Routes = [
  {
    path: 'settings-component',
    component: SettingsComponent, // contiene el <router-outlet>
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'security',
        component: SecurityComponent
      }
    ]
  }
];

```

> Una vez definidas correctamente las rutas y los outlets, ¡ya estás usando rutas anidadas en Angular!
> 

---

## 🪟 Rutas secundarias con outlets nombrados

Puedes tener **múltiples outlets** en la misma página. A cada uno le puedes asignar un nombre para definir **qué contenido va en cuál**.

```html

<app-header />
<router-outlet /> <!-- outlet primario -->
<router-outlet name="read-more" />
<router-outlet name="additional-actions" />
<app-footer />

```

Cada outlet debe tener un nombre único. Angular usará la propiedad `outlet` de la ruta para decidir qué contenido va en cada outlet.

```tsx

{
  path: 'user/:id',
  component: UserDetails,
  outlet: 'additional-actions'
}

```

---

## ⚙️ Eventos del ciclo de vida de `router-outlet`

`<router-outlet>` puede emitir 4 eventos relacionados con el ciclo de vida de los componentes que renderiza:

| Evento | Descripción |
| --- | --- |
| `activate` | Cuando se instancia un nuevo componente |
| `deactivate` | Cuando se destruye un componente |
| `attach` | Cuando se vuelve a montar una ruta por el `RouteReuseStrategy` |
| `detach` | Cuando se desmonta una ruta por el `RouteReuseStrategy` |

### Ejemplo de uso:

```html

<router-outlet
  (activate)="onActivate($event)"
  (deactivate)="onDeactivate($event)"
  (attach)="onAttach($event)"
  (detach)="onDetach($event)"
></router-outlet>

```