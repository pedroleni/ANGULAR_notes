/**
Las funciones en TypeScript son similares a las de JavaScript,
pero con la adición de tipos de datos para los parámetros y el valor de retorno.
Esto permite una mayor seguridad de tipos y ayuda a prevenir errores en tiempo de ejecución.
Las funciones pueden ser declaradas de manera tradicional o utilizando funciones flecha (arrow functions).
Además, TypeScript permite la sobrecarga de funciones, lo que significa que puedes definir múltiples
firmas para una función con diferentes tipos de parámetros y valores de retorno.    
 */
function addNumbers(a: number, b: number): number {
  return a + b;
}

const addNumbersArrow = (a: number, b: number): string => {
  return `${a + b}`;
};

/**
 *
 * Cuando en los parametros de una función se utiliza un signo de interrogación `?`
 * significa que ese parámetro es opcional.
 * Si no se proporciona un valor para ese parámetro al llamar a la función,
 * TypeScript asumirá que es `undefined`.
 * Cuando damos un valor por defecto a un parámetro,
 * significa que si no se proporciona un valor al llamar a la función,
 * se utilizará el valor por defecto especificado.
 * En el siguiente ejemplo, el parámetro `secondNumber` es opcional,
 * y si no se proporciona, su valor será `undefined`.
 * El parámetro `base` tiene un valor por defecto de `2`, lo que significa
 * que si no se proporciona un valor para `base`, se utilizará `2` como
 * valor predeterminado.
 */
function multiply(
  firstNumber: number,
  secondNumber?: number,
  base: number = 2
) {
  return firstNumber * base;
}

interface Character {
  name: string;
  hp: number;
  showHp: () => void;
}

const healCharacter = (character: Character, amount: number) => {
  character.hp += amount;
};

const strider: Character = {
  name: "Strider",
  hp: 50,
  showHp() {
    console.log(`Puntos de vida ${this.hp}`);
  },
};

healCharacter(strider, 10);
healCharacter(strider, 50);

strider.showHp();

export {};
