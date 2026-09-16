import React from "react";
import Link from "next/link";
import { RiFacebookBoxFill, RiTwitterFill, RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 text-gray-300 font-sans pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity mb-6">
              <span className="text-yellow-500">⚡</span>
              <span>The Computer Corner</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your premium destination for custom PC builds, high-performance components, and professional workstations. Built for gamers, creators, and professionals.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <RiFacebookBoxFill className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <RiTwitterFill className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <RiInstagramFill className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <RiYoutubeFill className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/pcbuilder" className="hover:text-yellow-500 transition-colors">Custom PC Builder</Link></li>
              <li><Link href="/category/processor" className="hover:text-yellow-500 transition-colors">Processors</Link></li>
              <li><Link href="/category/monitor" className="hover:text-yellow-500 transition-colors">Graphics Cards</Link></li>
              <li><Link href="/category/motherboard" className="hover:text-yellow-500 transition-colors">Motherboards</Link></li>
              <li><Link href="/category/ram" className="hover:text-yellow-500 transition-colors">Memory (RAM)</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Warranty Policy</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <strong className="block text-white mb-1">Phone:</strong>
                <a href="tel:09563600008" className="hover:text-yellow-500 transition-colors">095636 00008</a>
              </li>
              <li>
                <strong className="block text-white mb-1">Email:</strong>
                <a href="mailto:support@thecomputercorner.com" className="hover:text-yellow-500 transition-colors">support@thecomputercorner.com</a>
              </li>
              <li>
                <strong className="block text-white mb-1">Address:</strong>
                520, Amrik Singh Rd, <br/>Bathinda, Punjab 151001
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} The Computer Corner. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
