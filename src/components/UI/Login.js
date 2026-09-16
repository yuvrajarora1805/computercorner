import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || "/";
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // Handle Login
      const result = await signIn('credentials', {
        redirect: false,
        username: email, // NextAuth configured to use username field as Email
        password,
      });
      
      if (result?.error) {
        toast.error('Invalid credentials');
      } else {
        toast.success('Logged in successfully!');
        router.push(callbackUrl);
      }
    } else {
      // Handle Sign Up
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: name, email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
          toast.success('Account created successfully! Logging you in...');
          // Automatically log them in after signup
          await signIn('credentials', {
            redirect: false,
            username: email,
            password,
          });
          router.push(callbackUrl);
        } else {
          toast.error(data.error || 'Failed to sign up');
        }
      } catch (err) {
        toast.error('An error occurred during sign up');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#111] border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-xl max-w-md w-full relative overflow-hidden my-8">
      {/* Decorative Glow */}
      <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-yellow-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white z-10 text-center tracking-tight">
        {isLogin ? (
          <>Welcome <span className="text-yellow-500">Back</span></>
        ) : (
          <>Join <span className="text-yellow-500">Us</span></>
        )}
      </h2>
      <p className="text-gray-400 mb-8 z-10 text-center text-sm md:text-base">
        {isLogin ? 'Sign in to save your custom PC builds and complete your purchases.' : 'Create an account to start building your dream PC.'}
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4 z-10 mb-4">
        {!isLogin && (
          <div>
            <input
              required={!isLogin}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
        )}
        <div>
          <input
            required
            type="text"
            placeholder="Email (or 'admin' for Admin login)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
        <div>
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
      </form>

      <div className="z-10 mb-6 w-full text-center">
        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-gray-400 hover:text-yellow-500 text-sm transition-colors"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>

      <div className="w-full flex items-center justify-between z-10 mb-6">
        <hr className="w-full border-gray-800" />
        <span className="p-2 text-gray-500 text-sm whitespace-nowrap">OR</span>
        <hr className="w-full border-gray-800" />
      </div>

      <div className="w-full space-y-4 z-10">
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full flex justify-center items-center gap-4 bg-[#1a1a1a] hover:bg-[#222] border border-gray-700 hover:border-yellow-500/50 p-4 rounded-xl text-white transition-all duration-300 group"
        >
          <FcGoogle className="text-3xl group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold text-lg tracking-wide">Continue with Google</span>
        </button>
      </div>
      
      <div className="mt-8 z-10 text-xs text-gray-600 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
};

export default LoginPage;
