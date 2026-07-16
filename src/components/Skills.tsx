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

        <MotionStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
          {skills.bentoCards.map((card) => {
            const Icon = iconMap[card.icon];
            const isLearning = "learning" in card && card.learning;
            const isHero = card.id === "testing";

            return (
              <MotionItem
                key={card.id}
                variant="fadeUp"
                className={`skill-bento-tile group flex h-full flex-col rounded-2xl border p-5 sm:p-6 ${
                  isHero ? "lg:col-span-2 lg:row-span-2" : ""
                } ${
                  isLearning
                    ? "border-dashed border-muted/40 bg-card/50"
                    : "border-card-border bg-card"
                }`}
              >
                <div className="mb-4 flex items-center gap-3 border-b border-card-border/70 pb-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isLearning
                        ? "bg-muted/20 text-muted"
                        : "bg-primary text-white shadow-sm shadow-primary/25"
                    }`}
                  >
                    <Icon size={18} aria-hidden />
                  </div>
                  <h3 className="font-heading min-w-0 flex-1 text-base font-bold leading-snug sm:text-lg">
                    {card.title}
                  </h3>
                  {isLearning && (
                    <span className="shrink-0 rounded-full bg-muted/20 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted uppercase">
                      Learning
                    </span>
                  )}
                </div>

                <ul
                  className={`flex flex-1 flex-col gap-2.5 ${
                    isHero ? "sm:gap-3 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-2.5" : ""
                  }`}
                >
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <span
                        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${
                          isLearning ? "bg-muted" : "bg-primary-light"
                        }`}
                        aria-hidden
                      />
                      <span className="text-body text-[13px] text-foreground/90 sm:text-sm">
                        {item}
                      </span>
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
