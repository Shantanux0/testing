import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail, ArrowRight, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

const OTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            navigate("/signup");
            return;
        }
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [email, navigate]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pastedData.every(char => !isNaN(Number(char)))) {
            const newOtp = [...otp];
            pastedData.forEach((char, index) => {
                if (index < 6) newOtp[index] = char;
            });
            setOtp(newOtp);
            if (inputRefs.current[Math.min(pastedData.length, 5)]) {
                inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length !== 6) return;

        setLoading(true);
        try {
            await authApi.verifyOtp(email, otpValue); // Email is already passed from state (likely preserved casing)
            toast.success("Email verified!", { description: "Redirecting to login..." });
            setTimeout(() => navigate("/signin"), 1500);
        } catch (err: any) {
            console.error("OTP Error:", err);
            const msg = err?.message?.includes("API") ? err.message.split(": ")[1] : err.message;
            toast.error("Verification Failed", { description: msg || "Invalid OTP code." });
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await authApi.sendOtp(email);
            toast.success("Code sent!", { description: `Fresh code sent to ${email}` });
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err) {
            toast.error("Failed to resend code");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Check your email</h1>
                        <p className="text-slate-400 text-lg">
                            We sent a code to <br />
                            <span className="text-indigo-400 font-medium">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-center gap-2">
                            {otp.map((data, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={data}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    ref={(el) => { if (el) inputRefs.current[index] = el; }}
                                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl bg-slate-800/50 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/30 transition-all"
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                            disabled={loading || otp.join("").length !== 6}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify Email <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Didn't receive it?{" "}
                            <button
                                onClick={handleResend}
                                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                            >
                                Resend Code
                            </button>
                        </p>
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center mt-6">
                    <button onClick={() => navigate("/signup")} className="text-sm text-slate-500 hover:text-white transition-colors">
                        ← Back to Sign Up
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OTP;
