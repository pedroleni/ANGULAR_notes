// 🧾 Definimos una interfaz para un viajero
export interface Traveler {
  fullName: string;
  companions?: string[]; // Es opcional: puede estar o no
}

// 🎟️ Creamos un viajero sin compañeros
const traveler1: Traveler = {
  fullName: "Laura",
};

// 🎟️ Creamos un viajero con dos acompañantes
const traveler2: Traveler = {
  fullName: "Diego",
  companions: ["Sofía", "Mateo"],
};

// ✈️ Función que devuelve el número de acompañantes de un viajero
const countCompanions = (traveler: Traveler): number => {
  // Usamos optional chaining (?.) para evitar errores si companions no existe
  const total = traveler.companions?.length || 0;

  // Mostramos el nombre y cuántos acompañantes tiene
  console.log(`${traveler.fullName} tiene ${total} acompañante(s)`);

  return total;
};

// 🧪 Ejecutamos la función con el primer viajero (que no tiene acompañantes)
countCompanions(traveler1); // Laura tiene 0 acompañante(s)
