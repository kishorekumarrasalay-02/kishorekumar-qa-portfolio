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

export default function Home() {
  return (
    <>
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
