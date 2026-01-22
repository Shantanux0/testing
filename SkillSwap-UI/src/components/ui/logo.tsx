import { motion } from "framer-motion";

export const Logo = ({ scrolled = false, className = "" }: { scrolled?: boolean; className?: string }) => {
    return (
        <Link to="/" className={`flex items-center gap-2 group ${className}`}>
            <div className="relative w-10 h-10 flex items-center justify-center">
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 rounded-xl border-2 ${scrolled ? 'border-indigo-600/30' : 'border-white/30'} opacity-50`}
                />
                <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg overflow-hidden ${scrolled ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white/10 text-white backdrop-blur-md border border-white/20'}`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-110 transition-transform duration-300">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            <div className="flex flex-col">
                <span className={`font-display text-xl font-bold tracking-tight leading-none transition-colors duration-300 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                    Skill<span className={scrolled ? 'text-indigo-600' : 'text-indigo-300'}>Swap</span>
                </span>
            </div>
        </Link>
    );
};

import { Link } from "react-router-dom";
