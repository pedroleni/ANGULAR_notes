# 10. Cambiar propiedades @HostBinding -  ngStyle - ngClass

En Angular, puedes modificar estilos de elementos HTML de varias formas, dependiendo de lo que necesites (dinámico, condicional, estático…). Aquí te explico **las formas más comunes y directas**:

---

## ✅ 1. Con `ngStyle` (para estilos en línea dinámicos)

```html

<div [ngStyle]="{ 'background-color': colorFondo, 'font-size': tamanoLetra + 'px' }">
  Texto con estilo dinámico
</div>

```

### TypeScript:

```tsx

colorFondo = 'lightblue';
tamanoLetra = 20;

```

---

## ✅ 2. Con `ngClass` (para aplicar clases CSS condicionalmente)

```html

<div [ngClass]="{ 'activo': isActivo, 'error': tieneError }">
  Contenido estilizado
</div>

```

### CSS:

```css

.activo {
  background-color: green;
}
.error {
  color: red;
}

```

### TypeScript:

```tsx

isActivo = true;
tieneError = false;

```

---

## ✅ 3. Estilos desde el archivo `.component.css`

Si usas estilos encapsulados (por defecto en Angular):

### `componente.component.css`:

```css

.destacado {
  font-weight: bold;
  color: blue;
}

```

### HTML:

```html

<p class="destacado">Texto importante</p>

```

---

## ✅ 4. `@ViewChild` + `ElementRef` (DOM directo, no recomendado salvo casos especiales)

Para casos puntuales donde necesitas acceso directo al DOM (¡usa esto con moderación!):

### HTML:

```html

<div #miDiv>Texto a modificar</div>
<button (click)="cambiarEstilo()">Cambiar estilo</button>

```

### TypeScript:

```tsx

import { ElementRef, ViewChild } from '@angular/core';

@ViewChild('miDiv') divRef!: ElementRef;

cambiarEstilo() {
  this.divRef.nativeElement.style.backgroundColor = 'yellow';
  this.divRef.nativeElement.style.fontSize = '24px';
}

```

![image.png](10%20Cambiar%20propiedades%20@HostBinding%20-%20ngStyle%20-%20ng%2022e2f387d5c3805fb065d4f50afabc02/image.png)

![image.png](10%20Cambiar%20propiedades%20@HostBinding%20-%20ngStyle%20-%20ng%2022e2f387d5c3805fb065d4f50afabc02/image%201.png)

---

## ✅ 5. Angular 20: Si usas **Signals**, puedes hacer lo mismo de forma reactiva:

```tsx

import { signal } from '@angular/core';

colorFondo = signal('blue');

```

Y en el HTML:

```html

<div [style.backgroundColor]="colorFondo()">
  Caja con Signal
</div>

```

---

## ✅ 6. ¿Qué es `@HostBinding`?

Es una forma de **vincular propiedades o estilos del *host element*** (el `<div>`, `<button>`, `<app-mi-componente>`, etc.) **desde el componente o directiva**, sin escribir nada en el HTML.

---

## 🎯 Ejemplo básico: cambiar el fondo desde el componente

Supón que tienes un componente personalizado llamado `boton-dinamico` y quieres que siempre tenga un fondo naranja y texto blanco.

### 1. `boton-dinamico.component.ts`

```tsx

import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'boton-dinamico',
  template: `Haz clic aquí`,
})
export class BotonDinamicoComponent {
  @HostBinding('style.backgroundColor') fondo = 'orange';
  @HostBinding('style.color') colorTexto = 'white';
  @HostBinding('style.padding') padding = '10px';
  @HostBinding('style.borderRadius') radio = '8px';
}

```

### 2. En tu HTML donde lo uses:

```html

<boton-dinamico></boton-dinamico>

```

> 🔍 El resultado será que el componente se verá como un botón naranja estilizado sin tener que poner ni una clase ni estilo en el HTML.
> 

## 🎯 Ejemplo dinámico: cambiar el fondo desde el componente

### ✅ Código funcional:

```tsx
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'boton-dinamico',
  template: `<button (click)="cambiarColor()">Cambiar color</button>`,
})
export class BotonDinamicoComponent {
  private alterna = false;

  @HostBinding('style.backgroundColor') fondo = 'green'; // Esta sí reacciona al cambio
  @HostBinding('style.display') display = 'inline-block'; // Para que se vea
  @HostBinding('style.padding') padding = '10px';

  cambiarColor() {
    this.alterna = !this.alterna;
    this.fondo = this.alterna ? 'crimson' : 'green';
  }
}

```

### 🧪 Cómo probarlo

En el HTML:

```html

<boton-dinamico></boton-dinamico>

```

Verás que el componente (el host, no el `<button>`) cambia de color.

![image.png](10%20Cambiar%20propiedades%20@HostBinding%20-%20ngStyle%20-%20ng%2022e2f387d5c3805fb065d4f50afabc02/image%202.png)

![image.png](10%20Cambiar%20propiedades%20@HostBinding%20-%20ngStyle%20-%20ng%2022e2f387d5c3805fb065d4f50afabc02/image%203.png)

## 🧠 Consejo

Siempre que puedas, **prefiere `ngStyle` o `ngClass`**. Son seguros, declarativos y aprovechan la filosofía de Angular. Solo accede al DOM directamente (`ViewChild + ElementRef`) si no tienes otra opción o si necesitas animaciones muy específicas.