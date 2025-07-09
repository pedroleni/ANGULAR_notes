//--------------------------HERENCIA Y COMPOSICIÓN EN TYPESCRIPT--------------------------
// En TypeScript, la herencia y la composición son dos enfoques diferentes para reutilizar
/**
 * la herencia es una técnica de programación orientada a objetos que permite
 * crear una nueva clase (subclase) a partir de una clase existente (superclase).
 * La subclase hereda las propiedades y métodos de la superclase, lo que permite
 * reutilizar código y extender la funcionalidad de la clase base.
 * En TypeScript, la herencia se implementa utilizando la palabra clave `extends`.
 * Esto permite que una clase derive de otra, obteniendo todas sus propiedades y métodos.
 * La subclase puede agregar nuevas propiedades y métodos, o sobrescribir los existentes
 * de la superclase para personalizar su comportamiento.
 */

// Clase base: representa una persona genérica
export class User {
  constructor(
    public givenName: string,
    public surname: string,
    private location: string = "Unknown"
  ) {}

  // Método público para acceder a la dirección privada
  public getAddress(): string {
    return this.location;
  }
}

// Clase que hereda de User y representa a un personaje con identidad secreta
export class Character extends User {
  // Constructor con propiedades adicionales propias del personaje
  constructor(
    public nickname: string,
    public yearsOld: number,
    givenName: string, // se pasa al constructor padre (User)
    surname: string,
    location: string
  ) {
    // Llamamos al constructor de la clase padre con super()
    super(givenName, surname, location);
  }
}

// Creamos una instancia de Character
const nightOwl = new Character("NightOwl", 33, "Lucas", "Reed", "Berlin");

// Mostramos el personaje completo
console.log(nightOwl);

// También podemos acceder a los métodos heredados
console.log("Dirección secreta:", nightOwl.getAddress());

//--------------------PRIORIZAR LA COMPOSICIÓN SOBRE LA HERENCIA------------------------------
// En lugar de heredar de User, podemos crear una clase que use User como propiedad

/**
 * la composición es una técnica de diseño de software que consiste en construir clases o componentes a partir de otros componentes más pequeños y especializados.
 * En lugar de heredar de una clase base, se crean instancias de otras clases dentro
 * de la clase actual, lo que permite reutilizar código y crear relaciones más flexibles entre
 * las clases.
 * La composición promueve la reutilización de código y la flexibilidad, ya que permite combinar
 * diferentes componentes de manera más dinámica y modular.
 * Esto es especialmente útil cuando se necesita agregar o cambiar funcionalidades sin modificar
 * la jerarquía de clases existente.
 * Por ejemplo, si tenemos una clase `Logger` que maneja el registro de mensajes,
 * en lugar de hacer que una clase `User` herede de `Logger`, podemos hacer que `User` tenga una instancia de `Logger` como propiedad.
 * Esto permite que `User` use las funcionalidades de `Logger` sin necesidad de heredar de ella,
 * lo que resulta en un diseño más flexible y menos acoplado.
 * La composición también facilita la creación de clases más pequeñas y especializadas,
 * lo que mejora la legibilidad y el mantenimiento del código.
 */

class Logger {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}

// En vez de que User herede de Logger, lo compone
class Users {
  constructor(public name: string, private logger: Logger) {}

  login() {
    this.logger.log(`${this.name} ha iniciado sesión.`);
  }
}

const logger = new Logger();
const user = new Users("Ada Lovelace", logger);

user.login(); // [LOG]: Ada Lovelace ha iniciado sesión.

export {};
