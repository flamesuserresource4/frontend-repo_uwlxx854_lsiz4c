import { useState } from 'react'

function Layout({ children, onRoleChange, currentRole, user, onLogout }) {
  const [open, setOpen] = useState(true)
  const menu = [
    { key: 'student', label: 'Student' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'cashier', label: 'Cashier' },
    { key: 'admin', label: 'Admin' },
  ]
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className={`transition-all duration-300 bg-slate-900/80 border-r border-slate-800 ${open ? 'w-64' : 'w-16'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <span className="font-bold tracking-wide">Enrollr</span>
          <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-white">{open ? '⟨' : '⟩'}</button>
        </div>
        <nav className="p-2 space-y-1">
          {menu.map(m => (
            <button
              key={m.key}
              onClick={() => onRoleChange(m.key)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 ${currentRole===m.key ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
            >{m.label} Dashboard</button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-800 text-xs text-slate-400 px-3">
            {user ? (
              <div className="space-y-2">
                <div>Signed in as<br/><span className="text-white font-medium">{user.name}</span></div>
                <button onClick={onLogout} className="w-full bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded">Logout</button>
              </div>
            ) : (
              <div>Not signed in</div>
            )}
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}

export default Layout
