function ListaPersonajes({ personajes, onSeleccionar, personajeSeleccionadoId }) {
  return (
    <div className="list-group">
      {personajes.map((personaje) => (
        <button
          key={personaje.id}
          type="button"
          className={`list-group-item list-group-item-action d-flex align-items-center gap-3 ${
            personaje.id === personajeSeleccionadoId ? 'active' : ''
          }`}
          onClick={() => onSeleccionar(personaje.id)}
        >
          <img
            src={personaje.image}
            alt={personaje.name}
            width="48"
            height="48"
            className="rounded-circle"
          />
          <div className="text-start">
            <div className="fw-bold">{personaje.name}</div>
            <small className={personaje.id === personajeSeleccionadoId ? 'text-white-50' : 'text-muted'}>
              {personaje.species} — {personaje.status}
            </small>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ListaPersonajes;
