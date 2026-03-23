import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  Code2,
  Globe,
  BookOpen,
  Film,
  TrendingUp,
  Layers,
  Palette,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── Types ── */

interface InquiryFormData {
  services: string[];
  projectName: string;
  description: string;
  hasAssets: string;
  currency: string;
  budget: string;
  startTimeline: string;
  name: string;
  email: string;
  phone: string;
  referralSource: string;
}

type StepErrors = Partial<Record<keyof InquiryFormData | "_services", string>>;
type FormStatus = "idle" | "submitting" | "success" | "error";

/* ── Zod schemas per step ── */

const step1Schema = z.object({
  services: z.array(z.string()).min(1, "Please select at least one service"),
});

const step2Schema = z.object({
  projectName: z.string().trim().min(1, "Project name is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(2000),
});

const step4Schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
});

/* ── Static data ── */

const SERVICES = [
  { id: "custom-software", label: "Custom Software Development", icon: Code2 },
  { id: "web-platform", label: "Website & Platform Engineering", icon: Globe },
  { id: "lms", label: "LMS & EdTech Solutions", icon: BookOpen },
  { id: "animation", label: "3D & 2D Animation", icon: Film },
  { id: "marketing", label: "Digital Marketing", icon: TrendingUp },
  { id: "uiux", label: "UI/UX Design & Prototyping", icon: Layers },
  { id: "branding", label: "Branding & Identity", icon: Palette },
  { id: "other", label: "Something Else", icon: HelpCircle },
];

const CURRENCIES = ["AED", "USD", "GBP", "EUR", "SAR"] as const;

const BUDGET_RANGES: Record<string, string[]> = {
  AED: [
    "Under AED 5k",
    "AED 5k–15k",
    "AED 15k–40k",
    "AED 40k+",
    "Not sure yet",
  ],
  USD: ["Under $1.5k", "$1.5k–$4k", "$4k–$11k", "$11k+", "Not sure yet"],
  GBP: ["Under £1.2k", "£1.2k–£3.5k", "£3.5k–£9k", "£9k+", "Not sure yet"],
  EUR: ["Under €1.5k", "€1.5k–€4k", "€4k–€10k", "€10k+", "Not sure yet"],
  SAR: [
    "Under SAR 5.5k",
    "SAR 5.5k–15k",
    "SAR 15k–40k",
    "SAR 40k+",
    "Not sure yet",
  ],
};

const TIMELINE_OPTIONS = [
  "ASAP",
  "Within a month",
  "1–3 months",
  "Just exploring",
];

const ASSET_OPTIONS = ["Yes", "No", "Not sure"];

const TOTAL_STEPS = 4;

/* ── Slide animation variants ── */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

/* ── Main component ── */

