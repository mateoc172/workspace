const BASE_URL = "https://rickandmortyapi.com/api/character";

const headers = {
  "Content-Type": "application/json",
};

async function obtenerPersonaje(id) {
  try {
    const url = `${BASE_URL}/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Personaje por ID:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener el personaje:", error);
  }
}

async function obtenerPersonajes() {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Todos los personajes:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener los personajes:", error);
  }
}

async function soloNombres() {
  try {
    const data = await obtenerPersonajes();
    if (!data || !Array.isArray(data.results)) {
      console.warn("No se encontraron resultados para mostrar nombres.");
      return;
    }

    const nombres = data.results.map((personaje) => personaje.name);
    console.log("Nombres de personajes:", nombres);
    return nombres;
  } catch (error) {
    console.error("Error al obtener solo los nombres:", error);
  }
}

async function obtenerPagina(numeroPagina) {
  try {
    const url = `${BASE_URL}?page=${numeroPagina}`;
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Página ${numeroPagina} de personajes:`, data);
    return data;
  } catch (error) {
    console.error(`Error al obtener la página ${numeroPagina}:`, error);
  }
}

async function main() {
  console.log("Iniciando taller de Rick and Morty API...");
  await obtenerPersonaje(1);
  await obtenerPersonajes();
  await soloNombres();
  await obtenerPagina(2);
}

main();