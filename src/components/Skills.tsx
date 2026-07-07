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
import type { MotionVariant } from "./motion/variants";

const iconMap = {
  testing: FileText,
  languages: Code2,
  tools: Wrench,
  api: Network,
  learning: GraduationCap,
} as const;

const cardVariants: MotionVariant[] = ["fadeUp", "scale", "rotate", "slide", "slideRight"];

export default function Skills() {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={skills.sectionTitle} />

        <MotionStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {skills.bentoCards.map((card, index) => {
            const Icon = iconMap[card.icon];
            const isLearning = "learning" in card && card.learning;

            return (
              <MotionItem
                key={card.id}
                variant={cardVariants[index % cardVariants.length]}
                className={`flex min-h-[200px] flex-col rounded-2xl p-5 sm:min-h-[220px] sm:p-6 ${
                  isLearning
                    ? "border border-dashed border-muted/50 bg-card/40"
                    : "border border-card-border bg-card"
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isLearning
                        ? "bg-muted/20 text-muted"
                        : "bg-primary text-white"
                    }`}
                  >
                    <Icon size={17} />
                  </div>
                  <h3 className="font-heading text-base font-bold sm:text-lg">
                    {card.title}
                  </h3>
                  {isLearning && (
                    <span className="ml-auto rounded-full bg-muted/20 px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted uppercase">
                      Learning
                    </span>
                  )}
                </div>

                <ul className="flex flex-1 flex-col gap-2">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs leading-relaxed sm:text-sm"
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          isLearning ? "bg-muted" : "bg-accent"
                        }`}
                      />
                      {isLearning ? (
                        <span className="rounded-md bg-tag-bg/60 px-2 py-0.5 text-foreground">
                          {item}
                        </span>
                      ) : (
                        <span className="text-body text-muted">{item}</span>
                      )}
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
