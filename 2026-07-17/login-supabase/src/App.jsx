import { useEffect, useState } from 'react'
import { supabase, supabaseConfigMessage } from './supabaseClient'
import Login from './Login'
import './App.css'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!supabase) {
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      },
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setSession(null)
  }

  if (!supabase) {
    return (
      <div className="app-shell">
        <h2>Configura Supabase</h2>
        <p>{supabaseConfigMessage}</p>
      </div>
    )
  }

  if (!session) {
    return <Login onLogin={setSession} />
  }

  return (
    <div className="app-shell">
      <h2>Bienvenido, {session.user.email}</h2>
      <p>Tu sesión está activa con Supabase.</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default App
