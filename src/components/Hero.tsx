import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface HeroProps {
  onScheduleCall?: () => void;
}

const WORDS = ["Friction.", "Complexity.", "Delays.", "Limits."];

const Hero = ({ onScheduleCall }: HeroProps) => {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const mouseRef    = useRef({ x: -9999, y: -9999 });
  const scrollPRef  = useRef(0);
  const glowOrbRef  = useRef<HTMLDivElement>(null);

  const [wordIndex,   setWordIndex]   = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  /* ── Morphing text ── */
  useEffect(() => {
    const id = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setWordVisible(true);
      }, 350);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  /* ── Particle canvas + scroll / orb effects ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const REPEL_RADIUS = 120;
    let isMobile = window.innerWidth < 768;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; pulseOffset: number;
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      const count = isMobile ? 45 : 90;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.5 + 0.8,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      isMobile = window.innerWidth < 768;
      initParticles();
    };
    resize();

    const onMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -top / (height * 0.75)));
      scrollPRef.current = p;

      const orb = glowOrbRef.current;
      if (orb) {
        if (p > 0) {
          orb.style.transform = `scale(${(1 + p * 0.8).toFixed(4)})`;
          orb.style.opacity   = Math.max(0, 1 - p * 0.7).toFixed(3);
        } else {
          orb.style.transform = "";
          orb.style.opacity   = "";
        }
      }
    };

    const section = sectionRef.current;
    section?.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll",  onScroll, { passive: true });
    window.addEventListener("resize",  resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width  / 2;
      const cy = canvas.height / 2;
      const sp  = scrollPRef.current;
      const mx  = mouseRef.current.x;
      const my  = mouseRef.current.y;

      const maxDist   = 85 + sp * 50;
      const baseAlpha = 0.1 + sp * 0.25;
      const lineWidth = 0.4 + sp * 0.8;

      for (const p of particles) {
        // Pulse
        p.pulseOffset += 0.02;
        const pulse    = (Math.sin(p.pulseOffset) + 1) / 2;   // 0..1
        const currentR = p.r * (0.8 + pulse * 0.4);
        const alpha    = 0.4 + pulse * 0.3;

        // Converge toward center on scroll
        if (sp > 0) {
          p.x += (cx - p.x) * sp * 0.04;
          p.y += (cy - p.y) * sp * 0.04;
        }

        // Repel from mouse (desktop only)
        if (!isMobile) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d  = Math.hypot(dx, dy);
          if (d < REPEL_RADIUS && d > 0) {
            const strength = (REPEL_RADIUS - d) * 0.028;
            p.x -= (dx / d) * strength;
            p.y -= (dy / d) * strength;
          }
        }

        // Move + bounce off edges
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x  += p.vx;
        p.y  += p.vy;
        if (p.x < 0)             { p.x = 0;             p.vx =  Math.abs(p.vx); }
        if (p.x > canvas.width)  { p.x = canvas.width;  p.vx = -Math.abs(p.vx); }
        if (p.y < 0)             { p.y = 0;             p.vy =  Math.abs(p.vy); }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy = -Math.abs(p.vy); }

        // Soft outer glow when scrollP > 0.3
        if (sp > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentR * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56,148,148,${((sp - 0.3) * 0.15 * pulse).toFixed(3)})`;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,148,148,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56,148,148,${(baseAlpha * (1 - d / maxDist)).toFixed(3)})`;
            ctx.lineWidth   = lineWidth;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      section?.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Framer Motion scroll transforms ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const sectionScale    = useTransform(scrollYProgress, [0, 0.75], [1, 0.95]);
  const sectionRadius   = useTransform(scrollYProgress, [0, 0.75], ["0px", "20px"]);
  const contentY        = useTransform(scrollYProgress, [0, 0.75], [0, -70]);
  const contentOpacity  = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const line1X          = useTransform(scrollYProgress, [0, 0.75], [0, -50]);
  const line1Opacity    = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const line2X          = useTransform(scrollYProgress, [0, 0.75], [0, 50]);
  const line2Opacity    = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const subtitleY       = useTransform(scrollYProgress, [0, 0.75], [0, 25]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const ctaY            = useTransform(scrollYProgress, [0, 0.75], [0, 35]);
  const ctaOpacity      = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const hintOpacity     = useTransform(scrollYProgress, [0, 0.10], [1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: sectionScale, borderRadius: sectionRadius, backgroundColor: "#060a0f" }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── 1. Particle canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── 2. Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: [
            "linear-gradient(rgba(56,148,148,0.03) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(56,148,148,0.03) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── 3. Glow orb ── */}
      <div
        ref={glowOrbRef}
        className="absolute rounded-full pointer-events-none hero-glow-orb"
        style={{
          width: 500, height: 500,
          top: "50%", left: "50%",
          marginTop: -250, marginLeft: -250,
          background: "radial-gradient(circle, rgba(56,148,148,0.1) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* ── 4. Scan line (desktop only) ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none hero-scan-line hidden md:block"
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(56,148,148,0.15), transparent)",
          zIndex: 2,
        }}
      />

      {/* ── 5. Corner brackets (desktop only) ── */}
      <div className="absolute pointer-events-none hidden md:block" style={{ top: 16, left: 16,   width: 16, height: 16, borderTop:    "1px solid rgba(56,148,148,0.4)", borderLeft:   "1px solid rgba(56,148,148,0.4)", zIndex: 3 }} />
      <div className="absolute pointer-events-none hidden md:block" style={{ top: 16, right: 16,  width: 16, height: 16, borderTop:    "1px solid rgba(56,148,148,0.4)", borderRight:  "1px solid rgba(56,148,148,0.4)", zIndex: 3 }} />
      <div className="absolute pointer-events-none hidden md:block" style={{ bottom: 16, left: 16,  width: 16, height: 16, borderBottom: "1px solid rgba(56,148,148,0.4)", borderLeft:   "1px solid rgba(56,148,148,0.4)", zIndex: 3 }} />
      <div className="absolute pointer-events-none hidden md:block" style={{ bottom: 16, right: 16, width: 16, height: 16, borderBottom: "1px solid rgba(56,148,148,0.4)", borderRight:  "1px solid rgba(56,148,148,0.4)", zIndex: 3 }} />

      {/* ── 6. Hero content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, willChange: "transform", zIndex: 10 }}
        className="relative container-narrow section-padding text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="inline-flex items-center gap-[6px] mb-8"
          style={{
            background:    "rgba(56,148,148,0.08)",
            border:        "0.5px solid rgba(56,148,148,0.25)",
            borderRadius:  20,
            padding:       "5px 14px",
            willChange:    "transform",
          }}
        >
          <span className="hero-badge-dot" />
          <span
            className="font-heading"
            style={{ fontSize: 9, letterSpacing: "0.14em", color: "#389494" }}
          >
            TECHNOLOGY EXECUTION PARTNER
          </span>
        </motion.div>

        {/* Headline — outer spans carry scroll transforms, inner spans carry entrance */}
        <h1
          className="font-heading text-white text-4xl md:text-6xl lg:text-7xl leading-tight mb-6"
          style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          {/* Line 1 */}
          <motion.span
            style={{ x: line1X, opacity: line1Opacity, willChange: "transform", display: "block" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              style={{ display: "block" }}
            >
              Execution Without
            </motion.span>
          </motion.span>

          {/* Line 2 — morphing word */}
          <motion.span
            style={{ x: line2X, opacity: line2Opacity, willChange: "transform", display: "block" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              style={{ display: "block" }}
            >
              <span
                className="inline-block"
                style={{
                  color:      "#389494",
                  opacity:    wordVisible ? 1 : 0,
                  transform:  wordVisible
                    ? "translateY(0px) skewX(0deg)"
                    : "translateY(-10px) skewX(-5deg)",
                  transition: "opacity 350ms ease, transform 350ms ease",
                }}
              >
                {WORDS[wordIndex]}
              </span>
            </motion.span>
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.div style={{ y: subtitleY, opacity: subtitleOpacity, willChange: "transform" }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            className="font-body mx-auto mb-10"
            style={{
              color:      "rgba(255,255,255,0.4)",
              maxWidth:   480,
              lineHeight: 1.7,
              fontSize:   "1.0625rem",
            }}
          >
            We help businesses design, build, and launch powerful digital
            solutions — without the complexity.
          </motion.p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div style={{ y: ctaY, opacity: ctaOpacity, willChange: "transform" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onScheduleCall}
              className="inline-flex items-center gap-2 font-heading font-semibold px-8 py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all text-sm tracking-wide text-white"
              style={{ background: "#389494" }}
            >
              Book a Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-we-work"
              className="inline-flex items-center gap-2 font-heading font-medium px-8 py-4 rounded-lg transition-colors text-sm tracking-wide text-white hover:border-white/30"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              See How We Work
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── 7. Scroll indicator ── */}
      <motion.div
        style={{ opacity: hintOpacity, zIndex: 4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="hero-scroll-line" />
        <span
          className="font-heading"
          style={{ fontSize: 8, letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)" }}
        >
          SCROLL
        </span>
      </motion.div>

      {/* ── CSS animations ── */}
      <style>{`
        /* Glow orb idle pulse */
        .hero-glow-orb {
          animation: heroGlowPulse 4s ease-in-out infinite;
        }
        @keyframes heroGlowPulse {
          0%, 100% { transform: scale(1);   opacity: 0.8; }
          50%       { transform: scale(1.2); opacity: 1;   }
        }

        /* Badge pulsing dot */
        .hero-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #389494;
          flex-shrink: 0;
          animation: heroBadgeDot 2s ease-in-out infinite;
        }
        @keyframes heroBadgeDot {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.3; }
        }

        /* Scan line sweep */
        .hero-scan-line {
          animation: heroScanLine 6s linear infinite;
        }
        @keyframes heroScanLine {
          0%   { top: 0%; }
          100% { top: 100%; }
        }

        /* Scroll indicator: draw down, erase upward */
        .hero-scroll-line {
          width: 1px; height: 28px;
          background: linear-gradient(to bottom, rgba(56,148,148,0.6), transparent);
          animation: heroScrollLineDraw 2s ease-in-out infinite;
        }
        @keyframes heroScrollLineDraw {
          0%   { clip-path: inset(0% 0 100% 0); }
          45%  { clip-path: inset(0% 0 0%   0); }
          55%  { clip-path: inset(0% 0 0%   0); }
          100% { clip-path: inset(100% 0 0% 0); }
        }
      `}</style>
    </motion.section>
  );
};

export default Hero;
