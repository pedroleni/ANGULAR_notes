# ¿Qué es un componente en Angular?

Un componente es el **bloque básico** en Angular. Está compuesto por:

1. Una **clase TypeScript** que define su lógica.
2. Un **template HTML** que describe la vista.
3. Uno o más **estilos CSS/SCSS** (opcional).
4. Un **selector** (una etiqueta personalizada usada en otros templates). 

Es la unidad mínima de UI reutilizable y encapsulada, como un pequeño widget que entiende su propia lógica, estructura y apariencia.

## Todo componente debe tener:

- **Una clase TypeScript** con comportamientos como manejar la entrada del usuario y obtener datos de un servidor.
- **Una plantilla HTML** que controla lo que se renderiza en el DOM.
- **Un selector CSS** que define cómo se usa el componente en HTML.

Proporcionas información específica de Angular para un componente añadiendo un decorador `@Component` encima de la clase TypeScript:

```tsx

@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Tu foto de perfil">`,
})
export class ProfilePhoto { }

```

Para más detalles sobre cómo escribir plantillas en Angular, incluyendo **data binding**, manejo de eventos y control de flujo, consulta la guía de *Templates*.

---

## Metadatos del componente

El objeto pasado al decorador `@Component` se llama **metadatos del componente**. Esto incluye el selector, la plantilla y otras propiedades que se describen a lo largo de esta guía.

Los componentes pueden incluir opcionalmente una lista de estilos CSS que se aplican al DOM de ese componente:

```tsx

@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Tu foto de perfil">`,
  styles: `img { border-radius: 50%; }`,
})
export class ProfilePhoto { }

```

Por defecto, los estilos de un componente solo afectan a los elementos definidos en la plantilla de ese componente. Consulta *Styling Components* para más información sobre el enfoque de Angular para el estilado.

---

## Plantilla y estilos en archivos separados

También puedes escribir la plantilla y los estilos en archivos separados:

```tsx

@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }

```

Esto ayuda a separar las preocupaciones de presentación y comportamiento en tu proyecto.

Puedes elegir un solo enfoque para todo el proyecto o decidir cuál usar en cada componente.

Tanto `templateUrl` como `styleUrl` son rutas **relativas** al directorio donde se encuentra el componente.

---

## Usar componentes

### Imports en el decorador `@Component`

Para usar un componente, directiva o pipe, debes añadirlo al array `imports` del decorador `@Component`:

```tsx

import { ProfilePhoto } from './profile-photo';

@Component({
  // Importa el componente `ProfilePhoto`
  // para usarlo en la plantilla de este componente.
  imports: [ProfilePhoto],
  /* ... */
})
export class UserProfile { }

```

Por defecto, los componentes en Angular son **standalone**, lo que significa que puedes añadirlos directamente al array `imports` de otros componentes.

Los componentes creados con versiones anteriores de Angular pueden especificar `standalone: false` en su decorador `@Component`.

En esos casos, debes importar el `NgModule` donde esté definido el componente. Consulta la guía completa de *NgModule* para más detalles.

> Importante: En versiones de Angular anteriores a la 19.0.0, la opción standalone es false por defecto.
> 

---

## Mostrar componentes en una plantilla

Todo componente define un **selector CSS**:

```tsx

@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }

```

Muestras un componente creando un elemento HTML que coincida con su selector en la plantilla de otro componente:

```tsx
@Component({
  selector: 'profile-photo',
})
export class ProfilePhoto { }

@Component({
  imports: [ProfilePhoto],
  template: `<profile-photo />`
})
export class UserProfile { }

```

Angular crea una instancia del componente para cada elemento HTML que coincida con su selector.

El elemento del DOM que coincide con el selector de un componente se llama **elemento host** de ese componente.

El contenido de la plantilla del componente se renderiza dentro de su elemento host.

El DOM renderizado por un componente, correspondiente a su plantilla, se llama **vista del componente** (*component view*).

---

## Árbol de componentes

Al componer componentes de esta forma, puedes imaginar tu aplicación Angular como un **árbol de componentes**:

```

AccountSettings
 ├── UserProfile
 │    ├── PaymentInfo
 │    ├── ProfilePic
 │    └── UserBio

```

Esta estructura en árbol es importante para entender otros conceptos de Angular, como la **inyección de dependencias** (*dependency injection*) y las **consultas de elementos hijos** (*child queries*).