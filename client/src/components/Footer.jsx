import { Link } from 'react-router-dom'
import { Star, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-gold rounded-lg flex items-center justify-center">
                <Star size={16} className="text-brand-navy fill-brand-navy" />
              </div>
              <div className="leading-tight">
                <div className="text-white font-bold text-sm tracking-wide">NORTHSTAR</div>
                <div className="text-brand-muted text-[10px] tracking-widest uppercase">Retail Co.</div>
              </div>
            </Link>
            <p className="text-brand-muted text-xs leading-relaxed">
              Your trusted retail partner. Quality products, instant support.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2.5">
              {[
                ['Help Center', '/help'],
                ['Orders', '/dashboard/orders'],
                ['Returns', '/dashboard/returns'],
                ['Stock Availability', '/stock'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-brand-muted text-xs hover:text-brand-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              {[
                ['About Us', '/about'],
                ['Contact', '/contact'],
                ['Privacy', '#'],
                ['Terms', '#'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-brand-muted text-xs hover:text-brand-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Account</h4>
            <ul className="space-y-2.5">
              {[
                ['Sign In', '/login'],
                ['Sign Up', '/signup'],
                ['My Dashboard', '/dashboard'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-brand-muted text-xs hover:text-brand-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            {[
              ['Help Center', '/help'],
              ['Orders', '/dashboard/orders'],
              ['Returns', '/dashboard/returns'],
              ['Stock Availability', '/stock'],
              ['Privacy', '#'],
              ['Terms', '#'],
            ].map(([label, to]) => (
              <Link key={label} to={to} className="text-brand-muted text-xs hover:text-brand-gold transition-colors hidden sm:block">
                {label}
              </Link>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-all"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center sm:text-right">
          <p className="text-brand-muted text-xs">
            © {new Date().getFullYear()} Northstar Retail Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
