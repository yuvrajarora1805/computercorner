import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiMoneyDollarCircleLine, RiShoppingCartLine, RiUserLine, RiTimeLine, RiCheckboxCircleLine, RiArrowUpLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [metricsData, setMetricsData] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/metrics'),
          fetch('/api/admin/recent-orders?limit=5')
        ]);

        if (metricsRes.ok) {
          const mData = await metricsRes.json();
          setMetricsData(mData);
        }
        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          setRecentOrders(oData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metrics = [
    { title: 'Total Sales', value: `₹${metricsData.totalSales.toLocaleString()}`, icon: <RiMoneyDollarCircleLine className="text-3xl text-yellow-500" /> },
    { title: 'Total Orders', value: metricsData.totalOrders.toLocaleString(), icon: <RiShoppingCartLine className="text-3xl text-blue-500" /> },
    { title: 'Active Customers', value: metricsData.activeCustomers.toLocaleString(), icon: <RiUserLine className="text-3xl text-purple-500" /> },
    { title: 'Pending Orders', value: metricsData.pendingOrders.toLocaleString(), icon: <RiTimeLine className="text-3xl text-orange-500" /> },
    { title: 'Completed Orders', value: metricsData.completedOrders.toLocaleString(), icon: <RiCheckboxCircleLine className="text-3xl text-green-500" /> },
  ];

  return (
    <div className="text-white font-sans">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 mt-2">Here is what is happening with your store today.</p>
        </div>
        <Link href="/admin/add-product" className="bg-[#00ff80] text-black hover:bg-[#00cc66] font-bold py-2 px-6 rounded transition-colors flex items-center shadow-lg shadow-[#00ff80]/20 whitespace-nowrap">
          + Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-[#111] p-6 rounded-xl border border-gray-800 flex flex-col justify-between hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                    {metric.icon}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{metric.title}</p>
                  <h3 className="text-3xl font-bold text-white truncate" title={metric.value}>{metric.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders List */}
            <div className="lg:col-span-2 bg-[#111] rounded-xl border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Recent Orders</h3>
                <Link href="/admin/orders" className="text-yellow-500 hover:text-yellow-400 text-sm font-medium">View All &rarr;</Link>
              </div>
              <div className="overflow-x-auto">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent orders found.</p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 uppercase tracking-wider border-b border-gray-800">
                      <tr>
                        <th className="pb-3 font-semibold">Order ID</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="py-4 font-mono text-gray-400 text-xs truncate max-w-[100px]" title={order.id}>
                            {order.id}
                          </td>
                          <td className="py-4 font-medium truncate max-w-[150px]" title={order.user_email}>
                            {order.user_email}
                          </td>
                          <td className="py-4 text-gray-300 whitespace-nowrap">₹{order.total_amount?.toLocaleString() || 0}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                              order.payment_status === 'Completed' || order.payment_status === 'Paid' ? 'bg-green-500/10 text-green-500' :
                              order.payment_status === 'Pending' ? 'bg-orange-500/10 text-orange-500' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>
                              {order.payment_status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Quick Links / Actions */}
            <div className="bg-[#111] rounded-xl border border-gray-800 p-6 flex flex-col">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="space-y-4 flex-1">
                <Link href="/admin/add-product" className="block w-full p-4 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-gray-700 rounded-lg transition-colors group">
                  <h4 className="font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">Add New Product</h4>
                  <p className="text-xs text-gray-400">Expand your catalogue with new inventory.</p>
                </Link>
                <Link href="/admin/products" className="block w-full p-4 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-gray-700 rounded-lg transition-colors group">
                  <h4 className="font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">Manage Inventory</h4>
                  <p className="text-xs text-gray-400">Update stock, prices, and product details.</p>
                </Link>
                <Link href="/admin/orders" className="block w-full p-4 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-gray-700 rounded-lg transition-colors group">
                  <h4 className="font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">Process Orders</h4>
                  <p className="text-xs text-gray-400">Ship items and update order statuses.</p>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
