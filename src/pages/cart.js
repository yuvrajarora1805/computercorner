import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { removeFromCart, updateQuantity } from '@/redux/cart/cartSlice';
import Link from 'next/link';
import { RiDeleteBinLine, RiArrowRightLine, RiShoppingBagLine } from 'react-icons/ri';

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.product);
  const [deliverySettings, setDeliverySettings] = useState({ deliveryCharge: 0, freeDeliveryThreshold: 0 });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setDeliverySettings({
            deliveryCharge: Number(data.deliveryCharge || 0),
            freeDeliveryThreshold: Number(data.freeDeliveryThreshold || 0)
          });
        }
      })
      .catch(console.error);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (Number(String(item.price).replace(/,/g, '')) * (item.cartQuantity || 1)), 0);

  const isFreeDelivery = 
    deliverySettings.freeDeliveryThreshold > 0 
      ? subtotal >= deliverySettings.freeDeliveryThreshold 
      : deliverySettings.deliveryCharge === 0;

  const deliveryCharge = isFreeDelivery ? 0 : deliverySettings.deliveryCharge;
  const finalTotal = subtotal + deliveryCharge;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">
              Shopping <span className="text-yellow-500">Cart</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Review your items before proceeding to checkout
            </p>
          </div>
          {items.length > 0 && (
            <span className="text-xs sm:text-sm font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 px-4 bg-[#111] rounded-2xl border border-gray-800 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto mb-4 text-2xl">
              <RiShoppingBagLine />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-400 mb-6">Looks like you haven't added any products or PC builds yet.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors">
                Explore Store
              </Link>
              <Link href="/pcbuilder" className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white border border-gray-700 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors">
                Build A PC
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Products List (Responsive: Cards on Mobile, Table on Desktop) */}
            <div className="lg:col-span-8 bg-[#111] rounded-2xl border border-gray-800 overflow-hidden">
              
              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#181818] border-b border-gray-800 uppercase text-xs tracking-wider text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/80">
                    {items.map((item) => {
                      let imgSrc = item.img;
                      try {
                        const parsed = JSON.parse(item.img);
                        imgSrc = Array.isArray(parsed) ? parsed[0] : parsed;
                      } catch (_) {}

                      const itemUnitPrice = Number(String(item.price).replace(/,/g, '')) || 0;
                      const itemTotal = itemUnitPrice * (item.cartQuantity || 1);

                      return (
                        <tr key={item._id} className="hover:bg-[#161616] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-black rounded-lg overflow-hidden border border-gray-800 shrink-0 flex items-center justify-center">
                                {imgSrc ? (
                                  <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[10px] text-gray-500 uppercase">Item</span>
                                )}
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <p className="font-bold text-gray-100 text-sm line-clamp-2" title={item.name}>{item.name}</p>
                                <span className="inline-block mt-1 text-[11px] text-gray-400 uppercase font-semibold bg-gray-800 px-2 py-0.5 rounded">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300 font-medium whitespace-nowrap">
                            ₹{itemUnitPrice.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 w-max rounded-lg px-2 py-1">
                              <button 
                                onClick={() => handleQuantityChange(item._id, item.cartQuantity - 1)}
                                className="text-gray-400 hover:text-white px-2 py-0.5 font-bold text-sm"
                              >-</button>
                              <span className="font-bold text-sm px-1 min-w-[20px] text-center">{item.cartQuantity || 1}</span>
                              <button 
                                onClick={() => handleQuantityChange(item._id, (item.cartQuantity || 1) + 1)}
                                className="text-gray-400 hover:text-white px-2 py-0.5 font-bold text-sm"
                              >+</button>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-black text-yellow-400 whitespace-nowrap">
                            ₹{itemTotal.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleRemove(item._id)}
                              title="Remove item"
                              className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                              <RiDeleteBinLine className="text-lg" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (Shown only on small screens) */}
              <div className="md:hidden divide-y divide-gray-800">
                {items.map((item) => {
                  let imgSrc = item.img;
                  try {
                    const parsed = JSON.parse(item.img);
                    imgSrc = Array.isArray(parsed) ? parsed[0] : parsed;
                  } catch (_) {}

                  const itemUnitPrice = Number(String(item.price).replace(/,/g, '')) || 0;
                  const itemTotal = itemUnitPrice * (item.cartQuantity || 1);

                  return (
                    <div key={item._id} className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-black rounded-lg overflow-hidden border border-gray-800 shrink-0">
                          {imgSrc ? (
                            <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-500 uppercase">Item</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-100 text-sm line-clamp-2">{item.name}</p>
                          <span className="inline-block mt-1 text-[10px] text-gray-400 uppercase font-semibold bg-gray-800 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleRemove(item._id)}
                          className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg shrink-0"
                        >
                          <RiDeleteBinLine className="text-lg" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.cartQuantity - 1)}
                            className="text-gray-400 hover:text-white px-2 py-0.5 font-bold"
                          >-</button>
                          <span className="font-bold text-xs min-w-[18px] text-center">{item.cartQuantity || 1}</span>
                          <button 
                            onClick={() => handleQuantityChange(item._id, (item.cartQuantity || 1) + 1)}
                            className="text-gray-400 hover:text-white px-2 py-0.5 font-bold"
                          >+</button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Total</span>
                          <span className="text-base font-black text-yellow-400">₹{itemTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Sidebar Summary (12 cols on mobile, 4 on desktop) */}
            <div className="lg:col-span-4">
              <div className="bg-[#111] p-6 sm:p-8 rounded-2xl border border-gray-800 lg:sticky lg:top-28 space-y-6">
                <h3 className="text-lg font-black border-b border-gray-800 pb-4 uppercase tracking-wider text-white">
                  Order Summary
                </h3>
                
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-400">
                    <span>Delivery / Shipping</span>
                    {deliveryCharge === 0 ? (
                      <span className="font-bold text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded text-xs uppercase tracking-wide border border-green-500/20">
                        Free
                      </span>
                    ) : (
                      <span className="font-bold text-white">₹{deliveryCharge.toLocaleString()}</span>
                    )}
                  </div>

                  {deliverySettings.freeDeliveryThreshold > 0 && subtotal < deliverySettings.freeDeliveryThreshold && (
                    <p className="text-xs text-yellow-500/80 bg-yellow-500/10 p-2.5 rounded-lg border border-yellow-500/20">
                      💡 Add ₹{(deliverySettings.freeDeliveryThreshold - subtotal).toLocaleString()} more for <strong className="text-yellow-400">FREE delivery</strong>!
                    </p>
                  )}

                  <div className="flex justify-between items-center text-gray-300 border-t border-gray-800 pt-4 mt-4">
                    <span className="text-base font-bold">Total Amount</span>
                    <span className="text-2xl font-black text-yellow-400">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full text-center bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-6 rounded-xl transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                  <span>Proceed to Checkout</span>
                  <RiArrowRightLine className="text-lg" />
                </Link>

                <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                  🔒 Safe & Secure checkout powered by Razorpay. Pan-India shipping with transit insurance.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
