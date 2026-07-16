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

        <MotionStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {skills.bentoCards.map((card) => {
            const Icon = iconMap[card.icon];
            const isLearning = "learning" in card && card.learning;
            const wide = card.colSpan >= 2;

            return (
              <MotionItem
                key={card.id}
                variant="fadeUp"
                className={`skill-bento-tile group flex flex-col rounded-2xl p-5 sm:p-6 ${
                  wide ? "lg:col-span-2" : "lg:col-span-1"
                } ${
                  card.rowSpan >= 2 ? "lg:row-span-2" : ""
                } ${
                  isLearning
                    ? "border border-dashed border-muted/40 bg-card/50"
                    : "border border-card-border bg-card"
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${
                      isLearning
                        ? "bg-muted/20 text-muted"
                        : "bg-primary text-white shadow-sm shadow-primary/30"
                    }`}
                  >
                    <Icon size={18} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-base font-bold leading-snug sm:text-lg">
                      {card.title}
                    </h3>
                  </div>
                  {isLearning && (
                    <span className="shrink-0 rounded-full bg-muted/20 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted uppercase">
                      Learning
                    </span>
                  )}
                </div>

                <ul className="flex flex-wrap gap-2">
                  {card.items.map((item) => (
                    <li key={item}>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium leading-snug sm:text-[13px] ${
                          isLearning
                            ? "border border-dashed border-muted/40 bg-background/60 text-muted"
                            : "bg-tag-bg text-foreground"
                        }`}
                      >
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
