# Creación de un formulario basado en plantillas

Este tutorial te muestra cómo crear un formulario basado en plantillas (*template-driven form*).

Los elementos de control del formulario están vinculados a propiedades de datos que tienen validación de entrada.

La validación de entrada ayuda a mantener la integridad de los datos y aplicar estilos para mejorar la experiencia del usuario.

Los formularios basados en plantillas usan **enlace de datos bidireccional** (*two-way data binding*) para actualizar el modelo de datos en el componente a medida que se realizan cambios en la plantilla, y viceversa.

---

### Formularios basados en plantilla vs Formularios reactivos

Angular admite dos enfoques de diseño para formularios interactivos:

- **Formularios basados en plantillas**: permiten usar directivas específicas de formularios directamente en tu plantilla de Angular.
- **Formularios reactivos**: proporcionan un enfoque guiado por el modelo (*model-driven*) para construir formularios.

Los formularios basados en plantillas son una excelente opción para formularios pequeños o simples, mientras que los formularios reactivos son más escalables y adecuados para formularios complejos.

Para una comparación de ambos enfoques, consulta **Choosing an approach** (*Elegir un enfoque*).

Puedes crear prácticamente cualquier tipo de formulario con una plantilla de Angular: formularios de inicio de sesión, de contacto o casi cualquier formulario empresarial.

Puedes organizar los controles de manera creativa y vincularlos a los datos de tu modelo de objetos.

También puedes:

- Especificar reglas de validación y mostrar errores de validación
- Permitir o no la entrada desde controles específicos de forma condicional
- Activar retroalimentación visual integrada
- Y mucho más

---

### Construir un formulario basado en plantillas

Los formularios basados en plantillas dependen de directivas definidas en **FormsModule**.

| Directiva | Detalles |
| --- | --- |
| **NgModel** | Reconcilia los cambios de valor en el elemento de formulario adjunto con los cambios en el modelo de datos, permitiéndote responder a la entrada del usuario con validación y manejo de errores. |
| **NgForm** | Crea una instancia de **FormGroup** de nivel superior y la vincula a un elemento `<form>` para rastrear el valor agregado del formulario y su estado de validación. Tan pronto como importas **FormsModule**, esta directiva se activa por defecto en todas las etiquetas `<form>`. No necesitas añadir un selector especial. |
| **NgModelGroup** | Crea y vincula una instancia de **FormGroup** a un elemento del DOM. |

---

### Resumen de pasos

En este tutorial, vincularás un formulario de ejemplo a datos y manejarás la entrada del usuario siguiendo estos pasos:

1. Construir el formulario básico.
2. Definir un modelo de datos de ejemplo.
3. Incluir la infraestructura necesaria como **FormsModule**.
4. Vincular controles de formulario a propiedades de datos usando la directiva **ngModel** y la sintaxis de enlace bidireccional.
5. Examinar cómo **ngModel** informa sobre los estados de los controles mediante clases CSS.
6. Nombrar los controles para que **ngModel** pueda acceder a ellos.
7. Rastrear la validez de la entrada y el estado de los controles usando **ngModel**.
8. Añadir CSS personalizado para proporcionar retroalimentación visual sobre el estado.
9. Mostrar y ocultar mensajes de error de validación.
10. Responder a un evento de clic de botón HTML nativo añadiendo datos al modelo.
11. Manejar el envío del formulario usando la propiedad de salida **ngSubmit** del formulario.
12. Deshabilitar el botón **Submit** hasta que el formulario sea válido.
13. Después del envío, sustituir el formulario finalizado por un contenido diferente en la página.

---

## Construir el formulario

La aplicación de ejemplo proporcionada crea la clase **Actor**, que define el modelo de datos reflejado en el formulario.

**`src/app/actor.ts`**

```tsx
export class Actor {
  constructor(
    public id: number,
    public name: string,
    public skill: string,
    public studio?: string,
  ) {}
}

```

---

El diseño y los detalles del formulario se definen en la clase **ActorFormComponent**.

**`src/app/actor-form/actor-form.component.ts (v1)`**

```tsx
import { Component } from '@angular/core';
import { Actor } from '../actor';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-actor-form',
  templateUrl: './actor-form.component.html',
  imports: [FormsModule, JsonPipe],
})
export class ActorFormComponent {
  skills = ['Method Acting', 'Singing', 'Dancing', 'Swordfighting'];
  model = new Actor(18, 'Tom Cruise', this.skills[3], 'CW Productions');
  submitted = false;

  onSubmit() {
    this.submitted = true;
  }
  ...
}

```

