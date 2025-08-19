# Selectores

Cada componente define un **selector CSS** que determina cómo se usa el componente:

```tsx

@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }

```

Usas un componente creando un elemento HTML que coincida con su selector en la plantilla de otros componentes:

```tsx
ts
CopiarEditar
@Component({
  template: `
    <profile-photo />
    <button>Subir una nueva foto de perfil</button>`,
  ...,
})
export class UserProfile { }

```

Angular hace coincidir los selectores **de forma estática en tiempo de compilación**. Cambiar el DOM en tiempo de ejecución, ya sea mediante *bindings* de Angular o con APIs del DOM, **no afecta** a los componentes renderizados.

Un elemento **solo puede coincidir con un único selector de componente**.

Si varios selectores de componentes coinciden con el mismo elemento, Angular muestra un error.

Los selectores de componentes **distinguen entre mayúsculas y minúsculas**.

---

## Tipos de selectores

Angular admite un subconjunto limitado de tipos básicos de selectores CSS en los selectores de componentes:

| Tipo de selector | Descripción | Ejemplos |
| --- | --- | --- |
| **Selector de tipo** | Coincide con elementos según su nombre de etiqueta HTML o nombre de nodo. | `profile-photo` |
| **Selector de atributo** | Coincide con elementos que tienen un atributo HTML concreto y, opcionalmente, un valor exacto para ese atributo. | `[dropzone]` `[type="reset"]` |
| **Selector de clase** | Coincide con elementos que tienen una clase CSS específica. | `.menu-item` |

Para valores de atributos, Angular admite coincidencias exactas usando el operador `=`.

No se admiten otros operadores de coincidencia de atributos.

Los selectores de componentes **no admiten combinadores** (como el combinador de descendientes o de hijos) ni la especificación de **namespaces**.

---

## La pseudo-clase `:not`

Angular admite la pseudo-clase `:not`. Puedes añadirla a cualquier otro selector para restringir qué elementos coinciden con el selector del componente.

Ejemplo: definir un selector de atributo `[dropzone]` pero evitar que coincida con elementos `<textarea>`:

```tsx

@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }

```

Angular no admite ninguna otra pseudo-clase ni pseudo-elemento en los selectores de componentes.

---

## Combinación de selectores

Puedes combinar varios selectores concatenándolos.

Ejemplo: coincidir con elementos `<button>` que tengan `type="reset"`:

```tsx

@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }

```

También puedes definir múltiples selectores en una lista separada por comas:

```tsx

@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }

```

Angular creará un componente para **cada elemento que coincida con cualquiera de los selectores** de la lista.

---

## Elegir un selector

La gran mayoría de los componentes deberían usar un **nombre de elemento personalizado** como selector.

Según la especificación HTML, todos los nombres de elementos personalizados deben incluir un guion (`-`).

Por defecto, Angular muestra un error si encuentra un nombre de etiqueta personalizada que no coincide con ningún componente disponible, evitando errores por nombres mal escritos.

---

## Prefijos de selectores

El equipo de Angular recomienda usar un **prefijo corto y coherente** para todos los componentes personalizados definidos en tu proyecto.

Por ejemplo, si construyes YouTube con Angular, podrías usar el prefijo `yt-`, con componentes como `yt-menu`, `yt-player`, etc.

Agrupar los selectores con un prefijo así deja claro de inmediato de dónde proviene un componente.

Por defecto, Angular CLI usa el prefijo `app-`.

> Angular usa el prefijo ng para sus propias APIs del framework. Nunca uses ng como prefijo para tus componentes personalizados.
> 

---

## Cuándo usar un selector de atributo

Considera usar un **selector de atributo** cuando quieras crear un componente sobre un elemento nativo estándar.

Ejemplo: para un botón personalizado, puedes aprovechar `<button>` usando un selector de atributo:

```tsx

@Component({
  selector: 'button[yt-upload]',
  ...
})
export class YouTubeUploadButton { }

```

Esto permite que quien use el componente aproveche todas las APIs estándar del elemento sin trabajo extra.

Es especialmente útil para atributos ARIA como `aria-label`.

Angular **no muestra errores** cuando encuentra atributos personalizados que no coinciden con ningún componente disponible.

Si usas componentes con selectores de atributo, los consumidores podrían olvidar importar el componente o su `NgModule`, lo que haría que el componente no se renderice.

Consulta *Importing and using components* para más información.

Los componentes que definan selectores de atributo deberían usar atributos **en minúsculas** y con **guiones** (`dash-case`).

Puedes seguir la misma recomendación de prefijos mencionada anteriormente.