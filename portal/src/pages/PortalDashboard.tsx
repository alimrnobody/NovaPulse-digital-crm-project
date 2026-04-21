import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, CheckCircle2, FileText, ListTodo } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { usePortalData } from "@/contexts/PortalDataContext";
import { buildActivity, buildProjects } from "@/lib/portal";

const PortalDashboard = () => {
  const { user } = useAuth();
  const { onboarding, documents } = usePortalData();
  const projects = buildProjects(user, onboarding);
  const activities = buildActivity(user, documents, onboarding);
  const onboardingProgress = user?.onboardingComplete ? 100 : Math.min(onboarding.currentStep * 20, 100);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="glass-card">
            <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-indigo-100">
                  Client Overview
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {user?.companyName}, your growth delivery hub is ready.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Track onboarding, organize documents, and stay aligned with NovaPulse Digital across every campaign milestone.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/onboarding">
                  <Button>
                    Continue Onboarding
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/book-meeting">
                  <Button variant="outline">Book Kickoff Call</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white">Portal Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Onboarding progress</span>
                  <span className="font-medium text-white">{onboardingProgress}%</span>
                </div>
                <Progress value={onboardingProgress} className="mt-3 h-2" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Services selected</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{Math.max(onboarding.services.length, 0)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Documents in portal</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{documents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-white">Active Client Workstreams</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                >
                  <Link to={`/project/${project.id}`}>
                    <Card className="h-full border-white/10 bg-white/5 transition hover:border-indigo-400/20 hover:bg-white/10">
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-100">
                            <project.icon className="h-5 w-5" />
                          </div>
                          <Badge className="border-0 bg-white/10 text-slate-200">{project.status}</Badge>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <p className="mt-2 text-sm text-slate-400">{project.summary}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
                            <span>{project.phase}</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * index }}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-100">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
                {[
                  { label: "Profile", complete: Boolean(onboarding.profile.industry), icon: CheckCircle2 },
                  { label: "Goals", complete: Boolean(onboarding.goals.goals), icon: ListTodo },
                  { label: "Docs", complete: documents.length > 0, icon: FileText },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <item.icon className="h-5 w-5 text-indigo-200" />
                    <p className="mt-3 text-sm font-medium text-white">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.complete ? "Complete" : "Needs attention"}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default PortalDashboard;
