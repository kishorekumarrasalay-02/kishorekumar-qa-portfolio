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

const spanClass = (col: number, row: number) => {
  const cols =
    col >= 2
      ? "sm:col-span-2"
      : "sm:col-span-1";
  const rows = row >= 2 ? "sm:row-span-2" : "sm:row-span-1";
  return `${cols} ${rows}`;
};

export default function Skills() {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={skills.sectionTitle} />

        <MotionStagger className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {skills.bentoCards.map((card) => {
            const Icon = iconMap[card.icon];
            const isLearning = "learning" in card && card.learning;
            const isLarge = card.colSpan >= 2 || card.rowSpan >= 2;

            return (
              <MotionItem
                key={card.id}
                variant="fadeUp"
                className={`skill-bento-tile group flex min-h-[180px] flex-col rounded-2xl p-4 sm:min-h-[200px] sm:p-6 ${spanClass(
                  card.colSpan,
                  card.rowSpan
                )} ${
                  isLearning
                    ? "border border-dashed border-muted/50 bg-card/40"
                    : "border border-card-border bg-card"
                } ${isLarge ? "col-span-2" : "col-span-1"}`}
              >
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition group-hover:scale-105 ${
                      isLearning
                        ? "bg-muted/20 text-muted"
                        : "bg-primary text-white"
                    }`}
                  >
                    <Icon size={17} aria-hidden />
                  </div>
                  <h3 className="font-heading text-sm font-bold sm:text-lg">
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
                      className="flex items-start gap-2 text-[11px] leading-relaxed sm:text-sm"
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
