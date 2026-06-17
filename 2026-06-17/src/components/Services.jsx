// ============================================================
//  🛠️ COMPONENTE PARA COMPLETAR — TAREA ESTUDIANTE
//  Services.jsx
//
//  INSTRUCCIONES:
//  1. Define el array "servicios" con al menos 6 servicios.
//     Cada objeto debe tener: icono, titulo, descripcion.
//  2. Completa el JSX usando tarjetas Bootstrap (card).
//  3. Usa .map() para renderizar — NO copies el HTML 6 veces.
//
//  PISTAS:
//  - Usa <div className="row g-4"> para el grid
//  - Cada tarjeta va en <div className="col-md-6 col-lg-4">;
//  - Clases Bootstrap útiles: card, card-body, card-title, card-text
// ============================================================

const servicios = [
  {
    icono: '⚡',
    titulo: 'Instalaciones residenciales',
    descripcion:
      'Diseñamos y ejecutamos instalaciones eléctricas seguras para casas, apartamentos y remodelaciones con cumplimiento RETIE.',
  },
  {
    icono: '🏢',
    titulo: 'Instalaciones comerciales',
    descripcion:
      'Suministramos soluciones eléctricas para negocios, oficinas, locales comerciales y centros de trabajo de cualquier tamaño.',
  },
  {
    icono: '🛠️',
    titulo: 'Mantenimiento preventivo',
    descripcion:
      'Realizamos revisiones periódicas, ajustes y pruebas para evitar fallas eléctricas y prolongar la vida útil de sus equipos.',
  },
  {
    icono: '🔌',
    titulo: 'Tableros eléctricos y breakers',
    descripcion:
      'Instalamos tableros nuevos, reemplazamos breakers e integramos protecciones que garantizan la seguridad de su instalación.',
  },
  {
    icono: '💡',
    titulo: 'Iluminación LED',
    descripcion:
      'Implementamos soluciones LED eficientes y ahorro energético para interiores, exteriores, fachadas y zonas comunes.',
  },
  {
    icono: '⚙️',
    titulo: 'Plantas eléctricas y UPS',
    descripcion:
      'Proveemos instalación y mantenimiento de plantas eléctricas y UPS para garantizar continuidad en su hogar o empresa.',
  },
];

function Services() {
  return (
    <section id="servicios" className="py-5 bg-light">
      <div className="container">

        <div className="text-center mb-5">
          <h2 className="section-titulo">Nuestros Servicios</h2>
          <p className="section-subtitulo text-muted">
            VoltTec ofrece soluciones eléctricas integrales para hogares y empresas, con enfoque en seguridad, eficiencia y calidad.
          </p>
        </div>

        <div className="row g-4">
          {servicios.map((servicio, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div style={{ fontSize: '2.5rem' }}>{servicio.icono}</div>
                  <h5 className="card-title fw-bold mt-2">{servicio.titulo}</h5>
                  <p className="card-text text-muted">{servicio.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Services;
