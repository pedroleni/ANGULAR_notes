# Uso de formularios

Las aplicaciones usan formularios para permitir que los usuarios inicien sesión, actualicen un perfil, introduzcan información sensible y realicen muchas otras tareas de entrada de datos.

Angular ofrece dos enfoques diferentes para manejar la entrada de datos de los usuarios a través de formularios: **reactivos** y **basados en plantillas**.

Ambos capturan los eventos de entrada del usuario desde la vista, validan los datos, crean un modelo de formulario y un modelo de datos a actualizar, y proporcionan una manera de rastrear los cambios.

Esta guía te ayudará a decidir qué tipo de formulario se adapta mejor a tu situación. Presenta los elementos básicos que usan ambos enfoques, resume las diferencias clave entre ellos y demuestra esas diferencias en el contexto de configuración, flujo de datos y pruebas.

---

### Elegir un enfoque

Los formularios reactivos y los basados en plantillas procesan y gestionan los datos de forma diferente, y cada uno tiene ventajas distintas.

| Tipo | Detalles |
| --- | --- |
| **Formularios reactivos** | Dan acceso directo y explícito al modelo de objeto subyacente del formulario. Son más robustos: escalables, reutilizables y fáciles de probar. Si los formularios son una parte clave de tu aplicación, o ya usas patrones reactivos, este es el enfoque recomendado. |
| **Formularios basados en plantillas** | Usan directivas en la plantilla para crear y manipular el modelo de objeto subyacente. Son útiles para formularios simples, como un registro de newsletter. Son fáciles de añadir, pero no escalan tan bien. Si tienes requisitos muy básicos y la lógica se puede manejar en la plantilla, este enfoque puede ser suficiente. |

---

### Diferencias clave

| Reactivos | Basados en plantillas |
| --- | --- |
| Configuración del modelo | Explícita, creada en la clase del componente |
| Modelo de datos | Estructurado e inmutable |
| Flujo de datos | Sincrónico |
| Validación | Funciones |

---

### Escalabilidad

Si los formularios son centrales en tu aplicación, la escalabilidad es crucial. Los **formularios reactivos** son más escalables porque:

- Proporcionan acceso directo a la API del formulario.
- Usan flujo de datos sincrónico entre la vista y el modelo.
- Requieren menos configuración para pruebas.
- No dependen profundamente del ciclo de detección de cambios.

Los **formularios basados en plantillas**:

- Son menos reutilizables.
- Usan flujo de datos asincrónico.
- Abstraen la API del formulario.
- Requieren más configuración para pruebas y dependen de detección de cambios manual.

---

### Configuración del modelo

Ambos enfoques rastrean los cambios de valor entre los elementos de entrada y el modelo de datos en el componente.

**Clases base compartidas:**

| Clase | Función |
| --- | --- |
| `FormControl` | Rastrea el valor y estado de validación de un control individual. |
| `FormGroup` | Rastrea valores y estado de un conjunto de controles. |
| `FormArray` | Rastrea valores y estado de un array de controles. |
| `ControlValueAccessor` | Crea un puente entre `FormControl` y elementos DOM. |

---

### Configuración en formularios reactivos

Definición directa en la clase del componente. El atributo `[formControl]` enlaza un `FormControl` con el elemento de la vista.

```tsx

import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-reactive-favorite-color',
  template: `
    Color favorito: <input type="text" [formControl]="favoriteColorControl">
  `,
  imports: [ReactiveFormsModule],
})
export class FavoriteColorReactiveComponent {
  favoriteColorControl = new FormControl('');
}

```

En este enfoque, **el modelo del formulario es la fuente de la verdad**.

---

### Configuración en formularios basados en plantillas

El modelo es implícito. `NgModel` crea y gestiona automáticamente un `FormControl`.

```tsx

import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-template-favorite-color',
  template: `
    Color favorito: <input type="text" [(ngModel)]="favoriteColor">
  `,
  imports: [FormsModule],
})
export class FavoriteColorTemplateComponent {
  favoriteColor = '';
}

```

Aquí, **la plantilla es la fuente de la verdad**.

---

### Flujo de datos

Angular debe mantener sincronizados la vista y el modelo.

La diferencia está en **cómo** se gestiona el flujo.

### Formularios reactivos

- Vista → Modelo: Sincrónico, el `ControlValueAccessor` pasa el valor inmediatamente al `FormControl`.
- Modelo → Vista: Cambiar el valor en el `FormControl` actualiza inmediatamente el elemento de entrada.

### Formularios basados en plantillas

- Vista → Modelo: `NgModel` escucha eventos, actualiza el `FormControl` y luego la propiedad del componente.
- Modelo → Vista: Al cambiar el valor en el componente, Angular usa detección de cambios asincrónica y una segunda pasada para evitar errores `ExpressionChangedAfterItHasBeenChecked`.

---

### Mutabilidad del modelo

| Reactivos | Basados en plantillas |
| --- | --- |
| Usan datos inmutables, generando un nuevo modelo en cada cambio. Esto facilita rastrear cambios únicos y optimiza detección de cambios. | Usan mutabilidad con binding bidireccional, lo que hace menos eficiente la detección de cambios. |

---

### Validación

| Reactivos | Basados en plantillas |
| --- | --- |
| Validadores como funciones. | Validadores como directivas. |

---

### Pruebas

**Formularios reactivos**: Más fáciles de probar porque son sincrónicos y no requieren renderizar la UI para validar.

Ejemplo de prueba vista → modelo:

```tsx

it('debería actualizar el valor del input', () => {
  const input = fixture.nativeElement.querySelector('input');
  const event = createNewEvent('input');
  input.value = 'Rojo';
  input.dispatchEvent(event);
  expect(fixture.componentInstance.favoriteColorControl.value).toEqual('Rojo');
});

```

Ejemplo modelo → vista:

```tsx

it('debería actualizar el valor en el control', () => {
  component.favoriteColorControl.setValue('Azul');
  const input = fixture.nativeElement.querySelector('input');
  expect(input.value).toBe('Azul');
});

```

**Formularios basados en plantillas**: Más complejos de probar, dependen de detección de cambios y `fakeAsync`.

Ejemplo vista → modelo:

```tsx

it('debería actualizar el color favorito en el componente', fakeAsync(() => {
  const input = fixture.nativeElement.querySelector('input');
  const event = createNewEvent('input');
  input.value = 'Rojo';
  input.dispatchEvent(event);
  fixture.detectChanges();
  expect(component.favoriteColor).toEqual('Rojo');
}));

```

Ejemplo modelo → vista:

```tsx

it('debería actualizar el color favorito en el input', fakeAsync(() => {
  component.favoriteColor = 'Azul';
  fixture.detectChanges();
  tick();
  const input = fixture.nativeElement.querySelector('input');
  expect(input.value).toBe('Azul');
}));

```

---