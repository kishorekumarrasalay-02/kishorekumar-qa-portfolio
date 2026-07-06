import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { portfolioData } from "@/data/portfolio";

interface SocialIconsProps {
  size?: "sm" | "md";
}

export default function SocialIcons({ size = "md" }: SocialIconsProps) {
  const { social } = portfolioData;
  const iconSize = size === "sm" ? 16 : 18;
  const buttonSize = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  const links = [
    { href: social.linkedin, label: "LinkedIn", type: "linkedin" as const },
    { href: social.github, label: "GitHub", type: "github" as const },
    { href: `mailto:${social.email}`, label: "Email", type: "email" as const },
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {links.map(({ href, label, type }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          className={`${buttonSize} flex items-center justify-center rounded-full border border-card-border bg-background text-muted transition-colors hover:border-accent hover:text-accent`}
        >
          {type === "linkedin" && <LinkedInIcon size={iconSize} />}
          {type === "github" && <GitHubIcon size={iconSize} />}
          {type === "email" && <Mail size={iconSize} />}
        </a>
      ))}
    </div>
  );
}
