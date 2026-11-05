import Banner from "@/components/UI/Banner";
import Card from "@/components/UI/Card";
import StarburstBadge from "@/components/UI/StarburstBadge";
import { useAppDispatch } from "@/redux/hooks";
import { avarageRating } from "@/redux/product/productSlice";
import Link from "next/link";
import { useState } from "react";
import { 
  RiCpuLine, 
  RiDashboardLine, 
  RiDatabase2Line, 
  RiGamepadLine, 
  RiHardDrive2Line, 
  RiServerLine, 
  RiHeadphoneLine, 
  RiArrowRightLine,
  RiFlashlightLine,
  RiShieldCheckLine,
  RiAwardLine,
  RiCustomerService2Line,
  RiSettings4Line
} from "react-icons/ri";

const categories = [
  { 
    id: 'processor', 
    name: 'Processor', 
    count: 'Intel & AMD', 
    img: '/img/categories/processor.png',
    glowColor: 'hover:shadow-[0_0_25px_rgba(253,200,0,0.4)]',
    borderColor: 'group-hover:border-[#FDC800]',
    accentText: 'group-hover:text-[#FDC800]'
  },
  { 
    id: 'motherboard', 
    name: 'Motherboard', 
    count: 'Z790 / B650', 
    img: '/img/categories/motherboard.png',
    glowColor: 'hover:shadow-[0_0_25px_rgba(56,189,248,0.4)]',
    borderColor: 'group-hover:border-[#38BDF8]',
    accentText: 'group-hover:text-[#38BDF8]'
  },
  { 
    id: 'monitor', 
    name: 'Graphics Card', 
    count: 'RTX 40-Series', 
    img: '/img/categories/gpu.png',
    glowColor: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]',
    borderColor: 'group-hover:border-[#EF4444]',
    accentText: 'group-hover:text-[#EF4444]'
  },
  { 
    id: 'ram', 
    name: 'Memory', 
    count: 'DDR4 & DDR5', 
    img: '/img/categories/ram.png',
    glowColor: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]',
    borderColor: 'group-hover:border-[#3B82F6]',
    accentText: 'group-hover:text-[#3B82F6]'
  },
  { 
    id: 'storage', 
    name: 'Storage', 
    count: 'NVMe Gen4/Gen5', 
    img: '/img/categories/storage.png',
    glowColor: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]',
    borderColor: 'group-hover:border-[#F59E0B]',
    accentText: 'group-hover:text-[#F59E0B]'
  },
  { 
    id: 'supply', 
    name: 'Power Supply', 
    count: 'Gold / Platinum', 
    img: '/img/categories/supply.png',
    glowColor: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]',
    borderColor: 'group-hover:border-[#EC4899]',
    accentText: 'group-hover:text-[#EC4899]'
  },
  { 
    id: 'others', 
    name: 'Cases & Coolers', 
    count: 'AIO & RGB', 
    img: '/img/categories/others.png',
    glowColor: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]',
    borderColor: 'group-hover:border-[#06B6D4]',
    accentText: 'group-hover:text-[#06B6D4]'
  }
];

