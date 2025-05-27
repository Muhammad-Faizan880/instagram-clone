import { useEffect, useState } from 'react';
import { AtSign, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Register = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value
    });
    // Clear previous error messages when user types
    setError('');
  };

  const validateForm = () => {
    if (!formState.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (!formState.email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formState.password) {
      setError('Password is required');
      return false;
    } else if (formState.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

 const handleSubmit = async (e) => {
  if (e && e.preventDefault) e.preventDefault();

  // Clear previous messages
  setError('');
  setSuccess('');

  // Validate form
  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://localhost:8000/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formState.username,
        email: formState.email,
        password: formState.password
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    toast.success('Registration successful! You can now login.');
    navigate("/signin");

    setFormState({
      username: '',
      email: '',
      password: ''
    });

  } catch (err) {
    toast.error(err.message || 'An error occurred during registration');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-md animate-float"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 15}s`
            }}
          />
        ))}
      </div>

      <div
        className={`backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl w-full max-w-md p-8 transition-all duration-700 ease-out transform ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-6'
        }`}
      >
        <div className="mb-8 text-center">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Create Account
          </h2>
          <p className="text-white/80 mt-2">Join our community today</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-5">
          {/* Username */}
          <div className="relative group">
            <div className="absolute left-3 top-3.5 text-white/60 group-focus-within:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="username"
              value={formState.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 text-white bg-white/10 placeholder-white/60 border border-white/20 rounded-xl backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-300"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute left-3 top-3.5 text-white/60 group-focus-within:text-white transition-colors">
              <AtSign className="w-5 h-5" />
            </div>
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 text-white bg-white/10 placeholder-white/60 border border-white/20 rounded-xl backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-300"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute left-3 top-3.5 text-white/60 group-focus-within:text-white transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 text-white bg-white/10 placeholder-white/60 border border-white/20 rounded-xl backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 rounded bg-white/10 border-white/30 text-indigo-600 focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-white/80">
              I agree to the <span className="text-white underline cursor-pointer">Terms</span> and <span className="text-white underline cursor-pointer">Privacy Policy</span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="relative w-full py-3 mt-2 bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:from-indigo-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 overflow-hidden group"
          >
            <span className={`transition-all duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              <span className="flex items-center justify-center">
                Register 
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/80">
            Already have an account? <span className="text-white font-semibold underline cursor-pointer"> <Link to="/signin">Sign in</Link> </span>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-white/70 text-center text-sm">Or continue with</p>
          <div className="flex justify-center items-center gap-6 mt-6">
            {/* Google */}
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
              </svg>
            </button>
            {/* Facebook */}
            <button className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            {/* Apple */}
            <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white"
              >
                <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91-.83 0-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53 1.25-.05 1.72-.8 3.22-.8s1.93.8 3.25.77c1.35 0 2.19-1.21 3-2.43a10.23 10.23 0 0 0 1.4-2.79 4.39 4.39 0 0 1-2.63-4.12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Define animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-20px, -15px) rotate(3deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  .animate-float {
    animation: float 15s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default Register;