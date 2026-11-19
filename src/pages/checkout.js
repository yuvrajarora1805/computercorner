import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { clearCart } from '@/redux/cart/cartSlice';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Checkout() {
  const { items } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
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
  const [deliverySettings, setDeliverySettings] = useState({ deliveryCharge: 0, freeDeliveryThreshold: 0 });

  // Fetch store delivery settings
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

  const subtotal = items.reduce((sum, item) => sum + (Number(String(item.price).replace(/,/g, '')) * (item.cartQuantity || 1)), 0);
  
  // Calculate delivery fee based on store settings
  const isFreeDelivery = 
    deliverySettings.freeDeliveryThreshold > 0 
      ? subtotal >= deliverySettings.freeDeliveryThreshold 
      : deliverySettings.deliveryCharge === 0;

  const deliveryCharge = isFreeDelivery ? 0 : deliverySettings.deliveryCharge;
  const finalTotal = subtotal + deliveryCharge;

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

    if (!captchaToken) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      // 1. Create Order on Backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, user: formData, items, captchaToken })
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
      <div className="bg-[#050505] min-h-screen text-white font-sans py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">
              Secure <span className="text-yellow-500">Checkout</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Complete your shipping address and proceed with payment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Shipping Form (Left column on desktop, ordered after or top) */}
            <div className="lg:col-span-7">
              <form onSubmit={handlePayment} className="bg-[#111] p-5 sm:p-8 rounded-2xl border border-gray-800 space-y-6">
                <h3 className="text-lg font-black uppercase tracking-wider pb-2 border-b border-gray-800">
                  Shipping Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Phone Number</label>
                  <input required type="tel" name="phone" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter exactly 10 digits" value={formData.phone} onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if(val.length <= 10) handleChange({target: {name: 'phone', value: val}});
                  }} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm" placeholder="10-digit mobile number" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Street Address</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm" placeholder="House/Flat No., Building, Street, Area" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">City / Area</label>
                    {locationOptions.length > 0 ? (
                      <select name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm">
                        {locationOptions.map((po, idx) => (
                          <option key={idx} value={po.Name}>{po.Name} ({po.District})</option>
                        ))}
                      </select>
                    ) : (
                      <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm" />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">State</label>
                    <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">PIN Code</label>
                    <input required type="text" name="pincode" value={formData.pincode} pattern="[0-9]{6}" maxLength="6" title="Enter exactly 6 digits" onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if(val.length <= 6) handleChange({target: {name: 'pincode', value: val}});
                    }} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm" placeholder="e.g. 110001" />
                    <p className="text-[11px] text-gray-500 mt-1">City & State auto-fill</p>
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

                {/* Google reCAPTCHA */}
                <div className="flex justify-center my-3 overflow-hidden rounded-lg">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LceUxEuAAAAAOkZVmEvWnoiiZ9naRDOIlfWc_HP"}
                    onChange={(token) => setCaptchaToken(token)}
                    theme="dark"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading || items.length === 0 || !consent || !captchaToken}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-6 rounded-xl transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                  >
                    {loading ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString()}`}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary (Right Column on desktop, top/bottom on mobile) */}
            <div className="lg:col-span-5">
              <div className="bg-[#111] p-5 sm:p-8 rounded-2xl border border-gray-800 lg:sticky lg:top-28">
                <h3 className="text-lg font-black border-b border-gray-800 pb-4 mb-5 uppercase tracking-wider">
                  Order Summary ({items.length})
                </h3>
                
                <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                  {items.map(item => {
                    let imgSrc = item.img;
                    try {
                      const parsed = JSON.parse(item.img);
                      imgSrc = Array.isArray(parsed) ? parsed[0] : parsed;
                    } catch (_) {}

                    return (
                      <div key={item._id} className="flex gap-3 items-center">
                        <div className="w-14 h-14 bg-black rounded-lg overflow-hidden shrink-0 border border-gray-800 flex items-center justify-center">
                          {imgSrc ? (
                            <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-500">Item</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-200 line-clamp-2">{item.name}</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">Qty: {item.cartQuantity || 1}</p>
                        </div>
                        <div className="text-xs sm:text-sm font-black text-yellow-400 shrink-0 text-right">
                          ₹{(Number(String(item.price).replace(/,/g, '')) * (item.cartQuantity || 1)).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-800 pt-5 space-y-3.5 text-sm">
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
                  <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-2xl font-black text-yellow-400">₹{finalTotal.toLocaleString()}</span>
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
