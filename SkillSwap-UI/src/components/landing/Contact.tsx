import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
    return (
        <section id="contact" className="py-32 px-4 bg-black text-white relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Floating Particles for Cinematic Feel */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.3 }}
                transition={{ duration: 2 }}
                className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.2 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute bottom-10 left-10 w-96 h-96 bg-gray-500/10 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="container-cinematic relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-serif text-5xl md:text-6xl mb-6 tracking-tighter"
                    >
                        Get in Touch
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl text-gray-400 font-light max-w-xl mx-auto"
                    >
                        Have questions? Speak to our team directly.
                    </motion.p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-8 bg-white/5 p-8 md:p-12 border border-white/10 backdrop-blur-sm shadow-2xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Name</label>
                            <Input
                                placeholder="YOUR NAME"
                                className="bg-transparent border-b border-white/20 border-t-0 border-x-0 rounded-none px-0 py-6 text-white placeholder:text-gray-700 focus:border-white focus:ring-0 transition-all font-serif"
                            />
                        </motion.div>
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Email</label>
                            <Input
                                placeholder="YOUR EMAIL"
                                className="bg-transparent border-b border-white/20 border-t-0 border-x-0 rounded-none px-0 py-6 text-white placeholder:text-gray-700 focus:border-white focus:ring-0 transition-all font-serif"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Message</label>
                        <Textarea
                            placeholder="TELL US ABOUT YOUR NEEDS..."
                            className="bg-transparent border-b border-white/20 border-t-0 border-x-0 rounded-none px-0 py-6 text-white placeholder:text-gray-700 focus:border-white focus:ring-0 transition-all min-h-[100px] font-serif resize-none"
                        />
                    </motion.div>

                    <motion.div
                        className="pt-4 flex justify-end"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        <Button className="btn-cinematic bg-white text-black hover:bg-gray-200 px-10 py-6 rounded-none text-sm tracking-widest font-bold uppercase transition-transform hover:scale-105 duration-300">
                            Send Message
                        </Button>
                    </motion.div>
                </motion.form>
            </div>
        </section>
    );
};

export default Contact;
