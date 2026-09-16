import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addToCart, removeFromCart, updateQuantity } from "@/redux/cart/cartSlice";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import React, { useState } from "react";

const ProductDetailPage = ({ product }) => {
  const { sumRating } = useAppSelector((state) => state.products || { sumRating: 0 });
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { items: cartItems } = useAppSelector((state) => state.product);
  const cartItem = cartItems?.find((item) => item._id === product?.data?._id);
  const cartQuantity = cartItem ? cartItem.cartQuantity : 0;

  const handleUpdateQuantity = (e, newQuantity) => {
    e.preventDefault();
    if (newQuantity === 0) {
      dispatch(removeFromCart(product.data._id));
      toast.success(`${product.data.name} removed from cart`);
    } else {
      dispatch(updateQuantity({ id: product.data._id, quantity: newQuantity }));
    }
  };

  const {
    img,
    name,
    category,
    status,
    price,
    keyFeature,
    rating,
    description,
    reviews,
  } = product?.data || {};

  let images = [];
  try {
    if (img) {
      const parsed = JSON.parse(img);
      images = Array.isArray(parsed) ? parsed : [img];
    }
  } catch (e) {
    images = [img];
  }

  const [mainImage, setMainImage] = useState(images.length > 0 ? images[0] : '/placeholder.png');

  return (
    <div className="container mx-auto font-sans text-gray-200 py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Side: Images */}
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 flex items-center justify-center min-h-[400px]">
            <img
              className="w-full h-auto object-contain max-h-[400px] transition-all duration-300 hover:scale-105"
              src={mainImage}
              alt={name}
            />
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((imgUrl, i) => (
                <div 
                  key={i} 
                  onClick={() => setMainImage(imgUrl)}
                  className={`w-24 h-24 bg-[#1a1a1a] border rounded-lg overflow-hidden shrink-0 cursor-pointer transition-colors ${mainImage === imgUrl ? 'border-[#00ff80]' : 'border-gray-800 hover:border-gray-500'}`}
                >
                  <img src={imgUrl} alt={`${name} ${i}`} className="w-full h-full object-contain p-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div>
          <h2 className="text-4xl font-bold mb-4 text-white">{name}</h2>
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm uppercase tracking-wider font-bold">
              {category}
            </span>
            <span className={`px-3 py-1 rounded text-sm uppercase tracking-wider font-bold ${status === 'In Stock' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {status}
            </span>
          </div>
          
          <p className="text-3xl font-bold text-white mb-8">₹ {price}</p>

          <div className="flex gap-4 mb-8 h-[52px]">
            {cartQuantity > 0 ? (
              <div className="w-48 flex items-center justify-between bg-[#1a1a1a] border border-[#00ff80] rounded overflow-hidden shadow-[0_0_15px_rgba(0,255,128,0.2)]">
                <button 
                  onClick={(e) => handleUpdateQuantity(e, cartQuantity - 1)}
                  className="px-6 text-[#00ff80] hover:text-black hover:bg-[#00ff80] h-full font-bold transition-colors text-xl"
                >-</button>
                <span className="font-bold text-white text-lg">{cartQuantity}</span>
                <button 
                  onClick={(e) => handleUpdateQuantity(e, cartQuantity + 1)}
                  className="px-6 text-[#00ff80] hover:text-black hover:bg-[#00ff80] h-full font-bold transition-colors text-xl"
                >+</button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  dispatch(addToCart(product.data));
                  toast.success(`${name} added to cart!`);
                }}
                className="bg-gray-800 hover:bg-[#00ff80] hover:text-black text-white font-bold px-8 rounded transition-colors uppercase tracking-wider"
              >
                Add to Cart
              </button>
            )}
            <button 
              onClick={() => {
                dispatch(addToCart(product.data));
                router.push('/checkout');
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 rounded transition-colors shadow-[0_0_15px_rgba(234,179,8,0.5)] uppercase tracking-wider"
            >
              Buy Now
            </button>
          </div>
          
          <div className="bg-[#111] p-6 rounded-lg border border-gray-800 mb-8">
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">Key Features</p>
            <p className="text-white text-lg">{keyFeature}</p>
          </div>
          
          <div className="flex items-center gap-8 border-t border-gray-800 pt-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Product Rating</p>
              <h2 className="font-bold text-2xl text-yellow-500">{rating} <span className="text-gray-600 text-sm">/ 5</span></h2>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Average Rating</p>
              <h2 className="font-bold text-2xl text-yellow-500">{sumRating} <span className="text-gray-600 text-sm">/ 5</span></h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Description</h2>
        <div className="bg-[#111] p-8 rounded-xl border border-gray-800">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{description}</p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-[#111] p-6 rounded-xl border border-gray-800">
                <p className="text-[#00ff80] font-bold mb-2">{review.name}</p>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

export async function getServerSideProps(context) {
  try {
    const { params } = context;
    const pool = (await import('@/utils/db')).default;
    const [rows] = await pool.query('SELECT * FROM products WHERE _id = ?', [params.productId]);
    
    if (rows.length === 0) {
      return { notFound: true };
    }

    const data = JSON.parse(JSON.stringify(rows[0]));

    return {
      props: {
        product: { data },
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
