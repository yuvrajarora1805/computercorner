import { useState } from "react";
import Link from "next/link";
import { RiHeartLine, RiHeartFill, RiStarFill, RiShoppingCartLine, RiAddLine, RiSubtractLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart, removeFromCart, updateQuantity } from "@/redux/cart/cartSlice";
import { toggleFavorite } from "@/redux/favorites/favoriteSlice";
import { toast } from "react-hot-toast";
import StarburstBadge from "@/components/UI/StarburstBadge";

const Card = ({ product, featured = false }) => {
  const dispatch = useAppDispatch();
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0, active: false });
  
  let images = [];
  try {
    if (product.img) {
      const parsed = JSON.parse(product.img);
      images = Array.isArray(parsed) ? parsed : [product.img];
    }
  } catch (e) {
    if (product.img) images = [product.img];
  }
  images = images.filter(Boolean);
  const mainImage = images.length > 0 ? images[0] : null;

  const { items: favoriteItems } = useAppSelector((state) => state.favorites);
  const isFavorite = favoriteItems?.some((item) => item._id === product._id);
  
  const { items: cartItems } = useAppSelector((state) => state.product);
  const cartItem = cartItems?.find((item) => item._id === product._id);
  const cartQuantity = cartItem ? cartItem.cartQuantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (e, newQuantity) => {
    e.preventDefault();
    if (newQuantity === 0) {
      dispatch(removeFromCart(product._id));
      toast.success(`${product.name} removed from cart`);
    } else {
      dispatch(updateQuantity({ id: product._id, quantity: newQuantity }));
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    dispatch(toggleFavorite(product));
    toast.success(isFavorite ? `${product.name} removed from favorites` : `${product.name} added to favorites!`);
  };

  const handleImageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;
    setImgTilt({ x: rotX, y: rotY, active: true });
  };

  const handleImageMouseLeave = () => {
    setImgTilt({ x: 0, y: 0, active: false });
  };

  return (
    <div className={`relative group gaming-grid-card overflow-hidden flex flex-col h-full bg-[#121212] rounded-2xl border-2 transition-all duration-300 ${featured ? 'border-[#FDC800] shadow-brutal-gold' : 'border-black hover:border-[#FDC800]'}`}>
      
      {/* ── 1. Gold Energy Border (Traveling Light Highlight around Card) ── */}
      <div className="card-energy-beam"></div>

      {/* ── 4. Featured / HOT Starburst Sticker (Subtle pulse & glint) ── */}
      {featured ? (
        <div className="absolute -top-2 -left-2 z-20 pointer-events-none">
          <StarburstBadge text="TOP!" color="yellow" size="sm" />
        </div>
      ) : product.rating >= 4.8 ? (
        <div className="absolute -top-2 -left-2 z-20 pointer-events-none">
          <StarburstBadge text="HOT" color="yellow" size="sm" />
        </div>
      ) : null}

      {/* ── Wishlist Button (Fills Gold when selected with pop) ── */}
      <button 
        onClick={handleToggleFavorite}
        title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full border-2 border-black transition-all duration-200 shadow-brutal-sm active:scale-90 ${
          isFavorite 
            ? 'bg-[#FDC800] text-black scale-105 shadow-brutal-gold' 
            : 'bg-[#181818] hover:bg-[#252525] text-white/70 hover:text-[#FDC800] hover:border-[#FDC800]'
        }`}
      >
        {isFavorite ? <RiHeartFill className="text-sm fill-black" /> : <RiHeartLine className="text-sm" />}
      </button>

      {/* ── 2. Product Image with 3D Tilt & Lift ───────── */}
      <Link href={`/product/${product?._id}`}>
        <div 
          className="p-2.5 sm:p-4"
          onMouseMove={handleImageMouseMove}
          onMouseLeave={handleImageMouseLeave}
          style={{ perspective: 700 }}
        >
          <div 
            style={{
              transform: imgTilt.active 
                ? `rotateX(${imgTilt.x}deg) rotateY(${imgTilt.y}deg) scale3d(1.07, 1.07, 1.07)` 
                : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              transition: imgTilt.active ? 'transform 0.08s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="relative h-44 sm:h-48 w-full bg-[#0A0A0A] rounded-xl flex items-center justify-center p-3 sm:p-4 overflow-hidden cursor-pointer border-2 border-black/80 group-hover:border-[#FDC800] transition-colors duration-300"
          >
            {/* Holographic Sheen Sweep on Hover */}
            <div className="holo-sweep w-full h-full absolute inset-0 pointer-events-none z-10"></div>

            {/* Cyber Corner Tech Brackets */}
            <div className="tech-bracket-tl"></div>
            <div className="tech-bracket-br"></div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, rgba(253,200,0,0.4) 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
            
            {/* ── 3. Anime Energy Reveal Aura Behind Hardware ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#432DD7]/40 via-brand-electric/30 to-[#FDC800]/25 blur-xl opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 ease-out"></div>
              <div className="anime-energy-sweep absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-md group-hover:scale-105 transition-transform duration-500 relative z-10"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img/cpu.png";
                  e.target.className = "w-auto h-full object-contain opacity-40 grayscale relative z-10";
                }}
              />
            ) : (
              <img
                src="/img/cpu.png"
                alt="Placeholder"
                className="w-auto h-full object-contain opacity-40 grayscale relative z-10"
              />
            )}
            
            {/* Category Badge */}
            <div className="absolute top-2 left-2 z-10 bg-black/85 backdrop-blur-sm text-white/90 text-[9px] font-heading font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-[#FDC800]/40 shadow-sm">
              {product.category}
            </div>

            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-electric/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="text-[8px] text-brand-white/20 text-center mt-1.5 font-body italic">
            *Image is for reference purpose. Actual product may vary.
          </div>
        </div>
      </Link>

      {/* ── Card Content (Remains stable & readable) ───── */}
      <div className="px-3.5 sm:px-5 pb-4 sm:pb-5 flex flex-col flex-1">
        
        {/* Rating & Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-[#FDC800]">
            <RiStarFill className="text-xs" />
            <span className="text-xs font-mono font-bold text-brand-white/80">{product.rating || '5.0'}</span>
          </div>
          <span className={`text-[9px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
            product.status === 'In Stock' 
              ? 'bg-brand-teal/15 text-brand-teal border border-brand-teal/30' 
              : 'bg-red-500/15 text-red-400 border border-red-500/30'
          }`}>
            {product.status || 'In Stock'}
          </span>
        </div>

        {/* Title */}
        <Link href={`/product/${product?._id}`} className="block flex-1">
          <h3 className="text-brand-white font-sub font-bold text-xs sm:text-sm leading-snug sm:leading-tight mb-3 sm:mb-4 group-hover:text-[#FDC800] transition-colors duration-200 line-clamp-2 tracking-wide">
            {product.name}
          </h3>
        </Link>

        {/* Price & Actions */}
        <div className="flex flex-col gap-2.5 sm:gap-3 mt-auto">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-black text-[#FDC800] border-2 border-[#FDC800] font-mono font-black text-xs sm:text-sm tracking-wide shadow-brutal-sm">
              ₹ {product.price?.toLocaleString()}
            </div>
            {product.rating && (
              <span className="text-[9px] sm:text-[10px] text-brand-white/50 font-mono">
                {product.status || 'Ready to Ship'}
              </span>
            )}
          </div>
          
          {/* Cart Actions */}
          <div className="flex gap-2 h-9 sm:h-[42px]">
            {cartQuantity > 0 ? (
              <div className="flex-1 flex items-center justify-between bg-black rounded-xl overflow-hidden h-full border-2 border-[#FDC800] shadow-brutal-sm">
                <button 
                  onClick={(e) => handleUpdateQuantity(e, cartQuantity - 1)}
                  className="px-2.5 sm:px-3 text-[#FDC800] hover:text-black hover:bg-[#FDC800] h-full font-bold transition-colors text-base sm:text-lg flex items-center"
                ><RiSubtractLine /></button>
                <span className="font-mono font-black text-white text-[11px] sm:text-xs tracking-wide">{cartQuantity} in Cart</span>
                <button 
                  onClick={(e) => handleUpdateQuantity(e, cartQuantity + 1)}
                  className="px-2.5 sm:px-3 text-[#FDC800] hover:text-black hover:bg-[#FDC800] h-full font-bold transition-colors text-base sm:text-lg flex items-center"
                ><RiAddLine /></button>
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="flex-1 brutal-btn brutal-btn-gold text-[11px] sm:text-xs h-full tracking-wider active:scale-95 transition-transform flex items-center justify-center gap-1.5"
              >
                <RiShoppingCartLine className="text-sm sm:text-base" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Card;
