import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function PersonalProjects() {
  const { personalProjects } = portfolioData;

  return (
    <section id="personal-projects" className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={personalProjects.sectionTitle} />

        <div className="space-y-8">
          {personalProjects.projects.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-card-border bg-card p-8 md:p-10"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h3 className="font-serif text-2xl font-bold md:text-3xl">
                  {project.title}
                </h3>
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-medium text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {project.status}
                </span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted md:text-base">
                {project.description}
              </p>

              <div className="mt-8">
                <h4 className="font-serif text-lg font-bold">
                  {project.buildingTitle}
                </h4>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted md:text-base">
                  {project.building.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h4 className="font-serif text-lg font-bold">
                  {project.whyTitle}
                </h4>
                <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  {project.why}
                </p>
              </div>

              <div className="mt-8">
                <h4 className="font-serif text-lg font-bold">
                  {project.currentFocusTitle}
                </h4>
                <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  {project.currentFocus}
                </p>
              </div>

              <div className="mt-8">
                <h4 className="font-serif text-lg font-bold">
                  {project.techStackTitle}
                </h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
