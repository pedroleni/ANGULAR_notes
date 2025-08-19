# Creación de formularios dinámicos

Muchos formularios, como cuestionarios, pueden ser muy similares entre sí en formato e intención.

Para generar diferentes versiones de este tipo de formulario más rápida y fácilmente, puedes crear una **plantilla de formulario dinámico** basada en metadatos que describen el modelo de objeto de negocio.

Luego, usas esa plantilla para generar nuevos formularios automáticamente, de acuerdo con cambios en el modelo de datos.

Esta técnica es especialmente útil cuando tienes un tipo de formulario cuyo contenido debe cambiar con frecuencia para cumplir con requisitos empresariales o normativos que cambian rápidamente.

Un caso típico de uso es un **cuestionario**, donde:

- El formato y estilo del formulario deben permanecer constantes.
- Las preguntas varían según el contexto.

En este tutorial construirás un **formulario dinámico** que presenta un cuestionario básico para una aplicación en línea de **héroes que buscan empleo**.

La agencia cambia constantemente el proceso de solicitud, pero con el formulario dinámico puedes crear nuevas versiones al instante, sin cambiar el código de la aplicación.

---

## **1. Habilitar formularios reactivos en tu proyecto**

Los formularios dinámicos se basan en **formularios reactivos**.

Para usar directivas de formularios reactivos, importa **ReactiveFormsModule** desde `@angular/forms` en los componentes necesarios:

```tsx
import {Component, input, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {QuestionBase} from './question-base';
@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  imports: [ReactiveFormsModule],
})
export class DynamicFormQuestionComponent {
  question = input.required<QuestionBase<string>>();
  form = input.required<FormGroup>();
  get isValid() {
    return this.form().controls[this.question().key].valid;
  }
}

```

```tsx
import {Component, computed, inject, input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormQuestionComponent} from './dynamic-form-question.component';
import {QuestionBase} from './question-base';
import {QuestionControlService} from './question-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService],
  imports: [DynamicFormQuestionComponent, ReactiveFormsModule],
})
export class DynamicFormComponent {
  private readonly qcs = inject(QuestionControlService);
  questions = input<QuestionBase<string>[] | null>([]);
  form = computed<FormGroup>(() =>
    this.qcs.toFormGroup(this.questions() as QuestionBase<string>[]),
  );
  payLoad = '';

  onSubmit() {
    this.payLoad = JSON.stringify(this.form().getRawValue());
  }
}

```

---

## **2. Crear un modelo de objeto de formulario**

Un formulario dinámico requiere un modelo de objeto capaz de describir todos los escenarios que la funcionalidad del formulario debe manejar.

En este ejemplo, el formulario de solicitud para héroes es un conjunto de **preguntas**:

- Cada control del formulario plantea una pregunta.
- El usuario debe responder.

El modelo de datos debe representar una pregunta.

El ejemplo incluye un componente `DynamicFormQuestionComponent` que define la pregunta como objeto fundamental en el modelo.

---

### **Clase base `QuestionBase`**

**`src/app/question-base.ts`**

```tsx
export class QuestionBase<T> {
  value: T | undefined;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: {key: string; value: string}[];

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      options?: {key: string; value: string}[];
    } = {},
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
  }
}

```

---

## **3. Definir clases de control**

A partir de la clase base, el ejemplo crea dos clases derivadas:

- **TextboxQuestion**
- **DropdownQuestion**

Cada una representa un tipo distinto de control en el formulario.

Cuando se construye la plantilla, se instancian estos tipos para renderizar los controles adecuados dinámicamente.

---

**`question-textbox.ts`**

```tsx
import {QuestionBase} from './question-base';
export class TextboxQuestion extends QuestionBase<string> {
  override controlType = 'textbox';
}

```

- Representa un campo de texto (`<input>`).
- El tipo del `<input>` se define según `options.type` (`text`, `email`, `url`, etc.).

---

**`question-dropdown.ts`**

```tsx
import {QuestionBase} from './question-base';
export class DropdownQuestion extends QuestionBase<string> {
  override controlType = 'dropdown';
}

```

- Representa una lista desplegable (`<select>`).

---

## **4. Componer grupos de formulario**

Un formulario dinámico utiliza un servicio para crear **FormGroups** a partir del modelo de preguntas.

**`src/app/question-control.service.ts`**

```tsx
import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionBase} from './question-base';

@Injectable()
export class QuestionControlService {
  toFormGroup(questions: QuestionBase<string>[]) {
    const group: any = {};
    questions.forEach((question) => {
      group[question.key] = question.required
        ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}

```

- Recorre la lista de preguntas.
- Crea un `FormControl` por cada una.
- Añade `Validators.required` si la pregunta es obligatoria.

---

## **Componer el contenido dinámico del formulario**

El propio formulario dinámico está representado por un componente contenedor, que añadirás en un paso posterior.

Cada pregunta se representa en la plantilla del componente de formulario mediante una etiqueta `<app-question>`, que coincide con una instancia de **DynamicFormQuestionComponent**.

El **DynamicFormQuestionComponent** es responsable de renderizar los detalles de una pregunta individual basándose en los valores del objeto `question` enlazado con datos.

El formulario se apoya en la directiva `[formGroup]` para conectar el HTML de la plantilla con los objetos de control subyacentes.

El **DynamicFormQuestionComponent** crea grupos de formulario y los rellena con los controles definidos en el modelo de pregunta, especificando reglas de visualización y validación.

