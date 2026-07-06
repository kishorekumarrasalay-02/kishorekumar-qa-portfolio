import { portfolioData } from "@/data/portfolio";

export default function Footer() {
  const { site } = portfolioData;

  return (
    <footer className="border-t border-card-border px-4 py-6 text-center sm:px-6 sm:py-8">
      <p className="text-xs text-muted sm:text-sm">
        © {site.copyrightYear} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
