import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BiX } from "react-icons/bi";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/orders");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const fetchOrders = async () => {
        try {
          const res = await fetch("/api/orders");
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } catch (error) {
          console.error("Failed to fetch orders", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [session]);

  const openOrderDetails = async (orderId) => {
    setSelectedOrder(orderId);
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrderDetails(data);
      } else {
        toast.error("Failed to load order details");
      }
    } catch (error) {
      toast.error("Error loading order details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 uppercase tracking-wider border-b border-gray-800 pb-4">
          My <span className="text-yellow-500">Orders</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#111] p-12 rounded-xl border border-gray-800 text-center shadow-lg">
            <div className="text-6xl mb-6 flex justify-center text-gray-700">🛒</div>
            <h2 className="text-2xl font-bold mb-4">No orders found</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">You haven't placed any orders yet. Once you build or buy a PC, your history will appear here.</p>
            <Link href="/pcbuilder" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-yellow-500/20">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors shadow-lg">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4 border-b border-gray-800 pb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order ID</p>
                    <p className="font-mono text-sm text-gray-300">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Date</p>
                    <p className="text-sm text-gray-300">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total</p>
                    <p className="text-lg font-bold text-yellow-500">₹{Number(order.total_amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider inline-block ${
                      order.order_status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                      order.order_status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                      order.order_status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      order.order_status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {order.order_status || 'Received'}
                    </span>
                  </div>
                  <div>
                    <button 
                      onClick={() => openOrderDetails(order.id)}
                      className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold py-2 px-6 rounded-full transition-colors shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="pt-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <p className="text-sm text-gray-400"><strong className="text-gray-300">Shipped To:</strong> {order.shipping_address}</p>
                  <p className="text-xs text-gray-500 bg-[#1a1a1a] px-3 py-1 rounded-full border border-gray-800">
                    Payment: <span className={order.payment_status === 'Completed' || order.payment_status === 'Paid' ? 'text-green-500 font-bold' : 'text-orange-500 font-bold'}>{order.payment_status || 'Pending'}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Order <span className="text-yellow-500">Details</span></h3>
              <button onClick={closeOrderDetails} className="text-gray-400 hover:text-white transition-colors text-3xl">
                <BiX />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {loadingDetails ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : orderDetails ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Order ID</p>
                      <p className="font-mono text-sm text-white">{orderDetails.order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Placed On</p>
                      <p className="text-sm text-white">{new Date(orderDetails.order.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                      <p className={`font-bold ${
                        orderDetails.order.order_status === 'Delivered' ? 'text-green-500' :
                        orderDetails.order.order_status === 'Shipped' ? 'text-blue-500' :
                        orderDetails.order.order_status === 'Processing' ? 'text-yellow-500' :
                        orderDetails.order.order_status === 'Cancelled' ? 'text-red-500' :
                        'text-gray-300'
                      }`}>{orderDetails.order.order_status || 'Received'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Total Paid</p>
                      <p className="text-green-500 font-bold text-lg">₹{Number(orderDetails.order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>

                  <h4 className="font-bold border-b border-gray-800 pb-2 text-gray-300 uppercase tracking-wider text-sm">Items Purchased</h4>
                  <div className="space-y-4">
                    {orderDetails.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                        <div className="w-16 h-16 bg-black rounded shrink-0 flex items-center justify-center overflow-hidden border border-gray-700">
                          {item.img ? (
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-500">No Image</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-200 line-clamp-2">{item.name || 'Unknown Product'}</p>
                          <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-yellow-500">₹{Number(item.price).toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">Could not load details.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