El valor del **selector** del componente `"app-actor-form"` significa que puedes insertar este formulario en una plantilla padre usando la etiqueta:

```html
<app-actor-form></app-actor-form>

```

---

El siguiente código crea una nueva instancia de actor, para que el formulario inicial pueda mostrar un actor de ejemplo.

**`adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts`**

```tsx
const myActress = new Actor(42, 'Marilyn Monroe', 'Singing');
console.log('My actress is called ' + myActress.name); // "My actress is called Marilyn"

```

Esta demostración usa datos ficticios para **model** y **skills**. En una aplicación real, inyectarías un servicio de datos para obtener y guardar datos reales, o expondrías estas propiedades como entradas y salidas.

---

El componente habilita la funcionalidad de formularios importando el módulo **FormsModule**.

**`adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts`**

```tsx
@Component({
  selector: 'app-actor-form',
  templateUrl: './actor-form.component.html',
  imports: [FormsModule, JsonPipe],
})
export class ActorFormComponent {

```

---

El formulario se muestra en el diseño de la aplicación definido por la plantilla del componente raíz.

**`src/app/app.component.html`**

```html
<app-actor-form />

```

---

La plantilla inicial define la estructura de un formulario con **dos grupos de formulario** (*form groups*) y un botón de envío.

Los grupos de formulario corresponden a dos propiedades del modelo de datos **Actor**: `name` y `studio`.

Cada grupo tiene una etiqueta (*label*) y una caja para la entrada del usuario.

- El elemento `<input>` para **Name** tiene el atributo HTML5 `required`.
- El elemento `<input>` para **Studio** no lo tiene, ya que `studio` es opcional.
- El botón **Submit** tiene algunas clases para estilos.

En este punto, el diseño del formulario es HTML5 puro, sin enlaces de datos ni directivas.

---

El formulario de ejemplo utiliza algunas clases de estilo de **Twitter Bootstrap**:

`container`, `form-group`, `form-control` y `btn`.

Para usar estos estilos, la hoja de estilos de la aplicación importa la librería:

**`src/styles.css`**

```css
@import url('https://unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css');

```

---

El formulario requiere que la **habilidad** (*skill*) del actor se elija de una lista predefinida de habilidades mantenidas internamente en **ActorFormComponent**.

El bucle `@for` de Angular recorre los valores de datos para rellenar el elemento `<select>`.

**`src/app/actor-form/actor-form.component.html (skills)`**

```html
<div class="form-group">
  <label for="skill">Skill</label>
  <select class="form-control" id="skill" required>
    @for(skill of skills; track $index) {
      <option [value]="skill">{{ skill }}</option>
    }
  </select>
</div>

```

Si ejecutas la aplicación ahora, verás la lista de habilidades en el control de selección.

Los elementos de entrada aún **no están vinculados** a valores de datos ni a eventos, por lo que siguen en blanco y sin comportamiento.

---

## Vincular controles de entrada a propiedades de datos

El siguiente paso es vincular los controles de entrada a las propiedades correspondientes de **Actor** usando **enlace de datos bidireccional**, de forma que respondan a la entrada del usuario actualizando el modelo de datos, y también respondan a cambios realizados por programación en los datos actualizando la vista.

La directiva **ngModel**, declarada en **FormsModule**, te permite vincular controles en tu formulario basado en plantillas a propiedades de tu modelo de datos.

Cuando incluyes la directiva usando la sintaxis de enlace bidireccional **`[(ngModel)]`**, Angular puede rastrear el valor y la interacción del usuario con el control, manteniendo la vista sincronizada con el modelo.

1. Edita el archivo de plantilla **`actor-form.component.html`**.
2. Busca la etiqueta `<input>` junto a la etiqueta *Name*.
3. Añade la directiva **ngModel** usando la sintaxis de enlace bidireccional:
    
    **`[(ngModel)]="..."`**.
    

**`src/app/actor-form/actor-form.component.html` (extracto)**

```html
<input type="text" class="form-control" id="name"
       required
       [(ngModel)]="model.name" name="name">
<!-- TODO: remove this: {{ model.name }} -->

```

💡 **Útil:** Este ejemplo incluye, después de cada etiqueta de entrada, una interpolación diagnóstica temporal `{{ model.name }}` para mostrar el valor actual de la propiedad correspondiente.

