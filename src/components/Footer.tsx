import { portfolioData } from "@/data/portfolio";

export default function Footer() {
  const { site } = portfolioData;

  return (
    <footer className="border-t border-card-border/50 px-4 py-10 text-center sm:px-6 sm:py-12">
      <p className="text-xs tracking-wide text-muted">Designed &amp; Developed by</p>
      <p className="font-heading mt-2 text-sm font-semibold text-foreground sm:text-base">
        {site.name}
      </p>
      <p className="text-subtitle mt-1 text-xs text-primary sm:text-sm">{site.role}</p>
      <p className="mt-5 text-xs text-muted">©{site.copyrightYear}</p>
    </footer>
  );
}
