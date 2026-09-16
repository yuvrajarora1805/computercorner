import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { clearCart } from '@/redux/cart/cartSlice';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Script from 'next/script';

export default function Checkout() {
  const { items } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('You must be signed in to place an order.');
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Set default form data once session loads
  useEffect(() => {
    if (session?.user) {
      // Load saved address from localStorage if available
      const savedAddressStr = localStorage.getItem('shippingAddress');
      let savedAddress = {};
      if (savedAddressStr) {
        try {
          savedAddress = JSON.parse(savedAddressStr);
        } catch (e) {}
      }

      setFormData(prev => ({
        ...prev,
        ...savedAddress,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email
      }));
    }
  }, [session]);

  const totalAmount = items.reduce((sum, item) => sum + (Number(String(item.price).replace(/,/g, '')) * (item.cartQuantity || 1)), 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (status !== 'authenticated') {
      toast.error('You must be signed in to place an order.');
      return;
    }

    setLoading(true);

    // Save shipping address for future use
    localStorage.setItem('shippingAddress', JSON.stringify({
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    }));

    try {
      // 1. Create Order on Backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, user: formData, items })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      // 2. Create PayU Form and Submit
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', 'https://test.payu.in/_payment');

      const addField = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField('key', data.key);
      addField('txnid', data.txnid);
      addField('amount', data.amount);
      addField('productinfo', data.productinfo);
      addField('firstname', data.firstname);
      addField('email', data.email);
      addField('phone', data.phone);
      addField('surl', data.surl);
      addField('furl', data.furl);
      addField('hash', data.hash);
      addField('service_provider', data.service_provider);

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
          Secure <span className="text-yellow-500">Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <form onSubmit={handlePayment} className="bg-[#111] p-8 rounded-xl border border-gray-800 space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-wider mb-6">Shipping Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Street Address</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">PIN Code</label>
                  <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
              </div>

              <div className="pt-8">
                <button 
                  type="submit" 
                  disabled={loading || items.length === 0}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded transition-colors uppercase tracking-wider disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#111] p-8 rounded-xl border border-gray-800 sticky top-24">
              <h3 className="text-xl font-bold border-b border-gray-800 pb-4 mb-6 uppercase tracking-wider">Your Order</h3>
              
              <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {items.map(item => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-black rounded overflow-hidden shrink-0 border border-gray-700">
                      {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-200 line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.cartQuantity || 1}</p>
                    </div>
                    <div className="text-sm font-bold text-yellow-500 shrink-0">
                      ₹{(Number(String(item.price).replace(/,/g, '')) * (item.cartQuantity || 1)).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-6 space-y-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="font-bold text-white">Free</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl font-bold text-yellow-500">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
