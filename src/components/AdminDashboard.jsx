import { useEffect, useState } from 'react'

function AdminDashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', role: 'student', password: 'password' })
  const [subjects, setSubjects] = useState([])
  const [subj, setSubj] = useState({ code: '', title: '', units: 3, fee_per_unit: 1000, faculty_id: '' })

  const load = async () => {
    const u = await fetch(`${baseUrl}/users`).then(r=>r.json())
    const s = await fetch(`${baseUrl}/subjects`).then(r=>r.json())
    setUsers(u.items || [])
    setSubjects(s.items || [])
  }

  useEffect(()=>{ load() }, [])

  const createUser = async (e) => {
    e.preventDefault()
    await fetch(`${baseUrl}/users`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    setForm({ name: '', email: '', role: 'student', password: 'password' })
    await load()
  }

  const createSubject = async (e) => {
    e.preventDefault()
    await fetch(`${baseUrl}/subjects`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subj)
    })
    setSubj({ code: '', title: '', units: 3, fee_per_unit: 1000, faculty_id: '' })
    await load()
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-3">Overview</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-sm">Users</div>
            <div className="text-2xl font-bold">{users.length}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-sm">Subjects</div>
            <div className="text-2xl font-bold">{subjects.length}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-sm">Faculty</div>
            <div className="text-2xl font-bold">{users.filter(u=>u.role==='faculty').length}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3">Create User</h3>
          <form onSubmit={createUser} className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="col-span-2 bg-slate-800 border border-slate-700 rounded px-3 py-2"/>
            <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="col-span-2 bg-slate-800 border border-slate-700 rounded px-3 py-2"/>
            <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})} className="bg-slate-800 border border-slate-700 rounded px-3 py-2">
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
            <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" className="bg-slate-800 border border-slate-700 rounded px-3 py-2"/>
            <button className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white rounded py-2">Add User</button>
          </form>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3">Create Subject</h3>
          <form onSubmit={createSubject} className="grid grid-cols-2 gap-3">
            <input value={subj.code} onChange={e=>setSubj({...subj, code:e.target.value})} placeholder="Code" className="bg-slate-800 border border-slate-700 rounded px-3 py-2"/>
            <input value={subj.title} onChange={e=>setSubj({...subj, title:e.target.value})} placeholder="Title" className="bg-slate-800 border border-slate-700 rounded px-3 py-2"/>
            <input type="number" value={subj.units} onChange={e=>setSubj({...subj, units:parseFloat(e.target.value)||0})} placeholder="Units" className="bg-slate-800 border border-slate-700 rounded px-3 py-2"/>
            <input type="number" value={subj.fee_per_unit} onChange={e=>setSubj({...subj, fee_per_unit:parseFloat(e.target.value)||0})} placeholder="Fee/Unit" className="bg-slate-800 border border-slate-700 rounded px-3 py-2"/>
            <select value={subj.faculty_id} onChange={e=>setSubj({...subj, faculty_id:e.target.value})} className="col-span-2 bg-slate-800 border border-slate-700 rounded px-3 py-2">
              <option value="">Assign Faculty (optional)</option>
              {users.filter(u=>u.role==='faculty').map(f=>(<option key={f._id} value={f._id}>{f.name}</option>))}
            </select>
            <button className="col-span-2 bg-green-600 hover:bg-green-500 text-white rounded py-2">Add Subject</button>
          </form>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-3">Users</h3>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-400">
              <tr><th className="text-left p-2">Name</th><th className="text-left p-2">Email</th><th className="text-left p-2">Role</th></tr>
            </thead>
            <tbody>
              {users.map(u=> (
                <tr key={u._id} className="odd:bg-slate-900/40">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
