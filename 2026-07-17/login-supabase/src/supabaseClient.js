import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const isConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('tu_project_url_aqui') &&
    !supabaseAnonKey.includes('tu_anon_key_aqui'),
)

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null
export const supabaseConfigMessage = isConfigured
  ? ''
  : 'Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env con tus credenciales reales de Supabase.'
