import { Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import SectionHeading from "./SectionHeading";
import SocialIcons from "./SocialIcons";
import { portfolioData } from "@/data/portfolio";

function ContactIcon({ type }: { type: "email" | "linkedin" | "github" | "location" }) {
  if (type === "email") return <Mail size={20} />;
  if (type === "linkedin") return <LinkedInIcon size={20} />;
  if (type === "github") return <GitHubIcon size={20} />;
  return <MapPin size={20} />;
}

export default function Contact() {
  const { contact, social } = portfolioData;
  const topCards = contact.items.filter((c) => c.type !== "location");
  const locationCard = contact.items.find((c) => c.type === "location");

  return (
    <section id="contact" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title={contact.sectionTitle}
          subtitle={contact.subtitle}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCards.map((item) => {
            const content = (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-tag-bg text-primary">
                  <ContactIcon type={item.type} />
                </div>
                <p className="text-xs font-medium tracking-widest text-muted uppercase">
                  {item.label}
                </p>
                <p className="mt-2 break-words text-sm text-foreground">{item.value}</p>
              </>
            );

            return (
              <a
                key={item.label}
                href={item.href!}
                target={item.href!.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="rounded-2xl border border-card-border bg-card p-5 text-center transition-colors hover:border-accent/50 sm:p-6 lg:p-8"
              >
                {content}
              </a>
            );
          })}
        </div>

        {locationCard && (
          <div className="mt-4 rounded-2xl border border-card-border bg-card p-5 text-center sm:p-6 lg:p-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-tag-bg text-primary">
              <MapPin size={20} />
            </div>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              {locationCard.label}
            </p>
            <p className="mt-2 text-sm text-foreground">{locationCard.value}</p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <a
            href={`mailto:${social.email}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
          >
            <Mail size={18} />
            {contact.emailCta}
          </a>
        </div>

        <div className="mt-12">
          <SocialIcons size="sm" />
        </div>
      </div>
    </section>
  );
}
