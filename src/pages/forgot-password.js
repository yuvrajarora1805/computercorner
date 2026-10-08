import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { BiMailSend } from 'react-icons/bi';
import Head from 'next/head';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSubmitted(true);
        toast.success('Reset request sent!');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - The Computer Corner</title>
        <meta name="description" content="Reset your password for The Computer Corner" />
      </Head>
      <div className="min-h-screen bg-[#050505] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full space-y-8 bg-[#111] p-10 rounded-2xl border border-gray-800 shadow-2xl">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
              Reset <span className="text-yellow-500">Password</span>
            </h2>
            <p className="mt-4 text-sm text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 text-center bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex justify-center mb-4 text-yellow-500">
                <BiMailSend size={60} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check Your Inbox</h3>
              <p className="text-sm text-gray-400 mb-6">
                We have sent a secure password reset link to <strong className="text-white">{email}</strong>. Please check your spam folder if you don't see it.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-yellow-500 hover:text-yellow-400 text-sm font-bold uppercase tracking-wide"
              >
                Send to a different email
              </button>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-400 uppercase tracking-wide mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-gray-500 hover:text-yellow-500 transition-colors font-bold">
                  Remember your password? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
