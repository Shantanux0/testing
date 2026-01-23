import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
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
            await authApi.verifyOtp({ email, otp: otpValue });
            toast.success("Identity Verified", { description: "Redirecting to secure area..." });
            setTimeout(() => navigate("/signin"), 1500);
        } catch (err: any) {
            console.error("OTP Error:", err);
            const msg = err?.message?.includes("API") ? err.message.split(": ")[1] : err.message;
            toast.error("Verification Failed", { description: msg || "Invalid code." });
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await authApi.resendOtp(email);
            toast.success("Code Sent", { description: `Fresh code dispatched to ${email}` });
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err) {
            toast.error("Transmission Failed");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Visual Side (Left) - Cinematic Image */}
            <div className="hidden lg:relative lg:flex lg:flex-col lg:justify-between p-12 bg-black text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                        alt="Security"
                        className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="relative z-10">
                    <button onClick={() => navigate("/signup")} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Cancel Verification
                    </button>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="w-12 h-12 flex items-center justify-center border border-white/20">
                        <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-4xl font-serif font-bold leading-tight tracking-tight">
                        "Security is the foundation of trust."
                    </h2>
                </div>
            </div>

            {/* Form Side (Right) */}
            <div className="flex items-center justify-center p-8 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-4xl font-serif font-bold text-black tracking-tight">Verify Identity.</h1>
                        <p className="text-gray-500 font-light">
                            Enter the code sent to <span className="font-semibold text-black">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-center lg:justify-start gap-3">
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
                                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-serif font-bold rounded-none bg-white border-gray-200 text-black focus:border-black focus:ring-0 transition-all shadow-none"
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-sm uppercase tracking-widest font-bold rounded-none bg-black hover:bg-gray-900 text-white transition-all hover:tracking-[0.2em] duration-300"
                            disabled={loading || otp.join("").length !== 6}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Confirm <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center lg:text-left">
                        <p className="text-sm text-gray-500">
                            Didn't receive it?{" "}
                            <button
                                onClick={handleResend}
                                className="text-black font-semibold hover:underline border-b-2 border-transparent hover:border-black transition-all"
                            >
                                Resend Code
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OTP;
