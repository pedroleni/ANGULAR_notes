# Formularios Reactivos

## **Los formularios reactivos**

Los formularios reactivos proporcionan un enfoque **basado en modelo** para manejar entradas de formulario cuyos valores cambian con el tiempo.

Esta guía muestra cómo crear y actualizar un control de formulario básico, avanzar hacia el uso de múltiples controles en grupo, validar valores de formulario y crear formularios dinámicos donde puedas agregar o eliminar controles en tiempo de ejecución.

## **Visión general de los formularios reactivos**

Los formularios reactivos usan un enfoque **explícito e inmutable** para gestionar el estado de un formulario en un momento dado.

Cada cambio en el estado del formulario devuelve un nuevo estado, manteniendo la integridad del modelo entre cambios.

Están construidos sobre flujos observables, donde las entradas y valores del formulario se proporcionan como **streams** que pueden ser accedidos de forma síncrona.

También ofrecen un camino claro para las pruebas, ya que los datos son consistentes y predecibles cuando se solicitan, y cualquier consumidor de esos flujos puede manipularlos de forma segura.

**Principales diferencias con formularios basados en plantilla**:

- Los formularios reactivos ofrecen acceso síncrono al modelo de datos, inmutabilidad con operadores observables y seguimiento de cambios a través de streams.
- Los formularios basados en plantilla permiten modificar directamente el dato en la plantilla, pero son menos explícitos y dependen de directivas incrustadas y datos mutables para rastrear cambios de forma asíncrona.
    
    Consulta la **visión general de formularios** para comparaciones detalladas.
    

---

## **Añadir un control de formulario básico**

Hay 3 pasos para usar controles de formulario:

1. **Generar un nuevo componente** e importar `ReactiveFormsModule` (que declara las directivas necesarias para usar formularios reactivos).
2. **Instanciar un nuevo `FormControl`**.
3. **Registrar el `FormControl`** en la plantilla.

Después, se muestra el formulario añadiendo el componente en la plantilla.

---

### **Generar un nuevo componente e importar `ReactiveFormsModule`**

Con el CLI:

```bash

ng generate component name-editor

```

En tu componente, importa `ReactiveFormsModule` desde `@angular/forms` y añádelo en `imports`:

```tsx

import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-name-editor',
  templateUrl: './name-editor.component.html',
  styleUrls: ['./name-editor.component.css'],
  imports: [ReactiveFormsModule],
})
export class NameEditorComponent { }

```

---

### **Declarar una instancia de `FormControl`**

Se establece un valor inicial (en este caso, cadena vacía):

```tsx

name = new FormControl('');

```

Esto permite escuchar, actualizar y validar el estado del input desde la clase del componente.

---

### **Registrar el control en la plantilla**

Enlazar el control al elemento de formulario usando la directiva `formControl`:

```html

<label for="name">Nombre: </label>
<input id="name" type="text" [formControl]="name">

```

Ahora el control y el elemento HTML están sincronizados:

- La vista refleja los cambios del modelo
- El modelo refleja los cambios de la vista

---

### **Mostrar el componente**

Añadir en cualquier plantilla:

```html

<app-name-editor />

```

---

## **Mostrar el valor de un control de formulario**

Dos formas de obtener el valor:

1. Usar `valueChanges` y escuchar cambios (`AsyncPipe` o `subscribe()`).
2. Usar la propiedad `value` para una instantánea del valor actual.

Ejemplo en plantilla:

```html

<p>Valor: {{ name.value }}</p>

```

El valor se actualiza en tiempo real.

---

## **Reemplazar el valor de un control de formulario**

Puedes cambiar el valor desde el código con `setValue()`:

```tsx

updateName() {
  this.name.setValue('Nancy');
}

```

Botón en plantilla:

```html

<button type="button" (click)="updateName()">Actualizar nombre</button>

```

Cuando se hace clic, el valor del input se reemplaza completamente en el modelo.

💡 **Nota:**

En un `FormGroup` o `FormArray` el valor pasado a `setValue()` debe coincidir con la estructura de dicho grupo o array.

