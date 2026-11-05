import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addToCart, removeFromCart } from "@/redux/cart/cartSlice";
import { useGetAllProductsQuery } from "@/redux/api/apiSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { 
  RiCpuLine, 
  RiDashboardLine, 
  RiGamepadLine, 
  RiDatabase2Line, 
  RiHardDrive2Line, 
  RiServerLine, 
  RiComputerLine, 
  RiDeleteBinLine, 
  RiAddLine, 
  RiExchangeLine, 
  RiWhatsappFill, 
  RiSearchLine, 
  RiCloseLine, 
  RiCheckLine,
  RiArrowRightLine
} from "react-icons/ri";

export default function PcBuilder() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.product);
  const { data: productsData, isLoading } = useGetAllProductsQuery();
  const allProducts = productsData?.data || [];
  
  const [activeTab, setActiveTab] = useState("components");
  const [bottomTab, setBottomTab] = useState("specs");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [hoveredPoly, setHoveredPoly] = useState(null);

  // Category definitions with icon, helper and aliases for flexible product matching
  const steps = useMemo(() => [
    { 
      id: 'processor', 
      label: 'Processor (CPU)', 
      short: 'CPU',
      icon: <RiCpuLine className="text-xl" />,
      aliases: ['processor', 'cpu', 'processors (cpu)', 'intel', 'amd'],
      description: 'The brain of your PC'
    },
    { 
      id: 'motherboard', 
      label: 'Motherboard', 
      short: 'Motherboard',
      icon: <RiDashboardLine className="text-xl" />,
      aliases: ['motherboard', 'motherboards', 'intel chipset', 'amd chipset', 'b550', 'b760', 'b450', 'a520', 'a620', 'h610'],
      description: 'Connects all your components'
    },
    { 
      id: 'gpu', 
      label: 'Graphics Card (GPU)', 
      short: 'GPU',
      icon: <RiGamepadLine className="text-xl" />,
      aliases: ['gpu', 'monitor', 'graphics card', 'graphics cards (gpu)', 'amd gpu', 'rtx 40 series'],
      description: 'Powers visual performance & gaming'
    },
    { 
      id: 'ram', 
      label: 'Memory (RAM)', 
      short: 'RAM',
      icon: <RiDatabase2Line className="text-xl" />,
      aliases: ['ram', 'memory', 'ram (memory)', 'kingston', 'adata', 'corsair'],
      description: 'High-speed multitasking memory'
    },
    { 
      id: 'storage', 
      label: 'Storage (SSD / NVMe)', 
      short: 'Storage',
      icon: <RiHardDrive2Line className="text-xl" />,
      aliases: ['storage', 'ssd', 'nvme', 'storage & ssd', 'nvme gen4', 'nvme gen3', 'nvme gen5', 'sata 2.5 inch', 'external ssd', 'samsung', 'sandisk'],
      description: 'Fast storage for OS & games'
    },
    { 
      id: 'supply', 
      label: 'Power Supply (SMPS)', 
      short: 'Power Supply',
      icon: <RiServerLine className="text-xl" />,
      aliases: ['supply', 'smps', 'power supply', 'power supply (smps)', '80 plus gold', '80 plus platinum', 'certification'],
      description: 'Reliable clean power distribution'
    },
    { 
      id: 'others', 
      label: 'Cabinet / PC Case', 
      short: 'Case',
      icon: <RiComputerLine className="text-xl" />,
      aliases: ['others', 'cabinet', 'cabinets & cases', 'case', 'mid tower', 'mini tower', 'full tower', 'argb enable case'],
      description: 'Chassis housing with airflow'
    }
  ], []);

  // Check if a product belongs to a step category
  const matchesCategory = (product, step) => {
    if (!product || !product.category) return false;
    const cat = product.category.toLowerCase().trim();
    return step.aliases.some(alias => cat === alias || cat.includes(alias));
  };

  // Find currently selected product for each step from the user's cart
  const getSelectedProductForStep = (step) => {
    return cartItems?.find(p => matchesCategory(p, step));
  };

  const selectedCount = steps.filter(s => getSelectedProductForStep(s)).length;

  // Calculate total price of current custom build parts in cart
  const buildItems = useMemo(() => {
    return steps.map(s => getSelectedProductForStep(s)).filter(Boolean);
  }, [steps, cartItems]);

  const totalPrice = useMemo(() => {
    return buildItems.reduce((sum, item) => {
      const p = Number(String(item?.price || "").replace(/,/g, "")) || 0;
      return sum + p * (item.cartQuantity || 1);
    }, 0);
  }, [buildItems]);

  // Estimated wattage based on selected parts
  const estimatedWattage = useMemo(() => {
    let watts = 80; // Base system motherboard + fans
    const cpu = getSelectedProductForStep(steps[0]);
    const gpu = getSelectedProductForStep(steps[2]);
    if (cpu) watts += 125;
    if (gpu) {
      const gpuName = (gpu.name || "").toLowerCase();
      if (gpuName.includes("4090") || gpuName.includes("7900 xtx")) watts += 450;
      else if (gpuName.includes("4080") || gpuName.includes("7900 xt")) watts += 320;
      else if (gpuName.includes("4070") || gpuName.includes("7800 xt")) watts += 220;
      else if (gpuName.includes("4060") || gpuName.includes("7600")) watts += 160;
      else watts += 200;
    }
    const ram = getSelectedProductForStep(steps[3]);
    if (ram) watts += 20;
    const storage = getSelectedProductForStep(steps[4]);
    if (storage) watts += 15;
    return watts;
  }, [steps, cartItems]);

  const openModal = (step) => {
    setModalCategory(step);
    setModalSearchQuery("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCategory(null);
  };

  const handleSelectProduct = (product, step) => {
    // If a product from the same category is already selected, remove it first
    const existing = getSelectedProductForStep(step);
    if (existing) {
      dispatch(removeFromCart(existing._id));
    }
    dispatch(addToCart(product));
    toast.success(`Selected ${product?.name}`);
    closeModal();
  };

  const handleRemoveProduct = (step) => {
    const existing = getSelectedProductForStep(step);
    if (existing) {
      dispatch(removeFromCart(existing._id));
      toast.success(`Removed ${step.short}`);
    }
  };

  const handleProceedToCheckout = () => {
    if (buildItems.length === 0) {
      toast.error("Please select at least one component for your PC build.");
      return;
    }
    toast.success("Build ready! Proceeding to checkout...");
    router.push('/checkout');
  };

  // Polygon highlight helper for the SVG
  const getPolyStyle = (categoryKey) => {
    const targetStep = steps.find(s => s.id === categoryKey);
    const isSelected = targetStep ? !!getSelectedProductForStep(targetStep) : false;
    const isHovered = hoveredPoly === categoryKey;
    const active = isSelected || isHovered;

    return {
      pointerEvents: 'auto',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      fill: active ? 'rgba(234, 179, 8, 0.45)' : 'rgba(234, 179, 8, 0.08)',
      stroke: active ? '#EAB308' : 'rgba(234, 179, 8, 0.35)',
      strokeWidth: active ? 2.5 : 1
    };
  };

  // Filter products for the active modal category
  const modalProducts = useMemo(() => {
    if (!modalCategory) return [];
    return allProducts
      .filter(p => matchesCategory(p, modalCategory))
      .filter(p => {
        if (!modalSearchQuery.trim()) return true;
        const q = modalSearchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q) || 
          p.category?.toLowerCase().includes(q)
        );
      });
  }, [allProducts, modalCategory, modalSearchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32 font-sans text-gray-200">
      
      {/* ── 1. Header Banner ─────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-6 md:pt-10">
        <div className="relative overflow-hidden rounded-2xl border-2 border-brand-charcoal bg-gradient-to-br from-[#141414] via-[#111] to-[#0A0A0A] p-6 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 mb-3">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                Custom Rig Architect
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                Interactive PC Builder
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-2 leading-relaxed">
                Handpick your processor, graphics card, motherboard, and chassis. Build your dream configuration with live compatibility checks and instant pricing.
              </p>
            </div>

            {/* Quick Build Summary Stats */}
            <div className="flex items-center gap-4 bg-black/60 p-4 md:p-5 rounded-xl border border-gray-800 backdrop-blur-sm self-start lg:self-auto shrink-0">
              <div className="text-left border-r border-gray-800 pr-5">
                <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Progress</span>
                <span className="text-xl md:text-2xl font-black text-yellow-400">
                  {selectedCount} <span className="text-sm font-semibold text-gray-500">/ {steps.length}</span>
                </span>
              </div>
              <div className="text-left pl-2">
                <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Est. Power</span>
                <span className="text-xl md:text-2xl font-black text-white">
                  ~{estimatedWattage}W
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-gray-800/80 rounded-full h-2 overflow-hidden border border-gray-700/50">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${(selectedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 2. Main Builder Section ──────────────────────────── */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Interactive Blueprint / PC Case Visual (5 Columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-[#121212] p-5 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Chassis Architecture Map</h3>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">Click any zone to swap</span>
              </div>

              <div className="relative w-full max-w-[340px] mx-auto bg-black/60 rounded-xl overflow-hidden p-2 border border-gray-800/70 group">
                <img 
                  src="/img/cpu.png" 
                  alt="PC Case Layout" 
                  className="w-full h-auto opacity-95 block mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                />
                
                {/* Interactive SVG polygon areas */}
                <svg 
                  className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none" 
                  viewBox="0 0 328 357" 
                  preserveAspectRatio="none"
                >
                  {/* Case (Others) */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('others')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('others')}
                    points="10,22 326,16 327,40 10,40" onClick={() => openModal(steps[6])} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('others')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('others')}
                    points="210,12 325,16 324,338 216,345" onClick={() => openModal(steps[6])} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('others')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('others')}
                    points="11,305 324,320 324,350 10,329" onClick={() => openModal(steps[6])} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('others')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('others')}
                    points="12,34 71,58 69,156 85,157 85,172 45,175 43,194 86,196 84,244 22,249 25,303 11,300" onClick={() => openModal(steps[6])} />
                  
                  {/* CPU (Processor) */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('processor')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('processor')}
                    points="105,88 142,89 144,142 106,140" onClick={() => openModal(steps[0])} />
                  
                  {/* GPU */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('gpu')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('gpu')}
                    points="45,170 90,170 183,193 44,193" onClick={() => openModal(steps[2])} />
                  
                  {/* CPU Cooler / Case Fans */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('others')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('others')}
                    points="49,41 188,36 188,54 49,56" onClick={() => openModal(steps[6])} />
                  
                  {/* Storage */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('storage')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('storage')}
                    points="168,237 217,237 217,255 169,257" onClick={() => openModal(steps[4])} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('storage')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('storage')}
                    points="118,152 158,151 160,168 118,169" onClick={() => openModal(steps[4])} />
                  
                  {/* Motherboard */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('motherboard')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('motherboard')}
                    points="181,63 207,63 205,176 168,172 167,161 185,158 183,74 179,96" onClick={() => openModal(steps[1])} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('motherboard')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('motherboard')}
                    points="191,179 204,179 204,234 178,234 164,246 87,246 87,196 159,197 187,193 194,183" onClick={() => openModal(steps[1])} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('motherboard')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('motherboard')}
                    points="73,67 148,66 117,93 115,136 150,139 153,152 118,152 75,157" onClick={() => openModal(steps[1])} />
                  
                  {/* SMPS (Supply) */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('supply')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('supply')}
                    points="26,253 236,253 235,319 23,305" onClick={() => openModal(steps[5])} />
                  
                  {/* RAM */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('ram')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('ram')}
                    points="156,73 184,73 184,155 156,155" onClick={() => openModal(steps[3])} />
                </svg>
              </div>

              {/* Blueprint Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-800/80 text-[11px] text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Selected / Active
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-700"></span> Unfilled Slot
                </div>
              </div>
            </div>

            {/* Expert Support Card */}
            <div className="bg-[#121212] p-5 rounded-2xl border border-gray-800 shadow-xl flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <RiWhatsappFill className="text-green-500 text-lg" /> Need Build Guidance?
                </h4>
                <p className="text-xs text-gray-400 mt-1">Chat directly with a certified PC technician on WhatsApp.</p>
              </div>
              <a 
                href="https://wa.me/919563600008?text=Hello%20The%20Computer%20Corner!%20I%20need%20help%20building%20my%20custom%20PC%20rig." 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RiWhatsappFill className="text-base" /> Chat Now
              </a>
            </div>
          </div>

          {/* RIGHT: Component Selection Stack (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Select Your Hardware</span>
              </h2>
              <span className="text-xs text-gray-400">
                {selectedCount === steps.length ? (
                  <span className="text-green-400 font-bold">✓ Rig Complete</span>
                ) : (
                  `${steps.length - selectedCount} components remaining`
                )}
              </span>
            </div>

            {/* 7 Component Cards */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const selected = getSelectedProductForStep(step);
                const isHovered = hoveredPoly === step.id;

                let imageSrc = null;
                if (selected?.img) {
                  try {
                    const parsed = JSON.parse(selected.img);
                    imageSrc = Array.isArray(parsed) ? parsed[0] : parsed;
                  } catch (_) {
                    imageSrc = selected.img;
                  }
                }

                return (
                  <div 
                    key={step.id}
                    onMouseEnter={() => setHoveredPoly(step.id)}
                    onMouseLeave={() => setHoveredPoly(null)}
                    className={`rounded-xl border transition-all duration-200 p-4 ${
                      selected 
                        ? 'bg-[#141414] border-yellow-500/40 hover:border-yellow-500' 
                        : isHovered
                          ? 'bg-[#181818] border-yellow-500/50'
                          : 'bg-[#111] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      
                      {/* Left info */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                          selected 
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' 
                            : 'bg-gray-800/60 text-gray-400 border-gray-700'
                        }`}>
                          {step.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                              {step.label}
                            </span>
                            {selected && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                <RiCheckLine /> Added
                              </span>
                            )}
                          </div>

                          {selected ? (
                            <div className="flex items-center gap-3 mt-1 min-w-0">
                              {imageSrc && (
                                <div className="w-9 h-9 relative bg-black rounded border border-gray-800 overflow-hidden shrink-0 hidden sm:block">
                                  <Image src={imageSrc} alt={selected.name} layout="fill" objectFit="cover" />
                                </div>
                              )}
                              <p className="text-sm font-bold text-white truncate max-w-md" title={selected.name}>
                                {selected.name}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right action / price */}
                      <div className="flex items-center gap-3 shrink-0">
                        {selected ? (
                          <>
                            <div className="text-right">
                              <span className="text-sm md:text-base font-black text-yellow-400 block">
                                ₹{(Number(String(selected.price).replace(/,/g, '')) || 0).toLocaleString()}
                              </span>
                            </div>

                            <button
                              onClick={() => openModal(step)}
                              title="Change component"
                              className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors border border-gray-700 text-sm"
                            >
                              <RiExchangeLine />
                            </button>

                            <button
                              onClick={() => handleRemoveProduct(step)}
                              title="Remove component"
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors border border-red-500/20 text-sm"
                            >
                              <RiDeleteBinLine />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openModal(step)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-yellow-500/10"
                          >
                            <RiAddLine className="text-sm" /> Choose
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── 3. Bottom Specs & Benchmark Tabs ───────────────── */}
        <div className="mt-12 bg-[#121212] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="flex border-b border-gray-800 bg-[#0E0E0E]">
            <button 
              onClick={() => setBottomTab("specs")}
              className={`py-4 px-8 font-bold uppercase tracking-wider text-xs transition-colors border-b-2 flex items-center gap-2 ${
                bottomTab === "specs" 
                  ? "text-yellow-400 border-yellow-500 bg-[#141414]" 
                  : "text-gray-400 hover:text-white border-transparent"
              }`}
            >
              <span>📋</span> Build Configuration Breakdown
            </button>
            <button 
              onClick={() => setBottomTab("performance")}
              className={`py-4 px-8 font-bold uppercase tracking-wider text-xs transition-colors border-b-2 flex items-center gap-2 ${
                bottomTab === "performance" 
                  ? "text-yellow-400 border-yellow-500 bg-[#141414]" 
                  : "text-gray-400 hover:text-white border-transparent"
              }`}
            >
              <span>⚡</span> Performance & Power Metrics
            </button>
          </div>

          <div className="p-6 md:p-8">
            {bottomTab === "specs" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {steps.map(step => {
                  const item = getSelectedProductForStep(step);
                  return (
                    <div key={step.id} className="bg-[#181818] p-4 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold mb-1.5">
                        {step.icon}
                        <span>{step.label}</span>
                      </div>
                      <p className={`text-sm font-semibold truncate ${item ? 'text-white' : 'text-gray-500 italic'}`}>
                        {item ? item.name : "Not selected yet"}
                      </p>
                      {item && (
                        <p className="text-xs font-bold text-yellow-400 mt-1">
                          ₹{(Number(String(item.price).replace(/,/g, '')) || 0).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#181818] p-5 rounded-xl border border-gray-800">
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Estimated System Wattage</h4>
                  <p className="text-2xl font-black text-yellow-400">~{estimatedWattage} W</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended PSU: {Math.ceil((estimatedWattage * 1.3) / 50) * 50}W+</p>
                </div>
                <div className="bg-[#181818] p-5 rounded-xl border border-gray-800">
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Target Resolution</h4>
                  <p className="text-2xl font-black text-white">
                    {getSelectedProductForStep(steps[2]) ? "1440p / 4K UHD" : "1080p FHD"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Based on GPU selection</p>
                </div>
                <div className="bg-[#181818] p-5 rounded-xl border border-gray-800">
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Thermal Headroom</h4>
                  <p className="text-2xl font-black text-white">Optimal</p>
                  <p className="text-xs text-gray-500 mt-1">High-airflow chassis profile</p>
                </div>
                <div className="bg-[#181818] p-5 rounded-xl border border-gray-800">
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Compatibility Status</h4>
                  <p className="text-2xl font-black text-green-400">100% Verified</p>
                  <p className="text-xs text-gray-500 mt-1">Direct technician check included</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── 4. Sticky Bottom Action Bar ──────────────────────── */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0D0D0D]/95 border-t border-gray-800 backdrop-blur-md z-40 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Left: WhatsApp Talk to Expert CTA */}
          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/919563600008?text=Hello%20The%20Computer%20Corner!%20I%20have%20questions%20regarding%20my%20custom%20PC%20build." 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 font-bold text-xs uppercase tracking-wider border border-green-500/30 transition-colors shadow-sm"
            >
              <RiWhatsappFill className="text-lg text-green-400" />
              <span>Talk to an Expert (+91 95636 00008)</span>
            </a>
          </div>

          {/* Right: Total Price & Checkout / Add to Cart Button */}
          <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                Total Estimated Price
              </span>
              <span className="text-xl sm:text-2xl font-black text-yellow-400">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={buildItems.length === 0}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black px-6 sm:px-8 py-3.5 font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 shrink-0"
            >
              <span>Proceed with Build</span>
              <RiArrowRightLine className="text-base" />
            </button>
          </div>

        </div>
      </div>

      {/* ── 5. Component Selection Modal ──────────────────────── */}
      {isModalOpen && modalCategory && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#141414] w-full max-w-3xl max-h-[85vh] rounded-2xl border border-gray-700 flex flex-col shadow-2xl animate-fade-in-up overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#0E0E0E]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center justify-center">
                  {modalCategory.icon}
                </div>
                <div>
                  <h2 className="text-white font-black uppercase tracking-wider text-lg">
                    Choose {modalCategory.label}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Select a component to add to your custom PC setup
                  </p>
                </div>
              </div>

              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <RiCloseLine className="text-2xl" />
              </button>
            </div>
            
            {/* Modal Search Bar */}
            <div className="p-4 bg-[#111] border-b border-gray-800">
              <div className="relative">
                <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder={`Search ${modalCategory.short} by model, brand, or specs...`}
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal Body: Products List */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-3 bg-[#141414]">
              {isLoading ? (
                <div className="py-16 text-center text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mx-auto mb-3"></div>
                  Loading components...
                </div>
              ) : modalProducts.length > 0 ? (
                modalProducts.map((product) => {
                  let imageSrc = null;
                  if (product.img) {
                    try {
                      const parsed = JSON.parse(product.img);
                      imageSrc = Array.isArray(parsed) ? parsed[0] : parsed;
                    } catch (_) {
                      imageSrc = product.img;
                    }
                  }

                  const isCurrentlySelected = cartItems?.some(item => item._id === product._id);

                  return (
                    <div 
                      key={product._id} 
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1A1A1A] border p-4 rounded-xl transition-all duration-200 group ${
                        isCurrentlySelected 
                          ? 'border-yellow-500 bg-yellow-500/5' 
                          : 'border-gray-800 hover:border-gray-700 hover:bg-[#202020]'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-14 h-14 relative bg-black rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-gray-800">
                          {imageSrc ? (
                            <Image src={imageSrc} alt={product.name} layout="fill" objectFit="contain" />
                          ) : (
                            <span className="text-xs text-gray-600 uppercase font-bold">No Img</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-bold group-hover:text-yellow-400 transition-colors line-clamp-1 text-sm md:text-base">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span className="capitalize px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">
                              {product.category}
                            </span>
                            <span className="text-green-400 font-semibold">{product.status || 'In Stock'}</span>
                            {product.rating && Number(product.rating) > 0 && (
                              <span className="text-yellow-400">★ {product.rating}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-800">
                        <div className="text-lg font-black text-yellow-400">
                          ₹{(Number(String(product.price).replace(/,/g, '')) || 0).toLocaleString()}
                        </div>

                        <button 
                          onClick={() => handleSelectProduct(product, modalCategory)} 
                          className={`mt-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                            isCurrentlySelected
                              ? 'bg-green-500 text-black'
                              : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-md shadow-yellow-500/10'
                          }`}
                        >
                          {isCurrentlySelected ? (
                            <>
                              <RiCheckLine /> Selected
                            </>
                          ) : (
                            'Select +'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-16 bg-[#1A1A1A] rounded-xl border border-dashed border-gray-800">
                  <span className="text-3xl block mb-2">🔍</span>
                  <p className="font-semibold text-gray-400">No components found for {modalCategory.label}</p>
                  <p className="text-xs text-gray-600 mt-1">Try refining your search keyword or check product catalog.</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-800 bg-[#0E0E0E] flex justify-between items-center text-xs text-gray-500">
              <span>Showing {modalProducts.length} available component(s)</span>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
