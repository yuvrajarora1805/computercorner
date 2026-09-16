import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RiCheckDoubleLine } from 'react-icons/ri';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const router = useRouter();
  const { payment_id } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setLoading(false);
      // Fire confetti on load
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#eab308', '#ffffff', '#000000']
      });
    }
  }, [router.isReady]);

  if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-20 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#111] p-10 rounded-2xl border border-gray-800 text-center shadow-2xl relative overflow-hidden">
        
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <RiCheckDoubleLine className="text-5xl" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Thank you for your purchase. Your order is being processed and will be shipped soon.
        </p>

        {payment_id && (
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 mb-8 flex flex-col items-center">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Payment Reference ID</span>
            <span className="font-mono text-yellow-500 font-bold">{payment_id}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold py-3 px-8 rounded transition-colors tracking-wide">
            Return to Store
          </Link>
          <Link href="/profile" className="bg-transparent border border-gray-700 text-white hover:bg-white/5 font-bold py-3 px-8 rounded transition-colors tracking-wide">
            View My Orders
          </Link>
        </div>

      </div>
    </div>
  );
}