El comentario recuerda que elimines estas líneas diagnósticas cuando hayas terminado de observar el funcionamiento del enlace bidireccional.

---

## Acceder al estado general del formulario

Cuando importaste **FormsModule** en tu componente, Angular creó y adjuntó automáticamente una directiva **NgForm** a la etiqueta `<form>` de la plantilla (porque **NgForm** tiene el selector `form` que coincide con los elementos `<form>`).

Para acceder a **NgForm** y al estado general del formulario, declara una **variable de referencia de plantilla**.

1. Edita el archivo **`actor-form.component.html`**.
2. Actualiza la etiqueta `<form>` añadiendo la variable de referencia **#actorForm** y asignándole el valor siguiente:

**`src/app/actor-form/actor-form.component.html` (extracto)**

```html
<form #actorForm="ngForm">

```

Ahora, la variable de plantilla **actorForm** es una referencia a la instancia de la directiva **NgForm** que gobierna todo el formulario.

---

## Ejecutar la aplicación

- Empieza a escribir en el cuadro de entrada *Name*.
- Al agregar o eliminar caracteres, verás que aparecen o desaparecen del modelo de datos.
- La línea diagnóstica que muestra valores interpolados demuestra que los valores realmente fluyen desde el cuadro de entrada hacia el modelo y viceversa.

---

## Nombrar elementos de control

Cuando usas **`[(ngModel)]`** en un elemento, debes definir un atributo **name** para ese elemento.

Angular utiliza el nombre asignado para registrar el elemento con la directiva **NgForm** adjunta al `<form>` padre.

En el ejemplo, se añadió un atributo **name** al elemento `<input>` y se estableció en `"name"`, lo cual tiene sentido para el nombre del actor.

Cualquier valor único funcionará, pero usar un nombre descriptivo es útil.

---

## Añadir bindings y atributos `name` a otros campos

1. Agrega también enlaces **`[(ngModel)]`** y atributos **name** a los campos *Studio* y *Skill*.
2. Ahora puedes eliminar los mensajes diagnósticos que muestran valores interpolados.
3. Para confirmar que el enlace bidireccional funciona para todo el modelo **Actor**, añade un nuevo enlace de texto con el **pipe json** al principio de la plantilla del componente, que serializa los datos a una cadena.

---

Después de estas revisiones, la plantilla del formulario debería verse así:

**`src/app/actor-form/actor-form.component.html` (extracto)**

```html
{{ model | json }}

<div class="form-group">
  <label for="name">Name</label>
  <input type="text" class="form-control" id="name"
         required
         [(ngModel)]="model.name" name="name">
</div>

<div class="form-group">
  <label for="studio">Studio</label>
  <input type="text" class="form-control" id="studio"
         [(ngModel)]="model.studio" name="studio">
</div>

<div class="form-group">
  <label for="skill">Skill</label>
  <select class="form-control" id="skill"
          required
          [(ngModel)]="model.skill" name="skill">
    @for (skill of skills; track $index) {
      <option [value]="skill">{{ skill }}</option>
    }
  </select>
</div>

```

---

### Observaciones

- Cada elemento `<input>` tiene una propiedad **id**. Esto lo utiliza el atributo **for** del `<label>` para asociar la etiqueta con su control de entrada. Esto es una característica estándar de HTML.
- Cada elemento `<input>` también tiene la propiedad obligatoria **name**, que Angular usa para registrar el control dentro del formulario.

Cuando hayas terminado de observar los efectos, puedes eliminar el enlace de texto **`{{ model | json }}`**.

---

## Rastrear estados del formulario

Angular aplica la clase **`ng-submitted`** a los elementos de formulario después de que el formulario haya sido enviado.

Esta clase puede usarse para cambiar el estilo del formulario una vez que se ha enviado.

---

## Rastrear estados de control

Agregar la directiva **NgModel** a un control añade nombres de clases al control que describen su estado.

Estas clases pueden usarse para cambiar el estilo de un control según su estado.

La siguiente tabla describe los nombres de clase que Angular aplica en función del estado del control:

| Estado | Clase si es verdadero | Clase si es falso |
| --- | --- | --- |
| El control ha sido visitado. | `ng-touched` | `ng-untouched` |
| El valor del control ha cambiado. | `ng-dirty` | `ng-pristine` |
| El valor del control es válido. | `ng-valid` | `ng-invalid` |

