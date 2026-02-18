import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowWeWork from "@/components/HowWeWork";
import WhyChooseUs from "@/components/WhyChooseUs";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CtaStrip from "@/components/CtaStrip";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <HowWeWork />
      <WhyChooseUs />
      <Projects />
      <About />
      <CtaStrip />
      <Footer />
    </main>
  );
};

export default Index;
