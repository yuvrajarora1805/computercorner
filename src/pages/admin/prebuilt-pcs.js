import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminPrebuiltPCs() {
  const [pcs, setPcs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPcs = async () => {
    try {
      const res = await fetch('/api/admin/prebuilt-pcs');
      const data = await res.json();
      if (data.data) {
        setPcs(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch Prebuilt PCs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPcs();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this Prebuilt PC?')) {
      try {
        const res = await fetch(`/api/admin/prebuilt-pcs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Prebuilt PC deleted successfully');
          fetchPcs();
        } else {
          toast.error('Failed to delete Prebuilt PC');
        }
      } catch (error) {
        toast.error('Error deleting Prebuilt PC');
      }
    }
  };

  return (
    <div className="text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Prebuilt PCs Management</h1>
            <p className="text-gray-400">Manage fully built systems and their specifications</p>
          </div>
          <Link href="/admin/edit-prebuilt/new" className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded font-bold transition-colors">
            + Add New System
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading systems...</div>
        ) : (
          <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1a1a1a] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Tag</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {pcs.map((pc) => (
                    <tr key={pc.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 bg-black rounded flex items-center justify-center overflow-hidden border border-gray-700">
                          {(() => {
                            let imgUrl = pc.image;
                            try {
                              const parsed = JSON.parse(imgUrl);
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                imgUrl = parsed[0];
                              }
                            } catch (e) {}
                            return imgUrl ? (
                              <img src={imgUrl} alt={pc.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs text-gray-600">No Img</span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-200">{pc.name}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{pc.cpu} • {pc.gpu}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded text-xs font-semibold">
                          {pc.tag || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">₹{pc.price?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/edit-prebuilt/${pc.id}`} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">Edit</Link>
                        <button onClick={() => handleDelete(pc.id)} className="text-red-500 hover:text-red-400 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {pcs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No Prebuilt PCs found. Click "Add New System" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