Angular también aplica la clase **`ng-submitted`** a los elementos de formulario al enviarlos, pero **no** a los controles dentro del elemento `<form>`.

Puedes usar estas clases CSS para definir estilos para tus controles en función de su estado.

---

## Observar estados de control

Para ver cómo el framework añade y elimina las clases, abre las herramientas de desarrollador de tu navegador e inspecciona el elemento `<input>` que representa el nombre del actor.

Usando las herramientas de desarrollador, localiza el elemento `<input>` correspondiente al cuadro de entrada *Name*.

Verás que el elemento tiene múltiples clases CSS además de `"form-control"`.

Cuando lo ves por primera vez, las clases indican que:

- Tiene un valor válido.
- El valor no ha cambiado desde la inicialización o el reinicio.
- El control no ha sido visitado desde la inicialización o el reinicio.

Ejemplo inicial:

```html
<input class="form-control ng-untouched ng-pristine ng-valid">

```

---

### Acciones para observar los cambios en las clases del `<input>` *Name*

1. **Mirar pero no tocar**
    - Las clases indican que está `untouched`, `pristine` y `valid`.
2. **Hacer clic dentro de la caja de nombre y luego fuera**
    - El control ahora ha sido visitado, y la clase `ng-touched` reemplaza a `ng-untouched`.
3. **Añadir caracteres (por ejemplo, barras) al final del nombre**
    - Ahora el control está `touched` y `dirty`.
4. **Borrar el nombre**
    - Esto hace que el valor sea inválido, por lo que la clase `ng-invalid` reemplaza a `ng-valid`.

---

## Crear retroalimentación visual para los estados

El par **`ng-valid` / `ng-invalid`** es particularmente interesante, porque quieres dar una señal visual clara cuando los valores son inválidos.

También quieres marcar los campos obligatorios.

Puedes marcar campos obligatorios e inválidos al mismo tiempo con una barra de color a la izquierda de la caja de entrada.

---

### Pasos para cambiar la apariencia

1. Añade definiciones para las clases CSS **ng-***.
2. Coloca estas definiciones en un nuevo archivo `forms.css`.
3. Añade el nuevo archivo al proyecto como un hermano de `index.html`.

**`src/assets/forms.css`**

```css
.ng-valid[required], .ng-valid.required  {
  border-left: 5px solid #42A948; /* verde */
}
.ng-invalid:not(form)  {
  border-left: 5px solid #a94442; /* rojo */
}

```

---

1. En el archivo **`index.html`**, actualiza la etiqueta `<head>` para incluir la nueva hoja de estilos:

**`src/index.html` (estilos)**

```html
<link rel="stylesheet" href="assets/forms.css">

```

---

## Mostrar y ocultar mensajes de error de validación

La caja de entrada *Name* es obligatoria, y al vaciarla la barra se pone roja.

Eso indica que algo está mal, pero el usuario no sabe qué es ni qué hacer al respecto.

Puedes mostrar un mensaje útil comprobando y respondiendo al estado del control.

La lista desplegable *Skill* también es obligatoria, pero no necesita este tipo de manejo de errores porque ya restringe la selección a valores válidos.

---

## Definir y mostrar un mensaje de error cuando corresponda

Para definir y mostrar un mensaje de error de forma adecuada, sigue estos pasos:

---

### 1. Añadir una referencia local al campo de entrada

Amplía la etiqueta `<input>` con una **variable de referencia de plantilla** que puedas usar para acceder al control de Angular asociado a la caja de entrada desde la propia plantilla.

En el ejemplo, la variable es **`#name="ngModel"`**.

La variable de referencia de plantilla (**`#name`**) se establece en `"ngModel"` porque ese es el valor de la propiedad **NgModel.exportAs**.

Esta propiedad le indica a Angular cómo vincular una variable de referencia a una directiva.

---

### 2. Añadir el mensaje de error

Agrega un elemento `<div>` que contenga un mensaje de error apropiado.

---

### 3. Hacer que el mensaje de error sea condicional

Muestra u oculta el mensaje de error enlazando propiedades del control `name` a la propiedad **`hidden`** del `<div>` del mensaje.

**`src/app/actor-form/actor-form.component.html` (mensaje de error oculto)**

```html
<div [hidden]="name.valid || name.pristine"
     class="alert alert-danger">
</div>

```

---

### 4. Añadir un mensaje de error condicional al campo *name*

Ejemplo:

