import { motion } from "framer-motion";
import ProjectCard, { ProjectStatus } from "./ProjectCard";
import lmsPreviewImage from "../assets/images/projects/lms_preview.png";
import animationPreviewImage from "../assets/images/projects/3d_animated_vide_preview.png";
import websitePreviewImage from "../assets/images/projects/website_enhancement_preview.png";

const PROJECTS = [
  {
    previewImage: lmsPreviewImage,
    status: ProjectStatus.InProgress,
    title: "Learning Management System",
    description:
      "A full-featured LMS with course purchasing, smart access control, and a powerful admin dashboard.",
    features: [
      "Course purchasing with timed access (e.g. 1-year validity)",
      "Nested courses & multi-certification tracks",
      "Custom quiz logic & auto-issued certifications",
      "Learner progress tracking & course history",
      "Admin analytics — enrolments, completions & drop-offs",
      "Modern UI/UX built for engagement",
    ],
  },
  {
    previewImage: animationPreviewImage,
    status: ProjectStatus.InProgress,
    title: "3D Educational Animation Series",
    description:
      "A series of 15 animated videos for educational and business content — client-scripted and fully 3D produced.",
    features: [
      "15-video production series",
      "Realistic 3D characters & scene animation",
      "Client-scripted educational & business narratives",
      "Motion graphics & visual effects",
      "Optimised for digital platforms & social",
    ],
  },
  {
    previewImage: websitePreviewImage,
    status: ProjectStatus.InProgress,
    title: "Website Enhancement",
    description:
      "Full enhancement of an existing live website — improving design, structure, and technical performance.",
    features: [
      "UI/UX redesign & modern visual elements",
      "Navigation improvements & content restructuring",
      "Fully responsive across all devices",
      "SEO optimisation & metadata improvements",
      "Performance & page speed optimisation",
    ],
  },
];

const Projects = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-narrow">
        {/* Section header */}
        <div className="text-center mb-12">
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
            className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4"
          >
            Current Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            Three active engagements currently in delivery — a look at the work
            underway right now.
          </motion.p>
        </div>

        {/* Cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={i} index={i} {...project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
