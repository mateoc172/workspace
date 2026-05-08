import Estudiante from "./Estudiante";

function Lista() {
  const estudiantes = [
    { nombre: "Carlos", edad: 21 },
    { nombre: "Ana", edad: 19 },
    { nombre: "Luis", edad: 23 },
  ];

  return (
    <div>
      {estudiantes.map((est, index) => (
        <Estudiante
          key={index}
          nombre={est.nombre}
          edad={est.edad}
        />
      ))}
    </div>
  );
}

export default Lista;