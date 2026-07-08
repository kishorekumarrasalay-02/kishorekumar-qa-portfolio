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

const PHONE_NUMBER = "+91 94909 46159";
const PHONE_HREF = "tel:+919490946159";
const LOCATION = "Hyderabad, Telangana, India";

function reply(text: string, links?: QaMessage["links"]): QaMessage {
  return { id: crypto.randomUUID(), role: "assistant", text, links };
}

export function getAssistantReply(input: string): QaMessage {
  const q = input.toLowerCase().trim();

  // ── Personal projects (check before generic "projects") ──
  if (matches(q, ["personal project", "personal projects", "own project", "side project", "own build"])) {
    const p = personalProjects.projects[0];
    const github =
      "githubUrl" in p && p.githubUrl ? p.githubUrl : social.github;
    return reply(
      `${p.title} (${p.status})\n\n${p.description}\n\n${p.buildingTitle}:\n• ${p.building.join("\n• ")}\n\nTech Stack: ${p.techStack.join(", ")}`,
      [
        { label: "View on GitHub", href: github },
        { label: "Personal Projects", href: "#personal-projects" },
      ]
    );
  }

  // ── Automation / framework (also a personal project) ──
  if (matches(q, ["automation", "playwright", "framework", "sdet"])) {
    const p = personalProjects.projects[0];
    const github =
      "githubUrl" in p && p.githubUrl ? p.githubUrl : social.github;
    return reply(
      `${p.title} — ${p.description}\n\nTech: ${p.techStack.join(", ")}\n\nStatus: ${p.status}. ${p.currentFocus}`,
      [
        { label: "View on GitHub", href: github },
        { label: "Personal Projects", href: "#personal-projects" },
      ]
    );
  }

  // ── Projects (professional + personal, detailed) ──
  if (matches(q, ["project", "projects", "portfolio", "what projects"])) {
    const tested = portfolio.projects
      .map((p) => `• ${p.title} — ${p.description}`)
      .join("\n\n");
    const personal = personalProjects.projects
      .map((p) => `• ${p.title} (${p.status}) — ${p.description}`)
      .join("\n\n");
    return reply(
      `Projects tested professionally:\n\n${tested}\n\n———\n\nPersonal builds:\n\n${personal}`,
      [
        { label: "View Projects", href: "#portfolio" },
        { label: "Personal Projects", href: "#personal-projects" },
      ]
    );
  }

  // ── Certifications ──
  if (matches(q, ["certification", "certifications", "certificate", "certified"])) {
    return reply(
      `${experience.certifications.description}\n\n• ${experience.certifications.tags.join("\n• ")}`,
      [{ label: "View Experience", href: "#experience" }]
    );
  }

  // ── Tools ──
  if (matches(q, ["tool", "tools", "skill", "skills", "tech", "stack", "what tools"])) {
    const tools = allTools().join(", ");
    const learning = skills.bentoCards
      .find((c) => c.id === "learning")
      ?.items.join(", ");
    return reply(
      `Tools: ${tools}\n\nBroader skills: ${allSkills().slice(0, 8).join(", ")}…\n\nCurrently learning: ${learning}`,
      [{ label: "View Skills", href: "#skills" }]
    );
  }

  // ── Phone (number only) ──
  if (matches(q, ["phone", "number", "call", "mobile", "contact number"])) {
    return reply(`Phone: ${PHONE_NUMBER}`, [
      { label: "Call", href: PHONE_HREF },
    ]);
  }

  // ── Email / Gmail ──
  if (matches(q, ["gmail", "email", "mail", "e-mail"])) {
    return reply(`Email: ${social.email}`, [
      { label: "Send Email", href: `mailto:${social.email}` },
    ]);
  }

  // ── GitHub link ──
  if (matches(q, ["github", "git hub", "repo", "repository"])) {
    return reply(`GitHub: ${social.github}`, [
      { label: "Open GitHub", href: social.github },
    ]);
  }

  // ── LinkedIn link ──
  if (matches(q, ["linkedin", "linked in"])) {
    return reply(`LinkedIn: ${social.linkedin}`, [
      { label: "Open LinkedIn", href: social.linkedin },
    ]);
  }

  // ── Full contact details ──
  if (matches(q, ["contact", "contact details", "reach", "hire", "get in touch", "details"])) {
    return reply(
      `Contact details for ${site.name}:\n\n📧 Email: ${social.email}\n📱 Phone: ${PHONE_NUMBER}\n💼 LinkedIn: ${social.linkedin}\n🐙 GitHub: ${social.github}\n📍 Location: ${LOCATION}`,
      [
        { label: "Email", href: `mailto:${social.email}` },
        { label: "Call", href: PHONE_HREF },
        { label: "LinkedIn", href: social.linkedin },
        { label: "GitHub", href: social.github },
        { label: "Contact section", href: "#contact" },
      ]
    );
  }

  // ── Resume / CV ──
  if (matches(q, ["resume", "cv", "download resume", "download cv"])) {
    const cv = about.downloads[0];
    return reply(
      `You can download ${site.name}'s CV below. Cover letter is also available in the About section.`,
      [
        { label: cv.label, href: cv.href },
        { label: "Go to About", href: "#about" },
      ]
    );
  }

  // ── Experience ──
  if (matches(q, ["experience", "job", "work experience", "career"])) {
    const jobs = experience.work.items
      .map((j) => `• ${j.title} @ ${j.company} (${j.period})\n  ${j.description}`)
      .join("\n\n");
    return reply(`Work experience:\n\n${jobs}`, [
      { label: "View Experience", href: "#experience" },
    ]);
  }

  // ── About ──
  if (matches(q, ["about kishore", "who is kishore", "about", "kishore", "intro", "background"])) {
    return reply(
      `${site.name} is a ${site.role} at Ratnam Solutions Private Limited. ${hero.bio}`,
      [
        { label: "View About section", href: "#about" },
        { label: "Contact", href: "#contact" },
      ]
    );
  }

  // ── Greeting ──
  if (matches(q, ["hello", "hi", "hey", "help"])) {
    return reply(
      `Hello! Try: "What projects?", "What tools?", "Show automation.", "LinkedIn?", "Phone number?", or "Download resume."`
    );
  }

  return reply(
    `I can help with info about ${site.name}. Try asking about projects, tools, automation, certifications, contact details, or resume download.`,
    [
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Contact", href: "#contact" },
    ]
  );
}

function matches(q: string, keywords: string[]) {
  return keywords.some((k) => q.includes(k));
}
