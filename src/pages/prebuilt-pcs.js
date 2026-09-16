import React from 'react';
import { RiCpuLine, RiDatabase2Line, RiGamepadLine, RiSettings3Line } from 'react-icons/ri';
import pool from '@/utils/db';
import { useAppDispatch } from '@/redux/hooks';
import { addToCart } from '@/redux/cart/cartSlice';
import { toast } from 'react-hot-toast';

export default function PrebuiltPCs({ systems }) {
  const dispatch = useAppDispatch();

  const handleBuyNow = (system) => {
    // We map the prebuilt system structure to match cart product structure
    const cartItem = {
      _id: `prebuilt-${system.id}`,
      name: system.name,
      price: system.price,
      img: system.image,
      category: 'Prebuilt System',
      description: system.description,
    };
    dispatch(addToCart(cartItem));
    toast.success(`${system.name} added to cart!`);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans">
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-32 overflow-hidden border-b border-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#050505] opacity-50"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Pre-Built</span> Systems
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            Plug and play right out of the box. Carefully engineered, rigorously tested, and perfectly cable-managed by our expert builders.
          </p>
        </div>
      </div>

      {/* Systems Grid */}
      <div className="container mx-auto px-6 py-20">
        {systems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-400">No Prebuilt Systems Available Right Now.</h2>
            <p className="text-gray-500 mt-4">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {systems.map(system => (
              <div key={system.id} className="group bg-[#111] rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500/50 transition-colors duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 flex flex-col">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden shrink-0 bg-black flex items-center justify-center">
                  {(() => {
                    let imgUrl = system.image;
                    try {
                      const parsed = JSON.parse(imgUrl);
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        imgUrl = parsed[0];
                      }
                    } catch (e) {}
                    return imgUrl ? (
                      <img 
                        src={imgUrl} 
                        alt={system.name} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <span className="text-gray-600">No Image</span>
                    );
                  })()}
                  {system.tag && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 uppercase rounded-full tracking-wider shadow-lg">
                        {system.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-2">{system.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1">{system.description}</p>

                  {/* Specs */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-sm text-gray-300">
                      <RiCpuLine className="text-yellow-500 text-xl mr-3 shrink-0" />
                      <span className="truncate">{system.cpu || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <RiGamepadLine className="text-yellow-500 text-xl mr-3 shrink-0" />
                      <span className="truncate">{system.gpu || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <RiDatabase2Line className="text-yellow-500 text-xl mr-3 shrink-0" />
                      <span className="truncate">{system.ram || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <RiSettings3Line className="text-yellow-500 text-xl mr-3 shrink-0" />
                      <span className="truncate">{system.storage || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto border-t border-gray-800 pt-6">
                    <span className="text-3xl font-bold text-white">₹{system.price?.toLocaleString()}</span>
                    <button 
                      onClick={() => handleBuyNow(system)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-full font-bold transition-colors uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="bg-[#111] border-y border-gray-800 py-16">
         <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-400">
           <div>
             <h4 className="text-white font-bold text-lg mb-2">Plug & Play</h4>
             <p className="text-sm">Pre-installed Windows & Drivers</p>
           </div>
           <div>
             <h4 className="text-white font-bold text-lg mb-2">Stress Tested</h4>
             <p className="text-sm">24-hour rigorous benchmark</p>
           </div>
           <div>
             <h4 className="text-white font-bold text-lg mb-2">Pro Wiring</h4>
             <p className="text-sm">Immaculate cable management</p>
           </div>
           <div>
             <h4 className="text-white font-bold text-lg mb-2">Warranty</h4>
             <p className="text-sm">3 Years Comprehensive Coverage</p>
           </div>
         </div>
      </div>
      
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const [rows] = await pool.query('SELECT * FROM prebuilt_pcs ORDER BY created_at DESC');
    const systems = JSON.parse(JSON.stringify(rows));
    return {
      props: {
        systems,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        systems: [],
      },
    };
  }
}
