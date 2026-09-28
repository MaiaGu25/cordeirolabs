import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicSite from './pages/PublicSite.jsx'

// Code-split /admin: it pulls in @supabase/supabase-js and the whole admin
// UI, none of which the public site needs. Most visitors only ever hit
// `/`, so that work shouldn't be in their bundle.
const AdminRoot = lazy(() => import('./admin/AdminRoot.jsx'))

function AdminFallback() {
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--fg-faint)',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
      }}
    >
      Loading…
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminRoot />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
