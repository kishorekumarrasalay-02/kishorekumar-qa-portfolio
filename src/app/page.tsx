import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MetricsBand from "@/components/MetricsBand";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Portfolio from "@/components/Portfolio";
import PersonalProjects from "@/components/PersonalProjects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MetricsBand />
        <About />
        <Experience />
        <Skills />
        <Portfolio />
        <PersonalProjects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
