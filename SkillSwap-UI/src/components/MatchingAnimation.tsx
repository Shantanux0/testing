import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface MatchingAnimationProps {
    onComplete: () => void;
}

const steps = [
    "Verifying Developer Credentials...",
    "Analyzing Technical Compatibility...",
    "Scanning Availability Windows...",
    "Checking Reputation Score...",
    "Calculating Mutual Skill Gap...",
    " establishing Secure Connection...",
    "Match Found."
];

const MatchingAnimation = ({ onComplete }: MatchingAnimationProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= steps.length - 1) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800);
                    return prev;
                }
                return prev + 1;
            });
        }, 1200);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
        >
            {/* Central Animation Container */}
            <div className="relative flex flex-col items-center justify-center w-full max-w-2xl px-6">

                {/* 1. Elegant Central Loader */}
                <div className="relative w-24 h-24 mb-16">
                    {/* Ring 1 - Static */}
                    <div className="absolute inset-0 border-2 border-white/10 rounded-full" />

                    {/* Ring 2 - Spinning */}
                    <motion.div
                        className="absolute inset-0 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Center Dot - Pulsing */}
                    <motion.div
                        className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>

                {/* 2. Professional Typography for Status */}
                <div className="h-20 flex items-center justify-center overflow-hidden w-full mb-8">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={currentStep}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-3xl md:text-4xl font-serif tracking-tight text-center text-white"
                        >
                            {steps[currentStep]}
                        </motion.h2>
                    </AnimatePresence>
                </div>

                {/* 3. Minimalist Progress Bar */}
                <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

            </div>
        </motion.div>
    );
};

export default MatchingAnimation;
