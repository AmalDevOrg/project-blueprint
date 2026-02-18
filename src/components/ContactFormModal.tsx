import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().regex(/^[0-9]*$/, "Phone must contain only numbers").max(20).optional().or(z.literal("")),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactFormModal = ({ open, onClose }: ContactFormModalProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");

    try {
      // ====================================================
      // 🔌 INTEGRATION POINT — Replace this with your API call
      // Example:
      //   const res = await fetch("/api/contact", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(result.data),
      //   });
      //   if (!res.ok) throw new Error("Failed");
      // ====================================================
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated delay
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    if (status !== "submitting") {
      onClose();
      // Reset after animation
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
        setErrors({});
        setStatus("idle");
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Schedule a Call"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground">Schedule a Call</h2>
                <p className="text-sm text-muted-foreground mt-1">Tell us about your project</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-2">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <CheckCircle className="w-12 h-12 text-accent mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      Thanks! We'll reach out shortly.
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                      We've received your message and will get back to you within one business day.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 text-sm font-medium text-accent hover:underline"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {status === "error" && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Oops! Something went wrong. Please try again.
                      </div>
                    )}

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Name"
                        required
                        value={formData.name}
                        error={errors.name}
                        onChange={(v) => handleChange("name", v)}
                        placeholder="John Doe"
                      />
                      <Field
                        label="Work Email"
                        required
                        type="email"
                        value={formData.email}
                        error={errors.email}
                        onChange={(v) => handleChange("email", v)}
                        placeholder="john@company.com"
                      />
                    </div>

                    {/* Phone & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Phone"
                        value={formData.phone || ""}
                        error={errors.phone}
                        onChange={(v) => handleChange("phone", v)}
                        placeholder="Optional"
                      />
                      <Field
                        label="Company"
                        value={formData.company || ""}
                        error={errors.company}
                        onChange={(v) => handleChange("company", v)}
                        placeholder="Optional"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Message <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        rows={4}
                        placeholder="Tell us about your project or what you'd like to discuss..."
                        className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none ${
                          errors.message ? "border-destructive" : "border-input"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-heading font-semibold px-6 py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── Reusable Field ── */

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}

const Field = ({ label, value, onChange, error, required, type = "text", placeholder }: FieldProps) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
        error ? "border-destructive" : "border-input"
      }`}
    />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export default ContactFormModal;
