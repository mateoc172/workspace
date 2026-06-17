// ============================================================
//  🛠️ COMPONENTE PARA COMPLETAR — TAREA ESTUDIANTE
//  WhyUs.jsx  (¿Por qué elegirnos?)
//
//  INSTRUCCIONES:
//  1. Define el array "razones" con al menos 4 objetos.
//     Cada objeto debe tener: icono, titulo, descripcion.
//  2. Agrega una imagen en la columna izquierda.
//  3. Escribe 2 párrafos sobre la empresa.
//  4. Usa .map() para renderizar la lista de razones.
//
//  PISTAS:
//  - <div className="row align-items-center"> para las columnas
//  - className="list-unstyled" en <ul> quita los bullets
//  - Placeholder: https://placehold.co/500x400/1a1e2e/f5c518?text=VoltTec
// ============================================================

const razones = [
  {
    icono: '🏆',
    titulo: 'Técnicos certificados',
    descripcion:
      'Nuestro equipo cuenta con certificación RETIE y experiencia en proyectos residenciales y comerciales.',
  },
  {
    icono: '⏱️',
    titulo: 'Respuesta rápida',
    descripcion:
      'Atendemos emergencias y solicitudes con respuesta en menos de 24 horas en el Área Metropolitana.',
  },
  {
    icono: '🔧',
    titulo: 'Garantía de calidad',
    descripcion:
      'Ofrecemos garantía de 1 año en mano de obra y usamos materiales de primera para cada instalación.',
  },
  {
    icono: '💡',
    titulo: 'Presupuestos sin costo',
    descripcion:
      'Recibirá un presupuesto claro y personalizado sin costo adicional, con opciones adaptadas a su proyecto.',
  },
];

function WhyUs() {
  return (
    <section id="nosotros" className="py-5">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* Columna izquierda: imagen */}
          <div className="col-lg-5">
            <img
              src="https://placehold.co/500x400/1a1e2e/f5c518?text=VoltTec"
              alt="Técnicos de VoltTec trabajando"
              className="img-fluid rounded shadow"
            />
          </div>

          {/* Columna derecha: texto y razones */}
          <div className="col-lg-7">
            <h2 className="section-titulo mb-3">¿Por qué elegirnos?</h2>

            <p className="text-muted mb-4">
              VoltTec lleva más de 15 años prestando servicios eléctricos en Medellín y su Área Metropolitana.
              Atendemos hogares, oficinas y comercios con proyectos personalizados y un fuerte compromiso con la seguridad.
            </p>
            <p className="text-muted mb-4">
              Nuestra experiencia técnica y atención cercana permiten solucionar desde reparaciones rápidas hasta instalaciones completas.
              Construimos confianza con seguimiento proactivo y soluciones eléctricas eficientes.
            </p>

            <ul className="list-unstyled">
              {razones.map((razon, index) => (
                <li key={index} className="d-flex gap-3 mb-3">
                  <span style={{ fontSize: '1.5rem' }}>{razon.icono}</span>
                  <div>
                    <strong>{razon.titulo}</strong>
                    <p className="text-muted mb-0 small">{razon.descripcion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhyUs;
