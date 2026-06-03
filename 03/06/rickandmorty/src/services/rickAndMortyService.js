const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Obtiene la lista de todos los personajes (primera página)
 * @returns {Promise<Array>} Array de personajes
 */
export async function obtenerPersonajes() {
  const respuesta = await fetch(`${BASE_URL}/character`);
  if (!respuesta.ok) {
    throw new Error('Error al obtener los personajes');
  }
  const datos = await respuesta.json();
  return datos.results;
}

/**
 * Obtiene un personaje por su ID
 * @param {number} id - ID del personaje
 * @returns {Promise<Object>} Objeto con los datos del personaje
 */
export async function obtenerPersonaje(id) {
  const respuesta = await fetch(`${BASE_URL}/character/${id}`);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener el personaje con ID ${id}`);
  }
  return respuesta.json();
}
