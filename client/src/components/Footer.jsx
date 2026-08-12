import { Link } from 'react-router-dom'
import { Star, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-brand-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <Star size={16} className="text-brand-navy fill-brand-navy" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">NORTHSTAR</div>
                <div className="text-brand-muted text-[10px] tracking-widest">Retail Co.</div>
              </div>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed">
              Your trusted retail partner. Quality products, fast support, zero wait time.
            </p>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2">
              {[['Help Center', '/help'], ['Track Order', '/dashboard/orders'], ['Returns', '/dashboard/returns'], ['Stock Availability', '/stock']].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-brand-muted text-sm hover:text-brand-gold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {[['About Us', '/about'], ['Contact', '/contact'], ['Sign In', '/login'], ['Sign Up', '/signup']].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-brand-muted text-sm hover:text-brand-gold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Follow Us</h4>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-brand-muted text-xs">© {new Date().getFullYear()} Northstar Retail Co. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a key={item} href="#" className="text-brand-muted text-xs hover:text-brand-gold transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