const ProjectInquiryForm = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<InquiryFormData>({
    services: [],
    projectName: "",
    description: "",
    hasAssets: "",
    currency: "AED",
    budget: "",
    startTimeline: "",
    name: "",
    email: "",
    phone: "",
    referralSource: "",
  });
  const [errors, setErrors] = useState<StepErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const setField = <K extends keyof InquiryFormData>(
    field: K,
    value: InquiryFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof StepErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleService = (id: string) => {
    const next = formData.services.includes(id)
      ? formData.services.filter((s) => s !== id)
      : [...formData.services, id];
    setField("services", next);
    if (errors._services)
      setErrors((prev) => ({ ...prev, _services: undefined }));
  };

  const togglePill = (
    field: "hasAssets" | "budget" | "startTimeline",
    value: string,
  ) => {
    setField(field, formData[field] === value ? "" : value);
  };

  /* ── Validation per step ── */

  const validateStep = (s: number): boolean => {
    setErrors({});
    if (s === 1) {
      const result = step1Schema.safeParse({ services: formData.services });
      if (!result.success) {
        setErrors({ _services: result.error.errors[0].message });
        return false;
      }
    }
    if (s === 2) {
      const result = step2Schema.safeParse({
        projectName: formData.projectName,
        description: formData.description,
      });
      if (!result.success) {
        const fieldErrors: StepErrors = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as keyof StepErrors;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    }
    if (s === 4) {
      const result = step4Schema.safeParse({
        name: formData.name,
        email: formData.email,
      });
      if (!result.success) {
        const fieldErrors: StepErrors = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as keyof StepErrors;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setErrors({});
    setDirection(-1);
    setStep((s) => s - 1);
  };

  /* ── Submit ── */

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "project-inquiry", ...formData }),
      });
      const data = await response.json();
      if (!data.success) throw new Error("Failed to send");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  /* ── Success state ── */

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-16 text-center"
      >
        <CheckCircle className="w-14 h-14 text-accent mb-5" />
        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
          Thanks, {formData.name.split(" ")[0]}!
        </h3>
        <p className="text-muted-foreground text-base max-w-sm">
          We've received your inquiry and will be in touch within two business
          days.
        </p>
      </motion.div>
    );
  }

  /* ── Progress bar ── */

  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground font-body">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="text-xs font-medium text-muted-foreground font-body">
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {step === 1 && (
            <Step1
              selected={formData.services}
              onToggle={toggleService}
              error={errors._services}
            />
          )}
          {step === 2 && (
            <Step2
              projectName={formData.projectName}
              description={formData.description}
              hasAssets={formData.hasAssets}
              errors={errors}
              onChange={setField}
              onTogglePill={(v) => togglePill("hasAssets", v)}
            />
          )}
          {step === 3 && (
            <Step3
              currency={formData.currency}
              budget={formData.budget}
              startTimeline={formData.startTimeline}
              onSelectCurrency={(v) => {
                setField("currency", v);
                setField("budget", "");
              }}
              onToggleBudget={(v) => togglePill("budget", v)}
              onToggleTimeline={(v) => togglePill("startTimeline", v)}
            />
          )}
          {step === 4 && (
            <Step4
              name={formData.name}
              email={formData.email}
              phone={formData.phone}
              referralSource={formData.referralSource}
              errors={errors}
              onChange={setField}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error banner */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          Something went wrong. Please try again.
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium font-body text-foreground transition-all hover:bg-muted active:scale-[0.98]",
            step === 1 && "opacity-0 pointer-events-none",
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-heading font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all text-sm tracking-wide"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-heading font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Inquiry
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Step 1: Service selection ── */

interface Step1Props {
  selected: string[];
  onToggle: (id: string) => void;
  error?: string;
}

const Step1 = ({ selected, onToggle, error }: Step1Props) => (
  <div>
    <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
      What can we help you with?
    </h3>
    <p className="text-muted-foreground text-sm font-body mb-6">
      Select all that apply.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SERVICES.map(({ id, label, icon: Icon }) => {
        const isSelected = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={cn(
              "flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all hover:border-accent/60 active:scale-[0.98]",
              isSelected
                ? "border-accent bg-accent/5 text-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5 shrink-0 transition-colors",
                isSelected ? "text-accent" : "text-muted-foreground",
              )}
            />
            <span className="text-sm font-medium font-body">{label}</span>
          </button>
        );
      })}
    </div>
    {error && (
      <p className="text-xs text-destructive mt-3 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        {error}
      </p>
    )}
  </div>
);

/* ── Step 2: Project brief ── */

interface Step2Props {
  projectName: string;
  description: string;
  hasAssets: string;
  errors: StepErrors;
  onChange: <K extends keyof InquiryFormData>(
    field: K,
    value: InquiryFormData[K],
  ) => void;
  onTogglePill: (value: string) => void;
}

