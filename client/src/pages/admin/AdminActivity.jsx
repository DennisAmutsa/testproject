import { useState, useEffect } from 'react'
import { Clock, ShoppingBag, RotateCcw, MessageSquare } from 'lucide-react'
import api from '../../services/api'

export default function AdminActivity() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/returns').catch(() => ({ data: [] })),
      api.get('/contact').catch(() => ({ data: [] }))
    ]).then(([ordersRes, returnsRes, contactsRes]) => {
      const allLogs = [];

      if (Array.isArray(ordersRes.data)) {
        ordersRes.data.forEach(o => {
          allLogs.push({
            type: 'order',
            title: `Order #${o.orderId} Placed`,
            desc: `Customer ${o.customerName} ordered items totaling KES ${o.items?.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString() || 0}`,
            time: new Date(o.createdAt),
            icon: ShoppingBag
          });
          if (o.status !== 'processing') {
            allLogs.push({
              type: 'order',
              title: `Order #${o.orderId} Status Updated`,
              desc: `Order marked as ${o.status.replace(/_/g, ' ')}`,
              time: new Date(o.updatedAt || o.createdAt),
              icon: ShoppingBag
            });
          }
        });
      }

      if (Array.isArray(returnsRes.data)) {
        returnsRes.data.forEach(r => {
          allLogs.push({
            type: 'return',
            title: `Return Claim Logged`,
            desc: `Claim opened for order #${r.orderId} Reason: "${r.reason}"`,
            time: new Date(r.createdAt),
            icon: RotateCcw
          });
        });
      }

      if (Array.isArray(contactsRes.data)) {
        contactsRes.data.forEach(c => {
          allLogs.push({
            type: 'support',
            title: `Support Ticket Received`,
            desc: `Message from ${c.name}: "${c.message}"`,
            time: new Date(c.createdAt),
            icon: MessageSquare
          });
        });
      }

      // Sort logs by time descending
      allLogs.sort((a, b) => b.time - a.time);
      setLogs(allLogs);
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Activity Logs</h1>
        <p className="text-slate-500 text-sm font-semibold mt-0.5">Audit trail of transactions, support tickers, and status updates</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white border border-slate-100 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 shadow-sm">
          <Clock size={44} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No activity logs recorded.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
          {logs.map((log, idx) => (
            <div key={idx} className="relative pl-6">
              {/* Dot */}
              <div className="absolute -left-3 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#f5c518] flex items-center justify-center text-[#9a6a00]">
                <log.icon size={10} />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[9px] font-black text-slate-400 uppercase block">
                  {log.time.toLocaleString()}
                </span>
                <h3 className="text-slate-800 font-extrabold text-xs mt-1">{log.title}</h3>
                <p className="text-slate-500 text-[10px] mt-1 font-medium leading-relaxed">{log.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
