import { Award, Briefcase } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={experience.sectionTitle} />

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-card-border bg-card p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                <Briefcase size={20} />
              </div>
              <h3 className="font-serif text-xl font-bold">
                {experience.work.title}
              </h3>
            </div>

            <div className="relative space-y-8 border-l-2 border-primary/30 pl-6">
              {experience.work.items.map((job) => (
                <div key={job.title} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-accent" />
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-serif text-lg font-bold">{job.title}</h4>
                    <span className="rounded-full bg-tag-bg px-3 py-1 text-xs text-muted">
                      {job.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-primary">{job.company}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                <Award size={20} />
              </div>
              <h3 className="font-serif text-xl font-bold">
                {experience.certifications.title}
              </h3>
            </div>

            <div className="rounded-xl border border-card-border bg-background p-6">
              <p className="text-sm leading-relaxed text-muted md:text-base">
                {experience.certifications.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {experience.certifications.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
