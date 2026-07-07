import Image from "next/image";
import SocialIcons from "./SocialIcons";
import TypewriterStatus from "./TypewriterStatus";
import { portfolioData } from "@/data/portfolio";
import MotionReveal from "./MotionReveal";
import AnimatedCounter from "./AnimatedCounter";

export default function Hero() {
  const { site, hero } = portfolioData;
  const projectsCount =
    portfolioData.portfolio.projects.length +
    portfolioData.personalProjects.projects.length;
  const skillsCount = portfolioData.skills.bentoCards.reduce(
    (sum, card) => sum + card.items.length,
    0
  );

  return (
    <section
      id="home"
      className="flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-12 text-center sm:px-6 sm:pt-24 sm:pb-16 lg:px-8"
    >
      <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-card-border shadow-sm sm:mb-8 sm:h-36 sm:w-36 md:h-44 md:w-44">
        <Image
          src={site.profileImage}
          alt={site.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 144px, 176px"
        />
      </div>

      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
        {site.name}
      </h1>

      <p className="text-subtitle mt-2 text-base text-primary sm:mt-3 sm:text-xl md:text-2xl">
        {site.role}
      </p>

      <TypewriterStatus />

      <MotionReveal variant="fadeUp" delay={0.15}>
        <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
          <div className="rounded-2xl border border-card-border bg-card p-4 text-center transition-transform duration-300 hover:-translate-y-0.5">
            <div className="text-subtitle text-xs font-semibold text-muted sm:text-sm">
              PROJECTS
            </div>
            <div className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
              <AnimatedCounter value={projectsCount} />
            </div>
          </div>
          <div className="rounded-2xl border border-card-border bg-card p-4 text-center transition-transform duration-300 hover:-translate-y-0.5">
            <div className="text-subtitle text-xs font-semibold text-muted sm:text-sm">
              SKILLS
            </div>
            <div className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
              <AnimatedCounter value={skillsCount} />
            </div>
          </div>
        </div>
      </MotionReveal>

      <p className="text-body mt-6 max-w-2xl px-2 text-sm text-muted sm:mt-8 sm:text-base md:text-lg">
        {hero.bio}
      </p>

      <div className="mt-8 sm:mt-10">
        <SocialIcons />
      </div>
    </section>
  );
}
