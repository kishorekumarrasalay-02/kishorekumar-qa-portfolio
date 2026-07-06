interface TagProps {
  children: React.ReactNode;
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="inline-block rounded-full bg-tag-bg px-3 py-1 text-xs text-foreground sm:px-4 sm:py-1.5 sm:text-sm">
      {children}
    </span>
  );
}
