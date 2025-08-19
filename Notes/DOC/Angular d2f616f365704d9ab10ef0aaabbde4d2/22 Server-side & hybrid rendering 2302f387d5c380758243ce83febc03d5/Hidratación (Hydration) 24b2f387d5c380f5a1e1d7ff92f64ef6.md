# Hidratación (Hydration)

### ¿Qué es la hidratación?

La hidratación es el proceso que **restaura** una aplicación renderizada en el servidor (SSR) en el cliente (navegador).

Incluye:

- Reutilizar estructuras del DOM renderizadas por el servidor.
- Mantener el estado de la aplicación.
- Transferir datos obtenidos por el servidor.
- Otros procesos relacionados.

---

### **¿Por qué es importante la hidratación?**

La hidratación **mejora el rendimiento** porque evita reconstruir nodos del DOM innecesariamente.

Angular intenta emparejar elementos existentes con la estructura de la aplicación y **reutiliza los nodos** siempre que puede.

Esto:

- Reduce el **FID** (*First Input Delay*).
- Reduce el **LCP** (*Largest Contentful Paint*).
- Reduce el **CLS** (*Cumulative Layout Shift*).
- Mejora el **SEO**.

Sin hidratación, una app SSR destruirá y volverá a renderizar el DOM, provocando parpadeos y cambios de diseño visibles.

---

### **Cómo habilitar la hidratación en Angular**

Solo puede habilitarse en aplicaciones con **SSR**.

### Usando Angular CLI

Si activaste SSR con Angular CLI (al crear la app o usando `ng add @angular/ssr`), la hidratación ya está incluida.

### Configuración manual

Si tienes una configuración personalizada:

```tsx

import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});

```

Con NgModules:

```tsx

import { provideClientHydration } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideClientHydration()],
})
export class AppModule {}

```

> Importante: provideClientHydration() también debe incluirse en el arranque del servidor.
> 

---

### **Verificar que la hidratación está activa**

- Inicia la app y abre la consola del navegador.
- En modo desarrollo, Angular mostrará estadísticas de hidratación (número de componentes y nodos hidratados).
- Con **Angular DevTools** puedes:
    - Ver el estado de hidratación por componente.
    - Activar un overlay para marcar las zonas hidratadas.
    - Detectar errores de desajuste (*mismatch*).

---

### **Captura y reproducción de eventos**

En SSR, el HTML se muestra antes de que la app esté lista para interactuar.

Desde Angular v18, puedes activar la **reproducción de eventos**:

```tsx

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});

```

**Funcionamiento:**

1. Captura interacciones (clics, mouseover, focusin…) antes de que termine la hidratación.
2. Las guarda en memoria.
3. Las reproduce cuando finaliza la hidratación.

> Si usas hidratación incremental, el event replay se activa automáticamente.
> 

---

### **Restricciones**

La hidratación requiere:

- **Misma estructura DOM** en servidor y cliente.
- No modificar el HTML generado por el servidor antes de llegar al cliente.
- Evitar manipulación directa del DOM.

### Manipulación directa del DOM

- No usar APIs nativas como `document.querySelector`, `appendChild`, `innerHTML`, `outerHTML` para modificar nodos.
- Esto provoca errores de *DOM mismatch*.
- Solución:
    - Refactorizar para usar APIs de Angular.
    - Si no es posible, usar `ngSkipHydration`.

### HTML válido

Evita estructuras inválidas como:

- `<table>` sin `<tbody>`.
- `<div>` dentro de `<p>`.
- `<a>` dentro de `<a>`.

### Configuración de *whitespaces*

- Recomendado: `preserveWhitespaces = false` (por defecto).
- Si está en `true`, puede romper la hidratación.
- Debe coincidir en `tsconfig.server.json` y `tsconfig.app.json`.

### Zone.js personalizado o Noop

No soportado aún. La hidratación depende del evento `onStable` de Zone.js.

---

### **Errores comunes**

- *Node mismatch*: DOM diferente entre cliente y servidor.
- HTML inválido.
- `ngSkipHydration` en un nodo no permitido.

---

### **Saltar hidratación en componentes**

Si un componente no puede hidratarse:

```html

<app-example ngSkipHydration />

```

O en el decorador:

```tsx

@Component({
  host: { ngSkipHydration: 'true' },
})
class ExampleComponent {}

```

> Esto desactiva la hidratación para ese componente y sus hijos.
> 

---

### **Tiempos de hidratación y estabilidad**

La hidratación ocurre cuando la aplicación está **estable**.

Se puede retrasar por:

- `setTimeout`, `setInterval`.
- Promesas sin resolver.
- *Microtasks* pendientes.

Si tarda más de 10s, aparece el error *Application remains unstable*.

---

### **Internacionalización (I18N)**

Por defecto, Angular **omite** la hidratación en componentes con bloques i18n.

Para activarla:

```tsx

import { provideClientHydration, withI18nSupport } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withI18nSupport())]
});

```

---

### **Renderizado consistente en SSR y CSR**

Evita condicionales que cambien el contenido entre servidor y cliente, como:

```tsx

@if (isPlatformBrowser(...)) { ... }

```

Esto provoca cambios de diseño (*layout shifts*).

---

### **Librerías externas con manipulación de DOM**

- Ejemplo: D3.js.
- Pueden causar errores de hidratación.
- Solución temporal: `ngSkipHydration` en el componente que las usa.

---

### **Scripts externos con manipulación de DOM**

- Ejemplo: *trackers* de anuncios, analíticas.
- Pueden romper la hidratación.
- Solución: ejecutarlos después de la hidratación (ej. con `AfterNextRender`).

---

### **Hidratación incremental**

Permite un control granular de cuándo hidratar.

Ver la guía de *Incremental Hydration* para más detalles.

---