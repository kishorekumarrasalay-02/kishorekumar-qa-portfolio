import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "./BrandIcons";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function PersonalProjects() {
  const { personalProjects } = portfolioData;
  const cardProjects = personalProjects.projects.filter(
    (p) => "variant" in p && p.variant === "card"
  );
  const detailedProjects = personalProjects.projects.filter(
    (p) => !("variant" in p) || p.variant === "detailed"
  );

  return (
    <section id="personal-projects" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={personalProjects.sectionTitle} />

        {cardProjects.length > 0 && (
          <div className="mb-6 grid gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6">
            {cardProjects.map((project) => (
              <article
                key={project.title}
                className="flex flex-col rounded-2xl border border-card-border bg-card p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-serif text-lg font-bold sm:text-xl">
                    {project.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {project.status}
                  </span>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                {"techStack" in project && project.techStack && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                )}

                {"githubUrl" in project && project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-card-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto sm:self-start"
                  >
                    <GitHubIcon size={16} />
                    View on GitHub
                    <ExternalLink size={14} className="text-muted" />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          {detailedProjects.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-card-border bg-card p-5 sm:p-8 lg:p-10"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h3 className="font-serif text-xl font-bold sm:text-2xl lg:text-3xl">
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

              {"buildingTitle" in project && project.building && (
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
              )}

              {"whyTitle" in project && project.why && (
                <div className="mt-8">
                  <h4 className="font-serif text-lg font-bold">
                    {project.whyTitle}
                  </h4>
                  <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                    {project.why}
                  </p>
                </div>
              )}

              {"currentFocusTitle" in project && project.currentFocus && (
                <div className="mt-8">
                  <h4 className="font-serif text-lg font-bold">
                    {project.currentFocusTitle}
                  </h4>
                  <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                    {project.currentFocus}
                  </p>
                </div>
              )}

              {"techStackTitle" in project && project.techStack && (
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
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
