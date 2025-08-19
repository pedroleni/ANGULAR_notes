# Interpolación {{}}

En Angular, el uso de **`{{ }}`** se llama "interpolación". La interpolación es una sintaxis de template que Angular proporciona para enlazar datos de propiedades del componente al HTML del mismo. Permite insertar dinámicamente valores de propiedades del componente dentro del HTML, lo cual es muy útil para mostrar datos actualizados o cambiar el contenido visible en la interfaz de usuario basado en la lógica del componente.

Por ejemplo, si tienes una propiedad en tu componente TypeScript como esta:

```tsx

export class AppComponent {
  title = 'Bienvenido a mi aplicación';
}

```

Puedes mostrar el valor de **`title`** en el archivo HTML del componente usando la interpolación:

```html

<h1>{{ title }}</h1>

```

En este caso, Angular reemplaza **`{{ title }}`** con el valor actual de la propiedad **`title`** del componente, mostrando "Bienvenido a mi aplicación" en un elemento **`<h1>`** en la página web.

La interpolación en Angular es una parte fundamental del data binding (enlace de datos) — en este caso, del componente hacia la vista (one-way data binding), donde los datos fluyen en una sola dirección, desde el componente (clase TypeScript) al template (HTML).

## 👓 Interpolación + Signals (Angular 16–20)

Ahora puedes interpolar **signals directamente**:

```tsx

nombre = signal('Aristóteles');

```

```html

<p>Hola, {{ nombre() }}</p>  <!-- ¡Importante los paréntesis! -->

```

Sí, `nombre` es una función que devuelve el valor actual del signal.

Si el signal cambia, Angular vuelve a renderizar automáticamente **solo esa parte del DOM**.

## 🔁 Ejemplo completo (Angular 20 + standalone + signals)

```tsx

@Component({
  selector: 'app-saludo',
  standalone: true,
  template: `
    <h1>Hola, {{ nombre() }}</h1>
    <button (click)="cambiarNombre()">Cambiar</button>
  `
})
export class SaludoComponent {
  nombre = signal('Aristóteles');

  cambiarNombre() {
    this.nombre.set('Platón');
  }
}

```

💥 Cuando haces clic en el botón, `nombre()` cambia y el DOM se actualiza automáticamente.

## 🚫 NO se puede hacer esto:

```html

{{ if (true) { return 'algo' } }} <!-- ❌ inválido -->

```

En su lugar, hazlo en el componente:

```tsx

get algo() {
  return this.valor > 0 ? 'positivo' : 'negativo';
}

```

Y luego:

```html

<p>{{ algo }}</p>

```