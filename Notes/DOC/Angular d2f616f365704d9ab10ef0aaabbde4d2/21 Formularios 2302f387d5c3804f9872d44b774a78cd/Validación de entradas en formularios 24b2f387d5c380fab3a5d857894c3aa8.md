# Validación de entradas en formularios

Puedes mejorar la calidad general de los datos validando la entrada del usuario para garantizar exactitud y completitud.

Esta página muestra cómo validar la entrada del usuario desde la interfaz y mostrar mensajes útiles de validación, tanto en formularios **reactivos** como **basados en plantillas**.

---

## **Validar entradas en formularios basados en plantillas**

Para añadir validación a un formulario basado en plantillas, se usan los mismos atributos de validación que en la validación nativa de HTML.

Angular utiliza directivas para asociar estos atributos a funciones validadoras del framework.

Cada vez que el valor de un control cambia, Angular ejecuta la validación y genera:

- Una lista de errores de validación → estado **INVALID**
- O `null` → estado **VALID**

Puedes inspeccionar el estado del control exportando `ngModel` a una variable local de plantilla.

Ejemplo:

**`template/actor-form-template.component.html` (name)**

```html
<input type="text" id="name" name="name" class="form-control"
       required minlength="4" appForbiddenName="bob"
       [(ngModel)]="actor.name" #name="ngModel">
@if (name.invalid && (name.dirty || name.touched)) {
  <div class="alert">
    @if (name.hasError('required')) {
      <div>Name is required.</div>
    }
    @if (name.hasError('minlength')) {
      <div>Name must be at least 4 characters long.</div>
    }
    @if (name.hasError('forbiddenName')) {
      <div>Name cannot be Bob.</div>
    }
  </div>
}

```

**Características del ejemplo:**

- El `<input>` incluye atributos HTML de validación: `required` y `minlength`. También usa un validador personalizado (`appForbiddenName`).
- `#name="ngModel"` exporta la directiva `NgModel` a la variable local `name`. `NgModel` refleja muchas propiedades de su `FormControl` subyacente, lo que permite consultar estados como `valid` o `dirty`.
- El `@if` exterior muestra mensajes solo si `name` es inválido **y** está en estado `dirty` o `touched`.
- Cada `@if` anidado muestra un mensaje específico para un error de validación: `required`, `minlength`, `forbiddenName`.

**Nota útil:**

- `dirty` → el usuario cambió el valor del campo.
- `touched` → el usuario interactuó con el campo y salió de él.
- Se recomienda comprobar `dirty` o `touched` para evitar mostrar errores antes de que el usuario interactúe.

---

## **Validar entradas en formularios reactivos**

En un formulario reactivo, la fuente de la verdad está en la clase del componente.

En lugar de usar atributos HTML, se añaden las funciones validadoras directamente al modelo del control en el componente.

Angular ejecuta estas funciones cada vez que cambia el valor del control.

---

### **Funciones validadoras**

Pueden ser **sincrónicas** o **asíncronas**:

| Tipo | Descripción |
| --- | --- |
| Sincrónicos | Reciben una instancia de control y devuelven inmediatamente un objeto con errores o `null`. Se pasan como segundo argumento al instanciar un `FormControl`. |
| Asíncronos | Reciben una instancia de control y devuelven una `Promise` o `Observable` que emitirá los errores o `null`. Se pasan como tercer argumento al instanciar un `FormControl`. |

> Angular ejecuta validadores asíncronos solo si todos los sincrónicos pasan.
> 

---

### **Validadores incorporados**

Puedes usar validadores propios o los incorporados de Angular, como `Validators.required` o `Validators.minLength`.

Son los mismos que en formularios basados en plantillas, pero disponibles como funciones desde la clase `Validators`.

---

Ejemplo de formulario reactivo:

**`reactive/actor-form-reactive.component.ts`**

```tsx
actorForm = new FormGroup({
  name: new FormControl(this.actor.name, [
    Validators.required,
    Validators.minLength(4),
    forbiddenNameValidator(/bob/i), // validador personalizado
  ]),
  role: new FormControl(this.actor.role),
  skill: new FormControl(this.actor.skill, Validators.required),
});

get name() {
  return this.actorForm.get('name');
}
get skill() {
  return this.actorForm.get('skill');
}

```

- `name` tiene dos validadores incorporados (`required`, `minLength(4)`) y uno personalizado (`forbiddenNameValidator`).
- Todos son sincrónicos → van como segundo argumento.
- Se usan getters (`name`, `skill`) para simplificar la plantilla.

---

### **Plantilla asociada**

