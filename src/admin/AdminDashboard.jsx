import { useState } from 'react'
import { useAuth } from './useAuth.js'
import ProjectList from './ProjectList.jsx'
import ProjectEditor from './ProjectEditor.jsx'
import SettingsEditor from './SettingsEditor.jsx'

// `editingId`: undefined = showing the list, null = creating a new
// project, a string = editing that project's id.
export default function AdminDashboard() {
  const { signOut } = useAuth()
  const [view, setView] = useState('projects')
  const [editingId, setEditingId] = useState(undefined)

  function goToView(nextView) {
    setView(nextView)
    setEditingId(undefined)
  }

  return (
    <div className="admin">
      <header className="admin__topbar">
        <p className="admin__mark">
          CORDEIRO LABS<span className="mark-reg">®</span>
          <span className="admin__tag">Admin</span>
        </p>

        <nav className="admin__nav" aria-label="Admin">
          <button
            type="button"
            className={view === 'projects' ? 'is-active' : ''}
            onClick={() => goToView('projects')}
          >
            Projects
          </button>
          <button
            type="button"
            className={view === 'settings' ? 'is-active' : ''}
            onClick={() => goToView('settings')}
          >
            Settings
          </button>
          <button type="button" className="admin__signout" onClick={signOut}>
            Sign Out
          </button>
        </nav>
      </header>

      <main className="admin__main">
        {view === 'projects' && editingId === undefined && (
          <ProjectList onEdit={(id) => setEditingId(id)} onNew={() => setEditingId(null)} />
        )}
        {view === 'projects' && editingId !== undefined && (
          <ProjectEditor projectId={editingId} onDone={() => setEditingId(undefined)} />
        )}
        {view === 'settings' && <SettingsEditor />}
      </main>
    </div>
  )
}
