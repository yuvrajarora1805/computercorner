import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'processor',
    price: '',
    status: 'In Stock',
    rating: '5',
    description: '',
    keyFeature: '',
    individualRating: '5'
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.data) {
          const catMap = {};
          data.data.forEach(p => {
            if (p.category) {
              catMap[p.category] = true;
            }
          });
          const dbCats = Object.keys(catMap).map(c => ({ slug: c.toLowerCase(), name: c }));
          const customCats = JSON.parse(localStorage.getItem('customCategories') || '[]');
          
          const merged = [...dbCats];
          customCats.forEach(custom => {
            if (!merged.find(m => m.slug === custom.slug)) {
              merged.push(custom);
            }
          });
          setCategories(merged);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      // Create previews
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrls = [];

      // 1. Upload files first
      if (files.length > 0) {
        const uploadData = new FormData();
        files.forEach(file => uploadData.append('files', file));

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          uploadedImageUrls = uploadResult.urls || [];
        } else {
          toast.error('Failed to upload images');
          setLoading(false);
          return;
        }
      }

      // 2. Submit product data with stringified image URLs
      const productData = { 
        ...formData, 
        img: JSON.stringify(uploadedImageUrls) 
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (res.ok) {
        toast.success('Product added successfully!');
        router.push('/admin');
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      toast.error('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#111] p-8 rounded-xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" placeholder="e.g. Intel Core i9-13900K" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors">
                  {categories.length === 0 && <option value="processor">Processor (CPU)</option>}
                  {categories.map((cat, index) => (
                    <option key={index} value={cat.slug} className="capitalize">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹)</label>
                <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" placeholder="e.g. 45,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors">
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Product Images</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange} 
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#333] file:text-white hover:file:bg-[#444] transition-colors cursor-pointer" 
              />
              {previewUrls.length > 0 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                  {previewUrls.map((url, idx) => (
                    <img key={idx} src={url} alt={`Preview ${idx}`} className="w-24 h-24 object-cover rounded border border-gray-700" />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Key Feature (Short string)</label>
              <input type="text" name="keyFeature" value={formData.keyFeature} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" placeholder="e.g. 24 Cores, 32 Threads" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" placeholder="Detailed product description..."></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <button disabled={loading} type="submit" className="bg-[#00ff80] text-black hover:bg-[#00cc66] font-bold py-3 px-8 rounded transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
