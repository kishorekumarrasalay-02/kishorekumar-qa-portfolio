"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => {
      setCommandPaletteOpen((prev) => !prev);
    };

    window.addEventListener("toggle-command-palette", handleToggle);
    return () => window.removeEventListener("toggle-command-palette", handleToggle);
  }, []);

  return (
    <>
      <Navbar />
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

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}