**`reactive/actor-form-reactive.component.html` (name con mensaje de error)**

```html
<input type="text" id="name" class="form-control"
       formControlName="name" required>
@if (name.invalid && (name.dirty || name.touched)) {
  <div class="alert alert-danger">
    @if (name.hasError('required')) {
      <div>Name is required.</div>
    }
    @if (name.hasError('minlength')) {
      <div>Name must be at least 4 characters long.</div>
    }
    @if (name.hasError('forbiddenName')) {
      <div>Name cannot be Bob.</div>
    }
  </div>
}

```

**Diferencias respecto a template-driven:**

- No exporta directivas (`#name="ngModel"`), sino que usa el getter `name` del componente.
- El atributo `required` sigue presente en HTML por motivos de accesibilidad, aunque no es necesario para la validación.

---

## **Definir validadores personalizados**

Los validadores integrados no siempre se ajustan exactamente a las necesidades de tu aplicación, por lo que en ocasiones es necesario crear un validador personalizado.

Considera la función `forbiddenNameValidator` del ejemplo anterior. Así es como se define:

**`shared/forbidden-name.directive.ts` (forbiddenNameValidator)**

```tsx
/** El nombre de un actor no puede coincidir con la expresión regular dada */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}

```

Esta función es una **fábrica** que recibe una expresión regular para detectar un nombre prohibido específico y devuelve una función validadora configurada.

En este ejemplo, el nombre prohibido es `"bob"`, así que el validador rechaza cualquier nombre de actor que lo contenga. En otros casos, podría rechazar `"alice"` o cualquier otro nombre que coincida con la expresión regular configurada.

La fábrica `forbiddenNameValidator` devuelve una función que recibe un objeto `AbstractControl` y retorna:

- `null` si el valor es válido
- Un objeto de errores de validación si es inválido.

Este objeto de errores suele tener como clave el nombre de la validación (`'forbiddenName'`) y como valor un diccionario con datos que pueden insertarse en un mensaje de error.

> Los validadores personalizados asíncronos son similares a los sincrónicos, pero devuelven una Promise o un Observable que posteriormente emite null o un objeto de error. En el caso de un Observable, debe completarse, y se toma el último valor emitido para la validación.
> 

---

## **Añadir validadores personalizados a formularios reactivos**

En formularios reactivos, se añade el validador pasando la función directamente al `FormControl`:

**`reactive/actor-form-reactive.component.ts` (funciones validadoras)**

```tsx
actorForm = new FormGroup({
  name: new FormControl(this.actor.name, [
    Validators.required,
    Validators.minLength(4),
    forbiddenNameValidator(/bob/i), // validador personalizado
  ]),
  role: new FormControl(this.actor.role),
  skill: new FormControl(this.actor.skill, Validators.required),
});

```

---

## **Añadir validadores personalizados a formularios basados en plantillas**

En formularios basados en plantillas, se añade una **directiva** en la plantilla que envuelva la función validadora.

Por ejemplo, `ForbiddenValidatorDirective` actúa como envoltorio para `forbiddenNameValidator`.

Angular reconoce el rol de la directiva en el proceso de validación porque se registra en el proveedor **`NG_VALIDATORS`**, que es una colección extensible de validadores predefinidos.

**`shared/forbidden-name.directive.ts` (providers)**

```tsx
providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}],
})
export class ForbiddenValidatorDirective implements Validator {
  forbiddenName = input<string>('', {alias: 'appForbiddenName'});
  validate(control: AbstractControl): ValidationErrors | null {
    return this.forbiddenName
      ? forbiddenNameValidator(new RegExp(this.forbiddenName(), 'i'))(control)
      : null;
  }
}

```

La clase de la directiva implementa la interfaz `Validator` para integrarse fácilmente con formularios Angular.

---

### Directiva completa:

**`shared/forbidden-name.directive.ts` (directive)**

```tsx
@Directive({
  selector: '[appForbiddenName]',
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}],
})
export class ForbiddenValidatorDirective implements Validator {
  forbiddenName = input<string>('', {alias: 'appForbiddenName'});
  validate(control: AbstractControl): ValidationErrors | null {
    return this.forbiddenName
      ? forbiddenNameValidator(new RegExp(this.forbiddenName(), 'i'))(control)
      : null;
  }
}

```

---

### Uso en la plantilla:

**`template/actor-form-template.component.html` (forbidden-name-input)**

```html
<input type="text" id="name" name="name" class="form-control"
       required minlength="4" appForbiddenName="bob"
       [(ngModel)]="actor.name" #name="ngModel">

```

💡 **Nota útil:**

