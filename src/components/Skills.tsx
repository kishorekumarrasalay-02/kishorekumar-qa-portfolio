import {
  Code2,
  FileText,
  GraduationCap,
  Network,
  Wrench,
} from "lucide-react";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import { portfolioData } from "@/data/portfolio";

const iconMap = {
  testing: FileText,
  languages: Code2,
  tools: Wrench,
  api: Network,
  learning: GraduationCap,
} as const;

export default function Skills() {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={skills.sectionTitle} />

        <MotionStagger className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-4">
          {skills.bentoCards.map((card) => {
            const Icon = iconMap[card.icon];
            const isLearning = "learning" in card && card.learning;
            const isHero = card.id === "testing";

            return (
              <MotionItem
                key={card.id}
                variant="fadeUp"
                className={`skill-bento-tile group rounded-2xl border ${
                  isHero ? "lg:col-span-2 lg:row-span-2" : ""
                } ${
                  isLearning
                    ? "border-dashed border-muted/40 bg-card/50"
                    : "border-card-border bg-card"
                }`}
              >
                <div className="flex items-center gap-2.5 border-b border-card-border/60 px-4 py-3 sm:px-5 sm:py-3.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isLearning
                        ? "bg-muted/20 text-muted"
                        : "bg-primary text-white"
                    }`}
                  >
                    <Icon size={15} aria-hidden />
                  </div>
                  <h3 className="font-heading min-w-0 flex-1 text-sm font-bold leading-tight sm:text-base">
                    {card.title}
                  </h3>
                  {isLearning && (
                    <span className="shrink-0 rounded-full bg-muted/20 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-muted uppercase">
                      Learning
                    </span>
                  )}
                </div>

                <ul
                  className={`px-4 py-3 sm:px-5 sm:py-3.5 ${
                    isHero
                      ? "grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2"
                      : "flex flex-col gap-y-1.5"
                  }`}
                >
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[13px] leading-snug sm:text-sm"
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          isLearning ? "bg-muted" : "bg-primary-light"
                        }`}
                        aria-hidden
                      />
                      <span className="text-foreground/85">{item}</span>
                    </li>
                  ))}
                </ul>
              </MotionItem>
            );
          })}
        </MotionStagger>
      </div>
    </section>
  );
}
