import { useState } from 'react'
import { UserCheck, Plus, Check, X, ShieldAlert } from 'lucide-react'

export default function AdminUsers() {
  const [admins, setAdmins] = useState([
    { id: '1', name: 'Dennis Amutsa', email: 'amutsaamutsa@gmail.com', role: 'admin', joined: '2026-08-12' },
    { id: '2', name: 'Epic Edge Creative', email: 'epicedgecreative@gmail.com', role: 'admin', joined: '2026-08-11' }
  ])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    const newAdmin = {
      id: String(Date.now()),
      name,
      email,
      role: 'admin',
      joined: new Date().toISOString().slice(0, 10)
    };
    setAdmins([...admins, newAdmin]);
    setName('');
    setEmail('');
    setPassword('');
    setShowForm(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Admin Users</h1>
          <p className="text-slate-500 text-sm font-semibold mt-0.5">Manage administrative credentials, credentials access, and users</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm text-xs">
          <Plus size={16} /> Add Admin
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md mb-8 animate-slide-up space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-650 mb-1">Full Name</label>
              <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-650 mb-1">Email Address</label>
              <input type="email" placeholder="john@northstar.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-650 mb-1">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-[#e6b400]">Save Admin</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 px-4 py-2 rounded-xl text-xs">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-black">
              <th className="p-4">Administrator</th>
              <th className="p-4">Email</th>
              <th className="p-4">Security Level</th>
              <th className="p-4">Assigned On</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-850 flex items-center gap-2">
                  <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-600">
                    {a.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {a.name}
                </td>
                <td className="p-4 text-slate-600 font-semibold">{a.email}</td>
                <td className="p-4">
                  <span className="bg-[#f5c518]/10 text-[#9a6a00] border border-[#f5c518]/20 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase">
                    {a.role}
                  </span>
                </td>
                <td className="p-4 text-slate-450 font-medium">{a.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
