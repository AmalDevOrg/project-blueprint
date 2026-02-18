import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowWeWork from "@/components/HowWeWork";
import WhyChooseUs from "@/components/WhyChooseUs";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CtaStrip from "@/components/CtaStrip";
import Footer from "@/components/Footer";
import ContactFormModal from "@/components/ContactFormModal";

const Index = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main>
      <Navbar />
      <Hero onScheduleCall={() => setContactOpen(true)} />
      <Services />
      <HowWeWork />
      <WhyChooseUs />
      <Projects />
      <About />
      <CtaStrip onScheduleCall={() => setContactOpen(true)} />
      <Footer />
      <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
};

export default Index;
