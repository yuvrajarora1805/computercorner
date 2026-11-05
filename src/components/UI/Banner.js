import Link from "next/link";
import { RiTruckLine, RiShieldCheckLine, RiCustomerService2Line, RiCpuLine, RiArrowRightLine, RiFlashlightLine, RiShieldStarLine, RiGamepadLine, RiFocus2Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import StarburstBadge from "@/components/UI/StarburstBadge";

const slides = [
  {
    badge: "XTREME UNIVERSE · SAGA SERIES",
    titleMain: "INVADER X BATTLESTATION",
    titleSub: "Saga Series",
    tagline: "MINI CASE, XTREME STYLE · LIQUID COOLED",
    description: "Precision engineered with dual-chamber airflow, panoramic tempered glass, and competitive esports tuning.",
    tag1: "RTX 4090 READY",
    tag2: "PANORAMIC GLASS",
    tag3: "360MM AIO SUPPORT",
    accentColor: "#FDC800",
  },
  {
    badge: "HYPER THREADING · PRO WORKSTATION",
    titleMain: "TITAN APEX WORKSTATION",
    titleSub: "Creator Edition",
    tagline: "MAXIMUM COMPUTE, ZERO BOTTLENECK",
    description: "Engineered for 8K video rendering, deep learning AI workflows, and uncompromising 3D production power.",
    tag1: "64-CORE AMD/INTEL",
    tag2: "128GB DDR5 ECC",
    tag3: "GEN5 NVME 14GB/s",
    accentColor: "#432DD7",
  },
  {
    badge: "CUSTOM LIQUID RIG · ZERO NOISE",
    titleMain: "CYBER HYDRA CUSTOM RIG",
    titleSub: "Hardline Edition",
    tagline: "HAND-CRAFTED IN BATHINDA WORKSHOP",
    description: "Bespoke hard-tubing liquid loop with dual 360mm radiators, custom distro plate, and precision temperature sensors.",
    tag1: "HARDLINE TUBE",
    tag2: "DISTRO PLATE",
    tag3: "SUB-55°C THERMALS",
    accentColor: "#16A34A",
  }
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsHovering(true);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -6;
    const tiltY = ((x - centerX) / centerX) * 6;
    setCardTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCardTilt({ x: 0, y: 0 });
  };

  const slide = slides[currentSlide];

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#0A0A0A] text-white overflow-hidden font-body select-none"
    >
      
      {/* ═══════════════════════════════════════════════════════════
          RICH GAMING & JAPANESE CYBER-ANIME BACKGROUND SYSTEM
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Animated Laser Radar Scan Line */}
        <div className="animate-laser-scan" />

        {/* Dynamic Interactive Cursor ARGB Spotlight */}
        {isHovering && (
          <div 
            className="absolute pointer-events-none transition-opacity duration-200"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              transform: 'translate(-50%, -50%)',
              width: '650px',
              height: '650px',
              background: 'radial-gradient(circle, rgba(253, 200, 0, 0.12) 0%, rgba(67, 45, 215, 0.05) 45%, transparent 70%)',
              zIndex: 2,
            }}
          />
        )}

        {/* 1. Cyber Circuit & Honeycomb Grid SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gaming-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FDC800" strokeWidth="0.5" strokeOpacity="0.4" />
              <circle cx="0" cy="0" r="1.5" fill="#FDC800" fillOpacity="0.7" />
              <circle cx="60" cy="60" r="1.5" fill="#FDC800" fillOpacity="0.7" />
            </pattern>
            {/* Hexagon Honeycomb */}
            <pattern id="hex-pattern" width="80" height="138.56" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 23.09 L80 69.28 L40 92.37 L0 69.28 L0 23.09 Z M40 138.56 L80 115.47 L80 69.28 L40 92.37 L0 69.28 L0 115.47 Z" fill="none" stroke="#FDC800" strokeWidth="0.5" strokeOpacity="0.15"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gaming-grid)" />
          <rect width="100%" height="100%" fill="url(#hex-pattern)" opacity="0.6" />
        </svg>

        {/* 2. Full-Bleed Angled Watermark Typography Rows (XPG Style) */}
        <div className="absolute -inset-20 flex flex-col justify-around rotate-[-12deg] opacity-[0.05] pointer-events-none select-none">
          {[
            "XTREME · THE COMPUTER CORNER · CUSTOM RIGS · BATTLESTATION · SAGA SERIES · BATHINDA · POWER · PRECISION",
            "TITAN APEX · OVERCLOCKED · RTX 4090 · LIQUID COOLED · 360HZ · ESPORTS READY · PERFORMANCE FIRST",
            "THE COMPUTER CORNER · HIGH-PERFORMANCE WORKSTATIONS · THERMAL OPTIMIZED · ZERO BOTTLENECK · GENUINE",
            "XTREME UNIVERSE · PANORAMIC TEMPERED GLASS · ARGB SYNC · CUSTOM DISTRO PLATE · HARDLINE TUBING",
            "BATTLE-READY RIGS · INTEL CORE I9 · AMD RYZEN 9 · 6000MHZ DDR5 · PCIE GEN5 NVME · SUB-50°C THERMALS",
            "XTREME · THE COMPUTER CORNER · CUSTOM RIGS · BATTLESTATION · SAGA SERIES · BATHINDA · POWER · PRECISION"
          ].map((textLine, i) => (
            <div key={i} className="whitespace-nowrap font-heading font-black text-4xl sm:text-6xl tracking-[0.25em] text-[#FDC800]">
              {textLine}
            </div>
          ))}
        </div>

        {/* 3. Glowing Circuit Traces & PCB Pathways */}
        <svg className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M800 100 L550 100 L450 200 L250 200 L200 250 L100 250" stroke="#FDC800" strokeWidth="1.5" strokeDasharray="6 4" />
          <path d="M800 350 L600 350 L520 430 L380 430 L320 490 L150 490" stroke="#FDC800" strokeWidth="1.5" strokeDasharray="8 6" />
          <path d="M700 0 L700 180 L620 260 L620 500" stroke="#FFE500" strokeWidth="1" opacity="0.7" />
          <circle cx="550" cy="100" r="4" fill="#FDC800" />
          <circle cx="450" cy="200" r="4" fill="#FDC800" />
          <circle cx="200" cy="250" r="5" fill="#FFE500" />
          <circle cx="600" cy="350" r="4" fill="#FDC800" />
          <circle cx="520" cy="430" r="4" fill="#FFE500" />
        </svg>

        {/* 4. Japanese Vertical Cyber Ribbons (Tategaki) */}
        <div className="absolute left-3 top-1/4 z-10 hidden 2xl:flex flex-col items-center gap-4 text-[#FDC800]/25 font-bold select-none tracking-[0.4em] pointer-events-none [writing-mode:vertical-rl]">
          <span className="text-xs font-mono font-black">『極限性能』</span>
          <span className="w-px h-8 bg-[#FDC800]/30"></span>
          <span className="text-xs font-mono font-black">『電脳工房』</span>
          <span className="w-px h-8 bg-[#FDC800]/30"></span>
          <span className="text-xs font-mono font-black">『最強構成』</span>
        </div>

        <div className="absolute right-3 top-1/4 z-10 hidden 2xl:flex flex-col items-center gap-4 text-[#FDC800]/25 font-bold select-none tracking-[0.4em] pointer-events-none [writing-mode:vertical-rl]">
          <span className="text-xs font-mono font-black">『皇室特製』</span>
          <span className="w-px h-8 bg-[#FDC800]/30"></span>
          <span className="text-xs font-mono font-black">『究極冷却』</span>
          <span className="w-px h-8 bg-[#FDC800]/30"></span>
          <span className="text-xs font-mono font-black">『不敗無敵』</span>
        </div>

        {/* 5. Gaming Ambient Underglow / Backlight Aura */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FDC800]/10 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#432DD7]/15 rounded-full blur-[150px] pointer-events-none"></div>

        {/* 6. Floating Gaming Energy Particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              backgroundColor: i % 2 === 0 ? '#FDC800' : '#432DD7',
              left: `${10 + (i * 9) % 85}%`,
              bottom: `${5 + (i * 11) % 80}%`,
              opacity: 0.35 + (i % 4) * 0.15,
              boxShadow: i % 2 === 0 ? '0 0 10px #FDC800' : '0 0 10px #432DD7',
              animation: `float ${5 + (i % 5) * 2}s ease-in-out infinite`,
              animationDelay: `${(i * 0.7) % 4}s`
            }}
          />
        ))}

        {/* 7. Gaming HUD Crosshairs & Telemetry Badges */}
        <div className="absolute top-6 left-8 font-mono text-[10px] text-white/40 hidden sm:flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping inline-block"></span>
          <span>SYS.ONLINE // 240+ FPS TUNED // 0.5ms LATENCY</span>
          <span className="text-[#FDC800]/60">『電脳工房』</span>
        </div>
        <div className="absolute top-6 right-8 font-mono text-[10px] text-[#FDC800]/60 hidden sm:flex items-center gap-2">
          <RiFocus2Line className="text-sm" />
          <span>BATTLESTATION TARGETING READY // 極限</span>
        </div>

      </div>

      {/* ── Main Hero Presentation Stage ────────────────── */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-12 pb-20 lg:py-24 flex flex-col lg:flex-row items-center justify-between min-h-[78vh] gap-10">
        
        {/* Left Side: XPG-Style Typography & Controls */}
        <div className={`w-full lg:w-3/5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Eyebrow Pill Tag with Manga Accent */}
          <div className="flex items-center gap-2 mb-4 flex-wrap justify-center lg:justify-start">
            <span className="brutal-pill bg-[#FDC800] text-[#0A0A0A] text-xs py-1 px-3 border-2 border-black font-black tracking-wider uppercase">
              ⚡ {slide.badge}
            </span>
            <span className="brutal-pill bg-[#121212] text-[#FDC800] text-xs py-1 px-3 border-2 border-black font-bold">
              EST. BATHINDA · 『本物保証』
            </span>
          </div>

          {/* Main XPG-Style Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.05] mb-2 uppercase">
            <span className="text-white block drop-shadow-md">
              {slide.titleMain}
            </span>
            <span className="text-[#FDC800] block text-3xl sm:text-5xl lg:text-6xl normal-case font-black tracking-tight mt-1">
              {slide.titleSub}
            </span>
          </h1>
          
          {/* Tagline Banner */}
          <p className="font-heading font-bold text-sm sm:text-base text-[#FDC800] tracking-[0.2em] uppercase mt-2 mb-4">
            {slide.tagline}
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/70 max-w-xl mb-6 leading-relaxed font-body">
            {slide.description}
          </p>

          {/* Spec Tags */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] border-2 border-black rounded-md text-xs font-heading font-bold text-white shadow-brutal-sm hover:border-[#FDC800] hover:text-[#FDC800] transition-colors">
              <RiFlashlightLine className="text-[#FDC800]" /> {slide.tag1}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] border-2 border-black rounded-md text-xs font-heading font-bold text-white shadow-brutal-sm hover:border-[#16A34A] hover:text-[#16A34A] transition-colors">
              <RiShieldStarLine className="text-[#16A34A]" /> {slide.tag2}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] border-2 border-black rounded-md text-xs font-heading font-bold text-white shadow-brutal-sm hover:border-[#FDC800] hover:text-[#FDC800] transition-colors">
              <RiCpuLine className="text-[#FDC800]" /> {slide.tag3}
            </span>
          </div>
          
          {/* CTA Buttons in Jet Black & High Contrast Yellow */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/prebuilt-pcs" 
              className="brutal-btn bg-[#FDC800] text-[#0A0A0A] hover:bg-[#FFE500] px-8 py-4 text-sm font-heading font-black tracking-wider flex items-center justify-center gap-2 border-2 border-black group shadow-brutal"
            >
              Configure Saga Build
              <RiArrowRightLine className="text-lg group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link 
              href="/pcbuilder" 
              className="brutal-btn bg-[#121212] text-white hover:text-[#FDC800] hover:border-[#FDC800] px-8 py-4 text-sm font-heading font-bold tracking-wider flex items-center justify-center gap-2 border-2 border-black shadow-brutal"
            >
              3D Custom Builder
            </Link>
          </div>

          {/* XPG-Style Dash Carousel Indicators [ — ] [ - ] [ - ] */}
          <div className="flex items-center gap-3 mt-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 border border-black ${
                  currentSlide === idx 
                    ? 'w-12 bg-[#FDC800] shadow-[0_0_12px_#FDC800]' 
                    : 'w-4 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
            <span className="text-[11px] font-mono text-white/50 ml-2">
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>

        </div>

        {/* Right Side: Anime Gamer Mascot + Gaming PC Case Fusion Stage with 3D Parallax Tilt */}
        <div className="w-full lg:w-2/5 flex justify-center items-center relative">
          
          <div 
            className="relative w-full max-w-md"
            style={{ 
              transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
              transition: isHovering ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            
            {/* Top Starburst Sticker */}
            <div className="absolute -top-6 -right-4 z-30">
              <StarburstBadge text="SAGA" color="yellow" size="md" />
            </div>

            {/* Manga Onomatopoeia Sticker (DOGO-N!) */}
            <div className="absolute -top-3 left-6 z-30 brutal-pill bg-[#FDC800] text-black text-[10px] font-black border-2 border-black rotate-[-8deg] shadow-brutal-sm hover:rotate-0 transition-transform">
              ドゴォォ！ DOGO-N
            </div>

            {/* Bottom-Left Starburst Sticker */}
            <div className="absolute -bottom-6 -left-4 z-30">
              <StarburstBadge text="4090" color="orange" size="sm" />
            </div>

            {/* Main Character & Hardware Visual Box with 3D Pop */}
            <div className="polaroid-card bg-[#FBFBF9] text-[#1C293C] overflow-hidden border-3 border-black shadow-brutal-lg">
              
              {/* Media Container with Anime Hero Character */}
              <div className="relative h-72 sm:h-96 w-full rounded-md overflow-hidden border-2 border-black bg-[#0A0A0A] group/media">
                
                {/* Anime Hero Mascot Image */}
                <img 
                  src="/img/hero/anime-gamer.jpg" 
                  alt="XPG Anime Gamer Saga Series" 
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logo.png";
                    e.target.className = "w-3/4 h-auto mx-auto object-contain my-10";
                  }}
                />

                {/* Overlaid Hardware Showcase Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0A0A0A]/95 backdrop-blur-md border-2 border-black rounded-lg p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-heading font-black text-[#FDC800] uppercase tracking-wider block">
                      INVADER X SAGA CASE · 『特装版』
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      DUAL CHAMBER · RGB SYNC
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-[#0A0A0A] bg-[#FDC800] px-2.5 py-1 rounded border border-black shadow-brutal-sm">
                    IN STOCK
                  </span>
                </div>

                {/* Top Badge */}
                <div className="absolute top-3 left-3 bg-[#FDC800] text-[#0A0A0A] px-3 py-1 rounded border border-black text-[10px] font-heading font-black uppercase tracking-wider shadow-brutal-sm">
                  ⚡ THE COMPUTER CORNER · 電脳
                </div>
              </div>

              {/* Caption Underneath (Neubrutalism Style) */}
              <div className="pt-3 px-1 flex items-center justify-between font-mono">
                <div>
                  <p className="font-heading font-black text-xs text-[#1C293C] uppercase tracking-wider">
                    Saga Series · Custom Rig 01
                  </p>
                  <p className="text-[10px] text-gray-500 font-semibold">
                    Bathinda Workshop · 『皇帝仕様』
                  </p>
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FDC800] border-2 border-black inline-block"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#432DD7] border-2 border-black inline-block"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#16A34A] border-2 border-black inline-block"></span>
                </div>
              </div>

            </div>

            {/* Jet Black & Yellow Offset Shadow Plate */}
            <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl bg-[#FDC800] border-3 border-black -z-10 hidden sm:block"></div>
          </div>

        </div>

      </div>

      {/* ── 4. XPG-Style Bold High-Contrast "Product Category" Transition Ribbon ── */}
      <div className="relative z-20 bg-[#FDC800] text-[#0A0A0A] py-4 border-y-3 border-black shadow-brutal">
        <div className="container mx-auto px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-[#0A0A0A] rounded-full inline-block animate-pulse"></span>
            <h3 className="font-heading font-black text-lg sm:text-2xl uppercase tracking-wider text-[#0A0A0A]">
              PRODUCT CATEGORIES · 『製品一覧』
            </h3>
          </div>
          <p className="font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] text-[#0A0A0A]">
            DISCOVER YOUR WEAPON · SELECT HARDWARE BELOW
          </p>
        </div>
      </div>

      {/* ── 5. Features Grid in High Contrast Jet Black ────── */}
      <div className="relative z-10 bg-[#121212] py-8 border-b-2 border-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {[
              { icon: <RiShieldCheckLine />, title: "3 Years Warranty", desc: "Comprehensive on all rigs", jp: "3年保証" },
              { icon: <RiTruckLine />, title: "Safe Pan-India Delivery", desc: "Insured express shipping", jp: "迅速配送" },
              { icon: <RiCpuLine />, title: "100% Genuine Components", desc: "Official brand warranty", jp: "本物保証" },
              { icon: <RiCustomerService2Line />, title: "Bathinda Store Support", desc: "Walk-in upgrades & help", jp: "店舗支援" },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-[#0A0A0A] border-2 border-black rounded-xl p-4 shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-[#171717] border-2 border-black flex items-center justify-center text-xl text-[#FDC800] mb-2 group-hover:scale-110 group-hover:border-[#FDC800] transition-all">
                  {feature.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-white font-sub font-bold text-sm tracking-wide">{feature.title}</h4>
                  <span className="text-[10px] text-[#FDC800]/50 font-mono">({feature.jp})</span>
                </div>
                <p className="text-white/40 text-xs font-body mt-0.5">{feature.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>
  );
};

export default Banner;
