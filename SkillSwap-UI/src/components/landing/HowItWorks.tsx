import { motion } from "framer-motion";
import { UserPlus, Search, Handshake, Video } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Profile",
    description: "Sign up and list the skills you can teach and want to learn.",
  },
  {
    icon: Search,
    title: "Find Matches",
    description: "Browse students with complementary skills or get smart recommendations.",
  },
  {
    icon: Handshake,
    title: "Propose Swap",
    description: "Send a swap request with your preferred time and learning goals.",
  },
  {
    icon: Video,
    title: "Learn Together",
    description: "Meet in our virtual room with video, chat, and shared workspace.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 px-4 relative bg-background border-t border-gray-100 overflow-hidden">
      <div className="container-cinematic relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h2 className="font-serif text-5xl md:text-6xl mb-6 tracking-tighter">
            The Process
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-xl mx-auto">
            A seamless path from curiosity to mastery.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative group flex flex-col items-center text-center"
            >
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.2), ease: "easeOut" }}
                  className="hidden lg:block absolute top-10 left-1/2 w-full h-[1px] bg-gray-200 -z-10 origin-left"
                />
              )}

              {/* Step Number Badge */}
              <motion.div
                whileHover={{ scale: 1.1, backgroundColor: "#000", borderColor: "#000", color: "#fff" }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center text-2xl font-serif mb-8 transition-colors duration-500 relative z-10 cursor-default"
              >
                {index + 1}
              </motion.div>

              {/* Icon - Minimalist */}
              <motion.div
                className="mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ y: -5 }}
              >
                <step.icon className="w-8 h-8" />
              </motion.div>

              {/* Content */}
              <h3 className="font-serif text-2xl mb-4 tracking-tight">{step.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
