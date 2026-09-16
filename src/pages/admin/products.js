import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.data) {
        setProducts(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Product deleted successfully');
          fetchProducts();
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  // Get unique categories from products
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products by active category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Products Management</h1>
          <p className="text-gray-400">View and filter your inventory</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : (
          <>
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider capitalize whitespace-nowrap transition-colors ${
                    activeCategory === cat 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-[#111] text-gray-400 border border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#1a1a1a] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 bg-black rounded flex items-center justify-center overflow-hidden border border-gray-700">
                            {product.img ? (
                              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs text-gray-600">No Img</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-200">{product.name}</td>
                        <td className="px-6 py-4 text-gray-400 capitalize">{product.category}</td>
                        <td className="px-6 py-4 text-gray-300">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${product.status === 'In Stock' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/edit/${product._id}`} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">Edit</Link>
                          <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-400 transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No products found for this category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
