import type { LucideIcon } from "lucide-react";
import { CalendarClock, FileText, Megaphone, Rocket, ShieldCheck, Sparkles } from "lucide-react";

import type { User } from "@/contexts/AuthContext";
import type { PortalDocument, PortalOnboardingDraft } from "@/contexts/PortalDataContext";

export interface PortalProject {
  id: string;
  name: string;
  phase: string;
  status: "On Track" | "Planning" | "Needs Input";
  progress: number;
  summary: string;
  deliverable: string;
  icon: LucideIcon;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  icon: LucideIcon;
}

const serviceCatalog: Record<
  string,
  { name: string; summary: string; deliverable: string; phase: string; progress: number; icon: LucideIcon }
> = {
  "Paid Media": {
    name: "Paid Media Growth Sprint",
    summary: "Ad account restructuring, creative testing, and weekly optimization.",
    deliverable: "Launch-ready ad matrix",
    phase: "Activation",
    progress: 72,
    icon: Rocket,
  },
  SEO: {
    name: "SEO Authority Program",
    summary: "Technical SEO cleanup and content opportunity mapping.",
    deliverable: "Priority keyword roadmap",
    phase: "Research",
    progress: 44,
    icon: ShieldCheck,
  },
  "Social Media": {
    name: "Social Content Engine",
    summary: "Monthly content pillars, posting plan, and creative review.",
    deliverable: "30-day social calendar",
    phase: "Creative",
    progress: 58,
    icon: Sparkles,
  },
  Branding: {
    name: "Brand Positioning Refresh",
    summary: "Messaging refinement and visual direction alignment.",
    deliverable: "Brand strategy board",
    phase: "Strategy",
    progress: 35,
    icon: Megaphone,
  },
  "Web Design": {
    name: "Conversion Website Revamp",
    summary: "Page hierarchy, UX review, and conversion-focused redesign.",
    deliverable: "Homepage wireframe pack",
    phase: "UX Review",
    progress: 63,
    icon: FileText,
  },
  "Content Marketing": {
    name: "Content Demand Engine",
    summary: "Lead magnet planning and editorial calendar setup.",
    deliverable: "Quarterly content plan",
    phase: "Planning",
    progress: 40,
    icon: CalendarClock,
  },
};

export function buildProjects(user: User | null, draft: PortalOnboardingDraft): PortalProject[] {
  const selectedServices = draft.services.length > 0 ? draft.services : ["Paid Media", "SEO", "Web Design"];

  return selectedServices.slice(0, 3).map((service, index) => {
    const item = serviceCatalog[service] ?? serviceCatalog["Paid Media"];

    return {
      id: `${index + 1}`,
      name: item.name,
      phase: item.phase,
      status: index === 0 ? "On Track" : index === 1 ? "Planning" : "Needs Input",
      progress: item.progress,
      summary: item.summary,
      deliverable: draft.goals.goals || item.deliverable,
      icon: item.icon,
    };
  });
}

export function buildActivity(user: User | null, documents: PortalDocument[], draft: PortalOnboardingDraft): ActivityItem[] {
  const activity: ActivityItem[] = [];

  if (!user?.onboardingComplete) {
    activity.push({
      id: "activity-onboarding",
      title: `Onboarding is ${Math.max(draft.currentStep, 1)}/5 complete`,
      time: "Just now",
      icon: Sparkles,
    });
  }

  if (documents[0]) {
    activity.push({
      id: `activity-doc-${documents[0].id}`,
      title: `${documents[0].name} was added to the portal`,
      time: documents[0].uploadDate,
      icon: FileText,
    });
  }

  if (draft.services[0]) {
    activity.push({
      id: "activity-services",
      title: `${draft.services.length} services selected for kickoff planning`,
      time: "This week",
      icon: Megaphone,
    });
  }

  activity.push({
    id: "activity-calendar",
    title: "Kickoff calendar is ready for client scheduling",
    time: "Today",
    icon: CalendarClock,
  });

  return activity.slice(0, 4);
}
