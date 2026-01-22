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
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            How <span className="gradient-text">SkillSwap</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four simple steps to start exchanging skills with peers
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-teal-200 to-transparent" />
              )}

              <div className="p-6 text-center h-full bg-white rounded-2xl border border-slate-100 shadow-elevation-1 hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300 z-10 relative">
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-navy-900 border-2 border-white flex items-center justify-center text-sm font-bold text-white shadow-md z-20 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-teal-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-bold mb-2 text-navy-900">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
