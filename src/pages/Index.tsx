import About from "@/components/About";
import ContactFormModal from "@/components/ContactFormModal";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowWeWork from "@/components/HowWeWork";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import StartAProject from "@/components/StartAProject";
import WhyChooseUs from "@/components/WhyChooseUs";
import { useState } from "react";

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
      <StartAProject />
      <Footer />
      <ContactFormModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </main>
  );
};

export default Index;
