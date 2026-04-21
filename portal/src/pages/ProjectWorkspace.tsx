import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, Circle, FileText, Target } from "lucide-react";
import { useParams } from "react-router-dom";

import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { usePortalData } from "@/contexts/PortalDataContext";
import { buildProjects } from "@/lib/portal";

const milestones = ["Discovery", "Strategy", "Creative", "Launch", "Optimization"];

const ProjectWorkspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { onboarding, documents } = usePortalData();
  const project = buildProjects(user, onboarding).find((item) => item.id === id) ?? buildProjects(user, onboarding)[0];

  if (!project) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="glass-card">
          <CardContent className="grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Badge className="border-0 bg-indigo-500/15 text-indigo-100">{project.status}</Badge>
              <h1 className="mt-4 text-3xl font-semibold text-white">{project.name}</h1>
              <p className="mt-3 max-w-2xl text-slate-300">{project.summary}</p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Current delivery progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Current Phase</p>
                <p className="mt-2 text-xl font-semibold text-white">{project.phase}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Primary Deliverable</p>
                <p className="mt-2 text-white">{project.deliverable}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-white">Milestone Timeline</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {milestones.map((milestone, index) => {
                const reached = index < Math.round(project.progress / 25);
                return (
                  <motion.div
                    key={milestone}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-indigo-100">
                      {reached ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{milestone}</p>
                      <p className="text-sm text-slate-400">{reached ? "In progress or completed" : "Upcoming"}</p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl text-white">Shared Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.slice(0, 4).map((document) => (
                  <div key={document.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <FileText className="h-4 w-4 text-indigo-200" />
                    <div>
                      <p className="text-sm font-medium text-white">{document.name}</p>
                      <p className="text-xs text-slate-400">{document.uploadDate}</p>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && <p className="text-sm text-slate-400">No documents attached yet.</p>}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="grid gap-4 p-6">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Target className="h-5 w-5 text-indigo-200" />
                  <div>
                    <p className="font-medium text-white">Goals captured</p>
                    <p className="text-sm text-slate-400">{onboarding.goals.goals || "Goals will appear here once onboarding is complete."}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CalendarClock className="h-5 w-5 text-indigo-200" />
                  <div>
                    <p className="font-medium text-white">Kickoff scheduling</p>
                    <p className="text-sm text-slate-400">Calendar link ready in the Book Meeting section.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectWorkspace;
