# Renderizado programático de componentes

Además de usar un componente directamente en una plantilla, también puedes renderizarlo dinámicamente de forma programática.

Esto es útil en situaciones en las que un componente **es desconocido inicialmente** (por lo que no puede referenciarse directamente en la plantilla) y depende de ciertas condiciones.

Existen **dos formas principales** de renderizar un componente de manera programática:

1. En una plantilla, usando **`NgComponentOutlet`**.
2. En tu código TypeScript, usando **`ViewContainerRef`**.

💡 **Útil:** Para casos de uso de *lazy-loading* (por ejemplo, si quieres retrasar la carga de un componente pesado), considera usar la característica integrada **`@defer`**.

Esta permite que el código de cualquier componente, directiva o *pipe* dentro del bloque `@defer` se extraiga automáticamente en *chunks* de JavaScript separados y se cargue solo cuando sea necesario, según los disparadores configurados.

---

### **En esta página**

- Usar `NgComponentOutlet`
- Usar `ViewContainerRef`
- Carga diferida (*lazy-loading*) de componentes

---

## **Usar NgComponentOutlet**

`NgComponentOutlet` es una directiva estructural que renderiza dinámicamente un componente en una plantilla.

```tsx

@Component({ ... })
export class AdminBio { /* ... */ }

@Component({ ... })
export class StandardBio { /* ... */ }

@Component({
  ...,
  template: `
    <p>Perfil de {{user.name}}</p>
    <ng-container *ngComponentOutlet="getBioComponent()" /> `
})
export class CustomDialog {
  user = input.required<User>();

  getBioComponent() {
    return this.user().isAdmin ? AdminBio : StandardBio;
  }
}

```

ℹ️ Consulta la **referencia de la API de NgComponentOutlet** para más información sobre las capacidades de esta directiva.

---

## **Usar ViewContainerRef**

Un *view container* es un nodo en el árbol de componentes de Angular que puede contener contenido.

Cualquier componente o directiva puede **inyectar** `ViewContainerRef` para obtener una referencia al *view container* correspondiente a su ubicación en el DOM.

Puedes usar el método **`createComponent`** en `ViewContainerRef` para crear y renderizar un componente de forma dinámica.

Cuando creas un componente con `ViewContainerRef`, Angular lo añade al DOM como **hermano siguiente** del componente o directiva que inyectó el `ViewContainerRef`.

```tsx

@Component({
  selector: 'leaf-content',
  template: `
    Esto es el contenido leaf
  `,
})
export class LeafContent {}

@Component({
  selector: 'outer-container',
  template: `
    <p>Inicio del contenedor exterior</p>
    <inner-item />
    <p>Fin del contenedor exterior</p>
  `,
})
export class OuterContainer {}

@Component({
  selector: 'inner-item',
  template: `
    <button (click)="loadContent()">Cargar contenido</button>
  `,
})
export class InnerItem {
  private viewContainer = inject(ViewContainerRef);

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}

```

En el ejemplo anterior, al hacer clic en el botón **"Cargar contenido"**, el DOM queda así:

```html

<outer-container>
  <p>Inicio del contenedor exterior</p>
  <inner-item>
    <button>Cargar contenido</button>
  </inner-item>
  <leaf-content>Esto es el contenido leaf</leaf-content>
  <p>Fin del contenedor exterior</p>
</outer-container>

```

---

## **Carga diferida de componentes**

💡 **Útil:** Si quieres hacer *lazy-loading* de componentes, considera usar la característica integrada `@defer`.

Si tu caso de uso no está cubierto por `@defer`, puedes usar tanto `NgComponentOutlet` como `ViewContainerRef` junto con una **importación dinámica de JavaScript** estándar.

```tsx

@Component({
  ...,
  template: `
    <section>
      <h2>Configuración básica</h2>
      <basic-settings />
    </section>

    <section>
      <h2>Configuración avanzada</h2>
      <button (click)="loadAdvanced()" *ngIf="!advancedSettings">
        Cargar configuración avanzada
      </button>
      <ng-container *ngComponentOutlet="advancedSettings" />
    </section>
  `
})
export class AdminSettings {
  advancedSettings: { new(): AdvancedSettings } | undefined;

  async loadAdvanced() {
    const { AdvancedSettings } = await import('path/to/advanced_settings.js');
    this.advancedSettings = AdvancedSettings;
  }
}

```

En este ejemplo, el componente **AdvancedSettings** se carga y se muestra **solo después** de que el usuario haga clic en el botón.

Aquí tienes la **tabla comparativa** entre **`NgComponentOutlet`** y **`ViewContainerRef`** para Angular v20:

| Característica | **NgComponentOutlet** | **ViewContainerRef** |
| --- | --- | --- |
| **Qué es** | Directiva estructural para renderizar dinámicamente un componente en la plantilla. | API de bajo nivel para crear y manejar componentes directamente desde TypeScript. |
| **Dónde se usa** | En el **HTML de la plantilla** con `*ngComponentOutlet`. | En el **código TypeScript** de un componente o directiva. |
| **Complejidad** | Baja. Sencillo de usar si ya conoces la plantilla. | Media/Alta. Requiere manejo programático de la creación e inserción de componentes. |
| **Casos de uso típicos** | - Renderizar un componente dinámico basado en condiciones.- Cambiar el componente según un estado.- Fácil integración con `@defer`. | - Añadir componentes en posiciones específicas del DOM en tiempo de ejecución.- Construcción de interfaces dinámicas complejas.- Integración con APIs externas que insertan contenido. |
| **Ejemplo básico** | `<ng-container *ngComponentOutlet="DynamicComponent"></ng-container>` | `this.viewContainer.createComponent(DynamicComponent);` |
| **Flexibilidad de ubicación** | Limitado al lugar donde pongas el `<ng-container>` en la plantilla. | Puedes insertar el componente donde tengas acceso a un `ViewContainerRef`. |
| **Control sobre el ciclo de vida** | Menor control, Angular lo gestiona automáticamente. | Control total: puedes destruir, recrear o cambiar el componente en cualquier momento. |
| **Integración con lazy-loading** | Muy fácil con `@defer` o importaciones dinámicas. | También posible, pero requiere más código. |
| **Estilo y encapsulación** | Mantiene la encapsulación de estilos del componente. | Mantiene la encapsulación de estilos del componente. |
| **Curva de aprendizaje** | Baja. Ideal para la mayoría de casos simples. | Más empinada. Ideal para casos complejos y avanzados. |

---

💡 **Resumen rápido**

- Usa **`NgComponentOutlet`** → si solo necesitas cambiar qué componente se muestra en un punto fijo de la plantilla.
- Usa **`ViewContainerRef`** → si necesitas **insertar, quitar o manipular componentes de forma programática** en ubicaciones más dinámicas o complejas.

---

Si quieres, puedo también prepararte **un diagrama visual** del flujo de creación de un componente con cada método para que lo tengas más claro.

¿Quieres que te lo haga?