**`src/app/actor-form/actor-form.component.html` (extracto)**

```html
<label for="name">Name</label>
<input type="text" class="form-control" id="name"
       required [(ngModel)]="model.name" name="name"
       #name="ngModel">
<div [hidden]="name.valid || name.pristine"
     class="alert alert-danger">
  Name is required
</div>

```

En este ejemplo:

- El mensaje se oculta cuando el control es **válido** o **pristine**.
- *Pristine* significa que el usuario no ha cambiado el valor desde que se mostró en este formulario.

Si ignorases el estado *pristine*, el mensaje solo se ocultaría cuando el valor fuera válido.

En ese caso, si llegas a este componente con un actor nuevo y en blanco o un actor inválido, verías el mensaje de error inmediatamente, antes de haber hecho nada.

Si quieres que el mensaje se muestre solo cuando el usuario haga un cambio inválido, ocultarlo mientras el control esté en estado *pristine* logra ese objetivo.

La importancia de esta elección se notará cuando agregues un nuevo actor al formulario en el siguiente paso.

---

## Añadir un nuevo actor

Este ejercicio muestra cómo responder a un evento nativo de clic de botón HTML añadiendo datos al modelo.

Para permitir que los usuarios del formulario agreguen un nuevo actor, añadirás un botón **New Actor** que responda a un evento de clic.

1. En la plantilla, coloca un botón `<button>` con el texto *"New Actor"* al final del formulario.
2. En el archivo del componente, añade el método para crear un nuevo actor en el modelo de datos.

**`src/app/actor-form/actor-form.component.ts` (método New Actor)**

```tsx
newActor() {
  this.model = new Actor(42, '', '');
}

```

1. Vincula el evento **click** del botón al método `newActor()`.

**`src/app/actor-form/actor-form.component.html` (botón New Actor)**

```html
<button type="button" class="btn btn-default"
  (click)="newActor()">New Actor</button>

```

---

### Ejecuta la aplicación

- Haz clic en el botón **New Actor**.
- El formulario se limpia y las barras de requerido a la izquierda de las cajas de entrada se ponen rojas, indicando que las propiedades *name* y *skill* son inválidas.
- Observa que los mensajes de error están ocultos, porque el formulario está en estado **pristine**: aún no has cambiado nada.

---

Introduce un nombre y vuelve a hacer clic en **New Actor**.

Ahora la aplicación muestra el mensaje de error **"Name is required"**, porque la caja de entrada ya no está en estado *pristine*.

El formulario recuerda que introdujiste un nombre antes de pulsar **New Actor**.

---

## Restaurar el estado *pristine* de los controles del formulario

Para restaurar el estado *pristine* de los controles, borra todos los indicadores de forma imperativa llamando al método **`reset()`** del formulario después de llamar a `newActor()`.

**`src/app/actor-form/actor-form.component.html` (restablecer el formulario)**

```html
<button type="button" class="btn btn-default"
  (click)="newActor(); actorForm.reset()">New Actor</button>

```

Ahora, al hacer clic en **New Actor**, se restablecen tanto el formulario como las banderas de estado de sus controles.

---

## Enviar el formulario con **ngSubmit**

El usuario debe poder enviar este formulario después de rellenarlo.

El botón **Submit** al final del formulario no hace nada por sí mismo, pero sí dispara un evento de envío de formulario debido a su tipo (`type="submit"`).

Para responder a este evento, sigue estos pasos:

---

### Escuchar **ngOnSubmit**

Vincula la propiedad de evento **ngSubmit** del formulario al método `onSubmit()` del componente **actor-form**.

**`src/app/actor-form/actor-form.component.html` (ngSubmit)**

```html
<form (ngSubmit)="onSubmit()" #actorForm="ngForm">

```

---

### Vincular la propiedad `disabled`

Usa la variable de referencia de plantilla **#actorForm** para acceder al formulario que contiene el botón **Submit** y crear un enlace de evento.

Vincularás la propiedad del formulario que indica su validez general a la propiedad **disabled** del botón **Submit**.

**`src/app/actor-form/actor-form.component.html` (botón submit)**

```html
<button type="submit" class="btn btn-success"
  [disabled]="!actorForm.form.valid">Submit</button>

```

---

### Ejecutar la aplicación

Observa que el botón está habilitado (aunque todavía no hace nada útil).

- Borra el valor de *Name*.
- Esto infringe la regla `required`, por lo que se muestra el mensaje de error y, además, se desactiva el botón **Submit**.

