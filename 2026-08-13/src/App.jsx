import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [mostrarReloj, setMostrarReloj] = useState(true);
  const [usuarioId, setUsuarioId] = useState(1);

  return (
    <div className="app">
      <h1>useEffect y Ciclo de Vida</h1>

      <section>
        <h2>1. Reloj</h2>
        <button onClick={() => setMostrarReloj(!mostrarReloj)}>
          {mostrarReloj ? 'Ocultar reloj' : 'Mostrar reloj'}
        </button>
        {mostrarReloj && <Reloj />}
      </section>

      <section>
        <h2>2. Contador automático</h2>
        <ContadorAutomatico />
      </section>

      <section>
        <h2>3. Ancho de ventana</h2>
        <RastreadorVentana />
      </section>

      <section>
        <h2>4. Perfil de usuario</h2>
        <div className="botones-usuario">
          <button onClick={() => setUsuarioId(1)}>Usuario 1</button>
          <button onClick={() => setUsuarioId(2)}>Usuario 2</button>
        </div>
        <PerfilUsuario id={usuarioId} />
      </section>

      <section>
        <h2>5. Experimento: fases del ciclo de vida</h2>
        <ExperimentoFases />
      </section>
    </div>
  );
}

function Reloj() {
  const [segundos, setSegundos] = useState(0);

  // Este efecto inicia el intervalo al montar el componente. Como el reloj
  // es un recurso que vive fuera de React, necesitamos limpiarlo al salir.
  // Si no lo hacemos, el timer sigue corriendo aunque el componente ya no esté
  // visible, y eso es el clásico memory leak del ciclo de vida.
  useEffect(() => {
    console.log('⏰ Reloj montado');

    const id = setInterval(() => {
      setSegundos((s) => {
        const siguiente = s + 1;
        console.log('tick, segundos:', siguiente);
        return siguiente;
      });
    }, 1000);

    return () => {
      console.log('🧹 Limpiando intervalo del reloj');
      clearInterval(id);
    };
  }, []);

  return <p>Segundos: {segundos}</p>;
}

function ContadorAutomatico() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log('⏱️ Tick del contador');

      // La forma funcional de setState evita el stale closure: React nos da el
      // valor actual del estado y no dependemos de la copia vieja que quedó
      // capturada cuando se creó el efecto.
      setContador((valorActual) => {
        console.log('valor real del estado antes de incrementar:', valorActual);
        return valorActual + 1;
      });
    }, 1000);

    return () => {
      console.log('🧹 Cancelando contador automático');
      clearInterval(id);
    };
  }, []);

  return <p>Contador: {contador}</p>;
}

function RastreadorVentana() {
  const [ancho, setAncho] = useState(window.innerWidth);

  // La idea aquí es escuchar resize una sola vez en montaje. Si dependemos de
  // 'ancho', el efecto se vuelve a correr cada vez que cambia el tamaño y se
  // acumulan listeners. El cleanup hace que React quite el antiguo antes de
  // registrar el nuevo.
  useEffect(() => {
    function manejarResize() {
      console.log('Resize detectado, ancho:', window.innerWidth);
      setAncho(window.innerWidth);
    }

    window.addEventListener('resize', manejarResize);

    return () => {
      console.log('🧹 Quitando listener del resize');
      window.removeEventListener('resize', manejarResize);
    };
  }, []);

  return <p>Ancho actual: {ancho}px</p>;
}

function PerfilUsuario({ id }) {
  const [nombre, setNombre] = useState('');

  // El efecto debe volver a ejecutarse cuando cambia la prop 'id'. Si no la
  // incluimos en el arreglo, el nombre se queda con el valor anterior aunque
  // el usuario haya cambiado.
  useEffect(() => {
    console.log('Buscando datos del usuario', id);
    const nombres = { 1: 'Ana', 2: 'Luis' };
    setNombre(nombres[id]);
  }, [id]);

  return <p>Nombre: {nombre}</p>;
}

function ExperimentoFases() {
  const [clics, setClics] = useState(0);
  const esPrimeraVez = useRef(true);

  // Este componente es el laboratorio para observar el ciclo de vida en vivo.
  // Si cambia la dependencia, cambia el momento en que React ejecuta el efecto.
  useEffect(() => {
    if (esPrimeraVez.current) {
      console.log('🟢 MONTADO');
      esPrimeraVez.current = false;
    } else {
      console.log('🔵 ACTUALIZADO, clics:', clics);
    }

    return () => {
      console.log('🔴 LIMPIEZA (antes del próximo efecto, o al desmontar)');
    };
  }, [clics]);

  return (
    <div>
      <p>Clics: {clics}</p>
      <button onClick={() => setClics(clics + 1)}>Clickeame</button>
    </div>
  );
}

export default App;
