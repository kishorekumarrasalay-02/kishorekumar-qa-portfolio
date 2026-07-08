import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Portfolio from "@/components/Portfolio";
import PersonalProjects from "@/components/PersonalProjects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import SectionTracker from "@/components/analytics/SectionTracker";

export default function Home() {
  return (
    <AnalyticsProvider>
      <SectionTracker />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Portfolio />
        <PersonalProjects />
        <Contact />
      </main>
      <Footer />
    </AnalyticsProvider>
  );
}
