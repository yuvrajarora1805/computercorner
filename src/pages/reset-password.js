import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { BiCheckCircle, BiShow, BiHide } from 'react-icons/bi';
import Head from 'next/head';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prevent rendering if token is completely missing
  useEffect(() => {
    if (router.isReady && !token) {
      toast.error('Invalid or missing password reset token');
      router.push('/forgot-password');
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) return null;

  return (
    <>
      <Head>
        <title>Set New Password - The Computer Corner</title>
      </Head>
      <div className="min-h-screen bg-[#050505] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full space-y-8 bg-[#111] p-10 rounded-2xl border border-gray-800 shadow-2xl">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
              New <span className="text-yellow-500">Password</span>
            </h2>
            <p className="mt-4 text-sm text-gray-400">
              Create a strong new password for your account.
            </p>
          </div>

          {success ? (
            <div className="mt-8 text-center bg-green-500/10 p-8 rounded-xl border border-green-500/20">
              <div className="flex justify-center mb-4 text-green-500">
                <BiCheckCircle size={70} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Password Reset!</h3>
              <p className="text-sm text-gray-400 mb-8">
                Your password has been securely updated. You can now log in with your new password.
              </p>
              <Link 
                href="/login"
                className="inline-block bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors hover:bg-yellow-400 uppercase tracking-wide shadow-lg shadow-yellow-500/20"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wide mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors sm:text-sm pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-500"
                    >
                      {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters long.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wide mb-1 mt-4">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors sm:text-sm pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-500"
                    >
                      {showConfirmPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                >
                  {loading ? 'Saving...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