```html
<div [formGroup]="form()">
  <label [attr.for]="question().key">{{ question().label }}</label>
  <div>
    @switch (question().controlType) {
      @case ('textbox') {
        <input [formControlName]="question().key" [id]="question().key" [type]="question().type" />
      }
      @case ('dropdown') {
        <select [id]="question().key" [formControlName]="question().key">
          @for (opt of question().options; track opt) {
            <option [value]="opt.key">{{ opt.value }}</option>
          }
        </select>
      }
    }
  </div>
  @if (!isValid) {
    <div class="errorMessage">{{ question().label }} es obligatorio</div>
  }
</div>

```

```tsx
import {Component, input, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {QuestionBase} from './question-base';
@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  imports: [ReactiveFormsModule],
})
export class DynamicFormQuestionComponent {
  question = input.required<QuestionBase<string>>();
  form = input.required<FormGroup>();
  get isValid() {
    return this.form().controls[this.question().key].valid;
  }
}
```

El objetivo del **DynamicFormQuestionComponent** es presentar los tipos de preguntas definidos en tu modelo.

De momento solo tienes dos tipos, pero podrías tener muchos más.

El bloque `@switch` de la plantilla determina qué tipo de pregunta mostrar.

El `switch` usa directivas con los selectores `formControlName` y `formGroup`, ambas definidas en **ReactiveFormsModule**.

---

## **Suministrar datos**

Necesitamos otro servicio para proporcionar un conjunto concreto de preguntas con las que construir un formulario.

En este ejercicio, se crea **QuestionService** para devolver un array de preguntas usando datos de ejemplo codificados.

En una aplicación real, el servicio podría obtener datos de un sistema backend.

Lo importante es que controlas el cuestionario de solicitud de héroes únicamente a través de los objetos que devuelve `QuestionService`.

Para mantener el cuestionario, solo necesitas **añadir, actualizar o eliminar** objetos del array `questions`.

```tsx
import {Injectable} from '@angular/core';
import {DropdownQuestion} from './question-dropdown';
import {QuestionBase} from './question-base';
import {TextboxQuestion} from './question-textbox';
import {of} from 'rxjs';

@Injectable()
export class QuestionService {
  // TODO: obtener de una fuente remota de metadatos
  getQuestions() {
    const questions: QuestionBase<string>[] = [
      new DropdownQuestion({
        key: 'favoriteAnimal',
        label: 'Animal favorito',
        options: [
          {key: 'cat', value: 'Gato'},
          {key: 'dog', value: 'Perro'},
          {key: 'horse', value: 'Caballo'},
          {key: 'capybara', value: 'Capibara'},
        ],
        order: 3,
      }),
      new TextboxQuestion({
        key: 'firstName',
        label: 'Nombre',
        value: 'Alex',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Correo electrónico',
        type: 'email',
        order: 2,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
}

```

---

## **Crear la plantilla del formulario dinámico**

El componente **DynamicFormComponent** es el punto de entrada y contenedor principal del formulario, que se representa con `<app-dynamic-form>` en la plantilla.

Presenta la lista de preguntas vinculando cada una a un elemento `<app-question>`, que corresponde al **DynamicFormQuestionComponent**.

```tsx
import {Component, computed, inject, input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormQuestionComponent} from './dynamic-form-question.component';
import {QuestionBase} from './question-base';
import {QuestionControlService} from './question-control.service';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService],
  imports: [DynamicFormQuestionComponent, ReactiveFormsModule],
})
export class DynamicFormComponent {
  private readonly qcs = inject(QuestionControlService);
  questions = input<QuestionBase<string>[] | null>([]);
  form = computed<FormGroup>(() =>
    this.qcs.toFormGroup(this.questions() as QuestionBase<string>[]),
  );
  payLoad = '';
  onSubmit() {
    this.payLoad = JSON.stringify(this.form().getRawValue());
  }
}

```

```html
<div>
  <form (ngSubmit)="onSubmit()" [formGroup]="form()">
    @for (question of questions(); track question) {
      <div class="form-row">
        <app-question [question]="question" [form]="form()" />
      </div>
    }
    <div class="form-row">
      <button type="submit" [disabled]="!form().valid">Guardar</button>
    </div>
  </form>
  @if (payLoad) {
    <div class="form-row">
      <strong>Se guardaron los siguientes valores</strong><br />{{ payLoad }}
    </div>
  }
</div>

```

---

## **Mostrar el formulario**

Para mostrar una instancia del formulario dinámico, la plantilla de `AppComponent` pasa el array `questions` devuelto por **QuestionService** al componente `<app-dynamic-form>`.

```tsx
import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {DynamicFormComponent} from './dynamic-form.component';
import {QuestionService} from './question.service';
import {QuestionBase} from './question-base';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Solicitud de empleo para héroes</h2>
      <app-dynamic-form [questions]="questions$ | async" />
    </div>
  `,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent],
})
export class AppComponent {
  questions$: Observable<QuestionBase<string>[]> = inject(QuestionService).getQuestions();
}

```

---

## **Garantizar datos válidos**

La plantilla del formulario usa enlace de datos dinámico de metadatos para renderizar el formulario sin hacer suposiciones codificadas sobre preguntas concretas.

Añade tanto la metadata de control como los criterios de validación de forma dinámica.

Para garantizar una entrada válida:

- El botón **Guardar** está deshabilitado hasta que el formulario sea válido.
- Una vez válido, al hacer clic en Guardar, la aplicación muestra los valores actuales del formulario en formato JSON.

![image.png](Creaci%C3%B3n%20de%20formularios%20din%C3%A1micos%2024b2f387d5c38019b892c6ba1de42abf/image.png)

---