---

## **Agrupando controles de formulario**

Normalmente, los formularios contienen varios controles relacionados.

Los formularios reactivos ofrecen dos maneras de agrupar varios controles relacionados dentro de un único formulario:

| Tipo | Detalles |
| --- | --- |
| **FormGroup** | Define un formulario con un conjunto fijo de controles que puedes gestionar juntos. Puedes anidar `FormGroup` para crear formularios más complejos. |
| **FormArray** | Define un formulario dinámico, donde puedes añadir y eliminar controles en tiempo de ejecución. También puedes anidar `FormArray` para casos más complejos. Para este caso, consulta *Creación de formularios dinámicos*. |

Así como una instancia de `FormControl` gestiona un solo campo de entrada, una instancia de `FormGroup` controla el estado de un grupo de controles. Cada control se rastrea por nombre al crear el grupo.

Ejemplo: gestión de varios controles en un solo grupo.

---

### **Generar el componente y preparar las importaciones**

```bash

ng generate component ProfileEditor

```

```tsx

import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css'],
  imports: [ReactiveFormsModule],
})
export class ProfileEditorComponent { }

```

---

### **1. Crear una instancia de FormGroup**

Añadir una propiedad `profileForm` inicializada con un objeto cuyas claves sean los nombres de los controles:

```tsx
import {Component} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css'],
  imports: [ReactiveFormsModule],
})
export class ProfileEditorComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
...
  });
...
}
```

- El valor del `FormGroup` es un objeto con los valores de cada control.
- Tiene las mismas propiedades (`value`, `untouched`) y métodos (`setValue()`) que `FormControl`.

---

### **2. Asociar el FormGroup con la vista**

En la plantilla, usar la directiva `formGroup` en el `<form>` y `formControlName` en cada input:

```html

<form [formGroup]="profileForm">
  <label for="first-name">Nombre:</label>
  <input id="first-name" type="text" formControlName="firstName" />

  <label for="last-name">Apellido:</label>
  <input id="last-name" type="text" formControlName="lastName" />
</form>

```

Esto crea el vínculo bidireccional entre el modelo (`FormGroup`) y la vista.

---

### **3. Guardar datos del formulario**

Para capturar el valor y procesarlo fuera del componente:

```html

<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
  <!-- campos -->
  <button type="submit">Enviar</button>
</form>

```

En el componente:

```tsx

onSubmit() {
  console.warn(this.profileForm.value);
}

```

Puedes añadir `[disabled]="!profileForm.valid"` para desactivar el botón si el formulario no es válido.

```html
 <p>Complete the form to enable button.</p>
 <button type="submit" [disabled]="!profileForm.valid">Submit</button>
```

---

## **Creando grupos de formulario anidados**

Un `FormGroup` puede contener:

- Controles individuales (`FormControl`)
- Otros `FormGroup`

Esto permite estructurar formularios complejos en secciones lógicas.

---

### **Ejemplo: grupo anidado `address`**

```tsx

import {Component} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css'],
  imports: [ReactiveFormsModule],
})
export class ProfileEditorComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
    }),
  });
...
}

```

- `address` es un `FormGroup` hijo.
- Cambios en `address` se propagan al grupo padre `profileForm`.

---

### **Asociar el grupo anidado en la plantilla**

```html

<div formGroupName="address">
  <h2>Dirección</h2>
  <label for="street">Calle:</label>
  <input id="street" type="text" formControlName="street" />

  <label for="city">Ciudad:</label>
  <input id="city" type="text" formControlName="city" />

  <label for="state">Provincia/Estado:</label>
  <input id="state" type="text" formControlName="state" />

  <label for="zip">Código Postal:</label>
  <input id="zip" type="text" formControlName="zip" />
</div>

```

---

📌 **Mostrar el valor del formulario**

Puedes usar:

```html

<pre>{{ profileForm.value | json }}</pre>

```

Esto te muestra el objeto completo en formato JSON en tiempo real.

---

## **Actualizando partes del modelo de datos**

