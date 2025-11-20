import { useEffect, useState } from 'react'

function CashierDashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState('')
  const [bills, setBills] = useState([])
  const [amount, setAmount] = useState('')

  const load = async () => {
    const u = await fetch(`${baseUrl}/users?role=student`).then(r=>r.json())
    setStudents(u.items||[])
  }
  useEffect(()=>{ load() }, [])

  useEffect(()=>{
    const run = async () => {
      if (!selected) return
      const b = await fetch(`${baseUrl}/bills?student_id=${selected}`).then(r=>r.json())
      setBills(b.items||[])
    }
    run()
  }, [selected])

  const pay = async (bill_id) => {
    if (!amount) return
    await fetch(`${baseUrl}/payments`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ bill_id, amount: parseFloat(amount), cashier_id: 'cashier' }) })
    const b = await fetch(`${baseUrl}/bills?student_id=${selected}`).then(r=>r.json())
    setBills(b.items||[])
    setAmount('')
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-3">Select Student</h3>
        <select value={selected} onChange={e=>setSelected(e.target.value)} className="bg-slate-800 border border-slate-700 rounded px-3 py-2">
          <option value="">Choose...</option>
          {students.map(s => (<option key={s._id} value={s._id}>{s.name}</option>))}
        </select>
      </div>

      {selected && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3">Bills</h3>
          <ul className="space-y-3">
            {bills.map(b => (
              <li key={b._id} className="p-3 bg-slate-800/60 rounded border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Semester {b.semester}</div>
                    <div className="text-sm text-slate-400">Total ₱{(b.total||0).toFixed(2)} • Paid ₱{(b.paid||0).toFixed(2)} • Status {b.status}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="bg-slate-900 border border-slate-700 rounded px-3 py-2 w-32" />
                    <button onClick={()=>pay(b._id)} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded">Pay</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CashierDashboard
