import { useEffect, useMemo, useState } from 'react'

function FacultyDashboard({ user }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [subjects, setSubjects] = useState([])
  const [selected, setSelected] = useState('')
  const [attendance, setAttendance] = useState([])
  const [enrollments, setEnrollments] = useState([])

  const load = async () => {
    if (!user) return
    const subs = await fetch(`${baseUrl}/subjects?faculty_id=${user._id}`).then(r=>r.json())
    setSubjects(subs.items || [])
  }
  useEffect(()=>{ load() }, [user])

  useEffect(()=>{
    const run = async () => {
      if (!selected) return
      const att = await fetch(`${baseUrl}/attendance?subject_id=${selected}`).then(r=>r.json())
      const enr = await fetch(`${baseUrl}/enrollments?subject_id=${selected}`).then(r=>r.json())
      setAttendance(att.items||[])
      setEnrollments(enr.items||[])
    }
    run()
  }, [selected])

  const takeAttendance = async () => {
    if (!selected || !user) return
    // Simple attendance: mark all enrolled students as present
    const records = enrollments.map(e => ({ student_id: e.student_id, status: 'present' }))
    await fetch(`${baseUrl}/attendance`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject_id: selected, faculty_id: user._id, session_date: new Date().toISOString().slice(0,10), records })
    })
    const att = await fetch(`${baseUrl}/attendance?subject_id=${selected}`).then(r=>r.json())
    setAttendance(att.items||[])
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-3">My Subjects</h3>
        <div className="flex gap-2 flex-wrap">
          {subjects.map(s => (
            <button key={s._id} onClick={()=>setSelected(s._id)} className={`px-3 py-2 rounded border ${selected===s._id? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'} `}>
              {s.code} - {s.title}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Attendance</h3>
              <button onClick={takeAttendance} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded">Take Attendance</button>
            </div>
            <ul className="space-y-2 max-h-72 overflow-auto">
              {attendance.map(a => (
                <li key={a._id} className="p-3 bg-slate-800/60 rounded border border-slate-700">
                  <div className="text-sm text-slate-400">{a.session_date}</div>
                  <div className="text-xs text-slate-500">Records: {a.records?.length||0}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h3 className="font-semibold mb-3">Enrolled Students</h3>
            <ul className="space-y-2 max-h-72 overflow-auto">
              {enrollments.map(e => (
                <li key={e._id} className="p-3 bg-slate-800/60 rounded border border-slate-700">{e.student_id}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacultyDashboard
