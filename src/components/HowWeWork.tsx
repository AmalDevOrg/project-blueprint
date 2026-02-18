import { motion } from "framer-motion";
import { Search, PenTool, Hammer, Rocket } from "lucide-react";

const steps = [
  { icon: Search, label: "Discover", description: "Deep-dive into your goals, constraints, and vision." },
  { icon: PenTool, label: "Architect", description: "Design the blueprint — systems, UX, and roadmap." },
  { icon: Hammer, label: "Build", description: "Agile engineering sprints with continuous delivery." },
  { icon: Rocket, label: "Deliver", description: "Launch, optimize, and hand off with full ownership." },
];

const HowWeWork = () => {
  return (
    <section id="how-we-work" className="section-padding bg-secondary">
      <div className="container-narrow">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent font-heading font-semibold text-sm tracking-widest uppercase mb-3"
        >
          Our Process
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4"
        >
          How We Work
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-xl mb-16 leading-relaxed"
        >
          Our process is structured, transparent, and built for speed —
          ensuring your projects move from concept to deployment seamlessly.
        </motion.p>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-5">
                <step.icon className="w-6 h-6 text-accent" />
              </div>
              <p className="text-xs text-accent font-heading font-semibold tracking-widest uppercase mb-1">
                Step {i + 1}
              </p>
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                {step.label}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
