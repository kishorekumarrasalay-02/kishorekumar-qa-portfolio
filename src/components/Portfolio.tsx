import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function Portfolio() {
  const { portfolio } = portfolioData;

  return (
    <section id="portfolio" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={portfolio.sectionTitle} />

        <MotionStagger className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {portfolio.projects.map((project) => (
            <MotionItem
              key={project.title}
              variant="scale"
              className="flex flex-col rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-8"
            >
              <h3 className="font-heading text-xl font-bold">{project.title}</h3>
              <p className="text-body mt-4 flex-1 text-sm text-muted">
                {project.description}
              </p>
              <div className="mt-6">
                <Tag>{project.tag}</Tag>
              </div>
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
