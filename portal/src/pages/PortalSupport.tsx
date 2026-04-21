import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { LifeBuoy, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PortalSupport = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subject || !message) {
      toast.error("Please add a subject and message.");
      return;
    }

    toast.success("Support request captured. Connect this form to your helpdesk when ready.");
    setSubject("");
    setMessage("");
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="glass-card">
          <CardContent className="space-y-4 p-6">
            {[
              { title: "Email Support", detail: "support@novapulsedigital.com", icon: Mail },
              { title: "Client Success", detail: "Live reply workflow ready for helpdesk integration", icon: MessageSquare },
              { title: "Escalations", detail: "Priority routing for urgent launch blockers", icon: LifeBuoy },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <item.icon className="h-5 w-5 text-indigo-200" />
                <p className="mt-4 text-lg font-medium text-white">{item.title}</p>
                <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl text-white">Send a Support Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-300">Subject</Label>
                <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="How can NovaPulse help?" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Message</Label>
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Share the issue, blocker, or request."
                  className="min-h-[180px]"
                />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PortalSupport;