Cuando actualizas el valor de una instancia de `FormGroup` que contiene múltiples controles, es posible que solo quieras cambiar partes concretas del modelo.

Existen **dos formas** de actualizar el valor del modelo:

| Método | Detalles |
| --- | --- |
| **setValue()** | Establece un nuevo valor para un control individual. `setValue()` respeta estrictamente la estructura del `FormGroup` y reemplaza el valor completo del control. |
| **patchValue()** | Sustituye únicamente las propiedades definidas en el objeto que han cambiado dentro del modelo del formulario. |

📌 **Diferencia clave:**

- `setValue()` lanza errores si la estructura no coincide con el formulario (útil para detectar fallos en formularios complejos).
- `patchValue()` ignora silenciosamente propiedades no existentes en el modelo.

---

### **Ejemplo en `ProfileEditorComponent`**

Actualizar solo el nombre y la calle del usuario:

```tsx

updateProfile() {
  this.profileForm.patchValue({
    firstName: 'Nancy',
    address: {
      street: '123 Drew Street',
    },
  });
}

```

📌 Observa que `street` está dentro de `address` como un objeto, porque `patchValue()` aplica los cambios respetando la estructura del modelo.

---

### **Botón para simular la actualización**

```html

<button type="button" (click)="updateProfile()">Actualizar perfil</button>

```

Cuando el usuario hace clic, `profileForm` se actualiza con los nuevos valores de `firstName` y `street`.

---

## **Usando el servicio FormBuilder para generar controles**

Crear instancias de controles manualmente puede volverse repetitivo en formularios grandes.

El servicio **`FormBuilder`** ofrece métodos prácticos para generarlos.

---

### **Pasos para usar FormBuilder**

**Importar la clase `FormBuilder`**

```tsx

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

```

**Inyectar el servicio `FormBuilder`**

```tsx

private formBuilder = inject(FormBuilder);

```

**Generar controles de formulario**

El servicio `FormBuilder` tiene tres métodos principales:

- `control()` → crea `FormControl`
- `group()` → crea `FormGroup`
- `array()` → crea `FormArray`

---

### **Ejemplo usando `FormBuilder`**

```tsx
 profileForm = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    address: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
    }),
...
  });

```

📌 Cada control se define como un array donde:

- Primer elemento → valor inicial.
- Segundo elemento (opcional) → validadores síncronos.
- Tercer elemento (opcional) → validadores asíncronos.

---

### **Comparación con creación manual**

Usando `FormBuilder`:

```tsx

profileForm = this.formBuilder.group({
  firstName: [''],
  lastName: [''],
  address: this.formBuilder.group({
    street: [''],
    city: [''],
    state: [''],
    zip: [''],
  }),
});

```

Creación manual:

```tsx

profileForm = new FormGroup({
  firstName: new FormControl(''),
  lastName: new FormControl(''),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
  }),
});

```

---

## **Validar entradas del formulario**

La **validación de formularios** se usa para asegurar que la entrada del usuario esté completa y sea correcta.

Esta sección cubre cómo añadir un único validador a un control de formulario y mostrar el estado general del formulario.

(La validación se explica más a fondo en la guía **Form Validation**).

---

### **Pasos para añadir validación**

1. **Importar una función de validación** en tu componente de formulario.
2. **Añadir el validador** al campo en el formulario.
3. **Agregar lógica** para manejar el estado de validación.

---

### **Importar una función de validación**

Angular incluye un conjunto de funciones validadoras para casos comunes.

Estas funciones reciben un control para validar y devuelven:

- Un **objeto de error** si no pasa la validación.
- `null` si pasa la validación.

Ejemplo: importar la clase `Validators` desde `@angular/forms`:

```tsx

import { Validators } from '@angular/forms';

```

---

### **Hacer un campo obligatorio**

En `ProfileEditor`, añade `Validators.required` como segundo elemento en el array de configuración del control `firstName`:

```tsx

private formBuilder = inject(FormBuilder);
profileForm = this.formBuilder.group({
  firstName: ['', Validators.required],
  lastName: [''],
  address: this.formBuilder.group({
    street: [''],
    city: [''],
    state: [''],
    zip: [''],
  }),
});

```

