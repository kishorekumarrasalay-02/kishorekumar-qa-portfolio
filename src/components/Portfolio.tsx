import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function Portfolio() {
  const { portfolio } = portfolioData;

  return (
    <section id="portfolio" className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={portfolio.sectionTitle} />

        <div className="grid gap-8 md:grid-cols-3">
          {portfolio.projects.map((project) => (
            <div
              key={project.title}
              className="flex flex-col rounded-2xl border border-card-border bg-card p-8"
            >
              <h3 className="font-serif text-xl font-bold">{project.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              <div className="mt-6">
                <Tag>{project.tag}</Tag>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
