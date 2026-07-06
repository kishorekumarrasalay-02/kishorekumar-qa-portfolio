interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-12 text-center">
      <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary" />
      {subtitle && (
        <p className="mx-auto mt-6 max-w-2xl text-muted">{subtitle}</p>
      )}
    </div>
  );
}
