import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="hidden lg:relative lg:flex lg:flex-col lg:justify-between p-12 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070"
            alt="Workspace"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/10" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-6 h-6 text-indigo-300" />
          </div>
          <h2 className="text-4xl font-display font-bold leading-tight">
            "The best way to learn is to teach. SkillSwap makes it effortless."
          </h2>
          <p className="text-lg text-slate-300">
            Join thousands of students and professionals exchanging knowledge daily.
          </p>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-display font-bold text-slate-900">Create an account</h1>
            <p className="text-slate-500">
              Enter your details to start swapping skills.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
                placeholder="student@university.edu"
                className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
              />
              {/* Password Strength Bar */}
              {password.length > 0 && (
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-300 ${password.length > 8 ? 'bg-emerald-500 w-full' :
                      password.length > 5 ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'
                      }`}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-indigo-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
