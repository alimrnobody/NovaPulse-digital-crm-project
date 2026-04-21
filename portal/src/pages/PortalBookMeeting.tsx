import { motion } from "framer-motion";
import { CalendarClock, ExternalLink } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortalData } from "@/contexts/PortalDataContext";

const PortalBookMeeting = () => {
  const { onboarding } = usePortalData();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
        <Card className="glass-card">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/15 text-indigo-100">
              <CalendarClock className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white">Book Your Kickoff Meeting</h1>
              <p className="mt-3 text-slate-400">
                Schedule time with the NovaPulse Digital team through your connected GoHighLevel calendar.
              </p>
            </div>
            <a href={onboarding.meeting.ghlCalendarUrl} target="_blank" rel="noreferrer">
              <Button className="min-w-[240px]">
                Open GHL Calendar
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default PortalBookMeeting;
