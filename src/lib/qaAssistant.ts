import { portfolioData } from "@/data/portfolio";

export interface QaLink {
  label: string;
  href: string;
  download?: boolean;
}

export interface QaProjectCard {
  title: string;
  tags: string[];
  href: string;
  hrefLabel: string;
}

export interface QaMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  links?: QaLink[];
  cards?: QaProjectCard[];
  scrollTo?: string;
}

export interface Suggestion {
  label: string;
  query: string;
}

export const SUGGESTIONS: Suggestion[] = [
  { label: "👨 About Me", query: "Tell me about Kishore" },
  { label: "🧪 QA Skills", query: "What tools does Kishore know?" },
  { label: "🚀 Projects", query: "Show QA projects" },
  { label: "📄 Resume", query: "Download resume" },
  { label: "📞 Contact", query: "Contact details" },
  { label: "💼 Experience", query: "Experience" },
];

const { site, hero, about, experience, skills, portfolio, personalProjects, social } =
  portfolioData;

const PHONE_NUMBER = "+91 94909 46159";
const PHONE_HREF = "tel:+919490946159";
const LOCATION = "Hyderabad, Telangana, India";

const PROJECT_TAGS: Record<string, string[]> = {
  HiKode: ["Manual Testing", "API Testing", "Bug Reports"],
  "NSO — Belgian Waffle": ["Functional", "Regression", "Sanity"],
  "Vidyarthi Vikas Academy": ["Functional", "Regression"],
};

function allSkills() {
  return skills.bentoCards.flatMap((card) => card.items);
}

function allTools() {
  return skills.bentoCards.find((c) => c.id === "tools")?.items ?? [];
}

function professionalCards(): QaProjectCard[] {
  return portfolio.projects.map((p) => ({
    title: p.title,
    tags: PROJECT_TAGS[p.title] ?? [p.tag],
    href: "#portfolio",
    hrefLabel: "View Project",
  }));
}

export function getWelcomeMessage(): QaMessage {
  return {
    id: "welcome",
    role: "assistant",
    text: `👋 Hi, I'm Kishore's AI QA Assistant — here to help recruiters explore this portfolio.\n\nI can tell you about:\n✅ About   ✅ Skills   ✅ Experience\n✅ Projects   ✅ Resume   ✅ Contact\n\nTry asking:\n• Tell me about Kishore\n• What automation tools does he know?\n• Show QA projects\n• Download resume`,
  };
}

function reply(
  text: string,
  extras?: Partial<Omit<QaMessage, "id" | "role" | "text">>
): QaMessage {
  return { id: crypto.randomUUID(), role: "assistant", text, ...extras };
}

