import { motion } from "framer-motion";

const Projects = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-narrow text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent font-heading font-semibold text-sm tracking-widest uppercase mb-3"
        >
          Portfolio
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-6"
        >
          Selected Work Coming Soon
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-lg mx-auto leading-relaxed mb-12"
        >
          We are currently delivering several high-impact projects that will
          be showcased here shortly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="aspect-[4/3] rounded-xl bg-muted/60 border border-border flex items-center justify-center"
            >
              <span className="text-muted-foreground/40 font-heading text-sm">Project {n}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
