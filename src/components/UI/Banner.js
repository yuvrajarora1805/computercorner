import Link from "next/link";
import { RiTruckLine, RiShieldCheckLine, RiCustomerService2Line, RiCpuLine } from "react-icons/ri";

const Banner = () => {
  return (
    <div className="relative w-full bg-[#0a0a0a] text-white overflow-hidden font-sans border-b border-gray-800">
      
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] to-transparent z-10"></div>
        {/* Using a placeholder high-end PC image or a dark subtle pattern if image isn't available */}
        <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full opacity-30 lg:opacity-50"
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center">
        
        {/* Main Content */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-semibold text-sm mb-6 uppercase tracking-wider">
            Premium Custom Builds
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Build Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Dream Machine
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            High-performance custom PCs tailored for gaming, streaming, and heavy workloads. Equipped with the latest AI-ready components.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/pcbuilder" className="btn bg-yellow-500 hover:bg-yellow-400 text-black border-none px-8 h-14 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all">
              Start Building Now
            </Link>
            <Link href="/prebuilt-pcs" className="btn bg-transparent hover:bg-white/5 text-white border border-gray-700 hover:border-gray-500 px-8 h-14 rounded-full font-semibold text-lg transition-all">
              View Pre-Built PCs
            </Link>
          </div>
        </div>

      </div>

      {/* Features Bar */}
      <div className="relative z-10 border-t border-gray-800 bg-[#0f0f0f]/80 backdrop-blur-md py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400">
            
            <div className="flex flex-col items-center justify-center text-center gap-3 group">
              <RiShieldCheckLine className="text-4xl text-gray-500 group-hover:text-yellow-500 transition-colors" />
              <div>
                <h4 className="text-white font-semibold mb-1">3 Years Warranty</h4>
                <p className="text-xs">On all custom builds</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center gap-3 group">
              <RiTruckLine className="text-4xl text-gray-500 group-hover:text-yellow-500 transition-colors" />
              <div>
                <h4 className="text-white font-semibold mb-1">Safe Delivery</h4>
                <p className="text-xs">Pan India shipping</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center gap-3 group">
              <RiCpuLine className="text-4xl text-gray-500 group-hover:text-yellow-500 transition-colors" />
              <div>
                <h4 className="text-white font-semibold mb-1">Genuine Parts</h4>
                <p className="text-xs">100% authentic components</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center gap-3 group">
              <RiCustomerService2Line className="text-4xl text-gray-500 group-hover:text-yellow-500 transition-colors" />
              <div>
                <h4 className="text-white font-semibold mb-1">Lifetime Support</h4>
                <p className="text-xs">Dedicated technical help</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Banner;
