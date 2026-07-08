import { portfolioData } from "@/data/portfolio";

export interface QaMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  links?: { label: string; href: string }[];
}

export const QUICK_PROMPTS = [
  "Ask about Kishore",
  "What projects?",
  "What tools?",
  "Show automation.",
  "Download resume.",
] as const;

const { site, hero, about, experience, skills, portfolio, personalProjects, social } =
  portfolioData;

function allSkills() {
  return skills.bentoCards.flatMap((card) => card.items);
}

function allTools() {
  const toolsCard = skills.bentoCards.find((c) => c.id === "tools");
  return toolsCard?.items ?? [];
}

export function getWelcomeMessage(): QaMessage {
  return {
    id: "welcome",
    role: "assistant",
    text: `Hi! I'm the QA Assistant for ${site.name}. Ask me about experience, projects, skills, automation, or download the resume.`,
  };
}

export function getAssistantReply(input: string): QaMessage {
  const q = input.toLowerCase().trim();

  if (matches(q, ["about kishore", "who is kishore", "about", "kishore", "intro", "background"])) {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `${site.name} is a ${site.role} at Ratnam Solutions Private Limited. ${hero.bio}`,
      links: [
        { label: "View About section", href: "#about" },
        { label: "Contact", href: "#contact" },
      ],
    };
  }

  if (matches(q, ["project", "projects", "work", "portfolio", "what projects"])) {
    const tested = portfolio.projects
      .map((p) => `• ${p.title} — ${p.description}`)
      .join("\n");
    const personal = personalProjects.projects
      .map((p) => `• ${p.title} (${p.status}) — ${p.description}`)
      .join("\n");

    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `Projects tested professionally:\n${tested}\n\nPersonal builds:\n${personal}`,
      links: [
        { label: "View Projects", href: "#portfolio" },
        { label: "Personal Projects", href: "#personal-projects" },
      ],
    };
  }

  if (matches(q, ["tool", "tools", "skills", "tech", "stack", "what tools"])) {
    const tools = allTools().join(", ");
    const learning = skills.bentoCards
      .find((c) => c.id === "learning")
      ?.items.join(", ");

    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `Core tools: ${tools}\n\nBroader skills: ${allSkills().slice(0, 8).join(", ")}…\n\nCurrently learning: ${learning}`,
      links: [{ label: "View Skills", href: "#skills" }],
    };
  }

  if (matches(q, ["automation", "playwright", "framework", "show automation", "sdet"])) {
    const project = personalProjects.projects[0];
    const github =
      "githubUrl" in project && project.githubUrl ? project.githubUrl : social.github;

    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `${project.title} — ${project.description}\n\nTech: ${project.techStack.join(", ")}\n\nStatus: ${project.status}. ${project.currentFocus}`,
      links: [
        { label: "View on GitHub", href: github },
        { label: "Personal Projects", href: "#personal-projects" },
      ],
    };
  }

  if (matches(q, ["resume", "cv", "download resume", "download cv"])) {
    const cv = about.downloads[0];
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `You can download ${site.name}'s CV below. Cover letter is also available on the About section.`,
      links: [
        { label: cv.label, href: cv.href },
        { label: "Go to About", href: "#about" },
      ],
    };
  }

  if (matches(q, ["experience", "job", "work experience", "career"])) {
    const jobs = experience.work.items
      .map((j) => `• ${j.title} @ ${j.company} (${j.period})`)
      .join("\n");
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `Work experience:\n${jobs}`,
      links: [{ label: "View Experience", href: "#experience" }],
    };
  }

  if (matches(q, ["contact", "email", "phone", "reach", "hire"])) {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `Reach ${site.name} at ${social.email} or +91 94909 46159. Based in Hyderabad, Telangana, India.`,
      links: [
        { label: "Contact section", href: "#contact" },
        { label: "Email", href: `mailto:${social.email}` },
        { label: "LinkedIn", href: social.linkedin },
      ],
    };
  }

  if (matches(q, ["certification", "certifications", "learning"])) {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `${experience.certifications.description}\n\n• ${experience.certifications.tags.join("\n• ")}`,
      links: [{ label: "View Experience", href: "#experience" }],
    };
  }

  if (matches(q, ["hello", "hi", "hey", "help"])) {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `Hello! Try: "What projects?", "What tools?", "Show automation.", or "Download resume."`,
    };
  }

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: `I can help with info about ${site.name}. Try asking about projects, tools, automation, experience, or resume download.`,
    links: [
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Contact", href: "#contact" },
    ],
  };
}

function matches(q: string, keywords: string[]) {
  return keywords.some((k) => q.includes(k));
}