La directiva se registra con `useExisting` en lugar de `useClass`.

Esto es importante porque el validador registrado debe ser **esta instancia** de `ForbiddenValidatorDirective` (la que tiene la propiedad `forbiddenName` enlazada a `"bob"`).

Si se usara `useClass`, se crearía una nueva instancia que no tendría ese valor.

---

## **Clases CSS de estado de control**

Angular refleja muchas propiedades de un control como clases CSS en el elemento del formulario.

Puedes usar estas clases para aplicar estilos en función del estado del control.

Clases soportadas:

- `.ng-valid`
- `.ng-invalid`
- `.ng-pending`
- `.ng-pristine`
- `.ng-dirty`
- `.ng-untouched`
- `.ng-touched`
- `.ng-submitted` *(solo en el elemento `<form>` contenedor)*

---

### Ejemplo de uso (.ng-valid / .ng-invalid)

**`forms.css` (status classes)**

```css
.ng-valid[required], .ng-valid.required {
  border-left: 5px solid #42A948; /* verde */
}
.ng-invalid:not(form) {
  border-left: 5px solid #a94442; /* rojo */
}
.alert div {
  background-color: #fed3d3;
  color: #820000;
  padding: 1rem;
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: .5rem;
}
select {
  width: 100%;
  padding: .5rem;
}

```

---

## **Validación cruzada de campos (Cross-field validation)**

Un **validador cruzado** (*cross-field validator*) es un validador personalizado que compara los valores de diferentes campos de un formulario y los acepta o rechaza en combinación.

Ejemplos de uso:

- Un formulario con opciones mutuamente incompatibles (puedes elegir **A** o **B**, pero no ambas).
- Un valor de un campo depende de otro (puedes elegir **B** solo si también eliges **A**).

---

En los ejemplos de esta sección, la validación cruzada se usa para evitar que los actores repitan el mismo nombre en su rol dentro del **Actor Form**.

El validador comprueba que **name** y **role** no sean iguales.

---

### **Añadir validación cruzada a formularios reactivos**

Estructura del formulario:

```tsx
const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl()
});

```

> Observa que name y role son controles hermanos.
> 
> 
> Para validarlos juntos, la validación debe realizarse en un **ancestro común**, en este caso el `FormGroup`.
> 

---

Para añadir el validador, se pasa como segundo argumento en la creación del `FormGroup`:

```tsx
const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl()
}, { validators: unambiguousRoleValidator });

```

---

**Código del validador:**

**`shared/unambiguous-role.directive.ts`**

```tsx
/** El nombre de un actor no puede coincidir con su rol */
export const unambiguousRoleValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const name = control.get('name');
  const role = control.get('role');
  return name && role && name.value === role.value ? {unambiguousRole: true} : null;
};

```

- Implementa la interfaz `ValidatorFn`.
- Recibe un `AbstractControl` (el `FormGroup`).
- Recupera los controles hijos con `get('name')` y `get('role')`.
- Si los valores coinciden → devuelve `{ unambiguousRole: true }` (formulario inválido).
- Si no coinciden → devuelve `null` (válido).

---

**Mostrar mensaje de error en la plantilla (formulario reactivo):**

**`reactive/actor-form-template.component.html`**

```html
@if (actorForm.hasError('unambiguousRole') && (actorForm.touched || actorForm.dirty)) {
  <div class="cross-validation-error-message alert alert-danger">
    Name cannot match role or audiences will be confused.
  </div>
}

```

- El mensaje aparece solo si el `FormGroup` tiene el error `unambiguousRole` **y** el usuario ya interactuó con el formulario (`touched` o `dirty`).

---

### **Añadir validación cruzada a formularios basados en plantillas**

En formularios template-driven, se crea una **directiva** que envuelva la función validadora.

Se registra usando el token `NG_VALIDATORS`.

**`shared/unambiguous-role.directive.ts`**

```tsx
@Directive({
  selector: '[appUnambiguousRole]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: UnambiguousRoleValidatorDirective, multi: true},
  ],
})
export class UnambiguousRoleValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return unambiguousRoleValidator(control);
  }
}

```

---

**Uso en la plantilla:**

El validador debe registrarse en el nivel más alto del formulario, así que se coloca en la etiqueta `<form>`:

```html
<form #actorForm="ngForm" appUnambiguousRole>

```

---

**Mostrar mensaje de error en la plantilla (formulario template-driven):**

```html
@if (actorForm.hasError('unambiguousRole') && (actorForm.touched || actorForm.dirty)) {
  <div class="cross-validation-error-message alert">
    Name cannot match role.
  </div>
}

```

