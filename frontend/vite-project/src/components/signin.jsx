import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function Signin() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateInput = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formState,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Login successful!", {
          position: "top-right",
        });
        console.log("User data", response.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login failed!", {
          position: "top-right",
        });
      } else {
        toast.error("Something went wrong!", { position: "top-right" });
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl w-full max-w-md p-8 transition-all duration-700 ease-out transform opacity-100 scale-100 translate-y-0">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative group">
            <div className="absolute left-3 top-3.5 text-white/60 group-focus-within:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={updateInput}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 text-white bg-white/10 placeholder-white/60 border border-white/20 rounded-xl backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute left-3 top-3.5 text-white/60 group-focus-within:text-white transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formState.password}
              onChange={updateInput}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 text-white bg-white/10 placeholder-white/60 border border-white/20 rounded-xl backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3.5 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3 mt-2 bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:from-indigo-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 overflow-hidden group"
          >
            <span className={`transition-all duration-300 ${loading ? "opacity-0" : "opacity-100"}`}>
              <span className="flex items-center justify-center">
                Sign In <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
