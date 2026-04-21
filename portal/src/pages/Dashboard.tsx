import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  LockKeyhole,
  Settings,
  Sparkles,
  TimerReset,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const onboardingSteps = [
  {
    title: "Profile Details",
    description: "Confirm your contact and company information.",
  },
  {
    title: "Services",
    description: "Tell us which services you want NovaPulse to prioritize.",
  },
  {
    title: "Documents",
    description: "Upload assets, briefs, and key brand materials.",
  },
  {
    title: "Goals",
    description: "Share campaign targets so strategy starts with clarity.",
  },
  {
    title: "GHL Calendar",
    description: "Book your kickoff call and lock in the next milestone.",
  },
] as const;

const secondaryCards = [
  {
    title: "Why this matters",
    text: "Completing onboarding helps our team launch faster with the right strategy, assets, and communication flow from day one.",
  },
  {
    title: "What happens next",
    text: "Once setup is complete, your portal becomes the home for project updates, documents, approvals, and meeting coordination.",
  },
] as const;

const onboardingBenefits = [
  "Kickoff planning gets aligned with your exact priorities.",
  "Our team can move faster with the right files and context.",
  "Your portal becomes ready for updates, approvals, and delivery tracking.",
] as const;

const setupReassurance = [
  {
    label: "Takes 3 to 5 min",
    icon: TimerReset,
  },
  {
    label: "Saved automatically",
    icon: Zap,
  },
  {
    label: "Secure setup",
    icon: LockKeyhole,
  },
] as const;

const Dashboard = () => {
  const { user } = useAuth();
  const completedSteps = user?.onboardingComplete
    ? onboardingSteps.length
    : Math.min(user?.onboardingStep ?? 0, onboardingSteps.length);
  const onboardingProgress = Math.round((completedSteps / onboardingSteps.length) * 100);
  const nextStep = onboardingSteps[Math.min(completedSteps, onboardingSteps.length - 1)];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        {!user?.onboardingComplete ? (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] border border-indigo-400/20 bg-slate-950/90 shadow-[0_30px_120px_rgba(15,23,42,0.65)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_28%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="space-y-8">
                <div className="space-y-5">
                  <Badge className="w-fit border border-indigo-300/20 bg-indigo-500/10 px-3 py-1 text-indigo-100">
                    Next Required Action
                  </Badge>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Complete Your Setup
                      </h1>
                      <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                        Finish your onboarding so NovaPulse Digital can align strategy,
                        kickoff planning, and delivery around your company from the very
                        first interaction.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Progress
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {onboardingProgress}%
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Next Step
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {nextStep.title}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Estimated Time
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">3 to 5 min</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Onboarding progress</span>
                    <span>{onboardingProgress}% complete</span>
                  </div>
                  <Progress
                    value={onboardingProgress}
                    className="h-3 rounded-full bg-slate-800/90"
                  />
                </div>

                <div className="grid gap-3 pt-1 sm:grid-cols-[1.35fr_1fr] sm:items-center">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="min-w-0"
                  >
                    <Link to="/onboarding" className="block">
                      <Button className="h-12 w-full rounded-xl bg-indigo-500 px-7 text-base text-white shadow-[0_12px_30px_rgba(99,102,241,0.35)] transition hover:bg-indigo-400">
                        Continue Onboarding
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>

                  <Link to="/settings" className="block min-w-0">
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-xl border-white/10 bg-white/5 px-6 text-base text-slate-200 hover:bg-white/10"
                    >
                      <Settings className="h-4 w-4" />
                      Review Account Details
                    </Button>
                  </Link>
                </div>

                <div className="grid gap-4 pt-1 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                    <p className="text-sm font-medium text-white">Why complete setup?</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      A complete setup helps us personalize your strategy, reduce kickoff
                      delays, and start delivery with stronger context from day one.
                    </p>

                    <div className="mt-4 space-y-3">
                      {onboardingBenefits.map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-sm leading-6 text-slate-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">Current focus</p>
                        <p className="mt-1 text-sm text-slate-400">
                          You are currently preparing the essentials for kickoff.
                        </p>
                      </div>
                      <div className="rounded-full border border-indigo-300/20 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-100">
                        Step {Math.min(completedSteps + 1, onboardingSteps.length)} of {onboardingSteps.length}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <p className="text-lg font-semibold text-white">{nextStep.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {nextStep.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
                  {setupReassurance.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-slate-300"
                    >
                      <Icon className="h-4 w-4 text-indigo-200" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <Card className="glass-card border-white/10">
              <CardContent className="space-y-6 p-8">
                <Badge className="w-fit border-0 bg-indigo-500/15 text-indigo-100">
                  Client Dashboard
                </Badge>
                <div>
                  <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                    Welcome back, {user?.companyName}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base text-slate-300">
                    Your NovaPulse Digital workspace is ready. Keep your setup current and
                    align project delivery from one clean portal.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <Building2 className="h-5 w-5 text-indigo-200" />
                    <p className="mt-3 text-sm text-slate-400">Company</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {user?.companyName}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <Sparkles className="h-5 w-5 text-indigo-200" />
                    <p className="mt-3 text-sm text-slate-400">Portal Status</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Fully configured
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white">Account Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Primary Contact</p>
                  <p className="mt-1 text-lg font-semibold text-white">{user?.fullName}</p>
                  <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="mt-1 text-lg font-semibold text-white">{user?.phone}</p>
                </div>
                <Link to="/settings">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4" />
                    Open Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.section>
        )}

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                {user?.onboardingComplete ? "Workspace Snapshot" : "Account Snapshot"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Primary Contact</p>
                <p className="mt-1 text-lg font-semibold text-white">{user?.fullName}</p>
                <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <Building2 className="h-5 w-5 text-indigo-200" />
                  <p className="mt-3 text-sm text-slate-400">Company</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {user?.companyName}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <Sparkles className="h-5 w-5 text-indigo-200" />
                  <p className="mt-3 text-sm text-slate-400">Portal Status</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {user?.onboardingComplete ? "Fully configured" : "Setup in progress"}
                  </p>
                </div>
              </div>
              <Link to="/settings">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4" />
                  Open Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                {user?.onboardingComplete ? "Portal Notes" : "Setup Guide"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {secondaryCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
