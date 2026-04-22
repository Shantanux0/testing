import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowLeft, Users, Target, Zap, Heart, Award, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const values = [
        {
            icon: Users,
            title: "Community First",
            description: "We believe in the power of peer-to-peer learning and building meaningful connections."
        },
        {
            icon: Target,
            title: "Goal Oriented",
            description: "Every interaction is purposeful, designed to help you achieve your learning objectives."
        },
        {
            icon: Zap,
            title: "Knowledge Exchange",
            description: "The best way to learn is to teach. We facilitate this natural exchange of expertise."
        },
        {
            icon: Heart,
            title: "Passion Driven",
            description: "Learning should be exciting. We match you with people who share your enthusiasm."
        }
    ];

    const stats = [
        { number: "10K+", label: "Active Learners" },
        { number: "500+", label: "Skills Shared" },
        { number: "50K+", label: "Sessions" },
        { number: "95%", label: "Satisfaction" }
    ];

    // Text Reveal Component
    const RevealText = ({ text, className = "" }: { text: string, className?: string }) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-10%" });

        return (
            <motion.span
                ref={ref}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                    hidden: {}
                }}
                className={className}
            >
                {(text || "").split(" ").map((word, i) => (
                    <span key={i} className="inline-block mr-2 overflow-hidden">
                        <motion.span
                            variants={{
                                hidden: { y: "100%" },
                                visible: {
                                    y: 0,
                                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                                }
                            }}
                            className="inline-block"
                        >
                            {word}
                        </motion.span>
                    </span>
                ))}
            </motion.span>
        );
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            {/* Film Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroY, opacity: opacityHero }} className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
                        alt="Team collaboration"
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
                </motion.div>

                {/* Navigation */}
                <div className="absolute top-0 left-0 right-0 z-50 p-8 flex justify-between items-center mix-blend-difference">
                    <Button
                        onClick={() => navigate('/')}
                        variant="ghost"
                        className="text-white hover:bg-white/10 gap-2 rounded-full px-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
                            <span className="h-[1px] w-12 bg-white/50" />
                            <span className="text-xs uppercase tracking-[0.4em] text-white/80">Est. 2024</span>
                        </motion.div>

                        <h1 className="font-serif text-8xl md:text-[10rem] font-bold mb-8 tracking-tighter leading-[0.8]">
                            <motion.span variants={fadeInUp} className="block">About</motion.span>
                            <motion.span variants={fadeInUp} className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">
                                SkillSwap
                            </motion.span>
                        </h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-3xl font-light max-w-2xl leading-relaxed text-white/80 ml-auto">
                            Redefining education through the power of
                            <span className="italic font-serif mx-2">human connection</span>
                            and shared mastery.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-12 right-12 z-10 flex flex-col items-center gap-4"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] rotate-90 origin-right translate-x-full">Scroll</span>
                    <div className="h-24 w-[1px] bg-white/20">
                        <motion.div
                            animate={{ height: ["0%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-full bg-white"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Manifesto Section */}
            <section className="py-40 px-8 bg-black relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-12 text-white/50" />
                    <h2 className="font-serif text-4xl md:text-6xl leading-tight font-light mb-12">
                        <RevealText text="We are building a world where knowledge flows freely, barriers dissolve, and every individual has the power to teach and learn." />
                    </h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    />
                </div>
            </section>

            {/* Mission Section - Dark Mode */}
            <section className="py-32 px-8 bg-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-24 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-6">
                                <span className="w-2 h-2 bg-white rounded-full" />
                                <span className="text-xs uppercase tracking-[0.3em] text-gray-400">The Mission</span>
                            </motion.div>

                            <motion.h2 variants={fadeInUp} className="font-serif text-6xl md:text-7xl font-bold mb-8 tracking-tight">
                                Knowledge <br />
                                <span className="italic text-gray-500">Unbound</span>
                            </motion.h2>

                            <motion.p variants={fadeInUp} className="text-xl text-gray-400 leading-relaxed mb-8">
                                SkillSwap breaks down traditional barriers to education. No expensive courses. No rigid schedules. Just genuine human connection.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                {stats.map((stat, i) => (
                                    <div key={i}>
                                        <div className="font-serif text-4xl font-bold mb-1">{stat.number}</div>
                                        <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ clipPath: 'inset(100% 0 0 0)' }}
                            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Custom bezier for cinematic reveal
                            className="relative h-[800px] w-full grayscale hover:grayscale-0 transition-all duration-700"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1940&auto=format&fit=crop"
                                alt="Mission"
                                className="w-full h-full object-cover"
                            />
                            {/* Floating Quote Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute bottom-12 -left-12 bg-white text-black p-8 max-w-sm shadow-2xl z-20 hidden md:block"
                            >
                                <p className="font-serif text-2xl italic leading-relaxed">"The art of teaching is the art of assisting discovery."</p>
                                <p className="mt-4 text-xs font-bold uppercase tracking-widest">— Mark Van Doren</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Horizontal Scroll or Grid */}
            <section className="py-32 bg-zinc-900 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-20 flex justify-between items-end"
                    >
                        <div>
                            <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Core Principles</div>
                            <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-tight">Our DNA</h2>
                        </div>
                        <p className="hidden md:block text-gray-400 max-w-sm text-right">
                            The fundamental beliefs that guide every feature we build and every connection we facilitate.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-black p-10 h-full hover:bg-zinc-900 transition-colors duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <ArrowLeft className="w-4 h-4 rotate-135 text-white/30" />
                                </div>
                                <value.icon className="w-10 h-10 mb-8 text-white stroke-[1.5]" />
                                <h3 className="font-serif text-xl font-bold mb-4">{value.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team/Vision Image Parallax */}
            <section className="h-[80vh] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-fixed bg-center bg-cover grayscale opacity-30"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2940&auto=format&fit=crop')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

                <div className="relative z-10 text-center max-w-4xl px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Globe className="w-20 h-20 mx-auto mb-8 text-white opacity-80" />
                        <h2 className="font-serif text-5xl md:text-8xl font-bold mb-8">Global Impact</h2>
                        <Button
                            onClick={() => navigate('/signup')}
                            className="bg-white text-black hover:bg-gray-200 rounded-full px-12 py-8 text-lg font-bold uppercase tracking-widest transition-transform hover:scale-105"
                        >
                            Join the Movement
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Footer-like CTA */}
            <section className="py-24 border-t border-white/10 text-center">
                <p className="text-xs uppercase tracking-[0.5em] text-gray-500 mb-8">End of Transmission</p>
                <h2 className="font-serif text-2xl text-white/30">SkillSwap © 2024</h2>
            </section>
        </div>
    );
};

export default AboutUs;
