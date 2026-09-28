import { useEffect } from 'react'
import { AuthProvider } from './AuthProvider.jsx'
import { useAuth } from './useAuth.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import AdminLogin from './AdminLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import './admin.css'

function AdminGate() {
  const { session, loading } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-auth">
        <div className="admin-auth__card">
          <p className="admin-auth__mark">
            CORDEIRO LABS<span className="mark-reg">®</span>
          </p>
          <p className="admin-error">
            Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local and
            restart the dev server.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-auth">
        <p className="admin-hint">Loading…</p>
      </div>
    )
  }

  return session ? <AdminDashboard /> : <AdminLogin />
}

export default function AdminRoot() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'CORDEIRO LABS® — Admin'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <AuthProvider>
      <AdminGate />
    </AuthProvider>
  )
}
