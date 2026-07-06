import { Code2, FileText, Wrench } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

const categoryIcons = {
  languages: Code2,
  tools: Wrench,
  testing: FileText,
} as const;

export default function Skills() {
  const { skills } = portfolioData;

  const categories = [
    { key: "languages" as const, ...skills.languages },
    { key: "tools" as const, ...skills.tools },
    { key: "testing" as const, ...skills.testing },
  ];

  return (
    <section id="skills" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={skills.sectionTitle} />

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {categories.map(({ key, title, items }) => {
            const Icon = categoryIcons[key];
            return (
              <div
                key={key}
                className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-8"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-serif text-lg font-bold">{title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
