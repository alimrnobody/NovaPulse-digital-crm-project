import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const PortalSettings = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    companyName: user?.companyName ?? "",
    phone: user?.phone ?? "",
  });

  useEffect(() => {
    setForm({
      fullName: user?.fullName ?? "",
      companyName: user?.companyName ?? "",
      phone: user?.phone ?? "",
    });
  }, [user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUser(form);
    toast.success("Profile settings saved.");
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl text-white">Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <Input value={form.fullName} onChange={(event) => setForm((previous) => ({ ...previous, fullName: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input value={user?.email ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Company Name</Label>
                <Input value={form.companyName} onChange={(event) => setForm((previous) => ({ ...previous, companyName: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Phone</Label>
                <Input value={form.phone} onChange={(event) => setForm((previous) => ({ ...previous, phone: event.target.value }))} />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default PortalSettings;
