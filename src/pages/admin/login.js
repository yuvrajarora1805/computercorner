import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      toast.error('Invalid admin credentials');
      setLoading(false);
    } else {
      toast.success('Logged in successfully');
      router.push('/admin');
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans flex items-center justify-center p-4">
      <div className="bg-[#111] border border-gray-800 p-8 rounded-xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-gray-400 mt-2">Sign in to manage the store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
            <input 
              required 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" 
              placeholder="admin" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#00ff80] transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-[#00ff80] text-black hover:bg-[#00cc66] font-bold py-3 px-8 rounded transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
