import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const fetchOrderDetails = async (id) => {
    setFetchingDetails(true);
    setIsModalOpen(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrderDetails(data);
      } else {
        toast.error('Failed to load order details');
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Error fetching details');
      setIsModalOpen(false);
    } finally {
      setFetchingDetails(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/recent-orders?limit=100');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/update-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, order_status: newStatus })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Order updated to ${newStatus}`);
        setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      } else {
        toast.error(data.error || 'Failed to update order');
      }
    } catch (error) {
      toast.error('An error occurred while updating');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-gray-400 mt-2">View and manage customer orders</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID & Date</th>
                <th className="px-6 py-4 font-semibold">Customer Details</th>
                <th className="px-6 py-4 font-semibold">Total & Payment</th>
                <th className="px-6 py-4 font-semibold">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No orders found. Orders will appear here once customers complete checkout.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs text-gray-400 truncate max-w-[150px]" title={order.id}>{order.id}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold">{order.user_email}</p>
                      <p className="text-xs text-yellow-500 font-bold mt-1">{order.user_phone || 'N/A'}</p>
                      <p className="text-xs text-gray-500 mt-1 max-w-[250px] truncate" title={order.shipping_address}>{order.shipping_address}</p>
                      <button 
                        onClick={() => fetchOrderDetails(order.id)}
                        className="mt-2 text-[#00ff80] hover:text-[#00cc66] text-xs font-bold uppercase tracking-wider"
                      >
                        View Details &rarr;
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-yellow-500 whitespace-nowrap">₹{Number(order.total_amount).toLocaleString()}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.payment_status === 'Completed' || order.payment_status === 'Paid' ? 'bg-green-500/10 text-green-500' :
                        order.payment_status === 'Pending' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {order.payment_status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.order_status || 'Received'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`bg-[#1a1a1a] border rounded px-3 py-1.5 text-sm font-bold focus:outline-none transition-colors ${
                          order.order_status === 'Delivered' ? 'border-green-500/50 text-green-500' :
                          order.order_status === 'Shipped' ? 'border-blue-500/50 text-blue-500' :
                          order.order_status === 'Processing' ? 'border-yellow-500/50 text-yellow-500' :
                          order.order_status === 'Cancelled' ? 'border-red-500/50 text-red-500' :
                          'border-gray-400/50 text-gray-300'
                        } ${updatingId === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-800'}`}
                      >
                        <option value="Received" className="text-white">Received</option>
                        <option value="Processing" className="text-white">Processing</option>
                        <option value="Shipped" className="text-white">Shipped</option>
                        <option value="Delivered" className="text-white">Delivered</option>
                        <option value="Cancelled" className="text-white">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-800 bg-[#1a1a1a] flex justify-between items-center rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                {orderDetails?.order && (
                  <p className="text-sm text-gray-500 mt-1 font-mono">{orderDetails.order.id}</p>
                )}
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setOrderDetails(null); }} 
                className="text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {fetchingDetails ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff80]"></div>
                </div>
              ) : orderDetails ? (
                <div className="space-y-8">
                  {/* Customer Info Section */}
                  <div>
                    <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2 mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Account Email</p>
                        <p className="font-medium text-white">{orderDetails.order.user_email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Phone Number</p>
                        <p className="font-medium text-white">{orderDetails.order.user_phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Payment ID</p>
                        <p className="font-mono text-sm text-yellow-500">{orderDetails.order.razorpay_order_id || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2 lg:col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Shipping Details</p>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{orderDetails.order.shipping_address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order Placed On</p>
                        <p className="text-sm text-gray-300">{new Date(orderDetails.order.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Section */}
                  <div>
                    <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2 mb-4">Items Ordered</h3>
                    <div className="space-y-4">
                      {orderDetails.items && orderDetails.items.length > 0 ? (
                        orderDetails.items.map((item, index) => {
                          let imageUrl = '/placeholder.png';
                          try {
                            if (item.img) {
                              const parsed = JSON.parse(item.img);
                              imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : item.img;
                            }
                          } catch (e) {
                            imageUrl = item.img || '/placeholder.png';
                          }

                          return (
                            <div key={index} className="flex items-center gap-4 bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                              <div className="w-16 h-16 bg-black rounded border border-gray-700 p-2 shrink-0 flex items-center justify-center">
                                <img src={imageUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-white">{item.name}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{item.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-sm">Qty: <span className="text-white font-bold">{item.quantity}</span></p>
                                <p className="font-bold text-yellow-500 mt-1">₹{Number(item.price).toLocaleString()}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 italic">No items found for this order.</p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary Section */}
                  <div className="flex justify-end pt-4 border-t border-gray-800">
                    <div className="w-full md:w-1/2 bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Subtotal</span>
                        <span className="text-white font-bold">₹{Number(orderDetails.order.total_amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 text-sm">Shipping</span>
                        <span className="text-green-500 font-bold">Free</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                        <span className="text-white font-bold uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-bold text-yellow-500">₹{Number(orderDetails.order.total_amount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
