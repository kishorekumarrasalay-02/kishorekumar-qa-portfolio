import { portfolioData } from "@/data/portfolio";

export default function Footer() {
  const { site } = portfolioData;

  return (
    <footer className="border-t border-card-border px-6 py-8 text-center">
      <p className="text-sm text-muted">
        © {site.copyrightYear} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
