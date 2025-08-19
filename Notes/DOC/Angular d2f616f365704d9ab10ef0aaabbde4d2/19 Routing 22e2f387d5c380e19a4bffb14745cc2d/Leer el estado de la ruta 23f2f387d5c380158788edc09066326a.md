# Leer el estado de la ruta

El **Angular Router** permite leer y utilizar información asociada a la ruta actual para crear componentes **reactivos y contextuales**.

---

## 🔍 Obtener información de la ruta actual con `ActivatedRoute`

`ActivatedRoute` es un servicio de `@angular/router` que proporciona toda la información relacionada con la ruta activa.

```tsx

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
})
export class ProductComponent {
  private activatedRoute = inject(ActivatedRoute);
  constructor() {
    console.log(this.activatedRoute);
  }
}

```

### Propiedades comunes:

| Propiedad | Descripción |
| --- | --- |
| `url` | Observable con las partes de la ruta como array de strings |
| `data` | Observable con los datos estáticos o resolvers definidos en la ruta |
| `params` | Observable con los parámetros de ruta requeridos u opcionales |
| `queryParams` | Observable con los parámetros de consulta (query string) |

---

## 🕰️ Comprender los snapshots de ruta

Cada navegación es un evento en el tiempo. Puedes obtener un **estado estático de la ruta actual** mediante un **snapshot**.

```tsx

import { ActivatedRoute } from '@angular/router';

@Component({ ... })
export class UserProfileComponent {
  readonly userId: string;
  private route = inject(ActivatedRoute);

  constructor() {
    this.userId = this.route.snapshot.paramMap.get('id');
    const snapshot = this.route.snapshot;

    console.log({
      url: snapshot.url,
      params: snapshot.params,
      queryParams: snapshot.queryParams
    });
  }
}

```

> Los snapshots no reaccionan a cambios futuros, sólo reflejan el estado en el momento de la activación de la ruta.
> 

---

## 🔑 Leer parámetros de una ruta

Existen dos tipos principales:

### 📍 Parámetros de ruta (`params`)

Se definen con `:id`, por ejemplo:

```tsx

import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
const routes: Routes = [
  { path: 'product/:id', component: ProductComponent }
];

```

Acceso desde el componente:

```tsx
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: `<h1>Producto: {{ productId() }}</h1>`,
})
export class ProductDetailComponent {
  productId = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      this.productId.set(params['id']);
    });
  }
}

```

---

### ❓ Parámetros de consulta (`queryParams`)

Son ideales para filtros, ordenamientos, paginación, etc.

```tsx

// URL: /products?category=electronics&sort=price&page=1
this.router.navigate(['/products'], {
  queryParams: { category: 'electronics', sort: 'price', page: 1 }
});

```

Acceso desde el componente:

```tsx
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <select (change)="updateSort($event)">
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
      <!-- Products list -->
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.route.queryParams.subscribe(params => {
      const sort = params['sort'] || 'price';
      const page = Number(params['page']) || 1;
      this.loadProducts(sort, page);
    });
  }

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    this.router.navigate([], {
      queryParams: { sort },
      queryParamsHandling: 'merge' // mantiene otros query params
    });
  }
}

```

---

## 🟢 Detectar la ruta activa con `RouterLinkActive`

`RouterLinkActive` permite aplicar clases CSS dinámicamente en enlaces según la ruta actual.

```html

<nav>
  <a routerLink="/about" routerLinkActive="active-button" ariaCurrentWhenActive="page">About</a>
  <a routerLink="/settings" routerLinkActive="active-button" ariaCurrentWhenActive="page">Settings</a>
</nav>

```

Puedes aplicar múltiples clases:

```html

<a routerLink="/user/bob" routerLinkActive="clase1 clase2">Bob</a>
<a routerLink="/user/bob" [routerLinkActive]="['clase1', 'clase2']">Bob</a>

```

---

## 🎯 Estrategia de coincidencia de rutas (`routerLinkActiveOptions`)

Por defecto, `RouterLinkActive` considera una ruta activa si está en el árbol de la actual.

```html

<!-- Ambas se activan en /user/jane/role/admin -->
<a routerLink="/user/jane" routerLinkActive="active-link">User</a>
<a routerLink="/user/jane/role/admin" routerLinkActive="active-link">Role</a>

```

### Activar solo si hay coincidencia exacta:

```html

<a routerLink="/user/jane"
   routerLinkActive="active-link"
   [routerLinkActiveOptions]="{ exact: true }">
   User
</a>

```

`exact: true` equivale a:

```tsx

{
  paths: 'exact',
  queryParams: 'exact',
  fragment: 'ignored',
  matrixParams: 'ignored',
}

```

---

## 🧬 Aplicar `RouterLinkActive` a un contenedor

También puedes aplicarlo al **contenedor** de los enlaces:

```html

<div routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }">
  <a routerLink="/user/jim">Jim</a>
  <a routerLink="/user/bob">Bob</a>
</div>

```