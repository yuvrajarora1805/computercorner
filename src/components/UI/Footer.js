import React from "react";
import Link from "next/link";
import { RiFacebookBoxFill, RiTwitterFill, RiInstagramFill, RiYoutubeFill, RiMapPinLine, RiPhoneLine, RiTimeLine, RiArrowRightUpLine } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="relative bg-brand-navy-deep text-brand-white/70 font-body overflow-hidden">
      
      {/* ── Manga top divider ─────────────────────────── */}
      <div className="manga-divider-reverse manga-divider"></div>
      
      {/* ── Background Effects ────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="energy-orb energy-orb-blue w-[300px] h-[300px] bottom-[-100px] right-[-50px] opacity-30"></div>
        <div className="energy-orb energy-orb-gold w-[200px] h-[200px] top-[20%] left-[-80px] opacity-20" style={{animationDelay:'4s'}}></div>
        {/* Japanese watermark */}
        <div className="absolute bottom-10 right-10 font-heading text-[120px] font-black text-brand-royal/[0.03] leading-none tracking-wider select-none" aria-hidden="true">
          TCC
        </div>
      </div>

      {/* ── Main Footer Content ───────────────────────── */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <img 
                src="/logo.png" 
                alt="The Computer Corner" 
                className="h-16 w-auto drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(214,168,79,0.3)] transition-all"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="flex flex-col">
                <span className="font-heading text-brand-gold text-xs tracking-[0.2em]">THE COMPUTER</span>
                <span className="font-heading text-brand-gold text-xs tracking-[0.2em]">CORNER</span>
                <span className="font-sub text-brand-white/30 text-[9px] tracking-[0.3em] mt-0.5">BATHINDA</span>
              </div>
            </Link>
            <p className="text-sm text-brand-white/40 leading-relaxed mb-6">
              Your premium destination for custom PC builds, high-performance components, and professional workstations. Built for gamers, creators, and professionals.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <RiFacebookBoxFill />, href: "#", label: "Facebook" },
                { icon: <RiTwitterFill />, href: "#", label: "Twitter" },
                { icon: <RiInstagramFill />, href: "#", label: "Instagram" },
                { icon: <RiYoutubeFill />, href: "#", label: "YouTube" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  aria-label={social.label}
                  className="neu-circle w-10 h-10 text-brand-white/40 hover:text-brand-gold hover:shadow-glow-gold transition-all duration-300 text-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-brand-white text-xs tracking-[0.2em] uppercase mb-6">Products</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Custom PC Builder", href: "/pcbuilder" },
                { label: "Gaming PCs", href: "/prebuilt-pcs" },
                { label: "Processors", href: "/category/processor" },
                { label: "Graphics Cards", href: "/category/monitor" },
                { label: "Motherboards", href: "/category/motherboard" },
                { label: "Memory (RAM)", href: "/category/ram" },
                { label: "Storage", href: "/category/storage" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="group/link flex items-center gap-2 text-brand-white/40 hover:text-brand-gold transition-colors font-sub tracking-wide">
                    <span className="w-1 h-1 rounded-full bg-brand-electric/40 group-hover/link:bg-brand-gold group-hover/link:shadow-glow-gold transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading text-brand-white text-xs tracking-[0.2em] uppercase mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Track Your Order", href: "/orders" },
                { label: "Warranty Policy", href: "#" },
                { label: "Shipping & Returns", href: "#" },
                { label: "FAQs", href: "#" },
                { label: "Contact Us", href: "#" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="group/link flex items-center gap-2 text-brand-white/40 hover:text-brand-gold transition-colors font-sub tracking-wide">
                    <span className="w-1 h-1 rounded-full bg-brand-electric/40 group-hover/link:bg-brand-gold group-hover/link:shadow-glow-gold transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Visit Store */}
          <div>
            <h3 className="font-heading text-brand-white text-xs tracking-[0.2em] uppercase mb-6">Visit Our Store</h3>
            <div className="space-y-4">
              <div className="neu-card p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <RiMapPinLine className="text-brand-gold text-lg mt-0.5 shrink-0" />
                  <p className="text-sm text-brand-white/50 font-sub leading-relaxed">
                    520, Amrik Singh Rd,<br/>Bathinda, Punjab 151001
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <RiPhoneLine className="text-brand-gold text-lg shrink-0" />
                  <a href="tel:09563600008" className="text-sm font-mono text-brand-gold hover:text-brand-champagne transition-colors">
                    095636 00008
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <RiTimeLine className="text-brand-gold text-lg shrink-0" />
                  <p className="text-sm text-brand-white/50 font-sub">
                    Mon - Sat: 10AM - 8PM
                  </p>
                </div>
              </div>
              <a 
                href="https://maps.google.com/?q=The+Computer+Corner+Bathinda" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neu-btn text-xs font-heading tracking-wider flex items-center justify-center gap-2 py-3 rounded-neu-md w-full hover:text-brand-gold"
              >
                Get Directions <RiArrowRightUpLine />
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ──────────────────────────────── */}
        <div className="border-t border-brand-steel/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-white/25 font-sub tracking-wider">
            &copy; {new Date().getFullYear()} The Computer Corner, Bathinda. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="/privacy-policy" className="text-brand-white/25 hover:text-brand-gold transition-colors font-sub tracking-wide">Privacy Policy</Link>
            <Link href="/terms" className="text-brand-white/25 hover:text-brand-gold transition-colors font-sub tracking-wide">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
