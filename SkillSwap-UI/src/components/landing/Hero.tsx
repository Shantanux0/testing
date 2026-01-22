import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const target = isAuthenticated ? "/dashboard" : "/signup";
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const headlineText = "Master Any Skill, Simply by Teaching.";
  const words = headlineText.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Subtle Animated Gradient Background */}
      {/* Immersive Background Image with Particle Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
          alt="Collaborative Learning"
          className="w-full h-full object-cover scale-105 animate-slow-pan"
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/40" />
        <div className="absolute inset-0 bg-indigo-900/20 mix-blend-overlay" />

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

        {/* Text Content */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
            </span>
            <span className="text-sm font-medium tracking-wide uppercase">The #1 Community for Peer Learning</span>
          </motion.div>

          {/* Main Heading - Word Reveal */}
          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold leading-tight text-navy-900 mb-6 tracking-tight"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {words.map((word, index) => (
              <motion.span variants={child} key={index} className="inline-block mr-2">
                {word === "Teaching." ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-navy-600">
                    {word}
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 mb-10 font-normal leading-relaxed"
          >
            Connect with driven peers. Swap your expertise for theirs.
            No fees, just pure knowledge exchange in a premium community.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link to={target}>
              <button className="btn-cinematic flex items-center gap-2 text-lg px-8 py-4 bg-navy-900 text-white shadow-elevation-3 hover:shadow-elevation-4 hover:scale-105 transition-all">
                Start Swapping <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

            <Link to="#features">
              <button className="flex items-center gap-3 px-8 py-4 rounded-lg bg-white text-navy-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-lg font-medium shadow-elevation-1">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current" />
                </div>
                How It Works
              </button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 flex items-center justify-center lg:justify-start gap-8"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gold-DEFAULT fill-current" />
                <Star className="w-4 h-4 text-gold-DEFAULT fill-current" />
                <Star className="w-4 h-4 text-gold-DEFAULT fill-current" />
                <Star className="w-4 h-4 text-gold-DEFAULT fill-current" />
                <Star className="w-4 h-4 text-gold-DEFAULT fill-current" />
              </div>
              <p className="text-sm text-slate-600 font-medium mt-1"><span className="text-navy-900 font-bold">10k+</span> Instructors</p>
            </div>
          </motion.div>
        </div>

        {/* Hero Image / Illustration */}
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-elevation-5 border border-white/50 bg-white/50 backdrop-blur-sm">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
              alt="SkillSwap Interface"
              className="w-full object-cover rounded-2xl md:h-[600px]"
            />
            {/* Floating Elements on Image */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 top-1/4 bg-white p-4 rounded-xl shadow-elevation-4 border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">New match found</p>
                <p className="text-sm font-bold text-navy-900">Sarah & David</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-6 bottom-1/3 bg-white p-4 rounded-xl shadow-elevation-4 border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-navy-900">Python Skill</span>
                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, delay: 2 }}
                    className="h-full bg-teal-500"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Level Up</p>
            </motion.div>
          </div>
          {/* Decorative Background Blob */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-200/20 to-navy-200/20 rounded-full blur-3xl opacity-60" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
