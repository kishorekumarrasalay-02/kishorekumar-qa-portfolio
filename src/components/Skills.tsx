import {
  Code2,
  FileText,
  GraduationCap,
  Network,
  Wrench,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import { portfolioData } from "@/data/portfolio";

const iconMap = {
  testing: FileText,
  languages: Code2,
  tools: Wrench,
  api: Network,
  learning: GraduationCap,
} as const;

function spanClass(colSpan: number, rowSpan: number) {
  const col =
    colSpan === 2
      ? "lg:col-span-2"
      : colSpan === 3
        ? "lg:col-span-3"
        : "lg:col-span-1";
  const row =
    rowSpan === 2
      ? "lg:row-span-2"
      : rowSpan === 3
        ? "lg:row-span-3"
        : "lg:row-span-1";
  return `${col} ${row}`;
}

export default function Skills() {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl">
          <SectionHeading title={skills.sectionTitle} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr">
            {skills.bentoCards.map((card) => {
              const Icon = iconMap[card.icon];
              const isLearning = "learning" in card && card.learning;

              return (
                <div
                  key={card.id}
                  className={`flex flex-col rounded-2xl p-5 sm:p-6 ${spanClass(card.colSpan, card.rowSpan)} ${
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
                    <h3 className="font-serif text-base font-bold sm:text-lg">
                      {card.title}
                    </h3>
                    {isLearning && (
                      <span className="ml-auto rounded-full bg-muted/20 px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted uppercase">
                        Learning
                      </span>
                    )}
                  </div>

                  <ul
                    className={`flex flex-1 flex-col gap-2 ${
                      card.colSpan >= 2 && card.rowSpan >= 2
                        ? "sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2"
                        : ""
                    }`}
                  >
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-2 text-xs leading-relaxed sm:text-sm ${
                          isLearning ? "text-muted" : "text-muted"
                        }`}
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
                          <span>{item}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
