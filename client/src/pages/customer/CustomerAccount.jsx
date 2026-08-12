import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Shield, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../../services/api'

export default function CustomerAccount() {
  const { user } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-800">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">My Account</h1>
        <p className="text-slate-500 text-sm mt-0.5 font-semibold">Manage your account profile information</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-[#0a0e1a] text-[#f5c518] flex items-center justify-center font-bold text-xl border-2 border-[#f5c518]/25">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DA'}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">{user?.name || 'Dennis Amutsa'}</h2>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">{user?.role === 'admin' ? 'Administrator' : 'Customer Account'}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User size={12} className="text-slate-400" /> Full Name
            </span>
            <p className="text-sm font-extrabold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
              {user?.name || 'Dennis Amutsa'}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={12} className="text-slate-400" /> Email Address
            </span>
            <p className="text-sm font-extrabold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
              {user?.email || 'customer@northstar.com'}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={12} className="text-slate-400" /> Account Privilege
            </span>
            <p className="text-sm font-extrabold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 capitalize">
              {user?.role || 'Customer'}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={12} className="text-slate-400" /> Registered Since
            </span>
            <p className="text-sm font-extrabold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'August 2024'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
