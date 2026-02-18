import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CtaStripProps {
  onScheduleCall?: () => void;
}

const CtaStrip = ({ onScheduleCall }: CtaStripProps) => {
  return (
    <section id="contact" className="bg-cta section-padding">
      <div className="container-narrow text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-cta-foreground mb-8 leading-tight"
        >
          Let's Build Something That Moves
          <br className="hidden md:block" /> Your Business Forward.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <button
            onClick={onScheduleCall}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-heading font-semibold px-8 py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all text-sm tracking-wide"
          >
            Schedule a Call
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaStrip;
