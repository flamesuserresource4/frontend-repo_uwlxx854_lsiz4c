import { useEffect, useState } from 'react'

function StudentDashboard({ user }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [enrollments, setEnrollments] = useState([])
  const [subjects, setSubjects] = useState({})
  const [bill, setBill] = useState(null)

  const load = async () => {
    if (!user) return
    const e = await fetch(`${baseUrl}/enrollments?student_id=${user._id}`).then(r=>r.json())
    const b = await fetch(`${baseUrl}/bills?student_id=${user._id}`).then(r=>r.json())
    setEnrollments(e.items || [])
    setBill((b.items || [])[0] || null)
    const subjIds = [...new Set((e.items||[]).map(x=>x.subject_id))]
    const map = {}
    for (const id of subjIds) {
      try {
        const res = await fetch(`${baseUrl}/subjects`).then(r=>r.json())
        for (const s of res.items||[]) map[s._id] = s
      } catch {}
    }
    setSubjects(map)
  }

  useEffect(()=>{ load() }, [user])

  const total = bill?.total || 0
  const paid = bill?.paid || 0
  const balance = Math.max(0, total - paid)

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm">Total Bill</div>
          <div className="text-2xl font-bold">₱{total.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm">Paid</div>
          <div className="text-2xl font-bold text-green-400">₱{paid.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm">Balance</div>
          <div className="text-2xl font-bold text-amber-300">₱{balance.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-3">My Subjects</h3>
        <ul className="space-y-2">
          {enrollments.length === 0 && <li className="text-slate-400">No subjects enrolled yet.</li>}
          {enrollments.map(en => (
            <li key={en._id} className="p-3 bg-slate-800/60 rounded border border-slate-700">
              <div className="font-medium">{subjects[en.subject_id]?.code} - {subjects[en.subject_id]?.title}</div>
              <div className="text-slate-400 text-sm">Semester: {en.semester}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default StudentDashboard
