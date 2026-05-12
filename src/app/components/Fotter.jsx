"use client";

import React from 'react';
import { 
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaRobot,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaBots
} from "react-icons/fa6";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Chat Widget', href: '#' },
      { name: 'API Docs', href: '#' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Partners', href: '#' },
    ],
    Support: [
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-white border-t border-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-1.5 rounded-lg">
                <FaBots size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">SupportAI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Empowering small businesses with human-like AI support that works 24/7. Reduce costs and delight your customers instantly.
            </p>
            <div className="flex gap-4">
              {[FaTwitter, FaLinkedin, FaGithub].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-500 hover:text-blue-600 text-sm transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {currentYear} SupportAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-600">Cookie Policy</a>
            <div className="flex items-center gap-1.5 ml-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-slate-500 font-medium">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Bottom Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600"></div>
    </footer>
  );
};

export default Footer;