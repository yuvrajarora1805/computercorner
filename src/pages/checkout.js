import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { clearCart } from '@/redux/cart/cartSlice';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import Link from 'next/link';

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
  const [consent, setConsent] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);

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
      // Load saved address from Database Profile API
      fetch('/api/user/profile')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('No profile data');
        })
        .then(data => {
          setFormData(prev => ({
            ...prev,
            name: session.user.name || prev.name,
            email: session.user.email || prev.email,
            phone: data.phone || prev.phone,
            address: data.address || prev.address,
            city: data.city || prev.city,
            state: data.state || prev.state,
            pincode: data.pincode || prev.pincode
          }));
        })
        .catch(() => {
          // Fallback to localStorage
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
        });
    }
  }, [session]);

  const totalAmount = items.reduce((sum, item) => sum + (Number(String(item.price).replace(/,/g, '')) * (item.cartQuantity || 1)), 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-fetch City and State based on Pincode (India)
  useEffect(() => {
    if (formData.pincode && formData.pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffices = data[0].PostOffice;
            setLocationOptions(postOffices);
            const firstPO = postOffices[0];
            setFormData(prev => {
              const isValidCity = prev.city && postOffices.some(po => po.Name === prev.city);
              return {
                ...prev,
                city: isValidCity ? prev.city : firstPO.Name,
                state: firstPO.State || prev.state
              };
            });
            toast.success(`Location auto-filled for ${formData.pincode}`);
          } else {
            setLocationOptions([]);
          }
        })
        .catch(() => { setLocationOptions([]); });
    } else {
      setLocationOptions([]);
    }
  }, [formData.pincode]);

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

    // Save shipping address for future use (local + remote)
    const addressToSave = {
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    };
    
    localStorage.setItem('shippingAddress', JSON.stringify(addressToSave));

    // Sync to Database for cross-device profile support
    fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressToSave)
    }).catch(console.error);

    try {
      // 1. Create Order on Backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, user: formData, items })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      if (data.isFree) {
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push('/order-success');
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'The Computer Corner',
        description: 'PC Build Purchase',
        order_id: data.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              dispatch(clearCart());
              toast.success('Payment successful!');
              router.push('/order-success');
            } else {
              toast.error(verifyData.error || 'Payment verification failed');
            }
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone
        },
        theme: {
          color: '#EAB308' // yellow-500
        },
        modal: {
          ondismiss: async function() {
            setLoading(false);
            toast.error("Payment was cancelled.");
            await fetch('/api/cancel-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ razorpay_order_id: data.id })
            });
            router.push('/order-failure');
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response){
        toast.error(response.error.description);
        setLoading(false);
        await fetch('/api/cancel-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ razorpay_order_id: data.id })
        });
        router.push('/order-failure');
      });
      rzp.open();

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

  if (items.length === 0) {
    return (
      <div className="bg-[#050505] min-h-[70vh] text-white font-sans py-20 px-4 flex flex-col items-center justify-center">
        <div className="text-yellow-500 text-6xl mb-6">🛒</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">Looks like you haven't added any components or custom builds to your cart yet.</p>
        <Link href="/pcbuilder" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-yellow-500/20">
          Build Your PC
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
                <input required type="tel" name="phone" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter exactly 10 digits" value={formData.phone} onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if(val.length <= 10) handleChange({target: {name: 'phone', value: val}});
                }} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Street Address</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City / Area</label>
                  {locationOptions.length > 0 ? (
                    <select name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors">
                      {locationOptions.map((po, idx) => (
                        <option key={idx} value={po.Name}>{po.Name} ({po.District})</option>
                      ))}
                    </select>
                  ) : (
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">PIN Code</label>
                  <input required type="text" name="pincode" value={formData.pincode} pattern="[0-9]{6}" maxLength="6" title="Enter exactly 6 digits" onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if(val.length <= 6) handleChange({target: {name: 'pincode', value: val}});
                  }} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" placeholder="e.g. 110001" />
                  <p className="text-xs text-gray-500 mt-1">City and State will auto-fill</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required 
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-700 text-yellow-500 focus:ring-yellow-500 bg-[#1a1a1a]" 
                  />
                  <span className="text-xs text-gray-400 leading-relaxed">
                    I agree to the <Link href="/terms" target="_blank" className="text-yellow-500 hover:underline">Terms & Conditions</Link> and <Link href="/privacy-policy" target="_blank" className="text-yellow-500 hover:underline">Privacy Policy</Link>, and I explicitly consent to the processing of my personal data for order fulfillment as required by the DPDP Act 2023.
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading || items.length === 0 || !consent}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
}
