import { motion } from "framer-motion";
import { Zap, Shield, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Smart Matching",
    description: "Our algorithms connect you with the precise expertise you need, instantly.",
    number: "01"
  },
  {
    icon: Shield,
    title: "Verified Excellence",
    description: "Every instructor is vetted. Quality is not just a goal, it's our baseline.",
    number: "02"
  },
  {
    icon: ArrowRight,
    title: "Seamless Exchange",
    description: "Knowledge transfer without the friction. Pure, direct, and effective.",
    number: "03"
  },
];

const Features = () => {
  return (
    <section className="py-32 px-4 bg-background relative overflow-hidden text-foreground">
      <div className="container-cinematic">
        <div className="grid md:grid-cols-12 gap-12">

          {/* Section Header */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="font-serif text-5xl md:text-6xl mb-6 tracking-tighter leading-none">
                Why <br /> SkillSwap?
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="h-1 bg-black mb-8"
              />
              <p className="text-xl text-muted-foreground font-light max-w-sm">
                A curated experience for those who value efficiency, quality, and mutual growth.
              </p>
            </motion.div>
          </div>

          {/* Features List */}
          <div className="md:col-span-8 grid gap-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col md:flex-row gap-8 items-start border-b border-gray-100 pb-12 hover:border-black transition-colors duration-500"
              >
                <div className="text-4xl font-serif text-gray-200 group-hover:text-black transition-colors duration-500">
                  {feature.number}
                </div>
                <div>
                  <h3 className="text-3xl font-serif mb-3 group-hover:translate-x-2 transition-transform duration-500">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground font-light max-w-lg group-hover:text-gray-600 transition-colors duration-500">
                    {feature.description}
                  </p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-x-4">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
