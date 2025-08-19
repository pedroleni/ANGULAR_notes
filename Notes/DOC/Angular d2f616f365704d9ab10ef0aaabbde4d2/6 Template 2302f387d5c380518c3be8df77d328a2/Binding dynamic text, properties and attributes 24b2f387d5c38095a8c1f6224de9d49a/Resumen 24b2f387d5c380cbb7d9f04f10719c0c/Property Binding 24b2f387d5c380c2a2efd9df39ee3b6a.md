# Property Binding

## 🎯 ¿Qué es Property Binding?

Es una manera de **ligar datos del componente a propiedades del DOM o de componentes hijos**.

Usa la sintaxis:

```html

[elementProperty]="componentProperty"

```

Por ejemplo:

```html

<img [src]="fotoUrl">

```

Angular evalúa la propiedad `fotoUrl` en tu componente y la asigna directamente al atributo `src` del elemento `img`.

---

## 🔬 ¿Por qué usar Property Binding en vez de interpolación?

| Caso | ¿Interpolación (`{{ }}`)? | ¿Property Binding (`[prop]`)? |
| --- | --- | --- |
| Solo texto (contenido de un párrafo) | ✅ | ❌ |
| Atributos dinámicos (como `src`, `href`, `disabled`) | ❌ | ✅ |
| Booleanos (`disabled`, `checked`, `hidden`, etc.) | ❌ | ✅ |
| Estilos, clases, bindings complejos | ❌ | ✅ |

---

## 📦 Ejemplos prácticos

### 1. Imagen dinámica

```tsx

fotoUrl = 'assets/perro.png';

```

```html

<img [src]="fotoUrl">

```

---

### 2. Botón deshabilitado condicionalmente

```tsx

botonActivo = false;

```

```html

<button [disabled]="!botonActivo">Enviar</button>

```

---

### 3. Estilo dinámico

```tsx

color = 'red';

```

```html

<p [style.color]="color">Texto rojo</p>

```

---

### 4. Binding con signal (Angular 16+)

```tsx

contador = signal(0);

```

```html

<button [disabled]="contador() >= 5">Click</button>

```

💡 ¡Ojo! Si usás `signal`, recordá siempre los paréntesis: `contador()`

---

## 🧠 Detrás del telón

Property binding es más que un simple reemplazo de texto.

Angular hace lo siguiente:

- Detecta cambios en tus datos
- Actualiza SOLO los elementos que usan esos datos
- Evita inyecciones de código (seguridad)

---

## 🧪 Binding vs Atributos HTML normales

```html

<!-- Esto no funciona como esperás -->
<input value="{{ nombre }}">       <!-- Esto pone el valor inicial, pero no lo actualiza -->
<input [value]="nombre">          <!-- Esto sí lo actualiza dinámicamente -->

```

---