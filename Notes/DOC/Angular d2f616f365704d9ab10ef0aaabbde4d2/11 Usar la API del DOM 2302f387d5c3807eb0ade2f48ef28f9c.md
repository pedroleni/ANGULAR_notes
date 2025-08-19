# 11. Usar la API del DOM

Angular gestiona por ti la mayoría de la creación, actualización y eliminación de elementos del DOM.

Sin embargo, en casos poco frecuentes, puede que necesites interactuar directamente con el DOM de un componente.

Los componentes pueden **inyectar** `ElementRef` para obtener una referencia al elemento host del componente:

```tsx

@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}

```

La propiedad `nativeElement` hace referencia a la instancia **Element** del host.

---

## **Callbacks después de renderizado**

Puedes usar las funciones `afterEveryRender` y `afterNextRender` para registrar un *callback* que se ejecuta cuando Angular ha terminado de renderizar la página.

```tsx

@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Focalizar el primer input de este componente.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}

```

- `afterEveryRender` y `afterNextRender` **deben** llamarse en un **contexto de inyección**, normalmente en el constructor de un componente.
- Evita la manipulación directa del DOM siempre que sea posible.
    
    **Prefiere** definir la estructura del DOM en las plantillas de los componentes y actualizarlas mediante *bindings*.
    
- Estos *callbacks* **no** se ejecutan durante el **renderizado en servidor (SSR)** ni en el **pre-renderizado en tiempo de compilación**.
- **Nunca** manipules el DOM directamente dentro de otros *lifecycle hooks* de Angular.
    
    Angular **no garantiza** que el DOM de un componente esté completamente renderizado en ningún punto salvo en estos *render callbacks*.
    
    Además, leer o modificar el DOM en otros hooks puede impactar negativamente el rendimiento provocando *layout thrashing*.
    

---

## **Usar el renderer de un componente**

Los componentes pueden inyectar una instancia de `Renderer2` para realizar ciertas manipulaciones del DOM que están ligadas a otras características de Angular.

- Cualquier elemento del DOM creado por `Renderer2` **participa en la encapsulación de estilos** del componente.
- Algunas APIs de `Renderer2` están integradas con el **sistema de animaciones** de Angular:
    - `setProperty` → actualiza propiedades de animación sintética.
    - `listen` → añade listeners para eventos de animación sintética.
        
        Consulta la guía de **Animaciones** para más detalles.
        
- Fuera de estos casos específicos, **no hay diferencias** entre usar `Renderer2` y las APIs nativas del DOM.
- Las APIs de `Renderer2` **no** permiten manipular el DOM en contextos de SSR o pre-renderizado en compilación.

---

## **Cuándo usar APIs del DOM**

Aunque Angular gestiona la mayor parte del renderizado, algunos comportamientos pueden requerir APIs del DOM.

Casos de uso comunes:

- Gestionar el foco de un elemento.
- Medir la geometría de un elemento (por ejemplo, con `getBoundingClientRect`).
- Leer el contenido de texto de un elemento.
- Configurar observadores nativos como:
    - `MutationObserver`
    - `ResizeObserver`
    - `IntersectionObserver`

---

⚠ **Evita** insertar, eliminar o modificar elementos del DOM directamente.

En particular, **nunca** establezcas la propiedad `innerHTML` de un elemento directamente, ya que esto puede hacer tu aplicación vulnerable a ataques de **Cross-Site Scripting (XSS)**.

Los *bindings* de plantilla de Angular, incluyendo los de `innerHTML`, incorporan protecciones para ayudar a prevenir ataques XSS.

Consulta la guía de **Seguridad** para más información.

## **Manipulación del DOM en Angular: Guía rápida**

