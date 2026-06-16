import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Send, Phone, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-white border-t border-gray-100 pt-16 pb-8 overflow-hidden text-[#1a1a1a]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <img src="/logo.png" alt="Niyat Somsa Logo" className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t.about.content.substring(0, 100)}...
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-5">{t.footer.pages}</h4>
            <ul className="space-y-3">
              {[
                { to: '/about', label: t.nav.about },
                { to: '/menu', label: t.nav.menu },
                { to: '/location', label: t.nav.location },
                { to: '/contact', label: t.nav.contact },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-[#c8a96e] transition-colors duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-5">{t.nav.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2.5 text-sm text-gray-400">
                <MapPin size={15} className="text-[#c8a96e] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t.location.address}</span>
              </li>
              <li className="flex items-center space-x-2.5 text-sm text-gray-400">
                <Phone size={15} className="text-[#c8a96e] flex-shrink-0" />
                <span>+998 90 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2.5 text-sm text-gray-400">
                <Clock size={15} className="text-[#c8a96e] flex-shrink-0" />
                <span>08:00 – 20:00 ({t.footer.everyday})</span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-5">{t.footer.socials}</h4>
            <div className="flex space-x-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300">
                <Instagram size={16} />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300">
                <Send size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} {t.footer.rights}
          </p>
          <div className="w-6 h-px bg-[#c8a96e]/30" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
