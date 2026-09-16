import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              const { img, ...rest } = data.data;
              setFormData(rest);
              
              // Parse existing images if they are in JSON format
              if (img) {
                try {
                  const parsed = JSON.parse(img);
                  if (Array.isArray(parsed)) {
                    setExistingImages(parsed);
                  } else {
                    setExistingImages([img]); // Fallback for old string format
                  }
                } catch (e) {
                  setExistingImages([img]); // Fallback for old string format
                }
              }
            }
          } else {
            toast.error('Product not found');
            router.push('/admin');
          }
        } catch (error) {
          toast.error('Failed to fetch product details');
        } finally {
          setFetching(false);
        }
      };

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

      fetchProduct();
      fetchCategories();
    }
  }, [id, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      // Create previews for new files
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrls = [...existingImages];

      // 1. Upload new files if selected
      if (files.length > 0) {
        const uploadData = new FormData();
        files.forEach(file => uploadData.append('files', file));

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          // Append new images to existing ones (or replace, depending on preference. Here we append)
          uploadedImageUrls = [...uploadedImageUrls, ...(uploadResult.urls || [])];
        } else {
          toast.error('Failed to upload new images');
          setLoading(false);
          return;
        }
      }

      // 2. Submit product data with stringified image URLs
      const productData = { 
        ...formData, 
        img: JSON.stringify(uploadedImageUrls) 
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (res.ok) {
        toast.success('Product updated successfully!');
        router.push('/admin');
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="bg-[#050505] min-h-screen text-white font-sans flex items-center justify-center">Loading product...</div>;
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight border-l border-gray-700 pl-4">Edit Product</h1>
        </div>

        <div className="bg-[#111] p-8 rounded-xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors">
                  {categories.length === 0 && <option value={formData.category}>{formData.category}</option>}
                  {categories.map((cat, index) => (
                    <option key={index} value={cat.slug} className="capitalize">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹)</label>
                <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" />
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Add New Product Images</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange} 
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#333] file:text-white hover:file:bg-[#444] transition-colors cursor-pointer" 
              />
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Current Images</span>
                  <div className="flex gap-4 mt-2 overflow-x-auto pb-2 custom-scrollbar">
                    {existingImages.map((url, idx) => (
                      <div key={`exist-${idx}`} className="relative group">
                        <img src={url} alt={`Existing ${idx}`} className="w-24 h-24 object-cover rounded border border-gray-700" />
                        <button 
                          type="button"
                          onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Previews */}
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-[#00ff80] uppercase tracking-wider">New Images to Upload</span>
                  <div className="flex gap-4 mt-2 overflow-x-auto pb-2 custom-scrollbar">
                    {previewUrls.map((url, idx) => (
                      <img key={`new-${idx}`} src={url} alt={`Preview ${idx}`} className="w-24 h-24 object-cover rounded border border-[#00ff80]" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Key Feature</label>
              <input type="text" name="keyFeature" value={formData.keyFeature} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors"></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <button disabled={loading} type="submit" className="bg-[#00ff80] text-black hover:bg-[#00cc66] font-bold py-3 px-8 rounded transition-colors disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
