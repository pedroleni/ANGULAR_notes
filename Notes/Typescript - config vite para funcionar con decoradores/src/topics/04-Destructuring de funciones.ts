// Definimos una interfaz que describe un artículo de tienda
export interface Item {
  name: string;
  cost: number;
}

// Creamos un par de artículos
const keyboard: Item = {
  name: "Mechanical Keyboard",
  cost: 120.0,
};

const monitor: Item = {
  name: "4K Monitor",
  cost: 300.0,
};

// Esta interfaz define las opciones que se pasan a la función de cálculo de impuestos
interface InvoiceOptions {
  vatRate: number; // Porcentaje de IVA (ej: 0.21 para 21%)
  items: Item[];
}

// Función que calcula el total sin IVA y el total del IVA
export function calculateInvoice(options: InvoiceOptions): [number, number] {
  // Desestructuramos el objeto de opciones para extraer vatRate e items
  const { vatRate, items } = options;

  let subtotal = 0;

  // Recorremos cada item y acumulamos el costo
  items.forEach(({ cost }) => {
    subtotal += cost; // Desestructuramos directamente el 'cost' desde cada item
  });

  // Retornamos una tupla: [subtotal, total IVA]
  return [subtotal, subtotal * vatRate];
}

// Creamos el "carrito" con los artículos
const cart = [keyboard, monitor];

// Definimos el porcentaje de IVA que vamos a aplicar
const vatRate = 0.21; // 21%

// Llamamos a la función y desestructuramos el resultado
const [subtotal, vatTotal] = calculateInvoice({
  items: cart,
  vatRate: vatRate,
});

// Mostramos los resultados
console.log("Subtotal:", subtotal); // → Subtotal: 420
console.log("IVA:", vatTotal); // → IVA: 88.2
