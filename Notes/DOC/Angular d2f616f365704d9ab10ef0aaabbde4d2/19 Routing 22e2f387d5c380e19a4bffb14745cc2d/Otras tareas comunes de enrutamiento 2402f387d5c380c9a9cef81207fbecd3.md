# Otras tareas comunes de enrutamiento

Esta guía cubre algunas tareas comunes relacionadas con el uso del enrutador de Angular en tu aplicación.

---

### En esta página:

- Obtener información de la ruta
- Añadir `withComponentInputBinding`
- Añadir un input al componente
- Opcional: Usar un valor por defecto
- Mostrar una página 404
- Array de parámetros de enlace
- `LocationStrategy` y estilos de URL del navegador

---

### Obtener información de la ruta

A menudo, al navegar por la aplicación, se desea pasar información de un componente a otro. Por ejemplo, considera una app que muestra una lista de compras. Cada artículo tiene un `id` único. Para editar uno, el usuario pulsa un botón que abre un componente `EditGroceryItem`. Quieres que este componente reciba el `id` del artículo para mostrar la información correspondiente.

Para ello, puedes usar rutas. Utiliza la característica `withComponentInputBinding` con `provideRouter`, o la opción `bindToComponentInputs` de `RouterModule.forRoot`.

---

### Para obtener información desde una ruta:

### 1. Añadir `withComponentInputBinding`

Añade esta característica al `provideRouter`:

```tsx

providers: [
  provideRouter(appRoutes, withComponentInputBinding()),
]

```

---

### 2. Añadir un input al componente

Actualiza el componente con una propiedad `@input()` que coincida con el nombre del parámetro:

```tsx

id = input.required<string>()
hero = computed(() => this.service.getHero(id));

```

---

### 3. (Opcional) Usar un valor por defecto

El enrutador asigna valores a todas las entradas (`inputs`) basándose en la ruta actual. Si no encuentra coincidencia (como en el caso de un parámetro de consulta opcional), asigna `undefined`.

Puedes proporcionar un valor por defecto usando `transform`:

```tsx

id = input.required({
  transform: (maybeUndefined: string | undefined) => maybeUndefined ?? '0',
});

```

O gestionarlo tú:

```tsx

id = input<string|undefined>();
internalId = linkedSignal(() => this.id() ?? getDefaultId());

```

📌 **Nota**: puedes vincular todos los datos de la ruta como pares clave-valor a entradas del componente: datos estáticos, datos resueltos, parámetros de ruta, parámetros de matriz y de consulta.

Si necesitas acceder a datos de rutas padres, usa:

```tsx

withRouterConfig({ paramsInheritanceStrategy: 'always' })

```

---

### Mostrar una página 404

Configura una ruta comodín (`**`) con el componente que desees usar:

```tsx

const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '**', component: PageNotFoundComponent },  // Ruta comodín para 404
];

```

Esta última ruta captura cualquier URL no reconocida y dirige al usuario al componente `PageNotFoundComponent`.

---

### Array de parámetros de enlace (Link parameters array)

Un array de parámetros contiene:

- El path del componente destino
- Parámetros requeridos y opcionales para la URL

Ejemplo:

```html

<a [routerLink]="['/heroes']">Heroes</a>

```

Con parámetro:

```html

<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span>{{ hero.name }}
</a>

```

Con parámetros opcionales:

```html

<a [routerLink]="['/crisis-center', { foo: 'foo' }]">Crisis Center</a>

```

Esto también funciona con rutas hijas. Ejemplo mínimo:

```html

<a [routerLink]="['/crisis-center']">Crisis Center</a>

```

Explicación:

- Primer elemento: ruta padre `/crisis-center`
- No hay parámetros
- No hay ruta hija por defecto, se debe elegir una

Otra forma de navegar, por ejemplo, a una crisis específica:

```html

<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>

```

- Ruta padre: `/crisis-center`
- Segundo ítem: ID de la crisis `1`
- Ruta resultante: `/crisis-center/1`

Ejemplo completo de plantilla:

```tsx

@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', { foo: 'foo' }]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}

```

📌 En resumen: puedes construir aplicaciones con uno o varios niveles de rutas. El array de parámetros permite definir rutas de cualquier profundidad y estructura, con parámetros obligatorios u opcionales.

---

### `LocationStrategy` y estilos de URL

Cuando el enrutador navega a una vista, actualiza la ubicación y el historial del navegador con la URL.

Los navegadores modernos soportan `history.pushState`, que permite cambiar la URL sin recargar la página. Ejemplo de URL estilo `HTML5 pushState`:

```

localhost:3002/crisis-center

```

Navegadores antiguos requieren una `#` para evitar recargas. Ejemplo estilo hash:

```

localhost:3002/src/#/crisis-center

```

Angular ofrece dos estrategias:

| Estrategia | Descripción |
| --- | --- |
| `PathLocationStrategy` | (Por defecto) Usa URLs "naturales" con `pushState`. |
| `HashLocationStrategy` | Usa URLs con `#`. Útil para compatibilidad con navegadores antiguos. |

Puedes cambiar de estrategia usando un proveedor al hacer `bootstrap`.