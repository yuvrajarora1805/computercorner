import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  RiDashboardLine, 
  RiAddBoxLine, 
  RiFileList3Line, 
  RiSettings4Line, 
  RiLogoutBoxRLine,
  RiMenuLine,
  RiCloseLine,
  RiUser3Line,
  RiShoppingBag3Line,
  RiShoppingCartLine
} from 'react-icons/ri';
import { signOut, useSession } from 'next-auth/react';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <RiDashboardLine className="text-xl" /> },
    { name: 'Products', path: '/admin/products', icon: <RiShoppingBag3Line className="text-xl" /> },
    { name: 'Add Product', path: '/admin/add-product', icon: <RiAddBoxLine className="text-xl" /> },
    { name: 'Prebuilt PCs', path: '/admin/prebuilt-pcs', icon: <RiFileList3Line className="text-xl" /> },
    { name: 'Categories', path: '/admin/categories', icon: <RiFileList3Line className="text-xl" /> },
    { name: 'Orders', path: '/admin/orders', icon: <RiShoppingCartLine className="text-xl" /> },
    { name: 'Settings', path: '/admin/settings', icon: <RiSettings4Line className="text-xl" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#111111] border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo/Brand */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            <span className="text-yellow-500 text-2xl">⚡</span>
            <span>Admin<span className="text-gray-500 font-light">Panel</span></span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/20' 
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info / Logout Sidebar Bottom */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-[#1a1a1a]">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-yellow-500 font-bold uppercase">
              {session?.user?.name?.substring(0, 1) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{session?.user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <RiLogoutBoxRLine className="text-xl" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-[#111111]/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <RiMenuLine className="text-2xl" />
            </button>
            <h1 className="text-xl font-semibold hidden sm:block">
              {menuItems.find(item => item.path === router.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <Link href="/" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors hidden sm:block border border-gray-700 px-4 py-1.5 rounded-full hover:border-yellow-500">
               View Storefront
             </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

      </main>

    </div>
  );
};

export default AdminLayout;
