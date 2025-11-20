import { useState } from 'react'

function Layout({ children, user, onLogout }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className={`transition-all duration-300 bg-slate-900/80 border-r border-slate-800 ${open ? 'w-64' : 'w-16'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <span className="font-bold tracking-wide">Enrollr</span>
          <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-white">{open ? '⟨' : '⟩'}</button>
        </div>
        <nav className="p-3 space-y-3 text-sm">
          <div className="text-slate-400">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs">Signed in as</div>
                <div className="text-white font-medium leading-tight">{user.name}</div>
                <div className="text-slate-400 text-xs">Role: <span className="uppercase tracking-wide">{user.role}</span></div>
                <button onClick={onLogout} className="w-full bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded">Logout</button>
              </div>
            ) : (
              <div className="text-xs">Not signed in</div>
            )}
          </div>
          <div className="pt-4 mt-2 border-t border-slate-800 text-xs text-slate-500">
            <p>This account will see features for its role only.</p>
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
