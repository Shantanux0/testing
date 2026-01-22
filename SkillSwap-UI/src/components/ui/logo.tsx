import { Link } from "react-router-dom";

export const Logo = ({ scrolled = false, className = "" }: { scrolled?: boolean; className?: string }) => {
    return (
        <Link to="/" className={`flex items-center gap-3 group ${className}`}>
            <div className="relative w-10 h-10 flex items-center justify-center">
                <img
                    src="/skillswap-logo-bw.png"
                    alt="SkillSwap Logo"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 grayscale"
                />
            </div>
            <div className="flex flex-col">
                <span className={`font-serif text-xl font-bold tracking-tight leading-none transition-colors duration-500`}>
                    SkillSwap
                </span>
            </div>
        </Link>
    );
};