const Step2 = ({
  projectName,
  description,
  hasAssets,
  errors,
  onChange,
  onTogglePill,
}: Step2Props) => (
  <div className="space-y-5">
    <div>
      <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
        Give us a brief
      </h3>
      <p className="text-muted-foreground text-sm font-body">
        A little context goes a long way.
      </p>
    </div>

    <div>
      <Label className="mb-1.5 block">
        Project name or company <span className="text-destructive">*</span>
      </Label>
      <Input
        value={projectName}
        onChange={(e) => onChange("projectName", e.target.value)}
        placeholder="e.g. XYZ website redesign"
        className={cn(errors.projectName && "border-destructive")}
      />
      {errors.projectName && (
        <p className="text-xs text-destructive mt-1">{errors.projectName}</p>
      )}
    </div>

    <div>
      <Label className="mb-1.5 block">
        Brief description <span className="text-destructive">*</span>
      </Label>
      <Textarea
        value={description}
        onChange={(e) => onChange("description", e.target.value)}
        rows={4}
        placeholder="What are you trying to build? What problem does it solve?"
        className={cn(
          "resize-none",
          errors.description && "border-destructive",
        )}
      />
      {errors.description && (
        <p className="text-xs text-destructive mt-1">{errors.description}</p>
      )}
    </div>

    <div>
      <Label className="mb-2 block text-sm font-medium text-foreground">
        Existing website or assets?
      </Label>
      <div className="flex flex-wrap gap-2">
        {ASSET_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onTogglePill(opt)}
            className={cn(
              "px-4 py-2 rounded-full border text-sm font-body transition-all hover:border-accent/60 active:scale-[0.98]",
              hasAssets === opt
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ── Step 3: Scope & timeline ── */

interface Step3Props {
  currency: string;
  budget: string;
  startTimeline: string;
  onSelectCurrency: (value: string) => void;
  onToggleBudget: (value: string) => void;
  onToggleTimeline: (value: string) => void;
}

const Step3 = ({
  currency,
  budget,
  startTimeline,
  onSelectCurrency,
  onToggleBudget,
  onToggleTimeline,
}: Step3Props) => (
  <div className="space-y-7">
    <div>
      <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
        Scope &amp; timeline
      </h3>
      <p className="text-muted-foreground text-sm font-body">
        All fields optional — just helps us prepare.
      </p>
    </div>

    <div>
      <Label className="mb-3 block">Approximate project budget</Label>
      <div className="flex items-center gap-3 mb-[14px]">
        <span className="text-xs font-semibold text-muted-foreground font-body shrink-0">
          Currency
        </span>
        <div
          className="flex overflow-hidden"
          style={{ border: "0.5px solid hsl(var(--border))", borderRadius: 6 }}
        >
          {CURRENCIES.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => onSelectCurrency(c)}
              className={cn(
                "font-body font-semibold transition-colors",
                currency === c
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
              style={{
                fontSize: 11,
                padding: "5px 10px",
                borderLeft:
                  i > 0 ? "0.5px solid hsl(var(--border))" : undefined,
                borderRadius: 0,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {BUDGET_RANGES[currency].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggleBudget(opt)}
            className={cn(
              "px-4 py-2 rounded-full border text-sm font-body transition-all hover:border-accent/60 active:scale-[0.98]",
              budget === opt
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>

    <div>
      <Label className="mb-3 block">When do you want to start?</Label>
      <div className="flex flex-wrap gap-2">
        {TIMELINE_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggleTimeline(opt)}
            className={cn(
              "px-4 py-2 rounded-full border text-sm font-body transition-all hover:border-accent/60 active:scale-[0.98]",
              startTimeline === opt
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ── Step 4: Contact details ── */

interface Step4Props {
  name: string;
  email: string;
  phone: string;
  referralSource: string;
  errors: StepErrors;
  onChange: <K extends keyof InquiryFormData>(
    field: K,
    value: InquiryFormData[K],
  ) => void;
}

const Step4 = ({
  name,
  email,
  phone,
  referralSource,
  errors,
  onChange,
}: Step4Props) => (
  <div className="space-y-5">
    <div>
      <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
        Last step — how do we reach you?
      </h3>
      <p className="text-muted-foreground text-sm font-body">
        We'll never share your details.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label className="mb-1.5 block">
          Full name <span className="text-destructive">*</span>
        </Label>
        <Input
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="John Doe"
          className={cn(errors.name && "border-destructive")}
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label className="mb-1.5 block">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="john@company.com"
          className={cn(errors.email && "border-destructive")}
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email}</p>
        )}
      </div>
    </div>

    <div>
      <Label className="mb-1.5 block">Phone with country code</Label>
      <Input
        type="tel"
        value={phone}
        onChange={(e) => onChange("phone", e.target.value)}
        placeholder="Optional"
      />
    </div>

    <div>
      <Label className="mb-1.5 block">How did you hear about us?</Label>
      <Select
        value={referralSource}
        onValueChange={(v) => onChange("referralSource", v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Referral">Referral</SelectItem>
          <SelectItem value="Google Search">Google Search</SelectItem>
          <SelectItem value="Social Media">Social Media</SelectItem>
          <SelectItem value="Upwork">Upwork</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default ProjectInquiryForm;
