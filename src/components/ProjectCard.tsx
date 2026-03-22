/*
 * ProjectCard — reusable card for the Portfolio/Projects section.
 *
 * Project preview images should be placed in:
 *   src/assets/images/projects/
 * and imported at the top of this file (or in Projects.tsx), e.g.:
 *   import lmsPreview from "../assets/images/projects/lms-preview.jpg";
 * Then pass the imported value as the `previewImage` prop.
 */

export enum ProjectStatus {
  InProgress = "in-progress",
  Completed = "completed",
  Upcoming = "upcoming",
}

export interface ProjectCardProps {
  previewImage?: string;
  status: ProjectStatus;
  title: string;
  description: string;
  features: string[];
  index?: number;
}

const PLACEHOLDER_COLORS = [
  "from-teal-900/40 to-slate-900/60",
  "from-indigo-900/40 to-slate-900/60",
  "from-cyan-900/40 to-slate-900/60",
];

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  if (status === ProjectStatus.InProgress) {
    return (
      <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        In Progress
      </span>
    );
  }
  if (status === ProjectStatus.Completed) {
    return (
      <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-teal-700 text-white border border-teal-600">
        Completed
      </span>
    );
  }
  return (
    <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-muted text-muted-foreground border border-border">
      Upcoming
    </span>
  );
};

const ProjectCard = ({
  previewImage,
  status,
  title,
  description,
  features,
  index = 0,
}: ProjectCardProps) => {
  const placeholderGradient =
    PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
      {/* Preview image / placeholder */}
      <div className="relative h-44 shrink-0 overflow-hidden bg-muted">
        {previewImage ? (
          <img
            src={previewImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${placeholderGradient} flex items-center justify-center`}
          >
            {/* Subtle dot-grid pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id={`dot-${index}`}
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#dot-${index})`} />
            </svg>
            <span className="relative text-white/20 font-heading text-xs tracking-widest uppercase select-none">
              Preview Pending
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        <StatusBadge status={status} />

        <h3 className="font-heading font-bold text-lg text-foreground leading-snug">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        {/* Divider — consistent spacing regardless of description length */}
        <div className="mt-3 border-t border-border" />

        {/* Features list */}
        <ul className="flex flex-col gap-2">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectCard;
