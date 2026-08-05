"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FileText,
  User,
  Briefcase,
  Wrench,
  FolderGit2,
  BookOpen,
  Mail,
  Moon,
  Sun,
  Bot,
  TestTube2,
  Download,
} from "lucide-react";

interface ActionItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "QA Tools";
  icon: typeof Search;
  action: () => void;
  keywords?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open trigger handled outside or via event
          const event = new CustomEvent("toggle-command-palette");
          window.dispatchEvent(event);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (href: string) => {
    onClose();
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(href);
  };

  const actions: ActionItem[] = [
    {
      id: "nav-home",
      title: "Go to Home",
      category: "Navigation",
      icon: User,
      action: () => navigateTo("/#home"),
    },
    {
      id: "nav-about",
      title: "Go to About Me",
      category: "Navigation",
      icon: User,
      action: () => navigateTo("/#about"),
    },
    {
      id: "nav-experience",
      title: "Go to Experience & Certifications",
      category: "Navigation",
      icon: Briefcase,
      action: () => navigateTo("/#experience"),
    },
    {
      id: "nav-skills",
      title: "Go to Technical Skills",
      category: "Navigation",
      icon: Wrench,
      action: () => navigateTo("/#skills"),
    },
    {
      id: "nav-qa-sandbox",
      title: "Open QA Interactive Sandbox & Test Runner",
      category: "QA Tools",
      icon: TestTube2,
      action: () => navigateTo("/#qa-sandbox"),
    },
    {
      id: "nav-projects",
      title: "Go to Personal Projects",
      category: "Navigation",
      icon: FolderGit2,
      action: () => navigateTo("/#personal-projects"),
    },
    {
      id: "nav-blog",
      title: "View QA Blog & Articles",
      category: "Navigation",
      icon: BookOpen,
      action: () => navigateTo("/blog"),
    },
    {
      id: "nav-contact",
      title: "Go to Contact",
      category: "Navigation",
      icon: Mail,
      action: () => navigateTo("/#contact"),
    },
    {
      id: "act-cv",
      title: "Download CV (PDF)",
      category: "Actions",
      icon: Download,
      action: () => {
        onClose();
        window.open("/cv.pdf", "_blank");
      },
    },
    {
      id: "act-theme",
      title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      category: "Actions",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        onClose();
        setTheme(theme === "dark" ? "light" : "dark");
      },
    },
  ];

  const filteredActions = actions.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-card-border bg-card shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-card-border/60 px-4 py-3.5">
          <Search size={18} className="text-muted shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-muted/10 hover:text-foreground transition"
            aria-label="Close Command Palette"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm text-foreground/90 transition hover:bg-primary/10 hover:text-primary-light"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/10 text-muted">
                      <Icon size={16} />
                    </div>
                    <span className="flex-1 font-medium">{item.title}</span>
                    <span className="rounded-md bg-muted/15 px-2 py-0.5 text-[10px] font-semibold text-muted uppercase">
                      {item.category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-card-border/40 bg-muted/5 px-4 py-2 text-[11px] text-muted">
          <span>Use <kbd className="rounded bg-muted/20 px-1 py-0.5">Ctrl</kbd> + <kbd className="rounded bg-muted/20 px-1 py-0.5">K</kbd> to open anytime</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
