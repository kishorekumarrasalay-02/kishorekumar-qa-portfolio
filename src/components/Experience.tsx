import { Award, Briefcase } from "lucide-react";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={experience.sectionTitle} />

        <MotionStagger className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <MotionItem
            variant="slide"
            className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-8"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                <Briefcase size={20} />
              </div>
              <h3 className="font-heading text-xl font-bold">
                {experience.work.title}
              </h3>
            </div>

            <div className="relative space-y-6 border-l-2 border-primary/30 pl-4 sm:space-y-8 sm:pl-6">
              {experience.work.items.map((job) => (
                <div key={job.title} className="relative">
                  <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-accent sm:-left-[31px]" />
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-heading text-lg font-bold">{job.title}</h4>
                    <span className="rounded-full bg-tag-bg px-3 py-1 text-xs text-muted">
                      {job.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-primary">{job.company}</p>
                  <p className="text-body mt-3 text-sm text-muted">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </MotionItem>

          <MotionItem
            variant="slideRight"
            className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-8"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                <Award size={20} />
              </div>
              <h3 className="font-heading text-xl font-bold">
                {experience.certifications.title}
              </h3>
            </div>

            <div className="rounded-xl border border-card-border bg-background p-4 sm:p-6">
              <p className="text-body text-sm text-muted md:text-base">
                {experience.certifications.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {experience.certifications.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </MotionItem>
        </MotionStagger>
      </div>
    </section>
  );
}
