# Navegar entre rutas en Angular

### 📌 `RouterLink`: navegación declarativa

La directiva `RouterLink` es la forma **declarativa** de Angular para gestionar navegación. Permite usar etiquetas `<a>`tradicionales que se integran perfectamente con el sistema de enrutamiento.

---

### 🧭 Cómo usar `RouterLink`

En lugar de usar `<a href="...">`, se usa:

```tsx

import { RouterLink } from '@angular/router';

@Component({
  template: `
    <nav>
      <a routerLink="/user-profile">Perfil de usuario</a>
      <a routerLink="/settings">Configuración</a>
    </nav>
  `,
  imports: [RouterLink],
})
export class App {}

```

---

### 🔗 Enlaces absolutos vs relativos

Los enlaces **relativos** permiten definir rutas en función de la ubicación actual, mientras que los **absolutos** usan toda la URL (con dominio y protocolo).

```html

<!-- Enlace absoluto -->
<a href="https://www.angular.dev/essentials">Guía de Angular</a>

<!-- Enlace relativo -->
<a href="/essentials">Guía de Angular</a>

```

💡 Los enlaces relativos son preferibles por ser más mantenibles.

---

### 🧮 Cómo funcionan las URLs relativas

Angular acepta dos formas de definir URLs relativas:

```html

<!-- Ruta relativa simple -->
<a routerLink="dashboard">Dashboard</a>
<a [routerLink]="['dashboard']">Dashboard</a>

<!-- Ruta con parámetros dinámicos -->
<a [routerLink]="['user', currentUserId]">Usuario actual</a>

```

También puedes definir si la ruta parte de la URL actual o desde la raíz, dependiendo de si usas `/` al inicio:

```html

<!-- Desde /settings -->
<a routerLink="notifications">→ /settings/notifications</a>
<a routerLink="/settings/notifications">→ /settings/notifications</a>

<!-- Parámetros anidados -->
<a routerLink="/team/123/user/456">Usuario 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Usuario actual</a>

```

---

## 🧠 Navegación programática en Angular

Además de `RouterLink`, Angular permite navegar **desde el código TypeScript**, útil cuando necesitas navegar como respuesta a lógica, acciones de usuario o estado de la app.

---

### 🔸 `router.navigate()`

Permite navegar pasando un array de segmentos de ruta:

```tsx

import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `<button (click)="navigateToProfile()">Ver perfil</button>`
})
export class AppDashboard {
  private router = inject(Router);

  navigateToProfile() {
    this.router.navigate(['/profile']); // Navegación simple
    this.router.navigate(['/users', userId]); // Con parámetros
    this.router.navigate(['/search'], {
      queryParams: { category: 'books', sort: 'price' }
    }); // Con query params
  }
}

```

También puedes navegar de forma **relativa** desde la ruta actual usando `relativeTo`:

```tsx

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <button (click)="navigateToEdit()">Editar</button>
    <button (click)="navigateToParent()">Volver</button>
  `
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  navigateToEdit() {
    // De /users/123 → a /users/123/edit
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  navigateToParent() {
    // De /users/123 → a /users
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}

```

---

### 🔸 `router.navigateByUrl()`

Usa una cadena de texto con la URL completa:

```tsx

// Navegación estándar
router.navigateByUrl('/products');

// Ruta anidada
router.navigateByUrl('/products/featured');

// Con query y fragmento
router.navigateByUrl('/products/123?view=details#reviews');

// Con parámetros de búsqueda
router.navigateByUrl('/search?category=books&sortBy=price');

```

También puedes **reemplazar la URL en el historial** (sin dejar registro en "atrás"):

```tsx

router.navigateByUrl('/checkout', {
  replaceUrl: true
});

```