import { motion } from "framer-motion";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import { SECTION_ID_START_A_PROJECT } from "@/lib/constants";

const StartAProject = () => {
  return (
    <section
      id={SECTION_ID_START_A_PROJECT}
      className="section-padding bg-secondary"
    >
      <div className="container-narrow">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent font-heading font-semibold text-sm tracking-widest uppercase mb-3"
        >
          Get in Touch
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3"
        >
          Let's build something
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground font-body text-lg mb-10 max-w-xl"
        >
          Tell us about your project and we'll get back to you within two
          business days.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <ProjectInquiryForm />
        </motion.div>
      </div>
    </section>
  );
};

export default StartAProject;
