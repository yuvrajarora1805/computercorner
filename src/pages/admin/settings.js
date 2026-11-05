import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    storeName: '',
    contactEmail: '',
    announcementBanner: '',
    deliveryCharge: '0',
    freeDeliveryThreshold: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      toast.success('Settings saved successfully!');
    } else {
      toast.error('Failed to save settings');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading settings...</div>;

  return (
    <div className="text-white font-sans max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your store configurations</p>
      </div>

      <div className="bg-[#111] p-8 rounded-xl border border-gray-800 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Store Name</label>
          <input type="text" name="storeName" value={settings.storeName || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
          <input type="email" name="contactEmail" value={settings.contactEmail || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Announcement Banner Text</label>
          <textarea name="announcementBanner" value={settings.announcementBanner || ''} onChange={handleChange} rows="2" className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"></textarea>
          <p className="text-xs text-gray-500 mt-1">This text appears at the very top of the website. Clear the text to hide the banner.</p>
        </div>

        <div className="pt-6 border-t border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Delivery & Shipping Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Standard Delivery Charge (₹)</label>
              <input 
                type="number" 
                min="0"
                step="1"
                name="deliveryCharge" 
                value={settings.deliveryCharge ?? '0'} 
                onChange={handleChange} 
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                placeholder="e.g. 150"
              />
              <p className="text-xs text-gray-500 mt-1">Default flat shipping fee added to orders (0 for free).</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Free Delivery Above Order Value (₹)</label>
              <input 
                type="number" 
                min="0"
                step="1"
                name="freeDeliveryThreshold" 
                value={settings.freeDeliveryThreshold ?? '0'} 
                onChange={handleChange} 
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                placeholder="e.g. 5000"
              />
              <p className="text-xs text-gray-500 mt-1">Orders at or above this subtotal get free shipping. Set to 0 to disable free delivery threshold.</p>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-800">
          <button onClick={handleSave} className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold py-3 px-8 rounded transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
