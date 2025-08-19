# Estilado del componentes

Los componentes pueden incluir opcionalmente **estilos CSS** que se aplican al DOM de ese componente:

```tsx

@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Tu foto de perfil">`,
  styles: ` img { border-radius: 50%; } `,
})
export class ProfilePhoto { }

```

También puedes escribir los estilos en archivos separados:

```tsx

@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }

```

Cuando Angular compila tu componente, **estos estilos se emiten junto con el JavaScript** del componente.

Esto significa que los estilos participan en el sistema de módulos de JavaScript.

Cuando se renderiza un componente Angular, el framework incluye automáticamente sus estilos asociados, incluso si el componente se carga de forma diferida (*lazy-loading*).

Angular es compatible con cualquier herramienta que genere CSS, incluyendo **Sass**, **Less** y **Stylus**.

---

## **Ámbito de los estilos** (*Style scoping*)

Cada componente tiene una configuración de **encapsulación de vista** (*view encapsulation*) que determina cómo el framework delimita los estilos del componente.

Existen **tres modos**:

- **Emulated** (emulada)
- **ShadowDom** (Shadow DOM nativo)
- **None** (sin encapsulación)

Puedes especificar el modo en el decorador `@Component`:

```tsx

@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }

```

---

### **ViewEncapsulation.Emulated**

Por defecto, Angular usa la **encapsulación emulada**, lo que significa que los estilos de un componente **solo se aplican** a los elementos definidos en la plantilla de ese componente.

En este modo, Angular:

1. Genera un atributo HTML único para cada instancia del componente.
2. Añade ese atributo a los elementos de la plantilla del componente.
3. Inserta ese atributo en los selectores CSS definidos en los estilos del componente.

Esto evita que los estilos de un componente se filtren y afecten a otros componentes.

Sin embargo, los estilos globales definidos fuera de un componente **sí pueden afectar** a elementos dentro de un componente con encapsulación emulada.

### **Pseudo-clases soportadas en Emulated**

- `:host` y `:host-context()` — Angular las transforma en atributos durante la compilación (no se usan como pseudo-clases nativas en tiempo de ejecución).
- **No** se admiten otras pseudo-clases de Shadow DOM como `::shadow` o `::part`.

### **::ng-deep**

Angular admite la pseudo-clase personalizada `::ng-deep`, que **desactiva la encapsulación** para esa regla CSS, convirtiéndola en estilo global.

El equipo de Angular **desaconseja** su uso en nuevo código; se mantiene solo por compatibilidad hacia atrás.

---

### **ViewEncapsulation.ShadowDom**

Este modo utiliza la API estándar de **Shadow DOM** para aislar los estilos de un componente.

Cuando está activo:

- Angular añade un *shadow root* al elemento host del componente.
- Renderiza la plantilla y los estilos dentro de ese *shadow tree*.

Ventajas:

- Los estilos globales no afectan a los elementos dentro del shadow tree.
- Los estilos del shadow tree no afectan a elementos fuera de él.

Advertencia:

- Cambia más cosas que el ámbito de los estilos: afecta la propagación de eventos, el uso de `<slot>` y la visualización en las herramientas de desarrollo del navegador.
- Antes de habilitarlo, entiende bien las implicaciones.

---

### **ViewEncapsulation.None**

Este modo **desactiva completamente** la encapsulación de estilos.

Todos los estilos del componente se comportan como **globales**.

---

> Nota: En los modos Emulated y ShadowDom, Angular no garantiza al 100% que los estilos del componente siempre tengan prioridad sobre estilos externos en caso de conflicto; se asume que tienen la misma especificidad.
> 

---

## **Definir estilos en las plantillas**

Puedes usar la etiqueta `<style>` en la plantilla de un componente para definir estilos adicionales.

El modo de encapsulación del componente **también se aplica** a estos estilos.

> Angular no admite bindings dentro de elementos <style>.
> 

---

## **Referenciar archivos de estilo externos**

En las plantillas de componentes puedes:

- Usar `<link>` para enlazar archivos CSS.
- Usar `@import` dentro de tu CSS para importar otros archivos.

Angular trata estas referencias como **estilos externos**, que **no están afectados** por la encapsulación emulada.

## **Comparativa de modos de encapsulación de estilos en Angular**

| Modo | Cómo funciona | Aislamiento de estilos | Afecta a otros componentes | Puede recibir estilos globales | Ejemplo práctico |
| --- | --- | --- | --- | --- | --- |
| **Emulated** *(por defecto)* | Angular añade atributos únicos a elementos y selectores para simular aislamiento sin Shadow DOM. | ✅ Aíslan estilos internos. | ❌ No afectan fuera, salvo usando `::ng-deep`. | ✅ Sí recibe estilos globales. | Ideal para la mayoría de casos, compatibilidad amplia. |
| **ShadowDom** | Usa Shadow DOM nativo, renderizando plantilla y estilos dentro de un *shadow root*. | ✅ Aislamiento total (nativo). | ❌ No afecta fuera. | ❌ No recibe estilos globales. | Útil cuando necesitas aislamiento real y control total. |
| **None** | No hay encapsulación, los estilos son globales. | ❌ Sin aislamiento. | ✅ Afectan a todo el DOM. | ✅ Recibe y comparte estilos globales. | Para estilos globales o cuando necesitas herencia total. |

---

### **Visualización de comportamiento**

Supongamos que tenemos este CSS en un componente:

```css

h1 {
  color: red;
}

```

| Modo | Resultado |
| --- | --- |
| **Emulated** | Solo `<h1>` dentro de la plantilla de este componente son rojos (añade atributos como `_ngcontent-c0`). |
| **ShadowDom** | Solo `<h1>` dentro del shadow root son rojos; imposible afectar o ser afectado por CSS externo. |
| **None** | **Todos** los `<h1>` de la app serán rojos (estilo global). |

---

### **Código de ejemplo de los tres modos**

```tsx

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-demo',
  template: `<h1>Hola Angular</h1>`,
  styles: [`h1 { color: red; }`],
  encapsulation: ViewEncapsulation.Emulated // Cambiar a .ShadowDom o .None
})
export class DemoComponent {}

```

---

### **Cuándo usar cada uno**

- **Emulated:**
    
    ✅ Uso general.
    
    ✅ Compatible con todos los navegadores.
    
    ✅ Evita fugas de estilos sin bloquear los globales.
    
- **ShadowDom:**
    
    ✅ Cuando requieres encapsulación real.
    
    ⚠ Cuidado con la propagación de eventos y la integración de estilos globales.
    
    ⚠ No todos los entornos SSR manejan bien Shadow DOM.
    
- **None:**
    
    ✅ Para temas globales o librerías de componentes que quieren heredar estilos.
    
    ⚠ Riesgo de colisiones de CSS.