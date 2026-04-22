import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(email, password);
      navigate("/verify", { state: { email } });
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.message?.includes("API")
        ? err.message.split(": ")[1] || "Unable to sign up. Please try again."
        : "Unable to sign up. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side (Left) */}
      <div className="relative flex flex-col justify-between p-8 md:p-12 bg-black text-white overflow-hidden min-h-[30vh] lg:min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070"
            alt="Workspace"
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
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight tracking-tight">
            "The best way to learn is to teach."
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-400">
            — SkillSwap Philosophy
          </p>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-black tracking-tight">Initiation.</h1>
            <p className="text-gray-500 font-light">
              Begin your journey of exchange.
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
              <label className="text-xs uppercase tracking-widest font-bold text-gray-900">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  className="h-12 rounded-none border-gray-200 focus:ring-0 focus:border-black transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password Strength Bar */}
              {password.length > 0 && (
                <div className="h-1 bg-gray-100 mt-2">
                  <div
                    className={`h-full transition-all duration-300 ${password.length > 8 ? 'bg-black w-full' :
                      password.length > 5 ? 'bg-gray-500 w-2/3' : 'bg-gray-300 w-1/3'
                      }`}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-900">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className="h-12 rounded-none border-gray-200 focus:ring-0 focus:border-black transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
              {loading ? "Creating Profile..." : "Join Now"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link to="/signin" className="text-black font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
