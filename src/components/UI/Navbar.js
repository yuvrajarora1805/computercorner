import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { RiArrowDropDownLine, RiSearchLine, RiUserLine, RiHeartLine, RiShoppingCartLine, RiCloseLine, RiMenuLine, RiCpuLine, RiDashboardLine, RiGamepadLine, RiDatabase2Line, RiHardDrive2Line, RiServerLine, RiLaptopLine, RiHeadphoneLine, RiCustomerServiceLine } from "react-icons/ri";
import { useAppSelector } from "@/redux/hooks";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data: session } = useSession();
  const { items } = useAppSelector((state) => state.product);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const [bannerText, setBannerText] = useState("PC prices will rise in JULY 2026 due to AI component scarcity. Order your PC now");

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.announcementBanner !== undefined) {
          setBannerText(data.announcementBanner);
        }
      })
      .catch(console.error);
      
    // Fetch products for live search
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setAllProducts(data.data);
        }
      })
      .catch(console.error);
      
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Scroll listener for navbar background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  const searchResults = allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownOpen(false);
    }
  };

  const navLinks = [
    { label: "Gaming PCs", href: "/prebuilt-pcs" },
    { label: "Components", href: "/category/processor", hasDropdown: true },
    { label: "Accessories", href: "/category/others" },
    { label: "PC Builder", href: "/pcbuilder", highlight: true },
  ];

  const categoryLinks = [
    { label: "CPU / Processor", href: "/category/processor", icon: <RiCpuLine /> },
    { label: "Motherboard", href: "/category/motherboard", icon: <RiDashboardLine /> },
    { label: "Graphics Card", href: "/category/monitor", icon: <RiGamepadLine /> },
    { label: "RAM", href: "/category/ram", icon: <RiDatabase2Line /> },
    { label: "Storage", href: "/category/storage", icon: <RiHardDrive2Line /> },
    { label: "Power Supply", href: "/category/supply", icon: <RiServerLine /> },
    { label: "Others", href: "/category/others", icon: <RiHeadphoneLine /> },
  ];

  return (
    <>
      <div className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'glass shadow-lg shadow-black/30' : 'bg-brand-navy/70 backdrop-blur-md'}`}>
        
        {/* ── Announcement Banner ─────────────────────────── */}
        {bannerText && bannerText.trim() !== '' && (
          <div className="relative overflow-hidden bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-navy text-center py-1.5 text-xs font-sub font-bold tracking-widest uppercase">
            {/* Subtle shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{backgroundSize:'200% 100%'}}></div>
            <span className="relative z-10">{bannerText}</span>
          </div>
        )}

        {/* ── Main Navbar ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* ── Left: Logo ─────────────────────────────── */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img 
                src="/logo.png" 
                alt="The Computer Corner" 
                className="h-14 w-auto drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(214,168,79,0.4)] transition-all duration-300"
                onError={(e) => {
                  // Fallback if logo image doesn't exist
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center gap-2" style={{display: 'none'}}>
                <span className="text-brand-gold text-2xl">👑</span>
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="font-heading text-brand-gold text-xs tracking-[0.25em] leading-none">
                  THE COMPUTER CORNER
                </span>
                <span className="font-sub text-brand-white/50 text-[10px] tracking-[0.3em] mt-0.5">
                  BATHINDA
                </span>
              </div>
            </Link>

            {/* ── Center: Nav Links + Search ──────────────── */}
            <div className="hidden lg:flex items-center gap-2 flex-1 justify-center max-w-2xl mx-8">
              
              {/* Search Bar */}
              <form ref={searchRef} onSubmit={handleSearch} className="relative w-full max-w-sm group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search products..." 
                  className="neu-input w-full text-sm py-2.5 pl-5 pr-10"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-white/40 hover:text-brand-electric transition-colors cursor-pointer">
                  <RiSearchLine className="text-lg" />
                </button>
                
                {/* ── Search Dropdown ─────────────────────── */}
                {isDropdownOpen && searchQuery.trim() !== "" && (
                  <div className="absolute top-full left-0 right-0 mt-2 neu-card overflow-hidden z-50 animate-slide-down">
                    {searchResults.length > 0 ? (
                      searchResults.map(product => (
                        <div 
                          key={product._id} 
                          onClick={() => {
                            router.push(`/product/${product._id}`);
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-brand-royal/20 cursor-pointer border-b border-brand-steel/30 last:border-b-0 transition-colors group/item"
                        >
                          <div className="w-10 h-10 bg-brand-navy rounded-lg shrink-0 overflow-hidden border border-brand-steel/30">
                            {product.img && (() => {
                              let src = product.img;
                              try {
                                const parsed = JSON.parse(product.img);
                                src = Array.isArray(parsed) ? parsed[0] : parsed;
                              } catch (_) {}
                              return <img src={src} alt={product.name} className="w-full h-full object-cover" />;
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-brand-white truncate group-hover/item:text-brand-electric transition-colors">{product.name}</p>
                            <p className="text-xs font-mono text-brand-gold font-bold">₹{product.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-brand-white/40 font-sub">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* ── Right: Nav Links + Icons ────────────────── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <div key={link.label} className="dropdown dropdown-hover">
                    <label tabIndex={0} className={`flex items-center gap-0.5 cursor-pointer px-3 py-2 rounded-lg font-sub font-600 text-sm tracking-wide transition-all duration-200 ${router.pathname.startsWith('/category') ? 'text-brand-gold' : 'text-brand-white/70 hover:text-brand-gold hover:bg-brand-royal/10'}`}>
                      {link.label} <RiArrowDropDownLine className="text-xl" />
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 mt-2 w-60 neu-card">
                      {categoryLinks.map((cat) => (
                        <li key={cat.href}>
                          <Link href={cat.href} className="flex items-center gap-3 text-brand-white/70 hover:text-brand-gold hover:bg-brand-royal/15 rounded-lg px-3 py-2.5 transition-colors font-sub text-sm tracking-wide">
                            <span className="text-brand-electric text-lg">{cat.icon}</span>
                            {cat.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : link.highlight ? (
                  <Link key={link.label} href={link.href} className="neu-btn-gold text-xs px-5 py-2 rounded-full font-heading tracking-wider ml-2">
                    {link.label}
                  </Link>
                ) : (
                  <Link key={link.label} href={link.href} className={`px-3 py-2 rounded-lg font-sub font-600 text-sm tracking-wide transition-all duration-200 ${router.pathname === link.href ? 'text-brand-gold' : 'text-brand-white/70 hover:text-brand-gold hover:bg-brand-royal/10'}`}>
                    {link.label}
                  </Link>
                )
              ))}

              {/* Divider */}
              <div className="w-px h-8 bg-brand-steel/40 mx-2"></div>

              {/* Icons */}
              <Link href="/favorites" className="relative p-2 rounded-lg text-brand-white/60 hover:text-brand-sakura hover:bg-brand-royal/10 transition-all duration-200">
                <RiHeartLine className="text-xl" />
              </Link>

              <Link href="/cart" className="relative p-2 rounded-lg text-brand-white/60 hover:text-brand-electric hover:bg-brand-royal/10 transition-all duration-200">
                <RiShoppingCartLine className="text-xl" />
                {items?.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-brand-gold text-brand-navy text-[10px] font-bold font-mono animate-manga-bounce">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* User */}
              {session?.user ? (
                <div className="dropdown dropdown-end ml-1">
                  <label tabIndex={0} className="cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-brand-navy-deep flex items-center justify-center border-2 border-brand-gold/30 hover:border-brand-gold transition-colors glow-ring-gold">
                      <span className="text-sm text-brand-gold font-heading font-bold uppercase">
                        {session?.user?.name?.substring(0, 1) || 'U'}
                      </span>
                    </div>
                  </label>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 w-52 neu-card">
                    <div className="px-4 py-3 border-b border-brand-steel/30 mb-2">
                      <p className="text-sm font-semibold truncate text-brand-white font-sub">{session.user.name}</p>
                      <p className="text-[10px] text-brand-white/40 font-mono truncate">{session.user.email}</p>
                    </div>
                    {session?.user?.role === 'admin' && (
                      <li><Link href="/admin" className="hover:bg-brand-royal/20 text-brand-teal font-bold font-sub">Admin Dashboard</Link></li>
                    )}
                    <li><Link href="/orders" className="hover:bg-brand-royal/20 text-brand-white/70 hover:text-brand-white font-sub">My Orders</Link></li>
                    <li><Link href="/profile" className="hover:bg-brand-royal/20 text-brand-white/70 hover:text-brand-white font-sub">Profile</Link></li>
                    <li><button onClick={() => signOut()} className="hover:bg-red-500/10 text-red-400 hover:text-red-300 mt-1 font-sub">Logout</button></li>
                  </ul>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-brand-white/60 hover:text-brand-gold transition-colors ml-1 px-3 py-2 rounded-lg hover:bg-brand-royal/10">
                  <RiUserLine className="text-xl" />
                  <span className="hidden xl:block font-sub font-600 text-sm tracking-wide">Sign In</span>
                </Link>
              )}
            </div>

            {/* ── Mobile: Hamburger + Cart ────────────────── */}
            <div className="flex lg:hidden items-center gap-3">
              <Link href="/cart" className="relative p-2 text-brand-white/60">
                <RiShoppingCartLine className="text-xl" />
                {items?.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-brand-gold text-brand-navy text-[10px] font-bold font-mono">
                    {items.length}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-brand-white/70 hover:text-brand-gold transition-colors"
              >
                {isMobileMenuOpen ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
         MOBILE MENU — Full-screen manga-panel slide
         ═══════════════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-brand-navy/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Menu Content */}
          <div className="relative z-10 flex flex-col h-full overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-steel/20">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/logo.png" alt="Logo" className="h-10 w-auto" onError={(e) => { e.target.style.display = 'none'; }} />
                <span className="font-heading text-brand-gold text-xs tracking-[0.2em]">THE COMPUTER CORNER</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-brand-white/60 hover:text-brand-gold">
                <RiCloseLine className="text-2xl" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4">
              <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." 
                  className="neu-input w-full text-sm py-3"
                />
              </form>
            </div>

            {/* Manga-style diagonal divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-brand-gold/50 via-brand-electric/50 to-transparent"></div>

            {/* Navigation Links */}
            <div className="px-6 py-4 space-y-1">
              <p className="font-heading text-brand-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Navigation</p>
              
              <Link href="/prebuilt-pcs" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-white/70 hover:text-brand-gold hover:bg-brand-royal/15 transition-all font-sub text-lg tracking-wide">
                <RiGamepadLine className="text-brand-electric" />
                Gaming PCs
              </Link>
              <Link href="/pcbuilder" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-gold/10 to-transparent border border-brand-gold/20 text-brand-gold font-sub text-lg tracking-wide font-bold">
                <RiCpuLine />
                PC Builder
                <span className="ml-auto text-xs bg-brand-gold/20 px-2 py-0.5 rounded-full">★</span>
              </Link>
            </div>

            {/* Diagonal divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-brand-electric/30 to-transparent"></div>

            {/* Categories */}
            <div className="px-6 py-4 space-y-1">
              <p className="font-heading text-brand-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Components</p>
              {categoryLinks.map((cat) => (
                <Link 
                  key={cat.href} 
                  href={cat.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-brand-white/60 hover:text-brand-gold hover:bg-brand-royal/10 transition-all font-sub tracking-wide"
                >
                  <span className="text-brand-electric/70 text-lg">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Diagonal divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-brand-gold/30 via-transparent to-brand-gold/30"></div>

            {/* Account */}
            <div className="px-6 py-4 space-y-1">
              <p className="font-heading text-brand-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Account</p>
              {session?.user ? (
                <>
                  <div className="px-4 py-3 rounded-xl bg-brand-navy-deep/50 border border-brand-steel/20 mb-2">
                    <p className="font-sub font-bold text-brand-white">{session.user.name}</p>
                    <p className="text-[11px] text-brand-white/40 font-mono">{session.user.email}</p>
                  </div>
                  {session?.user?.role === 'admin' && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-brand-teal font-sub font-bold tracking-wide">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-brand-white/60 hover:text-brand-white font-sub tracking-wide">
                    My Orders
                  </Link>
                  <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-brand-white/60 hover:text-brand-white font-sub tracking-wide">
                    <RiHeartLine className="text-brand-sakura" /> Favorites
                  </Link>
                  <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 font-sub tracking-wide w-full text-left mt-2">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-gold hover:bg-brand-royal/15 transition-all font-sub text-lg tracking-wide border border-brand-gold/20">
                  <RiUserLine />
                  Sign In
                </Link>
              )}
            </div>

            {/* Bottom: store info */}
            <div className="mt-auto px-6 py-6 border-t border-brand-steel/20">
              <p className="font-sub text-brand-white/30 text-xs tracking-widest uppercase">Bathinda, Punjab</p>
              <a href="tel:09563600008" className="font-mono text-brand-gold text-sm mt-1 block">095636 00008</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
