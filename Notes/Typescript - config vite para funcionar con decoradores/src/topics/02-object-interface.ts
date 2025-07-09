/**
 * Si quiero un arreglo de strings, puedo declararlo de la siguiente manera:
 */
const flores: string[] = ["Margarita", "Ruby", "Rosa"];

/**
 * Las interfaces en typescript son una forma de definir la estructura de un objeto.
 * Permiten especificar qué propiedades y métodos debe tener un objeto,
 * así como sus tipos de datos.
 * Las interfaces son útiles para garantizar que los objetos cumplan con un contrato específico,
 * lo que ayuda a mantener la consistencia y la seguridad de tipos en el código.
 */
interface Personaje {
  nombre: string;
  vida: number;
  skills: string[];
  pueblo?: string;
}

/**
 * Con la ? en typescript, se indica que una propiedad es opcional.
 * Esto significa que esa propiedad puede estar presente o no en un objeto.
 * Si una propiedad es opcional, no es necesario proporcionarla al crear un objeto que implemente la interfaz.
 * Esto es útil cuando se desea permitir cierta flexibilidad en la estructura de los objetos,
 * ya que no todos los objetos necesitan tener todas las propiedades definidas en la interfaz.
 * Por ejemplo, si tienes una propiedad que solo es relevante en ciertos casos,
 * puedes marcarla como opcional para que no sea obligatoria en todos los objetos.
 * En el ejemplo, la propiedad `pueblo` es opcional, lo que significa que
 * un objeto que implemente la interfaz `Personaje` puede o no tener esa propiedad.
 * Si un objeto no tiene la propiedad `pueblo`, TypeScript no mostrará un error
 * al momento de compilar, ya que es una propiedad opcional.
 * Si un objeto tiene la propiedad `pueblo`, debe ser de tipo `string`.
 * Si no se proporciona, TypeScript asumirá que esa propiedad no está presente.
 * Esto permite una mayor flexibilidad al trabajar con objetos que implementan la interfaz.
 */

const strider: Personaje = {
  nombre: "Strider",
  vida: 100,
  skills: ["Bash", "Counter"],
};

strider.pueblo = "Rivendell";

console.table(strider);

export {};
