import { BiUserCircle, BiX } from "react-icons/bi";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
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

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.push("/");
  };

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Sidebar: Profile Card */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-[#111] p-8 rounded-xl border border-gray-800 text-center sticky top-24">
            <div className="text-9xl text-yellow-500 mb-6 flex justify-center drop-shadow-2xl">
              <BiUserCircle />
            </div>
            <h2 className="text-2xl font-bold mb-2">{session?.user?.name}</h2>
            <p className="text-gray-400 mb-8">{session?.user?.email}</p>
            
            <button 
              onClick={handleSignOut}
              className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 font-bold py-3 px-4 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Right Content: Profile Settings */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="bg-[#111] p-12 rounded-xl border border-gray-800 h-full flex flex-col justify-center items-center text-center shadow-lg">
            <div className="text-6xl mb-6 text-yellow-500">📦</div>
            <h3 className="text-3xl font-bold mb-4 uppercase tracking-wider">
              Your Orders
            </h3>
            <p className="text-gray-400 mb-8 max-w-md">
              View your complete order history, track shipping status, and manage your PC build purchases all in one place.
            </p>
            <Link href="/orders" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-full transition-colors shadow-lg shadow-yellow-500/20 text-lg">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
