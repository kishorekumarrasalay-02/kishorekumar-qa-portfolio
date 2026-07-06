import { BookOpen, Download, GraduationCap } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function About() {
  const { about } = portfolioData;

  return (
    <section id="about" className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={about.sectionTitle} />

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-card-border bg-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                <BookOpen size={20} />
              </div>
              <h3 className="font-serif text-xl font-bold">
                {about.whoIAm.title}
              </h3>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-muted md:text-base">
              {about.whoIAm.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {about.downloads.map((download, index) => (
                <a
                  key={download.label}
                  href={download.href}
                  download
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${
                    index === 0
                      ? "bg-primary text-white"
                      : "border border-primary text-primary hover:bg-primary/10"
                  }`}
                >
                  <Download size={16} />
                  {download.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                <GraduationCap size={20} />
              </div>
              <h3 className="font-serif text-xl font-bold">
                {about.education.title}
              </h3>
            </div>

            <h4 className="font-serif text-lg font-bold leading-snug">
              {about.education.degree}
            </h4>
            <p className="mt-2 text-sm text-primary">{about.education.college}</p>
            <span className="mt-4 inline-block rounded-full bg-tag-bg px-4 py-1 text-sm text-muted">
              {about.education.period}
            </span>
            <p className="mt-6 text-sm leading-relaxed text-muted md:text-base">
              {about.education.summary}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-card-border bg-card p-8">
          <h3 className="mb-6 font-serif text-xl font-bold">
            {about.coreCompetenciesTitle}
          </h3>
          <div className="flex flex-wrap gap-3">
            {about.coreCompetencies.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
