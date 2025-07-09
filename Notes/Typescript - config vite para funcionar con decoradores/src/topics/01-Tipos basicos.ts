/*TIPO INFERIDO
En typescript los tipos se pueden inferir automáticamente
Esto significa que TypeScript puede deducir el tipo de una variable basándose en su valor inicial o en su uso posterior.
Esto es útil para evitar la necesidad de declarar explícitamente el tipo
de una variable cuando es evidente a partir del contexto.
Por ejemplo, si asignas un número a una variable, TypeScript inferirá que esa variable
es de tipo `number`. Si luego intentas asignar un valor de tipo diferente, TypeScript
te mostrará un error de tipo.
Esto permite que el código sea más conciso y legible, al tiempo que se mantiene laseguridad de tipos.

*/
const name: string = "Tipo inferido";

/**
 * En typescrip el simbolo `|` se utiliza para crear un tipo de unión.
 * Esto significa que una variable puede ser de uno de varios tipos diferentes.
 * Por ejemplo, si tienes una variable que puede ser un número o una cadena,
 * puedes declararla como `number | string`. Esto permite que la variable
 * contenga un valor de tipo `number` o un valor de tipo `string`.
 * Es útil cuando una variable puede tener múltiples tipos de valores,
 * lo que proporciona flexibilidad en el código.
 */
let hpPoints: number | "FULL" = 95;
const isAlive: boolean = true;

hpPoints = "FULL";

console.log({
  name,
  hpPoints,
  isAlive,
});

// ✅ Tipo string: cadenas de texto
let userName: string = "Aristóteles";
let quote: string = `La virtud está en el término medio.`;

// ✅ Tipo number: enteros, decimales, hexadecimales, etc.
let userAge: number = 32;
let temperature: number = 36.5;
let hexValue: number = 0xff;

// ✅ Tipo boolean: verdadero o falso
let isLoggedIn: boolean = true;
let hasPermission: boolean = false;

// ✅ Tipo array: lista de elementos del mismo tipo
let scores: number[] = [85, 92, 76]; // Array de números
let names: string[] = ["Ana", "Luis", "Marta"]; // Array de strings

// ✅ Tipo tuple: array con un número fijo de elementos y tipos específicos
let personInfo: [string, number] = ["Carlos", 40];

// ✅ Tipo enum: conjunto de constantes con nombre
enum Color {
  Red,
  Green,
  Blue,
}
let favoriteColor: Color = Color.Green; // valor = 1

// ✅ Tipo any: acepta cualquier tipo (⚠️ se pierde la ayuda del compilador)
let randomData: any = 123;
randomData = "Ahora soy un string";
randomData = true;

// ✅ Tipo unknown: acepta cualquier tipo PERO no se puede usar sin verificar
let unknownValue: unknown = "Hola";

// unknownValue.toUpperCase(); // ❌ Error
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase()); // ✅ Seguro
}

// ✅ Tipo null y undefined
let nothingHere: null = null;
let notAssigned: undefined = undefined;

// ✅ Tipo void: función que no retorna nada
function logMessage(message: string): void {
  console.log("Log:", message);
}

// ✅ Tipo never: función que nunca termina (por ejemplo, lanza error)
function throwError(msg: string): never {
  throw new Error(msg);
}

// ✅ Tipo object: para cualquier objeto que no sea primitivo
let userObject: object = {
  id: 1,
  name: "Lucía",
};

// ✅ Union types: permite varios tipos posibles
let userId: string | number = 101;
userId = "ABC123";

// ✅ Literal types: valores fijos y concretos
let direction: "left" | "right" | "up" | "down" = "left";
export {};
