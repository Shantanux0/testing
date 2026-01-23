import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { matchApi, SwapMatchDto, sessionApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Sparkles, BookOpen, GraduationCap, ArrowRight, CheckCircle2, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import MatchingAnimation from "@/components/MatchingAnimation";

const CreateSwap = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [skillToLearn, setSkillToLearn] = useState("");
    const [skillToTeach, setSkillToTeach] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [matchResult, setMatchResult] = useState<SwapMatchDto[] | null>(null);
    const [matchError, setMatchError] = useState<string | null>(null);

    // Status Modal State: 'success' | 'no-match' | null
    const [statusModal, setStatusModal] = useState<'success' | 'no-match' | null>(null);

    const handleNext = () => {
        if (step === 1 && skillToLearn.trim()) setStep(2);
        else if (step === 2 && skillToTeach.trim()) handleAutoMatch();
    };

    const handleAutoMatch = async () => {
        setLoading(true);
        setMatchResult(null);
        setMatchError(null);

        try {
            // 1. Fetch First
            const data = await matchApi.findSwapMatches(skillToLearn, skillToTeach);
            setMatchResult(data);

            // 2. Start animation
            setShowAnimation(true);
        } catch (error: any) {
            setLoading(false);
            const responseMsg = error.response?.data?.message || error.response?.data || error.message || "Unknown error";
            // Ensure responseMsg is a string
            const msg = typeof responseMsg === "string" ? responseMsg : JSON.stringify(responseMsg);

            if (msg.includes("PASS A TEST") || msg.includes("must have")) {
                toast.error("Skill Validation Failed", {
                    description: msg,
                    duration: 6000,
                    action: {
                        label: "Take Test",
                        onClick: () => navigate("/test-portal", { state: { autoCheckSkill: skillToTeach } })
                    }
                });
            } else {
                toast.error("Matching Failed", { description: msg });
            }
        }
    };

    const handleAnimationComplete = async () => {
        setLoading(false);
        setShowAnimation(false);

        // If no matches found -> Show 'No Match' modal
        if (!matchResult || matchResult.length === 0) {
            setStatusModal('no-match');
            return;
        }

        // Match found -> Show Confirmation Screen
        setStep(3);
    };

    const handleConfirmSwap = async () => {
        if (!matchResult || !matchResult[0]) return;
        const best = matchResult[0];

        try {
            setLoading(true);
            await sessionApi.requestSession(best.partnerId, best.skillILearn);
            // Success -> Show 'Success' modal
            setStatusModal('success');
        } catch (error: any) {
            setLoading(false);
            const msg = error.message;
            if (msg.includes("409") || msg.includes("already pending")) {
                // Treat "already pending" as success for this flow
                setStatusModal('success');
            } else {
                toast.error("Failed to connect", { description: msg });
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative overflow-hidden">
            {/* Film Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />

            {/* Status Modals Overlay */}
            <AnimatePresence>
                {statusModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="max-w-md w-full text-center space-y-8"
                        >
                            <div className="flex justify-center">
                                <div className={`p-6 rounded-full border ${statusModal === 'success' ? 'border-green-500/30 bg-green-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
                                    {statusModal === 'success' ? (
                                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                                    ) : (
                                        <RotateCw className="w-16 h-16 text-amber-500 animate-spin-slow" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-serif font-bold">
                                    {statusModal === 'success' ? 'Request Sent' : 'Searching for Match'}
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    {statusModal === 'success'
                                        ? "We will notify you once the user accepts your swap request."
                                        : "We are waiting for a good swap. We will notify you once a compatible partner is found."}
                                </p>
                            </div>

                            <Button
                                onClick={() => navigate('/')}
                                className="h-16 px-12 rounded-full bg-white text-black hover:bg-gray-200 text-sm uppercase tracking-widest w-full"
                            >
                                Return to Home
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white">
                <div className="flex items-center gap-8">
                    <Link to="/">
                        <div className="font-serif font-bold text-2xl tracking-tighter cursor-pointer">
                            SKILLSWAP
                        </div>
                    </Link>
                    {!statusModal && (
                        <div className="hidden md:flex items-center gap-8 ml-8">
                            <button onClick={() => setStep(1)} className={`text-xs uppercase tracking-widest hover:opacity-100 transition-opacity ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>1. Seek</button>
                            <button onClick={() => setStep(2)} className={`text-xs uppercase tracking-widest hover:opacity-100 transition-opacity ${step === 2 ? 'opacity-100' : 'opacity-50'}`}>2. Offer</button>
                            <button className={`text-xs uppercase tracking-widest hover:opacity-100 transition-opacity ${step === 3 ? 'opacity-100' : 'opacity-50'}`}>3. Confirm</button>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Dashboard</button>
                    <button onClick={() => navigate('/profile')} className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Profile</button>
                    <div className="w-[1px] h-4 bg-white/30 mx-2" />
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white transition-colors">Exit <div className="w-8 h-[1px] bg-white" /></button>
                </div>
            </nav>

            {showAnimation && <MatchingAnimation onComplete={handleAnimationComplete} />}

            <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-5xl mx-auto">
                    {!statusModal && (
                        <>
                            {/* Stepper Dots */}
                            <div className="flex justify-center mb-16 space-x-12">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`flex items-center gap-4 ${step >= i ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= i ? 'bg-white scale-125' : 'bg-gray-500'}`} />
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">
                                            {i === 1 ? 'Seek' : i === 2 ? 'Offer' : 'Confirm'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-center space-y-12"
                                >
                                    {step < 3 && (
                                        <>
                                            <div className="space-y-6">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="inline-block"
                                                >
                                                    {step === 1 ? (
                                                        <div className="flex justify-center mb-6"><div className="p-3 border border-white/20 rounded-full"><Search className="w-6 h-6" /></div></div>
                                                    ) : (
                                                        <div className="flex justify-center mb-6"><div className="p-3 border border-white/20 rounded-full"><Sparkles className="w-6 h-6" /></div></div>
                                                    )}
                                                </motion.div>

                                                <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter leading-none">
                                                    {step === 1 ? (
                                                        <>What do you <br /><span className="italic text-gray-500">crave</span> to learn?</>
                                                    ) : (
                                                        <>What will you <br /><span className="italic text-gray-500">share</span> with the world?</>
                                                    )}
                                                </h1>
                                            </div>

                                            <div className="max-w-xl mx-auto relative group">
                                                <Input
                                                    className="h-24 text-4xl text-center bg-transparent border-0 border-b border-white/20 rounded-none focus:ring-0 focus:border-white placeholder:text-gray-800 transition-all duration-500 font-serif text-white focus-visible:ring-0"
                                                    placeholder={step === 1 ? "e.g. Photography" : "e.g. Photoshop"}
                                                    value={step === 1 ? skillToLearn : skillToTeach}
                                                    onChange={(e) => step === 1 ? setSkillToLearn(e.target.value) : setSkillToTeach(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="pt-12">
                                                <Button
                                                    size="lg"
                                                    onClick={handleNext}
                                                    disabled={loading || (step === 1 ? !skillToLearn : !skillToTeach)}
                                                    className="h-20 px-12 text-sm uppercase tracking-[0.3em] rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-500 hover:scale-105"
                                                >
                                                    {loading ? <RotateCw className="animate-spin w-6 h-6" /> : (
                                                        <div className="flex items-center gap-4">
                                                            {step === 1 ? "Continue" : "Find Match"}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        </>
                                    )}

                                    {/* Step 3: Match Found Confirmation */}
                                    {step === 3 && matchResult && matchResult[0] && (
                                        <div className="space-y-8 max-w-2xl mx-auto border border-white/10 p-12 rounded-3xl bg-white/5 backdrop-blur-sm">
                                            <div className="flex justify-center mb-8">
                                                <div className="p-4 border border-green-500/30 rounded-full bg-green-500/10">
                                                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Perfect Match Found</h2>
                                                <h1 className="text-5xl font-serif font-bold">{matchResult[0].partnerName}</h1>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8 text-left py-8 border-y border-white/10">
                                                <div>
                                                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">They Teach</p>
                                                    <p className="text-xl font-serif">{matchResult[0].skillITeach}</p>
                                                    <span className="text-xs text-green-400">Expert Level Verified</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">They Want to Learn</p>
                                                    <p className="text-xl font-serif">{matchResult[0].skillILearn}</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 flex gap-4 justify-center">
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    onClick={() => setStep(2)}
                                                    className="h-16 px-8 rounded-full bg-transparent border border-white text-white hover:bg-white/10"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    size="lg"
                                                    onClick={handleConfirmSwap}
                                                    disabled={loading}
                                                    className="h-16 px-12 text-sm uppercase tracking-[0.2em] rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                                                >
                                                    {loading ? <RotateCw className="animate-spin w-5 h-5" /> : "Initialize Swap"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateSwap;