| **Situación** | **Ejemplo seguro (Angular)** | **Ejemplo no seguro (DOM directo)** | **Notas** |
| --- | --- | --- | --- |
| **Actualizar texto** | `html<br><p>{{ mensaje }}</p>ts<br>mensaje = 'Hola';` | `ts<br>elementRef.nativeElement.innerText = 'Hola';` | Usa *data binding* para que Angular gestione las actualizaciones. |
| **Actualizar HTML** | `html<br><div [innerHTML]="contenidoSeguro"></div>` | `ts<br>elementRef.nativeElement.innerHTML = contenido;` | El binding de `innerHTML` aplica sanitización contra XSS. |
| **Cambiar clases CSS** | `html<br><div [class.activo]="isActive"></div>` | `ts<br>element.classList.add('activo');` | Angular actualiza las clases sin riesgo de desincronización. |
| **Cambiar estilos** | `html<br><div [style.color]="color"></div>` | `ts<br>element.style.color = 'red';` | Usa bindings de estilo para aprovechar la detección de cambios. |
| **Enfocar un input tras renderizado** | `ts<br>afterNextRender(() => inputRef.nativeElement.focus());` | `ts<br>inputRef.nativeElement.focus();` en `ngOnInit` | Solo `afterNextRender` garantiza que el DOM esté listo. |
| **Medir tamaño** | `ts<br>afterEveryRender(() => console.log(el.nativeElement.getBoundingClientRect()));` | Leer medidas en `ngAfterViewInit` justo después de modificar el DOM | Usar `afterEveryRender` evita *layout thrashing*. |
| **Eventos** | `html<br><button (click)="accion()"></button>` | `ts<br>element.addEventListener('click', fn);` | Angular gestiona eventos y limpieza automáticamente. |

---

En Angular, si usas **binding** para poner HTML en un elemento, por ejemplo:

```html

<div [innerHTML]="contenido"></div>

```

Angular **no mete ese HTML “a pelo” en el DOM** como harías con:

```tsx

element.innerHTML = contenido; // ❌ inseguro

```

En vez de eso, **pasa el contenido por un proceso de sanitización** que limpia o elimina cualquier código potencialmente peligroso (JavaScript embebido, etiquetas `<script>`, eventos tipo `onclick=...`, URLs maliciosas, etc.).

---

### **¿Por qué?**

Para protegerte de ataques **XSS (Cross-Site Scripting)**, que son inyecciones de código malicioso dentro de una página para robar datos, secuestrar sesiones o manipular la interfaz.

---

### **Ejemplo de protección**

Si en tu variable pones algo así:

```tsx

contenido = '<img src=x onerror="alert(\'hackeado\')">';

```

- **Si usas DOM directo**:

```tsx

element.innerHTML = contenido; // el alert se ejecuta (❌ inseguro)

```

- **Si usas Angular binding**:

```html

<div [innerHTML]="contenido"></div>

```

Angular eliminará el `onerror="..."` y no ejecutará nada.

---

### **Si quieres desactivar la sanitización**

En casos muy específicos (por ejemplo, cuando muestras HTML seguro generado por ti) puedes usar `DomSanitizer` para marcarlo como seguro:

```tsx

import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

contenido = this.sanitizer.bypassSecurityTrustHtml('<b>Texto seguro</b>');

```

⚠ Pero **esto debe hacerse con muchísimo cuidado**, porque desactivas la protección contra XSS.

## **Cuándo usar cada enfoque**

- **Plantillas y bindings** → Para todo lo que sea mostrar datos, cambiar estilos, clases y contenido.
- **ElementRef** → Para acceder a propiedades específicas que no tienen binding, medir elementos o acceder a APIs nativas (con cuidado).
- **Renderer2** → Para casos en los que quieras mantener la integración con encapsulación de estilos y animaciones de Angular.
- **afterEveryRender / afterNextRender** → Para asegurar que el DOM está totalmente listo antes de manipularlo o leerlo.

---

## **Regla de oro**

> Si algo se puede hacer con plantillas y bindings, hazlo así.
Usa ElementRef o Renderer2 solo cuando no haya alternativa.
>