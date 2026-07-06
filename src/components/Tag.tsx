interface TagProps {
  children: React.ReactNode;
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="inline-block rounded-full bg-tag-bg px-4 py-1.5 text-sm text-foreground">
      {children}
    </span>
  );
}
