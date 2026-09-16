import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiCloseCircleLine } from 'react-icons/ri';

export default function OrderFailure() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-[#111] p-10 rounded-2xl border border-red-900/30 text-center shadow-2xl shadow-red-900/20">
        
        <div className="flex justify-center">
          <RiCloseCircleLine className="text-red-500 text-7xl mb-4" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Payment Failed
        </h2>
        
        <p className="mt-4 text-gray-400">
          Unfortunately, your transaction could not be completed. Your order has not been placed and no money was deducted.
        </p>

        <div className="mt-8 space-y-4">
          <Link 
            href="/checkout"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none transition-colors uppercase tracking-wider"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-bold text-gray-300 bg-[#1a1a1a] hover:bg-gray-800 focus:outline-none transition-colors uppercase tracking-wider"
          >
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
