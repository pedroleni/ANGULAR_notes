# 8. LinkedSignal

## Estado dependiente con `linkedSignal`

Puedes usar la función `signal` para mantener un estado dentro de tu código Angular. A veces, este estado depende de otro estado. Por ejemplo, imagina un componente que permite al usuario seleccionar un método de envío para un pedido:

```tsx

@Component({/* ... */})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();
  // Selecciona por defecto la primera opción de envío.
  selectedOption = signal(this.shippingOptions()[0]);

  changeShipping(newOptionIndex: number) {
    this.selectedOption.set(this.shippingOptions()[newOptionIndex]);
  }
}

```

En este ejemplo, `selectedOption` por defecto toma la primera opción, pero cambia si el usuario selecciona otra opción. Sin embargo, `shippingOptions` es una señal — ¡su valor puede cambiar! Si `shippingOptions` cambia, `selectedOption` puede contener un valor que ya no sea una opción válida.

La función `linkedSignal` te permite crear una señal que contiene un estado intrínsecamente vinculado a otro estado. Retomando el ejemplo anterior, `linkedSignal` puede reemplazar a `signal`:

```tsx

@Component({/* ... */})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();
  // Inicializa `selectedOption` con la primera opción de envío.
  selectedOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }
}

```

`linkedSignal` funciona de forma similar a `signal`, con una diferencia clave: en lugar de pasarle un valor por defecto, le pasas una función de cómputo, como con `computed`. Cuando el valor del cálculo cambia, el valor de `linkedSignal` también cambia al resultado de dicha función. Esto ayuda a asegurar que `linkedSignal` siempre contenga un valor válido.

El siguiente ejemplo muestra cómo el valor de un `linkedSignal` puede cambiar en función de su estado vinculado:

```tsx

const shippingOptions = signal(['Ground', 'Air', 'Sea']);
const selectedOption = linkedSignal(() => shippingOptions()[0]);

console.log(selectedOption()); // 'Ground'
selectedOption.set(shippingOptions()[2]);
console.log(selectedOption()); // 'Sea'

shippingOptions.set(['Email', 'Will Call', 'Postal service']);
console.log(selectedOption()); // 'Email'

```

---

## Tener en cuenta el estado previo

En algunos casos, el cálculo para un `linkedSignal` necesita tener en cuenta el valor previo de dicho `linkedSignal`.

En el ejemplo anterior, `selectedOption` siempre se restablece a la primera opción cuando cambia `shippingOptions`. Sin embargo, podrías querer conservar la selección del usuario si su opción seleccionada sigue estando en la lista. Para lograrlo, puedes crear un `linkedSignal` con una fuente (`source`) y un cálculo (`computation`) separados:

```tsx

interface ShippingMethod {
  id: number;
  name: string;
}

@Component({/* ... */})
export class ShippingMethodPicker {
  constructor() {
    this.changeShipping(2);
    this.changeShippingOptions();
    console.log(this.selectedOption()); // {"id":2,"name":"Postal Service"}
  }

  shippingOptions = signal<ShippingMethod[]>([
    { id: 0, name: 'Ground' },
    { id: 1, name: 'Air' },
    { id: 2, name: 'Sea' },
  ]);

  selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
    // `selectedOption` se establece al resultado de `computation` siempre que cambie `source`.
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // Si las nuevas opciones contienen la opción previamente seleccionada, se conserva.
      // De lo contrario, se usa por defecto la primera opción.
      return (
        newOptions.find((opt) => opt.id === previous?.value.id) ?? newOptions[0]
      );
    },
  });

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }

  changeShippingOptions() {
    this.shippingOptions.set([
      { id: 0, name: 'Email' },
      { id: 1, name: 'Sea' },
      { id: 2, name: 'Postal Service' },
    ]);
  }
}

```

Cuando creas un `linkedSignal`, puedes pasarle un objeto con propiedades separadas `source` y `computation` en lugar de solo una función de cálculo.

- `source` puede ser cualquier señal, como un `computed` o una entrada de componente (`@Input`).
- Cuando cambia el valor de `source`, `linkedSignal` actualiza su valor al resultado del cálculo proporcionado.

La propiedad `computation` es una función que recibe el nuevo valor de `source` y un objeto `previous`.

El objeto `previous` tiene dos propiedades:

- `previous.source`: el valor anterior de la fuente
- `previous.value`: el valor anterior del resultado de cálculo.

Puedes usar estos valores previos para decidir el nuevo resultado del cálculo.

> 💡 IMPORTANTE: Al usar el parámetro previous, es necesario proporcionar explícitamente los argumentos de tipo genérico en linkedSignal.
> 
> 
> El **primer tipo genérico** corresponde al tipo de `source` y el **segundo tipo** determina el tipo de salida del `computation`.
> 

---

## Comparación de igualdad personalizada

`linkedSignal`, al igual que cualquier otra señal, puede configurarse con una función de comparación personalizada (`equal`).

Esta función es usada por las dependencias para determinar si el valor del `linkedSignal` (resultado del cálculo) ha cambiado:

```tsx

const activeUser = signal({id: 123, name: 'Morgan', isAdmin: true});

const activeUserEditCopy = linkedSignal(() => activeUser(), {
  // Considera que el usuario es el mismo si tiene el mismo `id`.
  equal: (a, b) => a.id === b.id,
});

```

O, si separas `source` y `computation`:

```tsx

const activeUserEditCopy = linkedSignal({
  source: activeUser,
  computation: user => user,
  equal: (a, b) => a.id === b.id,
});

```