import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-3 right-3 z-50 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>
      {children}
      <Footer />
    </>
  );
}