const HomePage = ({ allProducts }) => {
  const dispatch = useAppDispatch();
  const products = allProducts?.data || [];
  dispatch(avarageRating(products));

  const [activeFilter, setActiveFilter] = useState("all");

  const filterCategoryMap = {
    all: null,
    cpu: 'processor',
    gpu: 'monitor',
    motherboard: 'motherboard',
    ram: 'ram',
  };

  const filteredProducts = activeFilter === "all" 
    ? products.slice(0, 8) 
    : products.filter(p => p.category?.toLowerCase() === filterCategoryMap[activeFilter]?.toLowerCase()).slice(0, 8);

  return (
    <div className="bg-brand-navy min-h-screen text-brand-white font-body overflow-x-hidden">
      
      {/* ── 1. Hero Banner (XPG Saga Series Style with Anime & RGB PC Cases) ── */}
      <Banner />

      {/* ── 2. Shop by Category (Neubrutalism Grid) ────────── */}
      <section className="container mx-auto px-6 lg:px-8 py-16 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="brutal-pill bg-[#FDC800] text-black text-[10px] py-0.5 px-3 border-2 border-black font-black">
                CORE INVENTORY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight uppercase">
              EXPLORE BY <span className="text-[#FDC800]">CATEGORY</span>
            </h2>
          </div>
          <Link 
            href="/pcbuilder" 
            className="brutal-btn brutal-btn-gold px-6 py-3 text-xs tracking-wider flex items-center gap-2"
          >
            Launch PC Builder
            <RiArrowRightLine className="text-base" />
          </Link>
        </div>

        {/* Category Cards with Anime Artwork & Hardware Fusion */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.id}`}
              className={`group relative rounded-2xl overflow-hidden border-2 border-black bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-2.5 hover:scale-[1.03] shadow-brutal hover:shadow-brutal-lg ${cat.glowColor} ${cat.borderColor} flex flex-col`}
            >
              {/* Holographic light sweep on hover */}
              <div className="holo-sweep w-full h-full absolute inset-0 pointer-events-none z-20"></div>

              {/* Full HD Visual Anime Card */}
              <div className="relative w-full aspect-[305/497] overflow-hidden bg-[#0A0A0A]">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Interactive Quick Select Bar on Hover */}
              <div className="py-2 px-1 text-center bg-[#121212] border-t-2 border-black/80 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-heading font-black tracking-wider uppercase text-white group-hover:text-[#FDC800] group-hover:bg-[#1A1A1A] transition-all">
                <span>EXPLORE</span>
                <span className="text-[#FDC800]">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Cyber-Neubrutalism Custom PC Showcase Banner ── */}
      <section className="container mx-auto px-6 lg:px-8 mb-20">
        <div className="bg-brand-royal/20 border-3 border-black rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-brutal-lg bg-grid-pattern">
          
          {/* Energy background accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-electric/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="brutal-pill bg-brand-sakura text-white text-xs py-1 px-4">
                  ★ NEW 2026 EDITION
                </span>
                <span className="brutal-pill bg-brand-gold text-brand-navy text-xs py-1 px-3">
                  COMPATIBILITY ENGINE
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight leading-tight mb-4">
                BUILD YOUR <span className="text-[#FDC800]">DREAM RIG</span> WITH 100% COMPATIBILITY
              </h2>

              <p className="text-sm sm:text-base text-brand-white/70 max-w-xl mb-6 leading-relaxed">
                Choose every part with real-time bottleneck checks, power calculation, and instant local pricing. Assembled, stress-tested, and certified at The Computer Corner, Bathinda.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/pcbuilder" 
                  className="brutal-btn brutal-btn-gold px-8 py-4 text-sm font-heading tracking-wider flex items-center gap-2"
                >
                  <RiSettings4Line className="text-lg" />
                  Start Building Now
                </Link>
                <Link 
                  href="/prebuilt-pcs" 
                  className="brutal-btn bg-brand-navy-deep text-brand-white border-2 border-black hover:bg-brand-navy px-8 py-4 text-sm font-heading tracking-wider flex items-center gap-2"
                >
                  View Prebuilt Rigs
                </Link>
              </div>

            </div>

            {/* Right Polaroid Showcase Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative max-w-xs sm:max-w-sm w-full">
                
                {/* Spiky Starburst Sticker */}
                <div className="absolute -top-5 -right-5 z-20">
                  <StarburstBadge text="BEAST" color="yellow" size="md" />
                </div>

                {/* Polaroid Frame */}
                <div className="polaroid-card bg-[#FFFDF7] text-brand-navy">
                  <div className="h-48 sm:h-56 bg-brand-navy rounded-lg overflow-hidden border-2 border-black relative flex items-center justify-center p-4">
                    <img 
                      src="/img/hero/anime-gamer.jpg" 
                      alt="Custom Battlestation" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/logo.png";
                        e.target.className = "w-32 h-auto object-contain";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black text-brand-gold text-[10px] font-heading font-bold px-2 py-0.5 rounded border border-brand-gold/40">
                      ⚡ ROYAL LIQUID EDITION
                    </div>
                  </div>
                  
                  <div className="pt-3 flex justify-between items-center">
                    <div>
                      <p className="font-heading font-black text-xs text-black">
                        CUSTOM GAMING RIG #4090
                      </p>
                      <p className="text-[10px] text-gray-600 font-mono">
                        Bathinda Workshop Build
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── High-Visibility Neobrutalism Ticker Ribbon ───── */}
      <div className="bg-[#FDC800] text-[#0A0A0A] border-y-3 border-black py-3 overflow-hidden select-none shadow-brutal my-12">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee font-heading font-black text-xs sm:text-sm tracking-wider uppercase">
          <span className="flex items-center gap-2">⚡ BATHINDA&apos;S #1 GAMING PC DESTINATION</span>
          <span>✦</span>
          <span className="flex items-center gap-2">🛡️ 3-YEAR COMPREHENSIVE WARRANTY</span>
          <span>✦</span>
          <span className="flex items-center gap-2">👑 ROYAL CRAFTSMANSHIP & RIGS</span>
          <span>✦</span>
          <span className="flex items-center gap-2">🚀 FAST PAN-INDIA SHIPPING</span>
          <span>✦</span>
          <span className="flex items-center gap-2">🎮 TEST BENCHED & GAME READY</span>
          <span>✦</span>
          <span className="flex items-center gap-2">⚡ BATHINDA&apos;S #1 GAMING PC DESTINATION</span>
        </div>
      </div>

      {/* ── 4. Featured Products Section ─────────────────── */}
      <section className="container mx-auto px-6 lg:px-8 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="brutal-pill bg-brand-gold text-brand-navy text-[10px] py-0.5 px-3">
                CERTIFIED HARDWARE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight">
              FEATURED <span className="text-brand-gold">COMPONENTS</span>
            </h2>
          </div>

          {/* Filter Pills in Neubrutalism style */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Gear' },
              { id: 'cpu', label: 'Processors' },
              { id: 'gpu', label: 'Graphics Cards' },
              { id: 'motherboard', label: 'Motherboards' },
              { id: 'ram', label: 'Memory' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider border-2 border-black transition-all ${
                  activeFilter === tab.id 
                    ? 'bg-brand-gold text-brand-navy shadow-brutal-sm scale-105' 
                    : 'bg-brand-navy-deep text-brand-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, idx) => (
              <Card key={product._id} product={product} featured={idx === 0} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center brutal-card p-8">
              <p className="text-brand-white/50 text-base font-sub">No components found under this category.</p>
              <button 
                onClick={() => setActiveFilter('all')} 
                className="mt-4 brutal-btn brutal-btn-gold px-6 py-2 text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-14 flex justify-center">
          <Link 
            href="/category/processor" 
            className="brutal-btn bg-brand-navy-deep text-brand-white border-2 border-black hover:border-brand-gold hover:text-brand-gold px-10 py-4 text-sm font-heading tracking-wider"
          >
            Explore Complete Inventory &rarr;
          </Link>
        </div>
      </section>

      {/* ── 6. Why Choose The Computer Corner (Neubrutalism Cards) ── */}
      <section className="container mx-auto px-6 lg:px-8 py-20 border-t-2 border-black">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="brutal-pill bg-[#A78BFA] text-brand-navy text-[10px] py-1 px-4 mb-3">
            ROYAL ASSURANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight mb-3">
            WHY GAMERS TRUST <span className="text-brand-gold">THE COMPUTER CORNER</span>
          </h2>
          <p className="text-sm text-brand-white/50 font-body">
            Bathinda&apos;s premier custom rig builder delivering enterprise precision and zero compromise hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <RiAwardLine className="text-3xl text-brand-gold" />,
              title: "100% Brand Authentic",
              desc: "Direct authorized channel partner for Intel, AMD, ASUS, MSI, Gigabyte & Corsair.",
              tag: "GENUINE"
            },
            {
              icon: <RiFlashlightLine className="text-3xl text-brand-electric" />,
              title: "Thermal Stress-Tested",
              desc: "Every PC undergoes a 12-hour synthetic benchmark stress test before packing.",
              tag: "BENCHMARKED"
            },
            {
              icon: <RiShieldCheckLine className="text-3xl text-brand-teal" />,
              title: "3-Year Royal Warranty",
              desc: "Complete component replacement support and lifetime offline store backup.",
              tag: "WARRANTY"
            },
            {
              icon: <RiCustomerService2Line className="text-3xl text-brand-sakura" />,
              title: "Bathinda Store Support",
              desc: "Walk in to our local store for custom consultation, upgrades, and hands-on testing.",
              tag: "LOCAL STORE"
            }
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-brand-navy-deep border-2 border-black rounded-2xl p-6 shadow-brutal-sm hover:shadow-brutal hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-xl bg-black border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-brand-gold border border-brand-gold/30">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base font-sub font-bold text-brand-white mb-2 group-hover:text-brand-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-white/50 leading-relaxed font-body">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;

export const getStaticProps = async () => {
  try {
    const pool = (await import('@/utils/db')).default;
    const [rows] = await pool.query('SELECT * FROM products');
    const data = JSON.parse(JSON.stringify(rows));
    
    return {
      props: {
        allProducts: { data },
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching products for static generation:', error);
    return {
      props: {
        allProducts: { data: [] },
      },
      revalidate: 10,
    };
  }
};