Este patrón para mostrar errores es el mismo en formularios reactivos y basados en plantillas.

---

## **Creación de validadores asíncronos**

Los validadores asíncronos implementan las interfaces **AsyncValidatorFn** y **AsyncValidator**.

Son muy similares a sus equivalentes sincrónicos, con las siguientes diferencias:

- La función **validate()** debe devolver una **Promise** o un **Observable**.
- El **Observable** devuelto debe ser finito (debe completarse en algún momento).
    - Para convertir un observable infinito en uno finito, se puede encadenar un operador de filtrado como `first`, `last`, `take` o `takeUntil`.

La validación asíncrona se ejecuta **después** de la validación sincrónica y **solo** si esta última fue exitosa.

Esto evita ejecutar procesos asíncronos costosos (como peticiones HTTP) si las validaciones básicas ya han fallado.

Cuando la validación asíncrona comienza, el control del formulario entra en estado **pending**.

Puedes inspeccionar la propiedad `pending` del control y usarla para mostrar retroalimentación visual sobre la operación en curso.

**Ejemplo de plantilla mostrando un spinner mientras valida:**

```html
<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>
@if(model.pending) {
  <app-spinner />
}

```

---

## **Implementar un validador asíncrono personalizado**

En este ejemplo, un validador asíncrono comprueba que un actor se asigne a un rol que no esté ocupado.

Como los actores cambian constantemente, no se puede obtener la lista de roles disponibles por adelantado; por ello, el validador debe consultar de forma asíncrona una base de datos central.

**`role.directive.ts`**

```tsx
@Injectable({providedIn: 'root'})
export class UniqueRoleValidator implements AsyncValidator {
  private readonly actorsService = inject(ActorsService);
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.actorsService.isRoleTaken(control.value).pipe(
      map((isTaken) => (isTaken ? {uniqueRole: true} : null)),
      catchError(() => of(null)),
    );
  }
}

```

**Interfaz del servicio:**

```tsx
interface ActorsService {
  isRoleTaken: (role: string) => Observable<boolean>;
}

```

- `actorsService.isRoleTaken()` hace la petición HTTP y devuelve `Observable<boolean>`.
- El validador transforma la respuesta en un objeto de error o `null`.
- Si hay error en la petición, en este ejemplo se considera válido (`catchError` devuelve `null`).

Cuando termina la validación, el `pending` pasa a `false` y se actualiza el estado del formulario.

---

## **Añadir validadores asíncronos a formularios reactivos**

1. Inyecta el validador en el componente:

```tsx
roleValidator = inject(UniqueRoleValidator);

```

1. Pásalo como opción `asyncValidators` al `FormControl`:

```tsx
const roleControl = new FormControl('', {
  asyncValidators: [this.roleValidator.validate.bind(this.roleValidator)],
  updateOn: 'blur',
});

```

- `asyncValidators` puede ser una sola función o un array.

---

## **Añadir validadores asíncronos a formularios basados en plantillas**

Crea una directiva y registra el proveedor `NG_ASYNC_VALIDATORS`:

```tsx
@Directive({
  selector: '[appUniqueRole]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UniqueRoleValidatorDirective),
      multi: true,
    },
  ],
})
export class UniqueRoleValidatorDirective implements AsyncValidator {
  private readonly validator = inject(UniqueRoleValidator);
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.validator.validate(control);
  }
}

```

**Uso en plantilla:**

```html
<input type="text"
       id="role"
       name="role"
       #role="ngModel"
       [(ngModel)]="actor.role"
       [ngModelOptions]="{ updateOn: 'blur' }"
       appUniqueRole>

```

---

## **Optimizar el rendimiento de validadores asíncronos**

Por defecto, todos los validadores se ejecutan tras **cada cambio** en el valor del formulario.

Con validadores sincrónicos esto normalmente no afecta el rendimiento, pero con asíncronos sí, porque pueden implicar peticiones HTTP costosas.

**Solución:** cambiar `updateOn` de `"change"` (por defecto) a `"submit"` o `"blur"`.

- En formularios basados en plantillas:

```html
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">

```

- En formularios reactivos:

```tsx
new FormControl('', {updateOn: 'blur'});

```

---

## **Interacción con la validación nativa de HTML**

Por defecto, Angular desactiva la validación nativa de HTML añadiendo el atributo `novalidate` en el `<form>`.

Esto se hace para usar las directivas de Angular que enlazan atributos con funciones validadoras internas.

Si quieres usar la validación nativa junto con la de Angular, puedes reactivarla con la directiva **`ngNativeValidate`**.

---