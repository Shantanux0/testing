import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles, KeyRound } from "lucide-react";
import { authApi, getErrorMessage } from "@/lib/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await authApi.sendResetOtp(email);
      setSuccess("A password reset OTP has been sent to your email.");
      setStep("OTP");
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      setSuccess("Your password has been successfully reset. Redirecting to login...");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err));
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
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Security"
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link to="/signin" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="w-12 h-12 flex items-center justify-center border border-white/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight tracking-tight">
            "Security is not a product, but a process."
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-400">
            — System Administrator
          </p>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-black tracking-tight">
              {step === "EMAIL" ? "Reset Password." : "Set New Password."}
            </h1>
            <p className="text-gray-500 font-light">
              {step === "EMAIL"
                ? "Enter your email address to receive a password reset OTP."
                : "Enter the OTP sent to your email and your new password."}
            </p>
          </div>

          {step === "EMAIL" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
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

              {error && (
                <div className="text-red-500 text-xs tracking-widest uppercase font-bold flex items-center gap-2 mt-2">
                  <span>Failed:</span> {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-xs tracking-widest uppercase font-bold flex items-center gap-2 mt-2">
                  <span>Success:</span> {success}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-sm uppercase tracking-widest font-bold rounded-none bg-black hover:bg-gray-900 text-white transition-all hover:tracking-[0.2em] duration-300"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-900">OTP</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter 6-digit OTP"
                  className="h-12 rounded-none border-gray-200 focus:ring-0 focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-900">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-12 rounded-none border-gray-200 focus:ring-0 focus:border-black transition-colors"
                />
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters and include uppercase, lowercase, number, and special character.
                </p>
              </div>

              {error && (
                <div className="text-red-500 text-xs tracking-widest uppercase font-bold flex items-center gap-2 mt-2">
                  <span>Failed:</span> {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-xs tracking-widest uppercase font-bold flex items-center gap-2 mt-2">
                  <span>Success:</span> {success}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-sm uppercase tracking-widest font-bold rounded-none bg-black hover:bg-gray-900 text-white transition-all hover:tracking-[0.2em] duration-300"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("EMAIL");
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full h-14 text-sm uppercase tracking-widest font-bold rounded-none border border-gray-200 bg-white text-black hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
              >
                Back to Email
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link to="/signin" className="text-black font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
