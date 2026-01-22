import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { matchApi, SwapMatchDto, sessionApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Sparkles, BookOpen, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MatchingAnimation from "@/components/MatchingAnimation";

const FindSwap = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skillToLearn, setSkillToLearn] = useState("");
  const [skillToTeach, setSkillToTeach] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [bestMatch, setBestMatch] = useState<SwapMatchDto | null>(null);

  const handleNext = () => {
    if (step === 1 && skillToLearn.trim()) setStep(2);
    else if (step === 2 && skillToTeach.trim()) handleAutoMatch();
  };

  const handleAutoMatch = async () => {
    setLoading(true);
    try {
      const data = await matchApi.findSwapMatches(skillToLearn, skillToTeach);

      if (data.length === 0) {
        toast.info("No perfect matches yet.", {
          description: "We'll keep looking for you!"
        });
        setLoading(false);
        return;
      }

      setBestMatch(data[0]);
      setShowAnimation(true);

    } catch (error: any) {
      setLoading(false);
      if (error.message && error.message.includes("PASS A TEST")) {
        toast.error("Certification Required!", {
          description: "You need to verify your teaching skills first.",
          action: {
            label: "Take Test",
            onClick: () => navigate("/tests")
          }
        });
        setTimeout(() => navigate("/tests"), 2000);
      } else {
        toast.error("Error", { description: error.message });
      }
    }
  };

  const handleAnimationComplete = async () => {
    if (!bestMatch) return;
    try {
      await sessionApi.requestSession(bestMatch.partnerId, bestMatch.skillILearn);
      toast.success("Swap Confirmed!", { description: `Connect with ${bestMatch.partnerName}` });
      navigate("/meetings");
    } catch (error: any) {
      toast.error("Failed to connect", { description: error.message });
      setShowAnimation(false);
    }
  };

  return (
    <MainLayout>
      {showAnimation && <MatchingAnimation onComplete={handleAnimationComplete} />}

      <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-slate-900" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">

          {/* Progress Indicator */}
          <div className="flex justify-center mb-12 space-x-4">
            {[1, 2].map((i) => (
              <div key={i} className={`flex items-center gap-2 ${step >= i ? 'text-indigo-400' : 'text-slate-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= i
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                    : 'border-slate-700 bg-slate-800'
                  }`}>
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
                <span className={`text-sm font-medium hidden md:block ${step >= i ? 'text-indigo-300' : 'text-slate-600'}`}>
                  {i === 1 ? 'I want to Learn' : 'I can Teach'}
                </span>
                {i < 2 && <div className={`h-px w-12 mx-2 ${step > i ? 'bg-indigo-500' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group"
            >
              {/* Glow Effects */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-500" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 text-center space-y-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-lg">
                  {step === 1 ? (
                    <BookOpen className="w-8 h-8 text-indigo-400" />
                  ) : (
                    <GraduationCap className="w-8 h-8 text-emerald-400" />
                  )}
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                    {step === 1 ? "What sparks your curiosity?" : "What's your superpower?"}
                  </h1>
                  <p className="text-xl text-slate-400 max-w-lg mx-auto">
                    {step === 1
                      ? "Enter the skill you want to master today."
                      : "Share the skill you're ready to teach others."
                    }
                  </p>
                </div>

                <div className="max-w-md mx-auto relative group">
                  <Input
                    className="h-16 text-xl text-center bg-slate-900/50 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-2xl text-white placeholder:text-slate-600 transition-all duration-300"
                    placeholder={step === 1 ? "e.g. React Native" : "e.g. Advanced Java"}
                    value={step === 1 ? skillToLearn : skillToTeach}
                    onChange={(e) => step === 1 ? setSkillToLearn(e.target.value) : setSkillToTeach(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    autoFocus
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                </div>

                <div className="pt-8">
                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={loading || (step === 1 ? !skillToLearn : !skillToTeach)}
                    className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-105"
                  >
                    {loading ? "Scanning Universe..." : (
                      <>
                        {step === 1 ? "Next Step" : "Find My Match"}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};

export default FindSwap;
