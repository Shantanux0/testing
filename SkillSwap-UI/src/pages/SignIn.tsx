import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      // Navigate to home page after login
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.message?.includes("API")
        ? err.message.split(": ")[1] || "Unable to sign in. Please try again."
        : "Unable to sign in. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side (Left) - Cinematic Image */}
      <div className="relative flex flex-col justify-between p-8 lg:p-12 bg-black text-white overflow-hidden min-h-[30vh] lg:min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
            alt="Collaboration"
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="w-12 h-12 flex items-center justify-center border border-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight tracking-tight">
            "Knowledge displayed is knowledge shared."
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-400">
            — Community Member
          </p>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-4xl font-serif font-bold text-black tracking-tight">Welcome Back.</h1>
            <p className="text-gray-500 font-light">
              Access your personalized learning space.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-900">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
                placeholder="name@example.com"
                className="h-12 rounded-none border-gray-200 focus:ring-0 focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-900">Password</label>
                <Link to="#" className="text-xs text-gray-500 hover:text-black hover:underline uppercase tracking-wide">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="h-12 rounded-none border-gray-200 focus:ring-0 focus:border-black transition-colors"
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs tracking-widest uppercase font-bold flex items-center gap-2 mt-2">
                <span>Failed:</span> {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-sm uppercase tracking-widest font-bold rounded-none bg-black hover:bg-gray-900 text-white transition-all hover:tracking-[0.2em] duration-300"
            >
              {loading ? "Authenticating..." : "Enter"}
            </Button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEmail("lazyleet20@gmail.com");
                setPassword("password123");
              }}
              className="w-full h-14 text-sm uppercase tracking-widest font-bold rounded-none border border-gray-200 bg-white text-black hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
            >
              Demo Account (Python)
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Are you new here?{" "}
            <Link to="/signup" className="text-black font-semibold hover:underline">
              Join the movement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
