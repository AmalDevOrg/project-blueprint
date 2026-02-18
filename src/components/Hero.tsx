import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-hero/80 via-hero/40 to-hero/90" />

      <div className="relative z-10 container-narrow section-padding text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-accent font-heading font-semibold text-sm tracking-widest uppercase mb-6"
        >
          Technology Execution Partner
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-hero-foreground font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-6"
        >
          Execution Without
          <br />
          Friction.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-hero-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We help businesses design, build, and launch powerful digital
          solutions — without the complexity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-heading font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity text-sm tracking-wide"
          >
            Book a Consultation
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#how-we-work"
            className="inline-flex items-center gap-2 border border-hero-muted/30 text-hero-foreground font-heading font-medium px-8 py-4 rounded-lg hover:border-hero-muted/60 transition-colors text-sm tracking-wide"
          >
            See How We Work
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
