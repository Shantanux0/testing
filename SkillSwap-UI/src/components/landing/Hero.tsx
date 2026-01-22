import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRef } from "react";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const target = isAuthenticated ? "/dashboard" : "/signup";
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Cinematic Background - Grainy texture overlay could be added here */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>

      <div className="container-cinematic relative z-10 w-full grid lg:grid-cols-12 gap-12 items-center">

        {/* Text Content */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {/* Minimalist Badge */}
            <motion.div variants={item} className="mb-8 flex justify-center lg:justify-start">
              <span className="inline-block py-1 border-b border-black text-xs font-semibold tracking-[0.2em] uppercase">
                The Premier Learning Exchange
              </span>
            </motion.div>

            {/* Cinematic Heading */}
            <motion.h1 variants={item} className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-8 text-primary tracking-tighter">
              Mastery <br />
              <span className="italic font-light opacity-60">Through</span> <br />
              Teaching.
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={item} className="text-xl md:text-2xl text-muted-foreground font-light max-w-lg mx-auto lg:mx-0 mb-12 leading-relaxed">
              An exclusive community where knowledge is currency—share expertise, gain mastery.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link to={target}>
                <button className="btn-cinematic">
                  Begin Journey
                </button>
              </Link>
              <Link to="#features">
                <button className="btn-cinematic-outline flex items-center gap-2 group">
                  <Play className="w-3 h-3 fill-current group-hover:scale-125 transition-transform duration-300" />
                  Watch Film
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Footer of Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-20 flex items-center justify-center lg:justify-start gap-8"
          >
            <div className="flex -space-x-4 grayscale opacity-70 hover:grayscale-0 transition-all duration-500">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Member" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium tracking-wide">
              <span className="font-bold">10,000+</span> Curated Members
            </div>
          </motion.div>
        </div>

        {/* Cinematic Visual - Parallax Image */}
        <motion.div
          style={{ y, opacity }}
          className="lg:col-span-5 relative h-[600px] hidden lg:block"
        >
          <div className="absolute inset-0 bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2940&auto=format&fit=crop"
              alt="Cinematic Portrait"
              className="w-full h-full object-cover contrast-110 hover:contrast-125 transition-all duration-1000 ease-out"
            />
            {/* Overlay Text */}
            <div className="absolute bottom-10 -left-20 bg-white p-6 shadow-2xl max-w-xs">
              <p className="font-serif text-2xl mb-2">"To teach is to learn twice."</p>
              <p className="text-xs uppercase tracking-widest text-gray-500">— Joseph Joubert</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