export function getAssistantReply(input: string): QaMessage {
  const q = input.toLowerCase().trim();

  // ── Playwright deep-dive ──
  if (has(q, ["playwright"])) {
    return reply(
      `Kishore has hands-on experience with Playwright using TypeScript for end-to-end web automation. He works with the Page Object Model (POM), assertions, screenshots, HTML/Allure reporting, and cross-browser execution — applied in his self-built HiKode automation framework.`,
      {
        links: [{ label: "View Skills", href: "#skills" }],
        scrollTo: "skills",
      }
    );
  }

  // ── API / Postman deep-dive ──
  if (has(q, ["api", "postman", "rest", "soap"])) {
    return reply(
      `Kishore practices API testing with Postman — validating REST & SOAP endpoints, working with JSONPath and schema validation, and handling authentication types (Basic, Bearer Token, OAuth 2.0, API Keys). He is extending automated API checks using Playwright's request context.`,
      {
        links: [{ label: "View Skills", href: "#skills" }],
        scrollTo: "skills",
      }
    );
  }

  // ── Manual testing deep-dive ──
  if (has(q, ["manual test", "manual testing", "functional", "regression", "smoke", "sanity", "exploratory"])) {
    return reply(
      `Manual testing is Kishore's core strength. He performs functional, regression, smoke, sanity, and exploratory testing across live web products, with structured bug tracking in Jira and clear test documentation.`,
      {
        links: [{ label: "View Skills", href: "#skills" }],
        scrollTo: "skills",
      }
    );
  }

  // ── SQL / database deep-dive ──
  if (has(q, ["sql", "database", "query", "queries"])) {
    return reply(
      `Kishore uses SQL for basic queries to validate data during testing — verifying records, checking data integrity, and supporting back-end validation alongside UI and API testing.`,
      {
        links: [{ label: "View Skills", href: "#skills" }],
        scrollTo: "skills",
      }
    );
  }

  // ── Tools / Skills (curated, recruiter-friendly) ──
  if (has(q, ["tool", "tools", "skill", "skills", "tech", "stack", "know", "technologies"])) {
    const learning = skills.bentoCards
      .find((c) => c.id === "learning")
      ?.items.join(", ");
    return reply(
      `Kishore's core QA toolkit:\n\n• Manual Testing (Functional, Regression, Smoke, Sanity, Exploratory)\n• Automation: Playwright with TypeScript (Page Object Model)\n• API Testing: Postman, REST & SOAP, JSONPath, Auth types\n• Database: SQL (basic queries)\n• Tools: Jira, Git & GitHub, Excel / Google Sheets\n\nCurrently learning: ${learning}`,
      {
        links: [{ label: "View Skills", href: "#skills" }],
        scrollTo: "skills",
      }
    );
  }

  // ── Automation framework project ──
  if (has(q, ["automation", "framework", "sdet"])) {
    const p = personalProjects.projects[0];
    const github = "githubUrl" in p && p.githubUrl ? p.githubUrl : social.github;
    return reply(
      `${p.title} (${p.status})\n\n${p.description}\n\nTech: ${p.techStack.join(", ")}`,
      {
        cards: [
          {
            title: p.title,
            tags: p.techStack.slice(0, 4),
            href: github,
            hrefLabel: "View Project",
          },
        ],
        scrollTo: "personal-projects",
      }
    );
  }

  // ── Personal projects ──
  if (has(q, ["personal project", "personal projects", "own project", "side project"])) {
    const p = personalProjects.projects[0];
    const github = "githubUrl" in p && p.githubUrl ? p.githubUrl : social.github;
    return reply(
      `${p.title} (${p.status})\n\n${p.description}\n\n${p.buildingTitle}:\n• ${p.building.join("\n• ")}`,
      {
        cards: [
          {
            title: p.title,
            tags: p.techStack.slice(0, 4),
            href: github,
            hrefLabel: "View Project",
          },
        ],
        scrollTo: "personal-projects",
      }
    );
  }

  // ── Projects (professional, as cards) ──
  if (has(q, ["project", "projects", "portfolio", "qa projects"])) {
    return reply(
      `Opening Projects… Here are the products Kishore has tested professionally:`,
      {
        cards: professionalCards(),
        links: [{ label: "Personal Projects", href: "#personal-projects" }],
        scrollTo: "portfolio",
      }
    );
  }

  // ── Certifications ──
  if (has(q, ["certification", "certifications", "certificate", "certified"])) {
    return reply(
      `${experience.certifications.description}\n\n• ${experience.certifications.tags.join("\n• ")}`,
      {
        links: [{ label: "View Experience", href: "#experience" }],
        scrollTo: "experience",
      }
    );
  }

  // ── Phone (number only) ──
  if (has(q, ["phone", "number", "call", "mobile"])) {
    return reply(`Phone: ${PHONE_NUMBER}`, {
      links: [{ label: "Call", href: PHONE_HREF }],
    });
  }

  // ── Email / Gmail ──
  if (has(q, ["gmail", "email", "mail", "e-mail"])) {
    return reply(`Email: ${social.email}`, {
      links: [{ label: "Send Email", href: `mailto:${social.email}` }],
    });
  }

  // ── GitHub ──
  if (has(q, ["github", "git hub", "repo", "repository"])) {
    return reply(`GitHub: ${social.github}`, {
      links: [{ label: "Open GitHub", href: social.github }],
    });
  }

  // ── LinkedIn ──
  if (has(q, ["linkedin", "linked in"])) {
    return reply(`LinkedIn: ${social.linkedin}`, {
      links: [{ label: "Open LinkedIn", href: social.linkedin }],
    });
  }

  // ── Full contact details ──
  if (has(q, ["contact", "reach", "hire", "get in touch", "details"])) {
    return reply(
      `Here's how to reach ${site.name}:\n\n📧  ${social.email}\n📱  ${PHONE_NUMBER}\n💼  LinkedIn: kishorekumarrasalay\n🐙  GitHub: kishorekumarrasalay-02\n📍  ${LOCATION}\n\nUse the buttons below to connect 👇`,
      {
        links: [
          { label: "Email", href: `mailto:${social.email}` },
          { label: "Call", href: PHONE_HREF },
          { label: "LinkedIn", href: social.linkedin },
          { label: "GitHub", href: social.github },
        ],
        scrollTo: "contact",
      }
    );
  }

  // ── Resume / CV ──
  if (has(q, ["resume", "cv", "download"])) {
    const cv = about.downloads[0];
    return reply(`Certainly. Preparing resume… ready to download below.`, {
      links: [
        { label: "⬇ Download Resume", href: cv.href, download: true },
        { label: "Go to About", href: "#about" },
      ],
    });
  }

  // ── Experience ──
  if (has(q, ["experience", "job", "work", "career"])) {
    const jobs = experience.work.items
      .map((j) => `• ${j.title} @ ${j.company} (${j.period})\n  ${j.description}`)
      .join("\n\n");
    return reply(`Opening Experience…\n\n${jobs}`, {
      links: [{ label: "View Experience", href: "#experience" }],
      scrollTo: "experience",
    });
  }

  // ── Education ──
  if (has(q, ["education", "college", "degree", "study", "graduation"])) {
    return reply(
      `${about.education.degree}\n${about.education.college}\n${about.education.period}\n\n${about.education.summary}`,
      {
        links: [{ label: "View About", href: "#about" }],
        scrollTo: "about",
      }
    );
  }

  // ── About ──
  if (has(q, ["about", "who is", "kishore", "intro", "background", "yourself"])) {
    return reply(
      `${site.name} is a ${site.role} at Ratnam Solutions Private Limited. ${hero.bio}`,
      {
        links: [
          { label: "View About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ],
        scrollTo: "about",
      }
    );
  }

  // ── Greeting ──
  if (has(q, ["hello", "hi", "hey", "help", "start"])) {
    return reply(
      `Hello 👋 I'm here to help recruiters learn about ${site.name}. What would you like to know? Try the suggestions below.`
    );
  }

  // ── Off-topic guard ──
  return reply(
    `I'm here to help with questions about ${site.name}'s QA portfolio — his skills, experience, projects, certifications, resume, and contact details. Try one of the suggestions below.`,
    {
      links: [
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Contact", href: "#contact" },
      ],
    }
  );
}

function has(q: string, keywords: string[]) {
  return keywords.some((k) => q.includes(k));
}
