import { useState } from 'react'
import { useAuth } from './useAuth.js'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)
    // Deliberately generic — never repeat back whatever Supabase's own
    // error message says, so failed attempts can't be used to probe which
    // accounts exist or hit an internal error.
    if (signInError) setError('Invalid email or password.')
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth__card">
        <p className="admin-auth__mark">
          CORDEIRO LABS<span className="mark-reg">®</span>
          <span className="admin-auth__tag">Admin</span>
        </p>

        <form className="admin-auth__form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span className="admin-field__label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="admin-btn admin-btn--primary admin-auth__submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