---

### **Mostrar el estado del formulario**

Al añadir un campo obligatorio, su estado inicial es `invalid`.

Esto se propaga al `FormGroup` padre, haciendo que todo el formulario sea inválido.

Podemos acceder al estado actual con la propiedad `status`:

```html

<p>Estado del formulario: {{ profileForm.status }}</p>

```

El botón de **Submit** estará deshabilitado mientras el formulario sea inválido.

En cuanto el usuario rellene `firstName`, el formulario será válido y el botón se habilitará.

---

## **Crear formularios dinámicos**

`FormArray` es una alternativa a `FormGroup` para manejar un número variable de controles **sin nombre**.

Permite añadir y eliminar controles dinámicamente, y su valor/estado de validación se calcula a partir de sus controles hijos.

Es ideal cuando no conoces de antemano cuántos valores habrá.

---

### **Pasos para definir un formulario dinámico**

1. Importar la clase `FormArray`.
2. Definir un control `FormArray`.
3. Acceder al `FormArray` con un getter.
4. Mostrar el `FormArray` en la plantilla.

---

### **Importar `FormArray`**

```tsx

import { FormArray } from '@angular/forms';

```

---

### **Definir un `FormArray`**

Añade la propiedad `aliases` al `FormGroup` `profileForm`:

```tsx

private formBuilder = inject(FormBuilder);
profileForm = this.formBuilder.group({
  firstName: ['', Validators.required],
  lastName: [''],
  address: this.formBuilder.group({
    street: [''],
    city: [''],
    state: [''],
    zip: [''],
  }),
  aliases: this.formBuilder.array([this.formBuilder.control('')]),
});

```

Inicialmente contiene un único control, pero se pueden añadir más.

---

### **Getter para acceder al FormArray**

```tsx

get aliases() {
  return this.profileForm.get('aliases') as FormArray;
}

```

---

### **Método para añadir un alias**

```tsx

addAlias() {
  this.aliases.push(this.formBuilder.control(''));
}

```

---

### **Mostrar el FormArray en la plantilla**

```html
<div formArrayName="aliases">
  <h2>Alias</h2>
  <button type="button" (click)="addAlias()">+ Añadir otro alias</button>
  @for (alias of aliases.controls; track $index; let i = $index) {
    <div>
      <label for="alias-{{ i }}">Alias:</label>
      <input id="alias-{{ i }}" type="text" [formControlName]="i" />
    </div>
  }
</div>

```

📌 La directiva `formArrayName` vincula el `FormArray` del modelo con la plantilla.

Cada control se indexa con `i` y se asigna a `formControlName`.

---

## **Resumen de la API de Formularios Reactivos**

### **Clases**

| Clase | Descripción |
| --- | --- |
| **AbstractControl** | Clase base abstracta para `FormControl`, `FormGroup` y `FormArray`. Proporciona propiedades y comportamientos comunes. |
| **FormControl** | Maneja el valor y la validez de un control individual (`<input>`, `<select>`, etc.). |
| **FormGroup** | Maneja el valor y validez de un grupo de `AbstractControl`. Incluye sus controles hijos. |
| **FormArray** | Maneja el valor y validez de un array indexado de `AbstractControl`. |
| **FormBuilder** | Servicio inyectable que crea instancias de controles de forma simplificada. |
| **FormRecord** | Rastrea el valor y validez de un conjunto de `FormControl` con el mismo tipo de valor. |

---

### **Directivas**

| Directiva | Descripción |
| --- | --- |
| **FormControlDirective** | Sincroniza un `FormControl` independiente con un elemento de formulario. |
| **FormControlName** | Sincroniza un `FormControl` en un `FormGroup` con un elemento del formulario por nombre. |
| **FormGroupDirective** | Sincroniza un `FormGroup` existente con un elemento del DOM. |
| **FormGroupName** | Sincroniza un `FormGroup` anidado con un elemento del DOM. |
| **FormArrayName** | Sincroniza un `FormArray` anidado con un elemento del DOM. |