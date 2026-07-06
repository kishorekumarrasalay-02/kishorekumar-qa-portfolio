interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-8 text-center sm:mb-10 lg:mb-12">
      <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-primary sm:mt-4 sm:w-16" />
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl px-2 text-sm text-muted sm:mt-6 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
