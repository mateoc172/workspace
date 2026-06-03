function DetallePersonaje({ personaje, cargando }) {
  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!personaje) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
        <span className="fs-1">👈</span>
        <p className="mt-3">Selecciona un personaje de la lista para ver su detalle</p>
      </div>
    );
  }

  const badgeColor = {
    Alive: 'success',
    Dead: 'danger',
    unknown: 'secondary',
  };

  return (
    <div className="card h-100 border-0 shadow-sm">
      <img
        src={personaje.image}
        className="card-img-top"
        alt={personaje.name}
        style={{ objectFit: 'cover', maxHeight: '320px' }}
      />
      <div className="card-body">
        <h3 className="card-title fw-bold">{personaje.name}</h3>
        <span className={`badge bg-${badgeColor[personaje.status] || 'secondary'} mb-3`}>
          {personaje.status}
        </span>

        <table className="table table-borderless table-sm">
          <tbody>
            <tr>
              <th scope="row" className="text-muted">Especie</th>
              <td>{personaje.species}</td>
            </tr>
            <tr>
              <th scope="row" className="text-muted">Género</th>
              <td>{personaje.gender}</td>
            </tr>
            <tr>
              <th scope="row" className="text-muted">Origen</th>
              <td>{personaje.origin?.name}</td>
            </tr>
            <tr>
              <th scope="row" className="text-muted">Ubicación actual</th>
              <td>{personaje.location?.name}</td>
            </tr>
            <tr>
              <th scope="row" className="text-muted">Episodios</th>
              <td>{personaje.episode?.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetallePersonaje;
