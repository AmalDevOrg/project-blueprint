import { motion } from "framer-motion";
import { Code2, Globe, GraduationCap, Film, TrendingUp, Layers, Palette } from "lucide-react";
import { SECTION_ID_SERVICES } from "@/lib/constants";

const services = [
  {
    icon: Code2,
    title: "Custom Software Development",
    description: "Tailored solutions engineered for your unique business challenges and growth trajectory.",
  },
  {
    icon: Globe,
    title: "Website & Platform Engineering",
    description: "From design to production — high-performance web platforms built with modern architecture and scalable infrastructure.",
  },
  {
    icon: GraduationCap,
    title: "LMS & EdTech Solutions",
    description: "End-to-end learning platforms designed for engagement, scale, and measurable outcomes.",
  },
  {
    icon: Film,
    title: "3D & 2D Animation",
    description: "From 2D explainer videos to cinematic 3D animation — crafted for marketing, e-learning, corporate training, and social content.",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "SEO, social media management, content creation, and paid advertising to grow your brand online.",
  },
  {
    icon: Layers,
    title: "UI/UX Design & Prototyping",
    description: "From user flows and wireframes to high-fidelity prototypes — ready for your dev team to build.",
  },
  {
    icon: Palette,
    title: "Branding & Identity",
    description: "Logo design, visual identity systems, and brand guidelines built for consistency and impact.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const Services = () => {
  return (
    <section id={SECTION_ID_SERVICES} className="section-padding bg-background">
      <div className="container-narrow">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent font-heading font-semibold text-sm tracking-widest uppercase mb-3"
        >
          What We Do
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-14"
        >
          Services
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group p-8 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <service.icon className="w-8 h-8 text-accent mb-5 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
