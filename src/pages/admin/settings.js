import React from 'react';

export default function Settings() {
  return (
    <div className="text-white font-sans max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your store configurations</p>
      </div>

      <div className="bg-[#111] p-8 rounded-xl border border-gray-800 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Store Name</label>
          <input type="text" defaultValue="The Computer Corner" className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
          <input type="email" defaultValue="support@computercorner.com" className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Razorpay Key ID</label>
          <input type="text" placeholder="rzp_test_xxxxxx" className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
        </div>
        <div className="pt-4 border-t border-gray-800">
          <button className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold py-3 px-8 rounded transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
