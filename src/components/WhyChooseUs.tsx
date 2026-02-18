import { motion } from "framer-motion";
import { Zap, Globe2, TrendingUp, Clock, Building2 } from "lucide-react";

const reasons = [
  { icon: Zap, title: "Execution-Driven", text: "We ship. No endless meetings, no scope creep." },
  { icon: Globe2, title: "Global Talent", text: "Access world-class engineers across time zones." },
  { icon: TrendingUp, title: "Scalable Teams", text: "Flex capacity up or down as your project evolves." },
  { icon: Clock, title: "Fast Turnaround", text: "Structured sprints keep delivery timelines tight." },
  { icon: Building2, title: "Enterprise Mindset", text: "Security, compliance, and scalability by default." },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent font-heading font-semibold text-sm tracking-widest uppercase mb-3"
        >
          Why Us
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-14"
        >
          Why Choose Us
        </motion.h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4"
            >
              <r.icon className="w-6 h-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{r.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{r.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
