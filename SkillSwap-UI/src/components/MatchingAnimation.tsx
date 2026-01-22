import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, Scan, Sparkles, User, Globe2 } from "lucide-react";

interface MatchingAnimationProps {
    onComplete: () => void;
}

const steps = [
    { text: "Initiating Skill Radar...", icon: Scan },
    { text: "Scanning regional learning hubs...", icon: Globe2 },
    { text: "Analyzing skill gap compatibility...", icon: Sparkles },
    { text: "Perfect match located!", icon: CheckCircle2 },
];

const MatchingAnimation = ({ onComplete }: MatchingAnimationProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= steps.length - 1) {
                    clearInterval(interval);
                    setTimeout(onComplete, 1500);
                    return prev;
                }
                return prev + 1;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative text-center w-full max-w-lg p-12">

                {/* Visual Radar */}
                <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
                    {/* Rotating Scanner */}
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30">
                        <motion.div
                            className="w-full h-1/2 bg-gradient-to-t from-transparent to-indigo-500/20 absolute top-0 left-0 origin-bottom"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            style={{ borderTopLeftRadius: "100%", borderTopRightRadius: "100%" }}
                        />
                    </div>

                    {/* Pulsing Circles */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-indigo-500/50"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border border-indigo-400/30"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />

                    {/* Central Hub */}
                    <div className="relative z-10 w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border-2 border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                        <Globe2 className="w-12 h-12 text-indigo-400 animate-pulse" />
                    </div>

                    {/* Floating Candidate Dots */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: Math.cos(i * 60) * 100,
                                y: Math.sin(i * 60) * 100
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: i * 0.4,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Status Text */}
                <div className="space-y-6 h-32">
                    {steps.map((step, index) => {
                        const isActive = index === currentStep;
                        if (index > currentStep) return null;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: isActive ? 1 : 0.4 }}
                                className={`flex items-center justify-center gap-3 text-lg font-medium ${isActive ? "text-indigo-300" : "text-slate-600"}`}
                            >
                                <step.icon className={`w-5 h-5 ${isActive ? "animate-spin-slow" : ""}`} />
                                <span className="font-mono tracking-wide">{step.text}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MatchingAnimation;
