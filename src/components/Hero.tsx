import Image from "next/image";
import SocialIcons from "./SocialIcons";
import TypewriterStatus from "./TypewriterStatus";
import { portfolioData } from "@/data/portfolio";

export default function Hero() {
  const { site, hero } = portfolioData;

  return (
    <section
      id="home"
      className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-12 text-center sm:px-6 sm:pt-20 sm:pb-16 lg:px-8"
    >
      <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-card-border shadow-sm sm:mb-8 sm:h-36 sm:w-36 md:h-44 md:w-44">
        <Image
          src={site.profileImage}
          alt={site.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 144px, 176px"
        />
      </div>

      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
        {site.name}
      </h1>

      <p className="text-subtitle mt-2 text-base text-primary sm:mt-3 sm:text-xl md:text-2xl">
        {site.role}
      </p>

      <TypewriterStatus />

      <p className="text-body mt-6 max-w-2xl px-2 text-sm text-muted sm:mt-8 sm:text-base md:text-lg">
        {hero.bio}
      </p>

      <div className="mt-8 sm:mt-10">
        <SocialIcons />
      </div>
    </section>
  );
}
