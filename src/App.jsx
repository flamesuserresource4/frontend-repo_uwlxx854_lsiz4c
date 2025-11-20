import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import StudentDashboard from './components/StudentDashboard'
import FacultyDashboard from './components/FacultyDashboard'
import CashierDashboard from './components/CashierDashboard'

function App() {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    setUser(null)
  }, [])

  const onLogin = (u) => {
    setUser(u)
  }

  const onLogout = () => {
    setUser(null)
  }

  const role = user?.role

  return (
    <Layout user={user} onLogout={onLogout}>
      {!user ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Login onLogin={onLogin} />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{role.charAt(0).toUpperCase()+role.slice(1)} Dashboard</h1>
            <p className="text-slate-400">Welcome, {user.name}</p>
          </div>
          {role === 'admin' && <AdminDashboard />}
          {role === 'student' && <StudentDashboard user={user} />}
          {role === 'faculty' && <FacultyDashboard user={user} />}
          {role === 'cashier' && <CashierDashboard />}
        </div>
      )}
    </Layout>
  )
}

export default App
