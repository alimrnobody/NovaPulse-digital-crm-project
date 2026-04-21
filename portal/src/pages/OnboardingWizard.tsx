import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarClock, Check, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  type PortalDocument,
  type PortalOnboardingDraft,
  usePortalData,
} from "@/contexts/PortalDataContext";
import { sendWebhook } from "@/lib/webhooks";

const steps = ["Profile", "Services", "Docs", "Goals", "GHL Calendar"] as const;

const services = [
  "Paid Media",
  "SEO",
  "Social Media",
  "Branding",
  "Web Design",
  "Content Marketing",
] as const;
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Professional Services",
] as const;
const teamSizes = ["1-5", "6-20", "21-50", "50+"] as const;
const timelines = ["30 days", "60 days", "90 days", "Ongoing"] as const;
const budgets = ["$1k-$3k", "$3k-$5k", "$5k-$10k", "$10k+"] as const;
const ONBOARDING_STEP_WEBHOOK_URL =
  "https://sizable2098.app.n8n.cloud/webhook-test/2bbb06de-c529-43db-827c-c9918ae9716a";

type StepName = (typeof steps)[number];

interface StepPayload {
  email: string;
  step_number: number;
  step_name: StepName;
  step_data: Record<string, unknown>;
}

function buildStepData(
  stepNumber: number,
  onboarding: PortalOnboardingDraft,
  documents: PortalDocument[],
) {
  switch (stepNumber) {
    case 1:
      return {
        website_url: onboarding.profile.websiteUrl,
        industry: onboarding.profile.industry,
        team_size: onboarding.profile.teamSize,
        business_goals: onboarding.profile.description,
      };
    case 2:
      return {
        selected_services: onboarding.services,
      };
    case 3:
      return {
        documents: documents
          .filter((document) => document.source === "onboarding")
          .map((document) => ({
            id: document.id,
            name: document.name,
            type: document.type,
            status: document.status,
            upload_date: document.uploadDate,
          })),
      };
    case 4:
      return {
        primary_marketing_goals: onboarding.goals.goals,
        preferred_timeline: onboarding.goals.timeline,
        budget_range: onboarding.goals.budget,
      };
    case 5:
      return {
        ghl_calendar_url: onboarding.meeting.ghlCalendarUrl,
      };
    default:
      return {};
  }
}

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const {
    onboarding,
    documents,
    setOnboardingStep,
    updateOnboardingProfile,
    setOnboardingServices,
    updateOnboardingGoals,
    updateMeetingSettings,
    uploadDocuments,
  } = usePortalData();
  const [submittingStep, setSubmittingStep] = useState(false);

  const currentStepIndex = Math.max(onboarding.currentStep - 1, 0);
  const currentStepNumber = onboarding.currentStep;
  const currentStepName = steps[currentStepIndex];
  const progress = (currentStepNumber / steps.length) * 100;

  const validateStep = () => {
    if (currentStepNumber === 1) {
      return Boolean(onboarding.profile.industry && onboarding.profile.teamSize);
    }

    if (currentStepNumber === 2) {
      return onboarding.services.length > 0;
    }

    if (currentStepNumber === 4) {
      return Boolean(onboarding.goals.goals);
    }

    if (currentStepNumber === 5) {
      return Boolean(onboarding.meeting.ghlCalendarUrl);
    }

    return true;
  };

  const submitCurrentStep = async () => {
    if (!user?.email) {
      toast.error("We could not verify your account. Please sign in again.");
      return false;
    }

    const payload: StepPayload = {
      email: user.email,
      step_number: currentStepNumber,
      step_name: currentStepName,
      step_data: buildStepData(currentStepNumber, onboarding, documents),
    };

    await sendWebhook("step_completion", payload, {
      endpoint: ONBOARDING_STEP_WEBHOOK_URL,
      rawPayload: true,
    });

    return true;
  };

  const nextStep = async () => {
    if (submittingStep) {
      return;
    }

    if (!validateStep()) {
      toast.error("Please complete the required details for this step.");
      return;
    }

    setSubmittingStep(true);

    try {
      await submitCurrentStep();
      const next = Math.min(currentStepNumber + 1, steps.length);
      setOnboardingStep(next);
      updateUser({ onboardingStep: next, onboardingComplete: false });
    } catch (error) {
      console.error("Onboarding step submission failed", error);
      toast.error("We couldn't save this step right now. Please try again.");
    } finally {
      setSubmittingStep(false);
    }
  };

  const previousStep = () => {
    if (submittingStep) {
      return;
    }

    const previous = Math.max(currentStepNumber - 1, 1);
    setOnboardingStep(previous);
    updateUser({ onboardingStep: previous });
  };

  const completeOnboarding = async () => {
    if (submittingStep) {
      return;
    }

    if (!validateStep()) {
      toast.error("Please add your GHL calendar URL before finishing.");
      return;
    }

    setSubmittingStep(true);

    try {
      await submitCurrentStep();
      updateUser({ onboardingStep: steps.length, onboardingComplete: true });
      toast.success("Onboarding complete. Welcome aboard.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Final onboarding submission failed", error);
      toast.error("We couldn't complete setup right now. Please try again.");
    } finally {
      setSubmittingStep(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
              NovaPulse onboarding
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Launch your client workspace in five guided steps.
            </h1>
            <p className="mt-2 text-slate-400">
              Your answers save automatically as you move between stages.
            </p>
          </div>

          <Card className="glass-card">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">
                  Step {currentStepNumber} of {steps.length}
                </span>
                <span className="text-slate-400">{currentStepName}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="grid gap-2 sm:grid-cols-5">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`rounded-2xl border px-3 py-3 text-center text-xs ${
                      currentStepNumber === index + 1
                        ? "border-indigo-400/30 bg-indigo-500/15 text-white"
                        : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-white">{currentStepName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStepNumber === 1 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-300">Website URL</Label>
                    <Input
                      value={onboarding.profile.websiteUrl}
                      onChange={(event) =>
                        updateOnboardingProfile({ websiteUrl: event.target.value })
                      }
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Industry</Label>
                    <Select
                      value={onboarding.profile.industry}
                      onValueChange={(value) => updateOnboardingProfile({ industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Team Size</Label>
                    <Select
                      value={onboarding.profile.teamSize}
                      onValueChange={(value) => updateOnboardingProfile({ teamSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizes.map((teamSize) => (
                          <SelectItem key={teamSize} value={teamSize}>
                            {teamSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-300">Business Goals Snapshot</Label>
                    <Textarea
                      value={onboarding.profile.description}
                      onChange={(event) =>
                        updateOnboardingProfile({ description: event.target.value })
                      }
                      placeholder="Tell NovaPulse about your brand, offer, and growth priorities."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              )}

              {currentStepNumber === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => {
                    const checked = onboarding.services.includes(service);

                    return (
                      <label
                        key={service}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${
                          checked
                            ? "border-indigo-400/30 bg-indigo-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => {
                            const next = checked
                              ? onboarding.services.filter((item) => item !== service)
                              : [...onboarding.services, service];
                            setOnboardingServices(next);
                          }}
                        />
                        <div>
                          <p className="font-medium text-white">{service}</p>
                          <p className="text-sm text-slate-400">
                            Scoped into your client delivery plan.
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentStepNumber === 3 && (
                <div className="space-y-5">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center transition hover:border-indigo-400/30 hover:bg-indigo-500/5">
                    <UploadCloud className="mb-3 h-8 w-8 text-indigo-200" />
                    <p className="font-medium text-white">
                      Upload briefs, brand assets, reports, or docs
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      PDF, PNG, JPG, DOC, DOCX, XLS, XLSX up to 10MB each.
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                      onChange={(event) => {
                        void uploadDocuments(event.target.files, "onboarding");
                      }}
                    />
                  </label>
                  <div className="space-y-3">
                    {documents.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        No onboarding documents uploaded yet.
                      </p>
                    ) : (
                      documents.map((document) => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{document.name}</p>
                            <p className="text-xs text-slate-400">
                              {document.type} · {document.uploadDate}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400">{document.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {currentStepNumber === 4 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-300">Primary Marketing Goals</Label>
                    <Textarea
                      value={onboarding.goals.goals}
                      onChange={(event) =>
                        updateOnboardingGoals({ goals: event.target.value })
                      }
                      placeholder="Share the outcomes you want NovaPulse to drive."
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Preferred Timeline</Label>
                    <Select
                      value={onboarding.goals.timeline}
                      onValueChange={(value) => updateOnboardingGoals({ timeline: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {timelines.map((timeline) => (
                          <SelectItem key={timeline} value={timeline}>
                            {timeline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Budget Range</Label>
                    <Select
                      value={onboarding.goals.budget}
                      onValueChange={(value) => updateOnboardingGoals({ budget: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgets.map((budget) => (
                          <SelectItem key={budget} value={budget}>
                            {budget}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStepNumber === 5 && (
                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-100">
                        <CalendarClock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          GoHighLevel Kickoff Calendar
                        </p>
                        <p className="text-sm text-slate-400">
                          Paste your client-ready scheduling link.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-2">
                      <Label className="text-slate-300">Calendar URL</Label>
                      <Input
                        value={onboarding.meeting.ghlCalendarUrl}
                        onChange={(event) =>
                          updateMeetingSettings({ ghlCalendarUrl: event.target.value })
                        }
                        placeholder="https://go.highlevel.com/..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  onClick={previousStep}
                  disabled={currentStepNumber === 1 || submittingStep}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                {currentStepNumber < steps.length ? (
                  <Button onClick={() => void nextStep()} disabled={submittingStep}>
                    {submittingStep ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Next Step
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                ) : (
                  <Button onClick={() => void completeOnboarding()} disabled={submittingStep}>
                    {submittingStep ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                        Finishing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Complete Setup
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
