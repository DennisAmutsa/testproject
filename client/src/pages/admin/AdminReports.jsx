import { useState, useEffect } from 'react'
import { FileText, Download, Printer } from 'lucide-react'
import api from '../../services/api'

export default function AdminReports() {
  const [orders, setOrders] = useState([])
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/returns').catch(() => ({ data: [] }))
    ]).then(([ordersRes, returnsRes]) => {
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])
      setReturns(Array.isArray(returnsRes.data) ? returnsRes.data : [])
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const printReport = () => {
    window.print();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in print:p-0 print:bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Operational Reports</h1>
          <p className="text-slate-500 text-sm font-semibold mt-0.5">Export operational and financial logs for accounting</p>
        </div>
        <div className="flex gap-2">
          <button onClick={printReport} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm">
            <Printer size={14} /> Print Report
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-800">Northstar Retail Co.</h2>
          <p className="text-slate-450 text-[10px] font-bold uppercase tracking-wider mt-0.5">System Activity & Financial Summary</p>
          <p className="text-slate-400 text-xs mt-1">Generated: {new Date().toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-[10px] font-black uppercase text-slate-400">Total Transactions</p>
            <p className="text-xl font-extrabold text-slate-800 mt-1">{orders.length} Orders</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-[10px] font-black uppercase text-slate-400">Return Activities</p>
            <p className="text-xl font-extrabold text-slate-800 mt-1">{returns.length} Return Cases</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Audit Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Ref ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2 text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="py-2.5 text-slate-450">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 font-bold text-slate-800">#{o.orderId}</td>
                    <td className="py-2.5 text-slate-600">{o.customerName}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-700">Order Placed ({o.status})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
