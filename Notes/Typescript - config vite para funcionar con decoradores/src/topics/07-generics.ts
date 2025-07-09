export function whatsMyType<T>(argument: T): T {
  return argument;
}

const amIString = whatsMyType<string>("Hola Mundo");
const amINumber = whatsMyType<number>(100);
const amIArray = whatsMyType<number[]>([1, 2, 3, 4, 5]);

console.log(amIString.split(" "));
console.log(amINumber.toFixed());
console.log(amIArray.join("-"));

//------------------- FUNCIONES GENERICAS -------------------
// Las funciones genéricas permiten definir funciones que pueden trabajar con diferentes tipos de datos sin perder la
// información de tipo. Esto se logra utilizando un parámetro de tipo genérico, que se define con la sintaxis `<T>`
// donde `T` es un marcador de posición para el tipo que se pasará a la función.
// Al llamar a la función, TypeScript inferirá el tipo de `T` basado en el argumento proporcionado, o se puede especificar explícitamente.

// La función 'identity' acepta un valor de tipo T y retorna el mismo valor
function identity<T>(value: T): T {
  return value;
}

// Llamamos la función con un string
const result1 = identity<string>("Hola mundo"); // T se convierte en string

// Llamamos la función con un número
const result2 = identity<number>(123); // T se convierte en number

console.log(result1); // 'Hola mundo'
console.log(result2); // 123

//------------------- FUNCIONES GENERICAS CON ARREGLOS -------------------

// La función recibe un array de cualquier tipo T y devuelve su primer elemento
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const firstNumber = getFirstElement<number>([10, 20, 30]); // Devuelve 10
const firstString = getFirstElement<string>(["Sol", "Luna"]); // Devuelve 'Sol'

console.log(firstNumber); // 10
console.log(firstString); // 'Sol'

//-------------------FUNCIONES CON VARIOS TIPOS GENERICOS -------------------
// La función mezcla dos objetos genéricos T y U, y devuelve un nuevo objeto con las propiedades de ambos
function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const user = mergeObjects({ name: "Juan" }, { age: 30, isAdmin: true });

console.log(user);
// Resultado: { name: 'Juan', age: 30, isAdmin: true }
// user tiene las propiedades de ambos objetos

//------------------GENERICOS CON RESTRICCIONES EXTENDS-------------------
/**A veces queremos restringir el tipo genérico a un conjunto específico de tipos o propiedades.
Esto se hace utilizando la palabra clave `extends` para definir una restricción en el tipo
genérico. Por ejemplo, si queremos que un tipo genérico T tenga una propiedad específica */

// Solo acepta elementos que tengan una propiedad 'length'
function logLength<T extends { length: number }>(item: T): void {
  console.log("Longitud:", item.length);
}

logLength("Texto"); // Longitud: 5 (string tiene length)
logLength([1, 2, 3]); // Longitud: 3 (array también)
logLength({ length: 10 }); // Longitud: 10 (objeto válido)

// logLength(42); ❌ Error: number no tiene 'length'

//------------------GENERICOS EN LA CLASE-------------------
// Clase genérica Box que almacena un valor de cualquier tipo T
class Box<T> {
  content: T;

  constructor(value: T) {
    this.content = value;
  }

  getContent(): T {
    return this.content;
  }
}

const numberBox = new Box<number>(99);
const stringBox = new Box<string>("Hola");

console.log(numberBox.getContent()); // 99
console.log(stringBox.getContent()); // 'Hola'

//------------------GENERICOS CON PROMESAS-------------------
// Esta función simula una llamada que devuelve una promesa con tipo T
function fetchData<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
}

fetchData<string>("Datos cargados").then((res) => {
  console.log(res); // 'Datos cargados'
});

fetchData<number>(2025).then((res) => {
  console.log(res); // 2025
});

//------------------GENERICOS CON INTERFACES-------------------

// Interfaz genérica para una respuesta de API
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Función que crea una respuesta usando el tipo pasado
function createResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

const response1 = createResponse<string>("Todo bien");
const response2 = createResponse<{ id: number; name: string }>({
  id: 1,
  name: "Alice",
});

console.log(response1); // { success: true, data: 'Todo bien' }
console.log(response2); // { success: true, data: { id: 1, name: 'Alice' } }
