import { Link } from 'react-router-dom'
import { Star, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#f6f0e8] border-t border-[#111111]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-[#111111] rounded-lg flex items-center justify-center">
                <Star size={14} className="text-[#f6f0e8] fill-[#f6f0e8]" />
              </div>
              <div className="leading-tight">
                <div className="text-[#111111] font-bold text-xs tracking-wide">NORTHSTAR</div>
                <div className="text-[#4a4a4a] text-[9px] tracking-widest uppercase">Retail Co.</div>
              </div>
            </Link>
            <p className="text-[#4a4a4a] text-[11px] leading-tight max-w-sm mx-auto md:mx-0">
              Your trusted retail partner. Quality products, instant support.
            </p>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-[#111111] font-bold mb-1.5 text-xs uppercase tracking-wider">Support</h4>
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-1">
              {[
                ['Help Center', '/help'],
                ['Orders', '/orders'],
                ['Returns', '/returns'],
                ['Stock', '/stock'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-[#4a4a4a] text-xs hover:text-[#111111] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h4 className="text-[#111111] font-bold mb-1.5 text-xs uppercase tracking-wider">Company</h4>
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-1">
              {[
                ['About Us', '/about'],
                ['Contact', '/contact'],
                ['Privacy', '#'],
                ['Terms', '#'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-[#4a4a4a] text-xs hover:text-[#111111] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#111111]/10 mt-5 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#4a4a4a] text-[11px]">
            © {new Date().getFullYear()} Northstar Retail Co. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-7 h-7 rounded-lg bg-white border border-[#111111]/15 flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-[#f6f0e8] transition-all"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
