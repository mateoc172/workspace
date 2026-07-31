import { useEffect, useState } from 'react'
import './App.css'

const initialForm = {
  nombre: '',
  email: '',
  password: '',
  edad: '',
  nacimiento: '',
  experiencia: 5,
  aceptarTerminos: false,
  idiomas: [],
  modalidad: 'presencial',
  pais: '',
  comentarios: '',
  colorFavorito: '#000000',
}

const idiomasOpciones = ['JavaScript', 'Python', 'Java', 'C#', 'Go']
const paisesOpciones = ['Argentina', 'Brasil', 'Chile', 'México', 'España']
const emailRegex = /^\S+@\S+\.\S+$/

function App() {
  const [form, setForm] = useState(initialForm)
  const [foto, setFoto] = useState(null)
  const [fotoPreview, setFotoPreview] = useState('')
  const [submittedData, setSubmittedData] = useState(null)

  const isEmailValido = emailRegex.test(form.email)
  const isEdadValida = Number(form.edad) > 0
  const puedeEnviar = form.aceptarTerminos && isEmailValido && isEdadValida

  useEffect(() => {
    if (!foto) {
      setFotoPreview('')
      return
    }

    const url = URL.createObjectURL(foto)
    setFotoPreview(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [foto])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    if (name === 'aceptarTerminos') {
      setForm((prev) => ({ ...prev, aceptarTerminos: checked }))
      return
    }

    if (name === 'idiomas') {
      const idioma = value
      setForm((prev) => {
        const nuevosIdiomas = prev.idiomas.includes(idioma)
          ? prev.idiomas.filter((item) => item !== idioma)
          : [...prev.idiomas, idioma]
        return { ...prev, idiomas: nuevosIdiomas }
      })
      return
    }

    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
  }

  const handleFotoChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setFoto(file)
    } else {
      setFoto(null)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!puedeEnviar) return

    setSubmittedData({
      ...form,
      foto: foto ? foto.name : 'No se subió imagen',
    })
  }

  return (
    <main className="app-shell">
      <h1>Registro de estudiante</h1>
      <form className="registro-form" onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend>Datos personales</legend>

          <label>
            Nombre
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Correo
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {!isEmailValido && form.email && (
              <span className="error">Ingresa un correo válido.</span>
            )}
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Edad
            <input
              type="number"
              name="edad"
              min="1"
              value={form.edad}
              onChange={handleChange}
              required
            />
            {!isEdadValida && form.edad !== '' && (
              <span className="error">La edad debe ser mayor a 0.</span>
            )}
          </label>

          <label>
            Fecha de nacimiento
            <input
              type="date"
              name="nacimiento"
              value={form.nacimiento}
              onChange={handleChange}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Preferencias</legend>

          <label className="range-field">
            Nivel de experiencia: <strong>{form.experiencia}</strong>
            <input
              type="range"
              name="experiencia"
              min="1"
              max="10"
              value={form.experiencia}
              onChange={handleChange}
            />
          </label>

          <label className="checkbox-field">
            <input
              type="checkbox"
              name="aceptarTerminos"
              checked={form.aceptarTerminos}
              onChange={handleChange}
            />
            Acepto los términos y condiciones
          </label>

          <div className="checkbox-group">
            <p>Lenguajes que conoces</p>
            {idiomasOpciones.map((idioma) => (
              <label key={idioma}>
                <input
                  type="checkbox"
                  name="idiomas"
                  value={idioma}
                  checked={form.idiomas.includes(idioma)}
                  onChange={handleChange}
                />
                {idioma}
              </label>
            ))}
          </div>

          <div className="radio-group">
            <p>Modalidad</p>
            <label>
              <input
                type="radio"
                name="modalidad"
                value="presencial"
                checked={form.modalidad === 'presencial'}
                onChange={handleChange}
              />
              Presencial
            </label>
            <label>
              <input
                type="radio"
                name="modalidad"
                value="virtual"
                checked={form.modalidad === 'virtual'}
                onChange={handleChange}
              />
              Virtual
            </label>
          </div>

          <label>
            País
            <select name="pais" value={form.pais} onChange={handleChange} required>
              <option value="">Selecciona un país</option>
              {paisesOpciones.map((pais) => (
                <option key={pais} value={pais}>
                  {pais}
                </option>
              ))}
            </select>
          </label>

          <label>
            Comentarios
            <textarea
              name="comentarios"
              value={form.comentarios}
              onChange={handleChange}
              rows="4"
            />
          </label>

          <label>
            Foto de perfil
            <input type="file" accept="image/*" onChange={handleFotoChange} />
          </label>
          {fotoPreview && (
            <div className="photo-preview">
              <img src={fotoPreview} alt="Vista previa" />
            </div>
          )}

          <label>
            Color favorito
            <input
              type="color"
              name="colorFavorito"
              value={form.colorFavorito}
              onChange={handleChange}
            />
          </label>
        </fieldset>

        <button type="submit" disabled={!puedeEnviar}>
          Enviar registro
        </button>
      </form>

      {submittedData && (
        <section className="summary">
          <h2>Resumen del registro</h2>
          <p>
            <strong>Nombre:</strong> {submittedData.nombre}
          </p>
          <p>
            <strong>Correo:</strong> {submittedData.email}
          </p>
          <p>
            <strong>Edad:</strong> {submittedData.edad}
          </p>
          <p>
            <strong>Fecha de nacimiento:</strong> {submittedData.nacimiento}
          </p>
          <p>
            <strong>Experiencia:</strong> {submittedData.experiencia}
          </p>
          <p>
            <strong>Modalidad:</strong> {submittedData.modalidad}
          </p>
          <p>
            <strong>País:</strong> {submittedData.pais}
          </p>
          <p>
            <strong>Comentarios:</strong> {submittedData.comentarios || 'Ninguno'}
          </p>
          <p>
            <strong>Lenguajes:</strong>{' '}
            {submittedData.idiomas.length > 0
              ? submittedData.idiomas.join(', ')
              : 'No seleccionados'}
          </p>
          <p>
            <strong>Foto:</strong> {submittedData.foto}
          </p>
          <p>
            <strong>Color favorito:</strong>{' '}
            <span className="color-chip" style={{ backgroundColor: submittedData.colorFavorito }} />
            {submittedData.colorFavorito}
          </p>
        </section>
      )}
    </main>
  )
}

export default App
