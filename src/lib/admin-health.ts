import { DEFAULTS, type ContactContent, type SeoContent } from "@/lib/site-content";

export type HealthIssue = {
  id: string;
  level: "warning" | "error";
  message: string;
  fixTo?: string;
};

export function getSiteHealthChecks(input: {
  contact: ContactContent;
  seo: SeoContent;
  contentMeta: Record<string, string | undefined>;
}): HealthIssue[] {
  const issues: HealthIssue[] = [];
  const { contact, seo } = input;

  const phone = contact.phone.replace(/[^+\d]/g, "");
  if (!phone || phone.includes("0000000")) {
    issues.push({ id: "phone", level: "error", message: "Phone number is missing or placeholder.", fixTo: "/admin/contact" });
  }
  if (!contact.email?.trim()) {
    issues.push({ id: "email", level: "warning", message: "Contact email is empty.", fixTo: "/admin/contact" });
  }
  if (!seo.description || seo.description.length < 50) {
    issues.push({ id: "seo-desc", level: "warning", message: "SEO description is short or missing.", fixTo: "/admin/seo" });
  }
  if (seo.title.length > 60) {
    issues.push({ id: "seo-title", level: "warning", message: "SEO title is over 60 characters.", fixTo: "/admin/seo" });
  }

  const heroUpdated = input.contentMeta.hero;
  if (!heroUpdated) {
    issues.push({ id: "hero", level: "warning", message: "Hero has never been saved to the database.", fixTo: "/admin/hero" });
  }

  return issues;
}

export const CONTENT_LABELS: Record<string, string> = {
  hero: "Hero",
  contact: "Contact",
  sections: "Sections",
  services: "Services",
  testimonials: "Reviews",
  about: "About",
  process: "Process",
  theme: "Theme",
  seo: "SEO",
};

export function formatRelativeUpdated(iso?: string) {
  if (!iso) return "Not saved yet";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
