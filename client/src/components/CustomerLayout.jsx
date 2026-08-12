import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function CustomerLayout() {
  return (
    <div className="flex w-full min-h-screen bg-[#f8fafc] text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        <Outlet />
      </div>
    </div>
  )
}
