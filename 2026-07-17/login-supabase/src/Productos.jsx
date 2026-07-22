import { useEffect, useState } from 'react'
import { supabase, supabaseConfigMessage } from './supabaseClient'

export default function Productos({ session }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [editingId, setEditingId] = useState(null)

  const cargarProductos = async () => {
    if (!supabase || !session) {
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setProductos(data || [])
      setErrorMsg('')
    }

    setLoading(false)
  }

  useEffect(() => {
    cargarProductos()
  }, [session?.user?.id])

  const limpiarFormulario = () => {
    setNombre('')
    setDescripcion('')
    setPrecio('')
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!supabase || !session) {
      setErrorMsg(supabaseConfigMessage || 'No hay sesión activa.')
      return
    }

    if (!nombre.trim() || !precio) {
      setErrorMsg('Completa todos los campos obligatorios.')
      return
    }

    const productoData = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
    }

    if (editingId) {
      const { error } = await supabase
        .from('productos')
        .update(productoData)
        .eq('id', editingId)

      if (error) {
        setErrorMsg(error.message)
        return
      }
    } else {
      const { error } = await supabase.from('productos').insert({
        ...productoData,
        user_id: session.user.id,
      })

      if (error) {
        setErrorMsg(error.message)
        return
      }
    }

    limpiarFormulario()
    cargarProductos()
  }

  const handleEditar = (producto) => {
    setEditingId(producto.id)
    setNombre(producto.nombre)
    setDescripcion(producto.descripcion || '')
    setPrecio(producto.precio)
  }

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este producto?')
    if (!confirmar) return

    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) {
      setErrorMsg(error.message)
      return
    }

    cargarProductos()
  }

  return (
    <div style={{ maxWidth: 700, margin: '24px auto', padding: '0 16px' }}>
      <h3>Mis productos</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </div>

          <div>
            <label>Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </div>

          <div>
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </div>
        </div>

        {errorMsg && <p style={{ color: 'crimson' }}>{errorMsg}</p>}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button type="submit">
            {editingId ? 'Guardar cambios' : 'Crear producto'}
          </button>
          {editingId && (
            <button type="button" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p>Aún no tienes productos registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th align="left">Nombre</th>
              <th align="left">Descripción</th>
              <th align="left">Precio</th>
              <th align="left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${Number(producto.precio).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEditar(producto)} style={{ marginRight: 8 }}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(producto.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
