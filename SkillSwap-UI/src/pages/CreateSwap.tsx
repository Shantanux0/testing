import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { matchApi, SwapMatchDto, sessionApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Sparkles, BookOpen, GraduationCap, ArrowRight, CheckCircle2, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import MatchingAnimation from "@/components/MatchingAnimation";
import { Logo } from "@/components/ui/logo";

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
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans relative overflow-hidden">
            {/* Soft Ambient White Background */}
            <div className="absolute inset-0 z-0 bg-white">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gray-50 rounded-full blur-[120px] opacity-80" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-100 rounded-full blur-[100px] opacity-80" />
            </div>

            {/* Status Modals Overlay */}
            <AnimatePresence>
                {statusModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl p-6"
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
                                className="h-16 px-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm uppercase tracking-widest w-full"
                            >
                                Return to Home
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 text-black border-b border-black/5 bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4 md:gap-8">
                    <Link to="/">
                        <Logo className="text-black" />
                    </Link>
                    {!statusModal && (
                        <div className="hidden lg:flex items-center gap-8 ml-8">
                            <button onClick={() => setStep(1)} className={`text-xs uppercase tracking-widest hover:opacity-100 transition-opacity ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>1. Seek</button>
                            <button onClick={() => setStep(2)} className={`text-xs uppercase tracking-widest hover:opacity-100 transition-opacity ${step === 2 ? 'opacity-100' : 'opacity-50'}`}>2. Offer</button>
                            <button className={`text-xs uppercase tracking-widest hover:opacity-100 transition-opacity ${step === 3 ? 'opacity-100' : 'opacity-50'}`}>3. Confirm</button>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                    <button onClick={() => navigate('/dashboard')} className="text-[10px] md:text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Dashboard</button>
                    <div className="hidden sm:block w-[1px] h-4 bg-black/20" />
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest hover:text-black transition-colors">Exit <div className="hidden sm:block w-8 h-[1px] bg-black" /></button>
                </div>
            </nav>

            {showAnimation && <MatchingAnimation onComplete={handleAnimationComplete} />}

            <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-5xl mx-auto">
                    {!statusModal && (
                        <>
                            {/* Stepper Dots */}
                            <div className="flex justify-center mb-12 md:mb-16 space-x-6 md:space-x-12">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`flex items-center gap-2 md:gap-4 ${step >= i ? 'opacity-100' : 'opacity-40'} transition-all duration-500`}>
                                        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 ${step >= i ? 'bg-black shadow-[0_0_15px_rgba(0,0,0,0.1)] scale-110' : 'bg-gray-300'}`} />
                                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
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
                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className="inline-flex justify-center mb-8"
                                                >
                                                    {step === 1 ? (
                                                        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                                            <Search className="w-6 h-6 text-black" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                                            <Sparkles className="w-6 h-6 text-black" />
                                                        </div>
                                                    )}
                                                </motion.div>

                                                <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tighter leading-[1.1] text-black">
                                                    {step === 1 ? (
                                                        <>What do you <br /><span className="italic text-gray-400 font-light">crave</span> to learn?</>
                                                    ) : (
                                                        <>What will you <br /><span className="italic text-gray-400 font-light">share</span> with the world?</>
                                                    )}
                                                </h1>
                                            </div>

                                            <div className="max-w-xl mx-auto relative group pt-8">
                                                <Input
                                                    className="relative h-16 md:h-24 text-2xl md:text-4xl text-center bg-transparent border-0 border-b-2 border-gray-200 rounded-none focus:ring-0 focus:border-black placeholder:text-gray-300 transition-all duration-500 font-serif text-black focus-visible:ring-0 shadow-none px-0"
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
                                                    className="h-16 px-10 text-xs uppercase tracking-[0.25em] rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-500 hover:scale-[1.02] shadow-[0_10_40px_rgba(0,0,0,0.1)] hover:shadow-lg"
                                                >
                                                    {loading ? <RotateCw className="animate-spin w-5 h-5 text-white" /> : (
                                                        <div className="flex items-center gap-3 font-semibold text-white">
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
                                        <div className="space-y-6 md:space-y-10 max-w-2xl mx-auto border border-gray-100 p-8 md:p-16 rounded-[1.5rem] md:rounded-[2.5rem] bg-white shadow-xl relative overflow-hidden">
                                            {/* Decorative glow inside card */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gray-50 blur-[60px] rounded-full pointer-events-none" />

                                            <div className="flex justify-center mb-6 md:mb-8 relative z-10">
                                                <div className="p-4 md:p-5 border border-green-200 rounded-xl md:rounded-2xl bg-green-50 shadow-sm">
                                                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                                                </div>
                                            </div>

                                            <div className="space-y-3 relative z-10 text-center">
                                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Match Found</h2>
                                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-black">{matchResult[0].partnerName}</h1>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left py-8 md:py-10 border-y border-gray-100 relative z-10">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">They Teach</p>
                                                    <p className="text-xl md:text-2xl font-serif text-black">{matchResult[0].skillITeach}</p>
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 border border-green-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Expert Level</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">They Want to Learn</p>
                                                    <p className="text-xl md:text-2xl font-serif text-black">{matchResult[0].skillILearn}</p>
                                                </div>
                                            </div>

                                            <div className="pt-6 flex flex-col md:flex-row gap-4 justify-center relative z-10 w-full mb-2">
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    onClick={() => setStep(2)}
                                                    className="w-full md:flex-1 h-12 md:h-14 rounded-none md:rounded-full bg-transparent border border-gray-200 text-black hover:bg-gray-50 hover:border-gray-300 text-[10px] md:text-[11px] uppercase tracking-widest font-semibold transition-all"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    size="lg"
                                                    onClick={handleConfirmSwap}
                                                    disabled={loading}
                                                    className="w-full md:flex-[2] h-12 md:h-14 rounded-none md:rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-md text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]"
                                                >
                                                    {loading ? <RotateCw className="animate-spin w-4 h-4 mx-auto" /> : "Initialize Swap"}
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
