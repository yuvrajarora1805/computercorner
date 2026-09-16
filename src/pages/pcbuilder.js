import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/cart/cartSlice";
import { useGetAllProductsQuery } from "@/redux/api/apiSlice";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const pcbuilder = () => {
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.product);
  const { data: productsData } = useGetAllProductsQuery();
  const allProducts = productsData?.data || [];
  
  const [activeTab, setActiveTab] = useState("components");
  const [bottomTab, setBottomTab] = useState("specs");
  
  // Wizard state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);
  const [hoveredPoly, setHoveredPoly] = useState(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  const getPolyStyle = (category) => {
    // Check if this category has a selected product in the Redux store
    const isSelected = products && products.some(p => p.category === category);
    const isHovered = hoveredPoly === category;
    const isActive = isSelected || isHovered;

    return {
      pointerEvents: 'auto',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fill: isActive ? 'rgba(0,255,128,0.5)' : 'rgba(0,255,128,0.05)',
      stroke: isActive ? '#00ff80' : 'rgba(0,255,128,0.3)',
      strokeWidth: isActive ? 3 : 1
    };
  };

  const steps = [
    { id: 'processor', label: 'CPU' },
    { id: 'motherboard', label: 'Motherboard' },
    { id: 'gpu', label: 'GPU' },
    { id: 'ram', label: 'RAM' },
    { id: 'storage', label: 'Storage' },
    { id: 'supply', label: 'Power Supply' },
    { id: 'others', label: 'Case' }
  ];

  const currentStep = steps[currentStepIndex];
  
  const processor = products?.find((p) => p?.category === "processor");
  const motherboard = products?.find((m) => m?.category === "motherboard");
  const ram = products?.find((r) => r?.category === "ram");
  const supply = products?.find((s) => s?.category === "supply");
  const storage = products?.find((s) => s?.category === "storage");
  const gpu = products?.find((g) => g?.category === "gpu");
  const others = products?.find((o) => o?.category === "others");

  // Calculate total price
  const totalPrice = products?.reduce((sum, item) => sum + (Number(String(item?.price || "").replace(/,/g, "")) || 0), 0) || 0;

  const handleSubmit = () => {
    toast.success("Pc Build Successfully added to cart!");
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  const openModal = (categoryId) => {
    setModalCategory(categoryId);
    setModalSearchQuery("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCategory(null);
  };

  const handleSelectProduct = (product) => {
    dispatch(addToCart(product));
    toast.success(`Selected ${product?.name}`);
    closeModal();
    handleNext(); // Automatically advance to the next step
  };

  const SpecRow = ({ title, item }) => (
    <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-700 last:border-0">
      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
        <span className="text-gray-400 font-bold text-xs">{title.substring(0, 3)}</span>
      </div>
      <div>
        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
        <p className="text-white font-semibold">{item ? item.name : "Select"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111] pb-24 font-sans text-gray-200">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-8">
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] p-8 md:p-10 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff80] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500 opacity-5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-block bg-[#00ff80]/10 text-[#00ff80] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#00ff80]/20">
                Custom PC Builder
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 uppercase tracking-tight">
                Build A PC
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Build your dream PC at the best price possible with our custom PC builder. Assemble your perfect desktop PC in just a few clicks.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center p-6 bg-black/40 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-inner shrink-0">
              <span className="text-4xl mb-2">⚡</span>
              <span className="text-gray-300 font-bold uppercase tracking-wider text-xs">Premium Build</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: Image Map visual */}
          <div className="lg:col-span-7">
            <div className="bg-[#1a1a1a] p-4 lg:p-6 rounded-xl border border-gray-800 lg:sticky lg:top-4 flex justify-center">
              <div className="relative w-full max-w-[250px] sm:max-w-xs lg:max-w-lg mx-auto bg-black rounded-lg overflow-hidden group">
                <img 
                  src="/img/cpu.png" 
                  alt="PC Case Layout" 
                  className="w-full h-auto opacity-90 block"
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
                    points="10,22 326,16 327,40 10,40" onClick={() => { setCurrentStepIndex(6); openModal('others'); }} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('others')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('others')}
                    points="210,12 325,16 324,338 216,345" onClick={() => { setCurrentStepIndex(6); openModal('others'); }} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('others')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('others')}
                    points="11,305 324,320 324,350 10,329" onClick={() => { setCurrentStepIndex(6); openModal('others'); }} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('others')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('others')}
                    points="12,34 71,58 69,156 85,157 85,172 45,175 43,194 86,196 84,244 22,249 25,303 11,300" onClick={() => { setCurrentStepIndex(6); openModal('others'); }} />
                  
                  {/* CPU (Processor) */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('processor')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('processor')}
                    points="105,88 142,89 144,142 106,140" onClick={() => { setCurrentStepIndex(0); openModal('processor'); }} />
                  
                  {/* GPU */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('gpu')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('gpu')}
                    points="45,170 90,170 183,193 44,193" onClick={() => { setCurrentStepIndex(2); openModal('gpu'); }} />
                  
                  {/* CPU Cooler (Others) */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('cooler')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('cooler')}
                    points="49,41 188,36 188,54 49,56" onClick={() => { setCurrentStepIndex(6); openModal('others'); }} />
                  
                  {/* Storage */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('storage')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('storage')}
                    points="168,237 217,237 217,255 169,257" onClick={() => { setCurrentStepIndex(4); openModal('storage'); }} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('storage')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('storage')}
                    points="118,152 158,151 160,168 118,169" onClick={() => { setCurrentStepIndex(4); openModal('storage'); }} />
                  
                  {/* Motherboard */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('motherboard')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('motherboard')}
                    points="181,63 207,63 205,176 168,172 167,161 185,158 183,74 179,96" onClick={() => { setCurrentStepIndex(1); openModal('motherboard'); }} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('motherboard')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('motherboard')}
                    points="191,179 204,179 204,234 178,234 164,246 87,246 87,196 159,197 187,193 194,183" onClick={() => { setCurrentStepIndex(1); openModal('motherboard'); }} />
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('motherboard')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('motherboard')}
                    points="73,67 148,66 117,93 115,136 150,139 153,152 118,152 75,157" onClick={() => { setCurrentStepIndex(1); openModal('motherboard'); }} />
                  
                  {/* SMPS (Supply) */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('supply')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('supply')}
                    points="26,253 236,253 235,319 23,305" onClick={() => { setCurrentStepIndex(5); openModal('supply'); }} />
                  
                  {/* RAM */}
                  <polygon 
                    onMouseEnter={() => setHoveredPoly('ram')} onMouseLeave={() => setHoveredPoly(null)}
                    style={getPolyStyle('ram')}
                    points="156,73 184,73 184,155 156,155" onClick={() => { setCurrentStepIndex(3); openModal('ram'); }} />
                </svg>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Tabs & Components Wizard */}
          <div className="lg:col-span-5">
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
              
              {/* Tab Headers */}
              <div className="flex border-b border-gray-800 bg-[#111]">
                <button 
                  onClick={() => setActiveTab("platform")}
                  className={`flex-1 py-4 text-center font-bold uppercase tracking-wider text-xs transition-colors ${activeTab === "platform" ? "bg-[#1a1a1a] text-white border-t-2 border-[#00ff80]" : "text-gray-500 hover:text-white"}`}
                >
                  Platform
                </button>
                <button 
                  onClick={() => setActiveTab("components")}
                  className={`flex-1 py-4 text-center font-bold uppercase tracking-wider text-xs transition-colors ${activeTab === "components" ? "bg-[#1a1a1a] text-white border-t-2 border-[#00ff80]" : "text-gray-500 hover:text-white"}`}
                >
                  Components
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6 lg:p-8 min-h-[350px] lg:h-[600px] bg-[#1a1a1a] flex flex-col justify-center">
                {activeTab === "platform" && (
                  <div className="space-y-4 text-center mt-12">
                    <h4 className="font-bold text-gray-300 uppercase mb-8">Choose Platform</h4>
                    <div className="flex gap-4 justify-center">
                      <label className="flex flex-col items-center gap-2 bg-[#222] p-6 border border-gray-700 rounded-lg cursor-pointer hover:border-[#00ff80] transition-colors w-40">
                        <input type="radio" name="platform" value="intel" className="w-4 h-4 text-[#00ff80] focus:ring-[#00ff80]" defaultChecked />
                        <span className="font-bold text-lg text-white">Intel</span>
                      </label>
                      <label className="flex flex-col items-center gap-2 bg-[#222] p-6 border border-gray-700 rounded-lg cursor-pointer hover:border-[#00ff80] transition-colors w-40">
                        <input type="radio" name="platform" value="amd" className="w-4 h-4 text-[#00ff80] focus:ring-[#00ff80]" />
                        <span className="font-bold text-lg text-white">AMD</span>
                      </label>
                    </div>
                    <button onClick={() => setActiveTab("components")} className="mt-8 bg-white text-black px-12 py-3 rounded uppercase font-bold hover:bg-gray-200 transition-colors">
                      Add
                    </button>
                  </div>
                )}

                {activeTab === "components" && (
                  <div className="flex flex-col h-full justify-center">
                    <div className="text-center mb-12">
                      <h4 className="font-bold text-white uppercase text-xl tracking-wider mb-2">Choose Components</h4>
                      <p className="text-sm text-gray-500">Please click below to choose from a popup</p>
                    </div>
                    
                    <div className="flex items-center justify-between w-full max-w-sm mx-auto">
                      <button 
                        onClick={handlePrev}
                        disabled={currentStepIndex === 0}
                        className="w-12 h-12 bg-[#222] rounded flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#333] transition-colors border border-gray-700"
                      >
                        ←
                      </button>
                      
                      <button 
                        onClick={() => openModal(currentStep.id)}
                        className={`hover:bg-gray-200 px-4 py-4 font-bold uppercase tracking-wider rounded shadow-md transition-colors text-sm w-56 text-center flex flex-col items-center justify-center min-h-[5rem] ${products?.find((p) => p?.category === currentStep.id) ? "bg-[#00ff80] text-black hover:bg-[#00cc66]" : "bg-white text-black"}`}
                      >
                        {products?.find((p) => p?.category === currentStep.id) ? (
                          <>
                            <span className="text-[10px] text-gray-800 mb-1 opacity-80">{currentStep.label}</span>
                            <span className="truncate w-full block leading-tight">{products.find((p) => p.category === currentStep.id).name}</span>
                          </>
                        ) : (
                          `Choose ${currentStep.label}`
                        )}
                      </button>

                      <button 
                        onClick={handleNext}
                        disabled={currentStepIndex === steps.length - 1}
                        className="w-12 h-12 bg-[#222] rounded flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#333] transition-colors border border-gray-700"
                      >
                        →
                      </button>
                    </div>
                    
                    {/* Status Indicators */}
                    <div className="mt-16 flex justify-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 rounded-full bg-white"></div> To Select</div>
                      <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 rounded-full bg-[#00ff80]"></div> Selected</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Your Build (Specs & Performance) */}
        <div className="mt-12 bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden" id="SelectedSpecs">
          <div className="p-6 border-b border-gray-800 bg-[#111]">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">Your Build</h3>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Case Preview Image */}
            <div className="lg:w-1/3 p-8 border-r border-gray-800 flex items-center justify-center bg-black/30">
               <Image src="/img/cpu.png" alt="Your Build" width={250} height={250} objectFit="contain" />
            </div>

            {/* Bottom Tabs */}
            <div className="lg:w-2/3">
              <div className="flex border-b border-gray-800 bg-[#111]">
                <button 
                  onClick={() => setBottomTab("specs")}
                  className={`flex-1 py-4 px-6 text-left font-bold uppercase tracking-wider text-xs transition-colors ${bottomTab === "specs" ? "text-white border-b-2 border-[#00ff80] bg-[#1a1a1a]" : "text-gray-500 hover:text-white"}`}
                >
                  <span className="mr-2">🔍</span> See Specs
                </button>
                <button 
                  onClick={() => setBottomTab("performance")}
                  className={`flex-1 py-4 px-6 text-left font-bold uppercase tracking-wider text-xs transition-colors ${bottomTab === "performance" ? "text-white border-b-2 border-[#00ff80] bg-[#1a1a1a]" : "text-gray-500 hover:text-white"}`}
                >
                  <span className="mr-2">⚡</span> See Performance
                </button>
              </div>

              <div className="p-8 h-[400px] overflow-y-auto">
                {bottomTab === "specs" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div>
                      <SpecRow title="Cpu" item={processor} />
                      <SpecRow title="GPU" item={gpu} />
                      <SpecRow title="Motherboard" item={motherboard} />
                      <SpecRow title="Ram" item={ram} />
                    </div>
                    <div>
                      <SpecRow title="Storage 1" item={storage} />
                      <SpecRow title="Smps" item={supply} />
                      <SpecRow title="Case" item={others} />
                    </div>
                  </div>
                )}

                {bottomTab === "performance" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="bg-[#111] p-5 rounded-lg border border-gray-800">
                      <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Cinebench score</h4>
                      <p className="text-2xl font-bold text-white">24,530</p>
                    </div>
                    <div className="bg-[#111] p-5 rounded-lg border border-gray-800">
                      <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">3D Mark score</h4>
                      <p className="text-2xl font-bold text-white">18,290</p>
                    </div>
                    <div className="bg-[#111] p-5 rounded-lg border border-gray-800">
                      <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Estimated Wattage</h4>
                      <p className="text-2xl font-bold text-white">650W</p>
                    </div>
                    <div className="bg-[#111] p-5 rounded-lg border border-gray-800">
                      <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Wifi / Bluetooth</h4>
                      <p className="text-lg font-bold text-white">Wi-Fi 6E & BT 5.2</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Footer (Total & CTA) */}
      <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 z-40 p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-gray-400 text-xs uppercase font-bold tracking-wider">
             <div className="flex items-center gap-2 hover:text-white cursor-pointer"><span className="text-lg">💬</span> Talk to an expert</div>
             <div className="flex items-center gap-2 hover:text-white cursor-pointer"><span className="text-lg">🛠️</span> 3 years doorstep warranty</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Estimated Price</div>
              <div className="text-2xl font-bold text-white">₹{totalPrice.toLocaleString()}</div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={products?.length === 0}
              className="bg-[#0055ff] hover:bg-[#0044cc] disabled:bg-gray-700 text-white px-8 py-3 font-bold uppercase tracking-wider rounded transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* MODAL COMPONENT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] w-full max-w-2xl max-h-[80vh] rounded-xl border border-gray-700 flex flex-col shadow-2xl animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#111] rounded-t-xl">
              <h2 className="text-white font-bold uppercase tracking-wider text-lg">
                Choose {steps.find(s => s.id === modalCategory)?.label || modalCategory}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body (Real Options) */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <p className="text-gray-400 text-sm">
                  Select your preferred component from the options below.
                </p>
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full sm:w-64 bg-[#222] border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:border-[#00ff80] block p-2.5 transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                     <span className="text-gray-500 text-xs">🔍</span>
                  </div>
                </div>
              </div>
              
              {allProducts
                .filter(p => p.category === modalCategory)
                .filter(p => p.name.toLowerCase().includes(modalSearchQuery.toLowerCase()))
                .map((product) => (
                <div key={product._id} className="flex justify-between items-center bg-[#222] border border-gray-700 p-4 rounded-lg hover:border-[#00ff80] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative bg-black rounded flex items-center justify-center overflow-hidden shrink-0 border border-gray-800">
                      {product.img ? (
                        <Image src={product.img} alt={product.name} layout="fill" objectFit="cover" />
                      ) : (
                        <span className="text-xs text-gray-500">Img</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-bold group-hover:text-[#00ff80] transition-colors">{product.name}</h4>
                      <p className="text-gray-500 text-xs mt-1 capitalize">{product.status} • {product.rating} ⭐</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0 pl-2">
                    <div className="text-white font-bold text-sm lg:text-base whitespace-nowrap">₹{product.price}</div>
                    <button onClick={() => handleSelectProduct(product)} className="text-xs bg-[#111] border border-gray-600 px-3 py-1 rounded text-[#00ff80] font-bold uppercase mt-2 hover:bg-[#00ff80] hover:text-black transition-colors">Select +</button>
                  </div>
                </div>
              ))}
              
              {allProducts.filter(p => p.category === modalCategory).filter(p => p.name.toLowerCase().includes(modalSearchQuery.toLowerCase())).length === 0 && (
                <div className="text-center text-gray-500 p-12 bg-[#222] rounded-lg border border-dashed border-gray-700">
                  <span className="text-2xl block mb-2">🔍</span>
                  No components found matching your search.
                </div>
              )}

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-800 bg-[#111] rounded-b-xl flex justify-end">
              <button 
                onClick={closeModal}
                className="bg-transparent text-gray-400 hover:text-white px-6 py-2 rounded font-bold uppercase text-xs tracking-wider transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default pcbuilder;
