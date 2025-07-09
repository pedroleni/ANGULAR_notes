// Definimos una interfaz para los datos del libro
interface BookDetails {
  writer: string;
  publishedYear: number;
}

// Definimos una interfaz para el lector de libros
interface BookReader {
  currentPage: number;
  totalPages: number;
  title: string;
  details: BookDetails;
}

// Creamos un objeto que sigue la estructura de BookReader
const bookReader: BookReader = {
  currentPage: 120,
  totalPages: 350,
  title: "The Infinite Mind",
  details: {
    writer: "Samantha Hill",
    publishedYear: 2021,
  },
};

// Variable independiente que no tiene que ver con el objeto
const title = "Another Book";

// Desestructuramos el objeto bookReader
const {
  title: currentTitle, // Renombramos 'title' del objeto como 'currentTitle' para no pisar la variable 'title'
  totalPages: pages, // Renombramos 'totalPages' como 'pages'
  details, // Extraemos el objeto anidado 'details'
} = bookReader;

// Desestructuramos 'writer' desde el objeto 'details'
const { writer } = details;

// Un arreglo con nombres de lenguajes de programación
const languages: string[] = ["TypeScript", "JavaScript", "Python", "Rust"];

// Desestructuramos los primeros dos elementos del arreglo
const [primary, secondary, ...others] = languages;

console.log("Lenguaje principal:", primary); // TypeScript
console.log("Lenguaje secundario:", secondary); // JavaScript
console.log("Otros lenguajes:", others); // ['Python', 'Rust']

/**
 * Desestructuración de un arreglo con valores por defecto
 * Si el arreglo no tiene suficientes elementos, se asigna un valor por defecto.
 */
const [, , trunks = "Not found"]: string[] = ["Goku", "Vegeta"];

console.error("Personaje 3:", trunks);

export {};
