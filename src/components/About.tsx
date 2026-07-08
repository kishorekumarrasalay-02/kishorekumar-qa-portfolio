import { BookOpen, GraduationCap } from "lucide-react";
import MotionReveal from "./MotionReveal";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import TrackableDownload from "./analytics/TrackableDownload";
import { portfolioData } from "@/data/portfolio";

export default function About() {
  const { about } = portfolioData;

  return (
    <section id="about" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={about.sectionTitle} />

        <MotionStagger className="grid gap-4 sm:gap-5 lg:grid-cols-2 lg:items-stretch">
          <MotionItem
            variant="fadeUp"
            className="flex h-full min-h-[280px] flex-col rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-7 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                <BookOpen size={20} />
              </div>
              <h3 className="font-heading text-xl font-bold">
                {about.whoIAm.title}
              </h3>
            </div>

            <div className="text-body space-y-4 text-sm text-muted md:text-base">
              {about.whoIAm.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
              {about.downloads.map((download, index) => (
                <TrackableDownload
                  key={download.label}
                  href={download.href}
                  label={download.label}
                  variant={index === 0 ? "primary" : "outline"}
                />
              ))}
            </div>
          </MotionItem>

          <MotionItem
            variant="fadeUp"
            className="flex h-full min-h-[280px] flex-col rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-7 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                <GraduationCap size={20} />
              </div>
              <h3 className="font-heading text-xl font-bold">
                {about.education.title}
              </h3>
            </div>

            <h4 className="font-heading text-lg font-bold leading-snug">
              {about.education.degree}
            </h4>
            <p className="mt-2 text-sm text-primary">{about.education.college}</p>
            <span className="mt-4 inline-block rounded-full bg-tag-bg px-4 py-1 text-sm text-muted">
              {about.education.period}
            </span>
            <p className="text-body mt-6 text-sm text-muted md:text-base">
              {about.education.summary}
            </p>
          </MotionItem>
        </MotionStagger>

        <MotionReveal variant="fadeUp" className="mt-6 sm:mt-8">
          <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-8 transition-transform duration-300 hover:-translate-y-0.5">
            <h3 className="mb-6 font-heading text-xl font-bold">
              {about.coreCompetenciesTitle}
            </h3>
            <div className="flex flex-wrap gap-3">
              {about.coreCompetencies.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
