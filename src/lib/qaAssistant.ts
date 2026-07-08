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

// ── Intent responses ──
const RESPONSES: Record<string, () => QaMessage> = {
  playwright: () =>
    reply(
      `Kishore has hands-on experience with Playwright using TypeScript for end-to-end web automation. He works with the Page Object Model (POM), assertions, screenshots, HTML/Allure reporting, and cross-browser execution — applied in his self-built HiKode automation framework.`,
      { links: [{ label: "View Skills", href: "#skills" }] }
    ),
  api: () =>
    reply(
      `Kishore practices API testing with Postman — validating REST & SOAP endpoints, working with JSONPath and schema validation, and handling authentication types (Basic, Bearer Token, OAuth 2.0, API Keys). He is extending automated API checks using Playwright's request context.`,
      { links: [{ label: "View Skills", href: "#skills" }] }
    ),
  manual: () =>
    reply(
      `Manual testing is Kishore's core strength. He performs functional, regression, smoke, sanity, and exploratory testing across live web products, with structured bug tracking in Jira and clear test documentation.`,
      { links: [{ label: "View Skills", href: "#skills" }] }
    ),
  sql: () =>
    reply(
      `Kishore uses SQL for basic queries to validate data during testing — verifying records, checking data integrity, and supporting back-end validation alongside UI and API testing.`,
      { links: [{ label: "View Skills", href: "#skills" }] }
    ),
  skills: () => {
    const learning = skills.bentoCards
      .find((c) => c.id === "learning")
      ?.items.join(", ");
    return reply(
      `Kishore's core QA toolkit:\n\n• Manual Testing (Functional, Regression, Smoke, Sanity, Exploratory)\n• Automation: Playwright with TypeScript (Page Object Model)\n• API Testing: Postman, REST & SOAP, JSONPath, Auth types\n• Database: SQL (basic queries)\n• Tools: Jira, Git & GitHub, Excel / Google Sheets\n\nCurrently learning: ${learning}`,
      { links: [{ label: "View Skills", href: "#skills" }] }
    );
  },
  automation: () => {
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
      }
    );
  },
  personalProjects: () => {
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
      }
    );
  },
  projects: () =>
    reply(`Here are the products Kishore has tested professionally:`, {
      cards: professionalCards(),
      links: [{ label: "Personal Projects", href: "#personal-projects" }],
    }),
  certifications: () =>
    reply(
      `${experience.certifications.description}\n\n• ${experience.certifications.tags.join("\n• ")}`,
      { links: [{ label: "View Experience", href: "#experience" }] }
    ),
  phone: () =>
    reply(`Phone: ${PHONE_NUMBER}`, {
      links: [{ label: "Call", href: PHONE_HREF }],
    }),
  email: () =>
    reply(`Email: ${social.email}`, {
      links: [{ label: "Send Email", href: `mailto:${social.email}` }],
    }),
  github: () =>
    reply(
      `Kishore uses Git & GitHub for version control — branching, commits, and hosting his automation work.\n\nGitHub: ${social.github}`,
      { links: [{ label: "Open GitHub", href: social.github }] }
    ),
  jira: () =>
    reply(
      `Kishore uses Jira daily for bug tracking and test management — logging defects, tracking the defect lifecycle, and maintaining clear test documentation across live products.`,
      { links: [{ label: "View Skills", href: "#skills" }] }
    ),
  linkedin: () =>
    reply(`LinkedIn: ${social.linkedin}`, {
      links: [{ label: "Open LinkedIn", href: social.linkedin }],
    }),
  contact: () =>
    reply(
      `Here's how to reach ${site.name}:\n\n📧  ${social.email}\n📱  ${PHONE_NUMBER}\n💼  LinkedIn: kishorekumarrasalay\n🐙  GitHub: kishorekumarrasalay-02\n📍  ${LOCATION}\n\nUse the buttons below to connect 👇`,
      {
        links: [
          { label: "Email", href: `mailto:${social.email}` },
          { label: "Call", href: PHONE_HREF },
          { label: "LinkedIn", href: social.linkedin },
          { label: "GitHub", href: social.github },
        ],
      }
    ),
  resume: () => {
    const cv = about.downloads[0];
    return reply(`Certainly. Preparing resume… ready to download below.`, {
      links: [
        { label: "⬇ Download Resume", href: cv.href, download: true },
        { label: "Go to About", href: "#about" },
      ],
    });
  },
  experience: () => {
    const jobs = experience.work.items
      .map((j) => `• ${j.title} @ ${j.company} (${j.period})\n  ${j.description}`)
      .join("\n\n");
    return reply(`Kishore's work experience:\n\n${jobs}`, {
      links: [{ label: "View Experience", href: "#experience" }],
    });
  },
  education: () =>
    reply(
      `${about.education.degree}\n${about.education.college}\n${about.education.period}\n\n${about.education.summary}`,
      { links: [{ label: "View About", href: "#about" }] }
    ),
  about: () =>
    reply(
      `${site.name} is a ${site.role} at Ratnam Solutions Private Limited. ${hero.bio}`,
      {
        links: [
          { label: "View About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ],
      }
    ),
};

// ── Intent definitions (priority order; earlier wins ties) ──
interface Intent {
  id: string;
  phrases?: string[];
  keywords?: string[];
}

const INTENTS: Intent[] = [
  { id: "playwright", keywords: ["playwright"] },
  { id: "api", phrases: ["api testing"], keywords: ["api", "postman", "rest", "soap"] },
  {
    id: "manual",
    phrases: ["manual testing"],
    keywords: ["manual", "functional", "regression", "smoke", "sanity", "exploratory"],
  },
  { id: "sql", keywords: ["sql", "database", "databases"] },
  { id: "jira", keywords: ["jira", "bug", "bugs", "defect", "defects", "ticket", "tickets"] },
  {
    id: "skills",
    phrases: ["what tools", "which tools", "tech stack", "tools does", "skills does", "what skills"],
    keywords: ["tools", "tool", "skills", "skill", "stack", "toolkit", "technologies"],
  },
  { id: "automation", phrases: ["automation framework", "show automation"], keywords: ["automation", "framework", "sdet"] },
  { id: "personalProjects", phrases: ["personal project", "personal projects", "own project", "side project", "own build"] },
  { id: "projects", phrases: ["qa projects", "show projects", "your projects", "tested projects"], keywords: ["projects", "project", "portfolio"] },
  { id: "certifications", keywords: ["certification", "certifications", "certificate", "certificates", "certified"] },
  { id: "experience", phrases: ["work experience"], keywords: ["experience", "career", "companies"] },
  { id: "education", keywords: ["education", "college", "degree", "study", "studied", "graduation", "qualification"] },
  { id: "phone", phrases: ["contact number", "phone number"], keywords: ["phone", "mobile", "call", "whatsapp"] },
  { id: "email", keywords: ["email", "gmail", "mail"] },
  { id: "github", phrases: ["git hub", "git and github", "version control"], keywords: ["github", "git", "repo", "repository", "repositories"] },
  { id: "linkedin", phrases: ["linked in"], keywords: ["linkedin"] },
  { id: "contact", phrases: ["contact details", "contact detail", "contact info", "get in touch", "how to reach", "how can i reach", "how do i contact"], keywords: ["contact", "reach", "hire"] },
  { id: "resume", phrases: ["download resume", "download cv"], keywords: ["resume", "cv"] },
  {
    id: "about",
    phrases: ["about kishore", "about you", "about him", "tell me about", "who is kishore", "your background", "his background", "professional summary", "introduce", "introduction"],
    keywords: ["about", "background", "intro", "summary", "profile"],
  },
];

const GREETINGS = new Set([
  "hi", "hii", "hiii", "hiya", "hey", "heyy", "heyya", "hello", "helo", "hellow",
  "hola", "yo", "howdy", "sup", "greetings", "namaste", "hai",
]);

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function isGreeting(norm: string, tokens: string[]): boolean {
  if (norm.startsWith("good morning") || norm.startsWith("good evening") || norm.startsWith("good afternoon") || norm.startsWith("good day")) {
    return true;
  }
  if (tokens.length > 3) return false;
  return tokens.some((t) => {
    if (GREETINGS.has(t)) return true;
    if (t.length >= 4 && levenshtein(t, "hello") <= 1) return true; // heelo, helllo, hallo
    if (t.length >= 4 && levenshtein(t, "hey") <= 1 && t.startsWith("h")) return true;
    return false;
  });
}

function scoreIntent(norm: string, tokens: string[], intent: Intent): number {
  let score = 0;
  for (const p of intent.phrases ?? []) {
    if (norm.includes(p)) score += 3;
  }
  const tokenSet = new Set(tokens);
  for (const k of intent.keywords ?? []) {
    if (tokenSet.has(k)) score += 1;
  }
  return score;
}

export function getAssistantReply(input: string): QaMessage {
  const norm = input.toLowerCase().trim();
  const tokens = norm.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

  // 1) Best-matching portfolio intent (by score)
  let bestId: string | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const score = scoreIntent(norm, tokens, intent);
    if (score > bestScore) {
      bestScore = score;
      bestId = intent.id;
    }
  }

  if (bestId && bestScore > 0) {
    return RESPONSES[bestId]();
  }

  // 2) Greeting (typo-tolerant) — only when no real intent matched
  if (isGreeting(norm, tokens) || tokens.includes("help")) {
    return reply(
      `👋 Hi! Welcome to ${site.name}'s QA Portfolio.\nI'm your AI QA Assistant. Ask me anything about my experience, projects, testing skills, certifications, or resume.`
    );
  }

  // 3) Off-topic guard
  return reply(
    `Sorry, I can't answer questions outside ${site.name}'s portfolio. I'm here to help you explore my professional experience, QA skills, projects, resume, and contact details. Please ask me anything related to my portfolio.`,
    {
      links: [
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#portfolio" },
        { label: "Contact", href: "#contact" },
      ],
    }
  );
}
