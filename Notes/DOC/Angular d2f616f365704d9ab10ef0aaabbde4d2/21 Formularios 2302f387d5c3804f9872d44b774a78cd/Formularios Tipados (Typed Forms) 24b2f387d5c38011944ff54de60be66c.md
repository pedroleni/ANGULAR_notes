# Formularios Tipados (Typed Forms)

Desde Angular 14, los **formularios reactivos** son **estrictamente tipados por defecto**.

---

## Resumen de los Formularios Tipados

En Angular con formularios reactivos, defines explícitamente un **modelo de formulario**.

Por ejemplo, un formulario básico de login:

```tsx

const login = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});

```

Angular ofrece muchas APIs para interactuar con este `FormGroup`, como:

`login.value`, `login.controls`, `login.patchValue`, etc.

En versiones anteriores de Angular, muchas de estas APIs usaban `any` en sus tipos, por lo que no había **seguridad de tipos**. Por ejemplo, este código era posible aunque incorrecto:

```tsx

const emailDomain = login.value.email.domain; // No existe 'domain'

```

Con formularios estrictamente tipados, este código **no compila**, ya que `email` no tiene una propiedad `domain`.

Ventajas adicionales:

- Mayor seguridad en tiempo de compilación.
- Mejor autocompletado en editores (IDE).
- Forma explícita de definir la estructura del formulario.

📌 Esto **solo aplica a formularios reactivos**, no a formularios basados en plantillas (*template-driven*).

---

## Formularios No Tipados

Los formularios no tipados siguen siendo compatibles.

Para usarlos, importa los símbolos **Untyped** desde `@angular/forms`:

```tsx

const login = new UntypedFormGroup({
  email: new UntypedFormControl(''),
  password: new UntypedFormControl(''),
});

```

Estos símbolos funcionan igual que en versiones anteriores.

Quitando el prefijo **Untyped** podrás migrar gradualmente a formularios tipados.

---

## FormControl: Primeros pasos

El formulario más simple es un único control:

```tsx

const email = new FormControl('angularrox@gmail.com');

```

Angular inferirá automáticamente el tipo:

```

FormControl<string | null>

```

TypeScript aplicará este tipo en:

- `email.value`
- `email.valueChanges`
- `email.setValue(...)`, etc.

---

### Nullability (Anulabilidad)

¿Por qué incluye `null`?

Porque el control puede ser **reseteado** en cualquier momento:

```tsx

const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null

```

Para evitar que pueda ser `null`, usa la opción `nonNullable`:

```tsx

const email = new FormControl('angularrox@gmail.com', { nonNullable: true });
email.reset();
console.log(email.value); // angularrox@gmail.com

```

Esto cambia el **comportamiento en tiempo de ejecución** cuando se llama a `.reset()`.

---

### Especificar un Tipo Explícito

Si inicializas un control con `null`, TypeScript inferirá:

```

FormControl<null>

```

lo cual es demasiado restrictivo.

Ejemplo incorrecto:

```tsx

const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // ❌ Error

```

Solución: especificar el tipo manualmente:

```tsx

const email = new FormControl<string | null>(null);
email.setValue('angularrox@gmail.com'); // ✅

```

---

## FormArray: Colecciones dinámicas y homogéneas

`FormArray` representa una lista abierta de controles **del mismo tipo**:

```tsx

const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));

```

En este caso, los controles internos son:

```

FormControl<string | null>

```

Si quieres tipos distintos en el array, usa **UntypedFormArray**.

---

## FormGroup y FormRecord

- **FormGroup**: conjunto de controles con claves **definidas**.
- **FormRecord**: conjunto de controles **dinámico** con claves no definidas previamente.

---

## Valores Parciales

Ejemplo:

```tsx

const login = new FormGroup({
  email: new FormControl('', { nonNullable: true }),
  password: new FormControl('', { nonNullable: true }),
});

```

En cualquier `FormGroup`, los controles pueden ser deshabilitados.

Cuando un control está deshabilitado, **no aparece** en `value`.

Por eso, `login.value` es:

```

Partial<{ email: string, password: string }>

```

Es decir, `email` puede ser `string | undefined`.

Para obtener todos los valores (incluyendo los deshabilitados) usa:

```tsx

login.getRawValue();

```

---

## Controles opcionales y grupos dinámicos

Puedes declarar controles opcionales en la interfaz:

```tsx

interface LoginForm {
  email: FormControl<string>;
  password?: FormControl<string>;
}
const login = new FormGroup<LoginForm>({
  email: new FormControl('', { nonNullable: true }),
  password: new FormControl('', { nonNullable: true }),
});
login.removeControl('password');

```

Solo los controles opcionales pueden ser añadidos/eliminados en tiempo de ejecución.

---

## FormRecord

Cuando las claves no se conocen de antemano:

```tsx

const addresses = new FormRecord<FormControl<string | null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));

```

También puedes crearlo con `FormBuilder`:

```tsx

const addresses = fb.record({ 'Andrew': '2340 Folsom St' });

```

Si necesitas un `FormGroup` **dinámico y heterogéneo**, usa `UntypedFormGroup`.

---

## FormBuilder y NonNullableFormBuilder

`FormBuilder` ahora soporta los nuevos tipos.

También existe **NonNullableFormBuilder**, que pone `{ nonNullable: true }` por defecto.

Ejemplo:

```tsx

const fb = new FormBuilder();
const login = fb.nonNullable.group({
  email: '',
  password: '',
});

```

En este caso, ambos controles son **no anulables**.

También puedes inyectarlo como `NonNullableFormBuilder`.