No tuviste que conectar explícitamente el estado habilitado del botón a la validez del formulario:

**FormsModule** lo hizo automáticamente cuando definiste una variable de referencia de plantilla en el elemento `<form>` mejorado y luego te referiste a esa variable en el control del botón.

---

## Responder al envío del formulario

Para mostrar una respuesta tras el envío, puedes ocultar el área de entrada de datos y mostrar otra cosa en su lugar.

---

### Envolver el formulario

Envuelve todo el formulario en un `<div>` y vincula su propiedad **hidden** a la propiedad `submitted` de **ActorFormComponent**.

**`src/app/actor-form/actor-form.component.html` (extracto)**

```html
<div [hidden]="submitted">
  <h1>Actor Form</h1>
  <form (ngSubmit)="onSubmit()" #actorForm="ngForm">
    ...
    <!-- ... todo el formulario ... -->
  </form>
</div>

```

El formulario principal es visible desde el inicio porque `submitted` es `false` hasta que envías el formulario, como se ve en este fragmento:

**`src/app/actor-form/actor-form.component.ts` (submitted)**

```tsx
submitted = false;
onSubmit() {
  this.submitted = true;
}

```

Cuando haces clic en **Submit**, la bandera `submitted` pasa a `true` y el formulario desaparece.

---

## Añadir el estado *submitted*

Para mostrar otra cosa mientras el formulario está en estado enviado, añade el siguiente HTML debajo del nuevo contenedor `<div>`.

**`src/app/actor-form/actor-form.component.html` (extracto)**

```html
<div [hidden]="!submitted">
  <h2>You submitted the following:</h2>
  <div class="row">
    <div class="col-xs-3">Name</div>
    <div class="col-xs-9">{{ model.name }}</div>
  </div>
  <div class="row">
    <div class="col-xs-3">Studio</div>
    <div class="col-xs-9">{{ model.studio }}</div>
  </div>
  <div class="row">
    <div class="col-xs-3">Skill</div>
    <div class="col-xs-9">{{ model.skill }}</div>
  </div>
  <br>
  <button type="button" class="btn btn-primary" (click)="submitted=false">
    Edit
  </button>
</div>

```

Este `<div>`, que muestra un actor en modo de solo lectura mediante enlaces de interpolación, aparece solo mientras el componente está en estado *submitted*.

La vista alternativa incluye un botón **Edit** cuyo evento `click` está vinculado a una expresión que limpia la bandera `submitted`.

---

### Probar el botón *Edit*

Haz clic en el botón **Edit** para volver a mostrar el formulario editable.

---

## Resumen

El formulario de Angular descrito en esta página aprovecha las siguientes características del framework para proporcionar soporte de modificación de datos, validación y más:

- Una plantilla HTML de formulario Angular.
- Una clase de componente de formulario con un decorador **@Component**.
- Manejo del envío del formulario enlazando a la propiedad de evento **NgForm.ngSubmit**.
- Variables de referencia de plantilla como **#actorForm** y **#name**.
- Sintaxis **`[(ngModel)]`** para enlace de datos bidireccional.
- Uso de atributos **name** para validación y seguimiento de cambios en elementos del formulario.
- La propiedad **valid** de la variable de referencia en controles de entrada indica si un control es válido o debe mostrar mensajes de error.
- Controlar el estado habilitado del botón **Submit** enlazando a la validez de **NgForm**.
- Clases CSS personalizadas que ofrecen retroalimentación visual a los usuarios sobre controles no válidos.

---

## Código de la versión final de la aplicación

```tsx
import { Component } from '@angular/core';
import { Actor } from '../actor';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-actor-form',
  templateUrl: './actor-form.component.html',
  imports: [FormsModule, JsonPipe],
})
export class ActorFormComponent {
  skills = ['Method Acting', 'Singing', 'Dancing', 'Swordfighting'];
  model = new Actor(18, 'Tom Cruise', this.skills[3], 'CW Productions');
  submitted = false;

  onSubmit() {
    this.submitted = true;
  }

  ...

  newActor() {
    this.model = new Actor(42, '', '');
  }

  ...
}

```

---

Si quieres, puedo prepararte ahora **toda la traducción completa del tutorial de Angular 20 sobre template-driven forms** en un solo documento limpio y estructurado, para que no tengas que ir por partes.

¿Quieres que te lo compile todo junto?