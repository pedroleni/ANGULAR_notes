function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "New Property";
    hello = "override";
  };
}

@classDecorator
export class SuperClass {
  public myProperty: string = "Abc123";

  print() {
    console.log("Hola Mundo");
  }
}

console.log(SuperClass);

const myClass = new SuperClass();
console.log(myClass);

//--------- DECORADOR DE CLASE -------------------

// Un decorador de clase es una función que recibe el constructor como argumento
function Logger(constructor: Function) {
  console.log("Decorador de clase ejecutado");
  console.log(constructor.name); // Muestra el nombre de la clase
}

// Aplicamos el decorador a la clase con @
@Logger
class Person {
  constructor(public name: string) {}
}

// Al declarar esta clase, el decorador se ejecuta automáticamente
const user = new Person("Aristóteles");

// -------DECORADOR DE PROPIEDAD -------------------

function ToUpperCase(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const privateKey = Symbol();

    Object.defineProperty(target, propertyKey, {
      get() {
        return this[privateKey];
      },
      set(value: string) {
        if (typeof value === "string") {
          this[privateKey] = value.toUpperCase();
        } else {
          this[privateKey] = value;
        }
      },
      enumerable: true,
      configurable: true,
    });
  };
}

class User {
  @ToUpperCase()
  name: string = "";

  constructor(name: string) {
    this.name = name;
  }
}

const userTwo = new User("aristóteles");
console.log(userTwo.name); // ARISTÓTELES
