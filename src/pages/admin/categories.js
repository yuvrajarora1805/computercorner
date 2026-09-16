import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });

  useEffect(() => {
    // Fetch products to extract categories
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.data) {
          // Extract unique categories and counts
          const catMap = {};
          data.data.forEach(p => {
            if (p.category) {
              catMap[p.category] = (catMap[p.category] || 0) + 1;
            }
          });
          
          const catArray = Object.keys(catMap).map(cat => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            slug: cat.toLowerCase(),
            count: catMap[cat]
          }));
          
          // Also check localStorage for custom added categories
          const customCats = JSON.parse(localStorage.getItem('customCategories') || '[]');
          
          const merged = [...catArray];
          customCats.forEach(custom => {
            if (!merged.find(m => m.slug === custom.slug)) {
              merged.push(custom);
            }
          });

          setCategories(merged);
        }
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Please fill all fields');
      return;
    }
    
    const newCatObj = { ...newCategory, count: 0, id: newCategory.slug };
    
    const updatedCats = [...categories, newCatObj];
    setCategories(updatedCats);
    
    // Save to localStorage so it persists in the UI
    const customCats = JSON.parse(localStorage.getItem('customCategories') || '[]');
    localStorage.setItem('customCategories', JSON.stringify([...customCats, newCatObj]));
    
    toast.success('Category added successfully');
    setIsModalOpen(false);
    setNewCategory({ name: '', slug: '' });
  };

  const handleDelete = (slug) => {
    if (confirm('Are you sure you want to remove this category?')) {
      const updatedCats = categories.filter(c => c.slug !== slug);
      setCategories(updatedCats);
      
      const customCats = JSON.parse(localStorage.getItem('customCategories') || '[]');
      const updatedCustom = customCats.filter(c => c.slug !== slug);
      localStorage.setItem('customCategories', JSON.stringify(updatedCustom));
      
      toast.success('Category removed');
    }
  };

  return (
    <div className="text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-gray-400 mt-2">Manage product categories</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00ff80] text-black hover:bg-[#00cc66] font-bold py-2 px-6 rounded transition-colors flex items-center shadow-lg shadow-[#00ff80]/20"
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading categories...</div>
      ) : (
        <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1a1a] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Products Count</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {categories.map(category => (
                  <tr key={category.slug} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-200">{category.name}</td>
                    <td className="px-6 py-4 text-gray-400">{category.slug}</td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className="bg-gray-800 px-2 py-1 rounded text-xs font-bold">{category.count}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(category.slug)} className="text-red-500 hover:text-red-400 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-[#1a1a1a] flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category Name</label>
                <input 
                  type="text" 
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g. Graphics Card"
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
                <input 
                  type="text" 
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g. graphics-card"
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-gray-400 focus:outline-none" 
                  required 
                />
                <p className="text-xs text-gray-600 mt-1">Used for URLs and internal references.</p>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-transparent border border-gray-700 hover:bg-gray-800 text-white font-bold py-3 rounded transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
