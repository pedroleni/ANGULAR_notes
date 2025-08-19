# Configuración avanzada de componentes

💡 **TIP:** Esta guía asume que ya has leído la **Guía de conceptos esenciales**. Léela primero si eres nuevo en Angular.

---

### **ChangeDetectionStrategy**

El decorador `@Component` acepta la opción `changeDetection`, que controla el modo de detección de cambios del componente.

Existen dos opciones de modo de detección de cambios:

- **`ChangeDetectionStrategy.Default`**
    
    Es, como su nombre indica, la estrategia por defecto.
    
    En este modo, Angular comprueba si el DOM del componente necesita actualizarse **cada vez que ocurre alguna actividad en toda la aplicación**.
    
    Actividades que disparan esta comprobación incluyen:
    
    - Interacción del usuario
    - Respuestas de red
    - Temporizadores (`setTimeout`, `setInterval`, etc.)
    - Y otros eventos que puedan afectar el estado.
- **`ChangeDetectionStrategy.OnPush`**
    
    Es un modo opcional que reduce la cantidad de comprobaciones que Angular necesita realizar.
    
    En este modo, el framework solo verifica si el DOM del componente necesita una actualización cuando:
    
    1. Una **propiedad de entrada (`@Input`) cambia** como resultado de un enlace (`binding`) en una plantilla.
    2. Se ejecuta un **manejador de eventos** en este componente.
    3. El componente es **marcado explícitamente para comprobación**, mediante `ChangeDetectorRef.markForCheck()` o algo que lo envuelva, como `AsyncPipe`.
    
    Además, cuando un componente con `OnPush` es verificado, Angular también revisa **todos sus componentes ancestros**, subiendo por el árbol de la aplicación.
    

---

### **PreserveWhitespaces**

Por defecto, Angular **elimina y colapsa los espacios en blanco innecesarios** en las plantillas, principalmente los que provienen de saltos de línea e indentaciones.

Puedes cambiar este comportamiento configurando explícitamente `preserveWhitespaces: true` en los metadatos del componente.

```tsx

@Component({
  ...,
  preserveWhitespaces: true
})
export class MiComponente { }

```

---

### **Custom element schemas**

Por defecto, Angular lanza un error cuando encuentra un elemento HTML desconocido.

Puedes desactivar este comportamiento para un componente incluyendo `CUSTOM_ELEMENTS_SCHEMA` en la propiedad `schemas` de sus metadatos:

```tsx

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component></some-unknown-component>'
})
export class ComponentWithCustomElements { }

```

⚠️ En este momento, Angular **no admite ningún otro esquema** aparte de este.

---

# Tabla comparativa: ChangeDetectionStrategy

| Aspecto | **Default** | **OnPush** |
| --- | --- | --- |
| ¿Cuándo se comprueba? | Ante *cualquier* actividad app-wide (eventos, HTTP, timers…). | Solo si: (1) cambia un `@Input` por **referencia**, (2) se ejecuta un **evento** en el propio componente, o (3) se llama a `markForCheck()` (o algo que lo envuelva, p. ej. `AsyncPipe`). |
| Mutaciones “in place” | **Sí** se ven (porque se reevaluan bindings en cada ciclo). | **No** se ven si la **referencia no cambia**. Necesitas nueva referencia o marcar. |
| Rendimiento | Más trabajo de verificación. | Menos trabajo; ideal para UIs grandes. |
| `async` pipe / Signals | Re-renderizan al emitir/actualizar (internamente marcan para check). | Ídem: `AsyncPipe` marca, y los `signals` también “pulsan” el check. |
| Cambio profundo de objetos | Detecta porque vuelve a evaluar plantillas. | No si no cambias referencia del `@Input`. |
| Integración con eventos | Cualquier `(click)` del hijo dispara CD. | También, los eventos del **propio** componente disparan CD local. |
| Forzar chequeo | `detectChanges()`/`markForCheck()` (raro en Default). | **Común**: `markForCheck()` cuando hay trabajo fuera de Angular o mutaciones “in place”. |
| Cuándo usar | Apps pequeñas/medianas o cuando prima la sencillez. | Apps grandes, listas densas, alta frecuencia de cambios. |

---

# Ejemplo visual (mínimo y directo)

**Objetivo:** mostrar cómo una **mutación “in place”** no refresca un hijo `OnPush`, pero sí uno `Default`.

```tsx

import { Component, ChangeDetectionStrategy, input } from '@angular/core';

// ===== HIJO Default =====
@Component({
  selector: 'child-default',
  template: `Default → clicks: {{ data.clicks }}`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChildDefault {
  data = input<{ clicks: number }>();
}

// ===== HIJO OnPush =====
@Component({
  selector: 'child-onpush',
  template: `OnPush → clicks: {{ data.clicks }}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildOnPush {
  data = input<{ clicks: number }>();
}

// ===== PADRE =====
@Component({
  selector: 'demo-cd',
  template: `
    <button (click)="mutarInPlace()">Mutar in place (misma ref)</button>
    <button (click)="nuevaReferencia()">Nueva referencia</button>

    <div class="box">
      <child-default [data]="data"></child-default>
    </div>
    <div class="box">
      <child-onpush [data]="data"></child-onpush>
    </div>
  `,
  styles: [`.box{margin:.5rem 0}`]
})
export class DemoChangeDetection {
  // OJO: objeto plano, NO signal (para demostrar mutación sin cambiar ref)
  data = { clicks: 0 };

  mutarInPlace() {
    // MISMA referencia
    this.data.clicks++;           // <- Default lo refleja, OnPush NO
  }

  nuevaReferencia() {
    // NUEVA referencia
    this.data = { ...this.data, clicks: this.data.clicks + 1 };
    // <- Ahora también refresca el hijo OnPush
  }
}

```

## Qué verás al pulsar botones

- **Mutar in place**
    - `ChildDefault`: actualiza `clicks` ✅
    - `ChildOnPush`: **no** actualiza ❌ (no cambió la referencia del `@Input`)
- **Nueva referencia**
    - Ambos hijos actualizan ✅✅

---

# Patrones rápidos (y antipatrones)

- ✅ **OnPush + inmutabilidad**: cambia referencias (`{...obj}`) o usa `signals` con `update()` que creen objetos nuevos.
- ✅ Usa `AsyncPipe` para streams: marca el componente automáticamente.
- ✅ Si integras APIs fuera de Angular (o websockets manuales), llama a `markForCheck()` en el componente afectado.
- ❌ Evitar mutar objetos “in place” con `OnPush` si esperas refrescos automáticos.
- ❌ Llamar a `detectChanges()` de forma impulsiva: úsalo solo cuando *de verdad* lo necesitas.