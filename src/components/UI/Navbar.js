import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { RiArrowDropDownLine, RiSearchLine, RiUserLine, RiHeartLine, RiShoppingCartLine } from "react-icons/ri";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data: session } = useSession();
  const { items } = useAppSelector((state) => state.product);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-gray-800 text-white shadow-xl font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-yellow-500 text-black text-center py-1 text-xs md:text-sm font-semibold tracking-wide">
        PC prices will rise in JULY 2026 due to AI component scarcity. Order your PC now
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="navbar h-20 min-h-[5rem] px-0">
          
          <div className="navbar-start w-1/4">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden hover:bg-gray-800 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-[#1a1a1a] border border-gray-800 rounded-box w-64">
                <li>
                  <a className="text-gray-300 hover:text-white hover:bg-gray-800 font-medium">Categories</a>
                  <ul className="p-2 border-l border-gray-700 ml-3">
                    <li><Link href="/category/processor" className="hover:text-yellow-500">CPU / Processor</Link></li>
                    <li><Link href="/category/motherboard" className="hover:text-yellow-500">Motherboard</Link></li>
                    <li><Link href="/category/ram" className="hover:text-yellow-500">RAM</Link></li>
                    <li><Link href="/category/supply" className="hover:text-yellow-500">Power Supply</Link></li>
                    <li><Link href="/category/storage" className="hover:text-yellow-500">Storage Device</Link></li>
                    <li><Link href="/category/monitor" className="hover:text-yellow-500">Monitor</Link></li>
                    <li><Link href="/category/others" className="hover:text-yellow-500">Others</Link></li>
                  </ul>
                </li>
                <li className="mt-2">
                  <Link href="/pcbuilder" className="btn btn-sm bg-yellow-500 hover:bg-yellow-400 text-black border-none w-full">
                    PC Builder
                  </Link>
                </li>
              </ul>
            </div>
            <Link href="/" className="flex items-center gap-2 normal-case text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
              <span className="text-yellow-500 text-2xl">⚡</span>
              <span className="hidden sm:block">The Computer Corner</span>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex flex-1 justify-center gap-6">
            <form onSubmit={handleSearch} className="relative w-full max-w-md group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products.." 
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-full py-2 px-5 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer">
                <RiSearchLine />
              </button>
            </form>

            <div className="dropdown dropdown-hover">
              <label tabIndex={0} className="flex items-center gap-1 cursor-pointer text-gray-300 hover:text-white transition-colors h-10 px-2 font-medium">
                Categories <RiArrowDropDownLine className="text-2xl" />
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-3 shadow-2xl bg-[#1a1a1a] border border-gray-800 rounded-box w-56 mt-4">
                <li><Link href="/category/processor" className="hover:bg-gray-800 hover:text-yellow-500">CPU / Processor</Link></li>
                <li><Link href="/category/motherboard" className="hover:bg-gray-800 hover:text-yellow-500">Motherboard</Link></li>
                <li><Link href="/category/ram" className="hover:bg-gray-800 hover:text-yellow-500">RAM</Link></li>
                <li><Link href="/category/supply" className="hover:bg-gray-800 hover:text-yellow-500">Power Supply</Link></li>
                <li><Link href="/category/storage" className="hover:bg-gray-800 hover:text-yellow-500">Storage Device</Link></li>
                <li><Link href="/category/monitor" className="hover:bg-gray-800 hover:text-yellow-500">Monitor</Link></li>
                <li><Link href="/category/others" className="hover:bg-gray-800 hover:text-yellow-500">Others</Link></li>
              </ul>
            </div>
            
            <Link href="/pcbuilder" className="btn btn-sm bg-yellow-500 hover:bg-yellow-400 text-black border-none rounded-full px-6 font-semibold shadow-lg shadow-yellow-500/20">
              PC Builder
            </Link>
          </div>

          <div className="navbar-end w-auto lg:w-1/4 gap-4">
            
            <div className="hidden sm:flex gap-4 items-center">
              <Link href="/favorites" className="cursor-pointer text-gray-300 hover:text-yellow-500 transition-colors">
                <RiHeartLine className="text-2xl" />
              </Link>
              <Link href="/cart" className="indicator cursor-pointer text-gray-300 hover:text-yellow-500 transition-colors mr-2">
                <span className="indicator-item badge badge-sm bg-yellow-500 border-none text-black font-bold -right-2">
                  {items?.length || 0}
                </span> 
                <RiShoppingCartLine className="text-2xl" />
              </Link>
            </div>

            {session?.user ? (
              <div className="dropdown dropdown-end ml-2">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring ring-gray-800 hover:ring-yellow-500 transition-all">
                  <div className="w-9 rounded-full bg-[#1a1a1a] flex justify-center items-center">
                    <span className="text-lg text-yellow-500 font-semibold uppercase">
                      {session?.user?.name?.substring(0, 1) || 'U'}
                    </span>
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-4 z-[1] p-3 shadow-2xl bg-[#1a1a1a] border border-gray-800 rounded-box w-52">
                  <div className="px-4 py-2 border-b border-gray-800 mb-2">
                    <p className="text-sm font-semibold truncate text-white">{session.user.name}</p>
                  </div>
                  <li><Link href="/profile" className="hover:bg-gray-800 hover:text-white">Profile</Link></li>
                  <li><button onClick={() => signOut()} className="hover:bg-red-500/20 hover:text-red-400 text-red-500 mt-1">Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 transition-colors ml-2">
                <RiUserLine className="text-2xl" />
                <span className="hidden md:block font-medium text-sm">Sign In</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
