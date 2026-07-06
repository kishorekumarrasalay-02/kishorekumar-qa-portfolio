import Image from "next/image";
import SocialIcons from "./SocialIcons";
import { portfolioData } from "@/data/portfolio";

export default function Hero() {
  const { site, hero } = portfolioData;

  return (
    <section
      id="home"
      className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 text-center"
    >
      <div className="relative mb-8 h-36 w-36 overflow-hidden rounded-full border-4 border-card-border shadow-sm md:h-44 md:w-44">
        <Image
          src={site.profileImage}
          alt={site.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 144px, 176px"
        />
      </div>

      <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
        {site.name}
      </h1>

      <p className="mt-3 font-serif text-xl text-primary md:text-2xl">
        {site.role}
      </p>

      <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
        {hero.bio}
      </p>

      <div className="mt-10">
        <SocialIcons />
      </div>
    </section>
  );
}
