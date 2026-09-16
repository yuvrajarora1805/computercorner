import Link from "next/link";
import { RiHeartLine, RiHeartFill, RiStarFill, RiShoppingCartLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart, removeFromCart, updateQuantity } from "@/redux/cart/cartSlice";
import { toggleFavorite } from "@/redux/favorites/favoriteSlice";
import { toast } from "react-hot-toast";

const Card = ({ product }) => {
  const dispatch = useAppDispatch();
  
  let images = [];
  try {
    if (product.img) {
      const parsed = JSON.parse(product.img);
      images = Array.isArray(parsed) ? parsed : [product.img];
    }
  } catch (e) {
    images = [product.img];
  }
  const mainImage = images.length > 0 ? images[0] : '';

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

  return (
    <div className="relative group bg-[#111111] border border-gray-800 rounded-xl overflow-hidden hover:border-[#00ff80]/50 hover:shadow-[0_0_20px_rgba(0,255,128,0.1)] transition-all duration-300 flex flex-col h-full font-sans">
      
      {/* Wishlist Button */}
      <button 
        onClick={handleToggleFavorite}
        className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
          isFavorite ? 'bg-[#00ff80] text-black' : 'bg-black/50 hover:bg-[#00ff80] text-gray-300 hover:text-black'
        }`}
      >
        {isFavorite ? <RiHeartFill className="text-lg" /> : <RiHeartLine className="text-lg" />}
      </button>

      {/* Product Image */}
      <Link href={`/product/${product?._id}`}>
        <div className="p-4 bg-[#111111]">
          <div className="relative h-48 w-full bg-[#f8f9fa] rounded-lg flex items-center justify-center p-4 overflow-hidden cursor-pointer border border-gray-800 shadow-inner">
            <img
              src={mainImage}
              alt={product.name}
              className="w-auto h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
            />
            
            {/* Category Badge */}
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-gray-700 text-gray-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              {product.category}
            </div>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Rating & Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-yellow-500">
            <RiStarFill className="text-sm" />
            <span className="text-xs font-semibold text-gray-300">{product.rating || '5.0'}</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${product.status === 'In Stock' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {product.status || 'In Stock'}
          </span>
        </div>

        {/* Title */}
        <Link href={`/product/${product?._id}`} className="block flex-1">
          <h3 className="text-white font-semibold text-sm leading-tight mb-4 group-hover:text-[#00ff80] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price & Actions */}
        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex items-end justify-between">
            <p className="text-xl font-bold text-white">
              ₹ {product.price?.toLocaleString()}
            </p>
          </div>
          
          <div className="flex gap-2 h-[42px]">
            {cartQuantity > 0 ? (
              <div className="flex-1 flex items-center justify-between bg-[#1a1a1a] border border-[#00ff80] rounded-lg overflow-hidden h-full shadow-[0_0_10px_rgba(0,255,128,0.2)]">
                <button 
                  onClick={(e) => handleUpdateQuantity(e, cartQuantity - 1)}
                  className="px-4 text-[#00ff80] hover:text-black hover:bg-[#00ff80] h-full font-bold transition-colors text-lg"
                >-</button>
                <span className="font-bold text-white text-sm">{cartQuantity} in Cart</span>
                <button 
                  onClick={(e) => handleUpdateQuantity(e, cartQuantity + 1)}
                  className="px-4 text-[#00ff80] hover:text-black hover:bg-[#00ff80] h-full font-bold transition-colors text-lg"
                >+</button>
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#00ff80] text-white hover:text-black border border-gray-700 hover:border-[#00ff80] rounded-lg h-full transition-colors font-bold text-xs uppercase tracking-wider"
              >
                <RiShoppingCartLine className="text-lg" />
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
