import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { removeFromCart, updateQuantity } from '@/redux/cart/cartSlice';
import Link from 'next/link';
import { RiDeleteBinLine } from 'react-icons/ri';

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.product);

  const totalAmount = items.reduce((sum, item) => sum + (Number(String(item.price).replace(/,/g, '')) * (item.cartQuantity || 1)), 0);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
          Shopping <span className="text-yellow-500">Cart</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#111] rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
            <Link href="/" className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold inline-block hover:bg-yellow-400 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#1a1a1a] border-b border-gray-800 uppercase text-xs tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-black rounded overflow-hidden border border-gray-700 shrink-0">
                              {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="font-bold text-gray-200">{item.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-medium">₹{item.price}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 bg-black border border-gray-700 w-max rounded px-2 py-1">
                            <button 
                              onClick={() => handleQuantityChange(item._id, item.cartQuantity - 1)}
                              className="text-gray-400 hover:text-white px-2 font-bold"
                            >-</button>
                            <span className="font-bold">{item.cartQuantity || 1}</span>
                            <button 
                              onClick={() => handleQuantityChange(item._id, (item.cartQuantity || 1) + 1)}
                              className="text-gray-400 hover:text-white px-2 font-bold"
                            >+</button>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-yellow-500">
                          ₹{(Number(String(item.price).replace(/,/g, '')) * (item.cartQuantity || 1)).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleRemove(item._id)}
                            className="text-red-500 hover:text-red-400 transition-colors p-2"
                          >
                            <RiDeleteBinLine className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-[#111] p-8 rounded-xl border border-gray-800 sticky top-24">
                <h3 className="text-xl font-bold border-b border-gray-800 pb-4 mb-6 uppercase tracking-wider">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="font-bold text-white">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-400 border-t border-gray-800 pt-4 mt-4">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl font-bold text-yellow-500">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded transition-colors uppercase tracking-wider">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
