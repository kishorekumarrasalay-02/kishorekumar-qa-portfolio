interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-8 text-center sm:mb-10 lg:mb-12">
      <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-primary sm:mt-4 sm:h-1 sm:w-14" />
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl px-2 text-sm leading-relaxed text-muted sm:mt-5 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
