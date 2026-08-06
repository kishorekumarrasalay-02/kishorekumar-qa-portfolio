"use client";

import Hero from "@/components/Hero";
import MetricsBand from "@/components/MetricsBand";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import QaSandbox from "@/components/QaSandbox";
import Portfolio from "@/components/Portfolio";
import PersonalProjects from "@/components/PersonalProjects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <div className="fixed top-3 right-3 z-50 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>
      <main>
        <Hero />
        <MetricsBand />
        <About />
        <Experience />
        <Skills />
        <QaSandbox />
        <Portfolio />
        <PersonalProjects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
