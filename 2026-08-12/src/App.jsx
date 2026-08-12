import { useState, useEffect } from 'react';
import './App.css';

// Datos iniciales de tareas.
// 👀 Miren con atención: una de estas tareas es distinta a las demás...
const tareasIniciales = [
  { id: 1, texto: 'Aprender React', categoria: 'estudio', completada: false },
  { id: 2, texto: 'Hacer ejercicio', categoria: 'salud', completada: true },
  { id: 3, texto: 'Leer un libro', categoria: 'ocio', completada: false },
  { id: 4, texto: 'Practicar debugging', completada: false },
];

function App() {
  const [tareas, setTareas] = useState(tareasIniciales);
  const [filtro, setFiltro] = useState('todas');
  const [contador, setContador] = useState(0);

  // 🐛 BUG 2 — useEffect SIN arreglo de dependencias.
  // Este efecto se ejecuta después de CADA render, y como adentro
  // llamamos a setContador, provocamos otro render... y otro... y otro.
  // Pista: abran la consola y cuenten cuántas veces se imprime esto.
  useEffect(() => {
    console.log('Renderizando App, contador:', contador);
    setContador(contador + 1);
  });

  // Filtra las tareas según el botón elegido
  const tareasFiltradas = tareas.filter((tarea) => {
    if (filtro === 'todas') return true;
    // 🐛 BUG 3 — 'completada' es un booleano (true/false),
    // pero acá se compara contra el STRING "true"/"false".
    // Agreguen un console.log(typeof tarea.completada, tarea.completada)
    // para ver qué tipo de dato es en realidad.
    if (filtro === 'completadas') return tarea.completada === 'true';
    if (filtro === 'pendientes') return tarea.completada === 'false';
    return true;
  });

  // Agrega una tarea nueva a la lista
  function agregarTarea(texto) {
    if (!texto.trim()) return;
    // 🐛 BUG 4 — Se está MUTANDO el arreglo original con push()
    // en vez de crear uno nuevo. React compara referencias, así que
    // no detecta el cambio y la lista no se actualiza en pantalla.
    // Prueben: console.log('tareas antes:', tareas.length) aquí arriba
    // y otra vez después del push, van a ver que sí cambia el arreglo...
    // pero la interfaz no se entera.
    tareas.push({ id: Date.now(), texto, categoria: 'general', completada: false });
    setTareas(tareas);
  }

  // Marca una tarea como completada
  function completarTarea(id) {
    const nuevasTareas = tareas.map((tarea) =>
      tarea.id === id ? { ...tarea, completada: true } : tarea
    );
    setTareas(nuevasTareas);
  }

  return (
    <div className="app">
      <h1>Mis Tareas</h1>

      <div className="filtros">
        <button onClick={() => setFiltro('todas')}>Todas</button>
        <button onClick={() => setFiltro('pendientes')}>Pendientes</button>
        <button onClick={() => setFiltro('completadas')}>Completadas</button>
      </div>

      <ul className="lista-tareas">
        {tareasFiltradas.map((tarea) => (
          <li key={tarea.id} className={tarea.completada ? 'completada' : ''}>
            <span>{tarea.texto}</span>
            {/* 🐛 BUG 1 — La tarea con id 4 no tiene la propiedad 'categoria',
                así que tarea.categoria es undefined, y undefined.toUpperCase()
                no existe: la app se rompe apenas carga.
                Este es el primer error que van a ver: la pantalla se pone
                en blanco (o roja) con un mensaje de error. Léanlo con calma. */}
            <span className="categoria">{tarea.categoria.toUpperCase()}</span>
            <button onClick={() => completarTarea(tarea.id)}>✔</button>
          </li>
        ))}
      </ul>

      <AgregarTarea onAgregar={agregarTarea} />
      <PerfilUsuario />
    </div>
  );
}

function AgregarTarea({ onAgregar }) {
  const [texto, setTexto] = useState('');

  function manejarEnvio(e) {
    e.preventDefault();
    onAgregar(texto);
    setTexto('');
  }

  return (
    <form onSubmit={manejarEnvio} className="form-agregar">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    obtenerUsuario();
  }, []);

  // Simula una llamada a una API que a veces falla (como pasa en la vida real)
  function obtenerUsuario() {
    const exito = Math.random() > 0.5;

    setTimeout(() => {
      if (exito) {
        setUsuario({ nombre: 'Estudiante React' });
      } else {
        // 🐛 BUG 5 — Se lanza un error pero nadie lo atrapa (no hay try/catch)
        // y nadie usa console.error para avisar. El resultado: la pantalla
        // se queda en "Cargando perfil..." para siempre y el único rastro
        // del problema es un error en rojo en la consola que nadie mira.
        throw new Error('No se pudo cargar el usuario');
      }
    }, 1000);
  }

  if (!usuario) return <p className="perfil">Cargando perfil...</p>;

  return <p className="perfil">Perfil: {usuario.nombre}</p>;
}

export default App;
