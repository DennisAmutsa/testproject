import { Shield, Check } from 'lucide-react'

export default function AdminRoles() {
  const roles = [
    { title: 'Super Admin', desc: 'Full root access to all settings, catalog, order records, and user management.', count: 2 },
    { title: 'Support Agent', desc: 'Read and update catalog inventory, fulfill shipments, and resolve support requests.', count: 0 },
    { title: 'Content Manager', desc: 'Update descriptions, manage promotional coupons, and edit products catalog.', count: 0 }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Roles & Permissions</h1>
        <p className="text-slate-500 text-sm font-semibold mt-0.5">Control administrative access layers and user privilege profiles</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {roles.map((r, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="w-10 h-10 bg-[#f5c518]/10 rounded-xl flex items-center justify-center text-[#9a6a00] flex-shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-slate-800 font-extrabold text-sm">{r.title}</h3>
                <span className="bg-slate-55 bg-slate-100 px-2 py-0.5 rounded-full text-[9px] font-black text-slate-500">{r.count} assigned</span>
              </div>
              <p className="text-slate-500 text-xs mt-1.5 font-medium leading-relaxed">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
