import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function EditPrebuiltPC() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    description: '',
    price: '',
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      setInitialLoading(false);
      return;
    }
    if (id) {
      fetchPc();
    }
  }, [id, isNew]);

  const fetchPc = async () => {
    try {
      const res = await fetch(`/api/admin/prebuilt-pcs/${id}`);
      const data = await res.json();
      if (data.data) {
        setFormData(data.data);
      } else {
        toast.error('Prebuilt PC not found');
        router.push('/admin/prebuilt-pcs');
      }
    } catch (error) {
      toast.error('Failed to fetch PC data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isNew ? '/api/admin/prebuilt-pcs' : `/api/admin/prebuilt-pcs/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price, 10) || 0
        }),
      });

      if (res.ok) {
        toast.success(isNew ? 'Prebuilt PC created!' : 'Prebuilt PC updated!');
        router.push('/admin/prebuilt-pcs');
      } else {
        toast.error('Failed to save Prebuilt PC');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('files', files[i]);
    }

    setLoading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.urls) {
        let currentImages = [];
        try {
          if (formData.image) currentImages = JSON.parse(formData.image);
        } catch {
          if (formData.image) currentImages = [formData.image];
        }
        const newImages = [...currentImages, ...result.urls];
        setFormData(prev => ({ ...prev, image: JSON.stringify(newImages) }));
        toast.success('Images uploaded successfully');
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Error uploading images');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    let currentImages = [];
    try {
      if (formData.image) currentImages = JSON.parse(formData.image);
    } catch {
      if (formData.image) currentImages = [formData.image];
    }
    const newImages = currentImages.filter((_, index) => index !== indexToRemove);
    setFormData(prev => ({ ...prev, image: JSON.stringify(newImages) }));
  };

  let displayImages = [];
  try {
    if (formData.image) displayImages = JSON.parse(formData.image);
  } catch {
    if (formData.image) displayImages = [formData.image];
  }

  if (initialLoading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <div className="text-white font-sans max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/prebuilt-pcs" className="text-gray-400 hover:text-white transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {isNew ? 'Add New Prebuilt PC' : 'Edit Prebuilt PC'}
        </h1>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="e.g. Gamer X-Treme 9"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="e.g. 245000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="md:w-1/2 pr-3">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Tag</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="e.g. Best Seller, Premium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">System Images</label>
              <div className="flex flex-col gap-4 bg-[#1a1a1a] p-4 rounded-lg border border-gray-700">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-white focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 cursor-pointer"
                />
                
                {displayImages.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {displayImages.map((img, idx) => (
                      <div key={idx} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-600">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="Short description of the system..."
            ></textarea>
          </div>

          <div className="border-t border-gray-800 pt-6 mt-6">
            <h3 className="text-xl font-bold mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">CPU</label>
                <input
                  type="text"
                  name="cpu"
                  value={formData.cpu}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="e.g. Intel Core i9-13900K"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">GPU</label>
                <input
                  type="text"
                  name="gpu"
                  value={formData.gpu}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="e.g. RTX 4090 24GB"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">RAM</label>
                <input
                  type="text"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="e.g. 64GB DDR5 6000MHz"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Storage</label>
                <input
                  type="text"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="e.g. 2TB NVMe Gen4 SSD"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black px-8 py-3 rounded-lg font-bold transition-colors"
            >
              {loading ? 'Saving...' : 'Save Prebuilt PC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
