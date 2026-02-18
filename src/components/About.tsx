import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-narrow max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent font-heading font-semibold text-sm tracking-widest uppercase mb-3"
        >
          About
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-8"
        >
          Who We Are
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg leading-relaxed mb-4"
        >
          We are a technology execution partner helping ambitious companies
          turn ideas into reliable digital products.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-lg leading-relaxed"
        >
          Our distributed model combines global engineering talent with
          structured delivery — enabling speed, precision, and scalability.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
