import { motion } from "framer-motion";
import {
  Video,
  MessageSquare,
  Calendar,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Smart Matching",
    description: "Our AI finds the perfect partner who wants to learn what you teach and vice versa.",
    gradient: "from-primary to-purple-400",
  },
  {
    icon: Shield,
    title: "Verify Skills",
    description: "Pass a quick test to earn your teaching badge. Credibility matters.",
    gradient: "from-secondary to-green-400",
  },
  {
    icon: ArrowRight,
    title: "Swap Instantly",
    description: "No scheduling headaches. Connect, teaching, and learn in real-time.",
    gradient: "from-blue-500 to-cyan-400",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            How SkillSwap Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three simple steps to start your learning journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-elevation-2 hover:shadow-elevation-4 hover:-translate-y-2 hover:border-slate-200 transition-all duration-250 ease-out relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-navy-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-full h-full" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy-900 group-hover:text-teal-700 transition-colors">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
