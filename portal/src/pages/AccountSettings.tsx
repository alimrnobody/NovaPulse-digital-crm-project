import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const AccountSettings = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    companyName: user?.companyName || '',
    phone: user?.phone || '',
  });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(form);
    toast.success('Settings saved!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your profile information.</p>
        </div>

        <Card className="glass-card p-6">
          <form onSubmit={save} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <Input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email</Label>
              <Input value={user?.email || ''} disabled className="bg-secondary/30 border-border/30 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Company Name</Label>
              <Input value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Phone</Label>
              <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-secondary/50 border-border/50" />
            </div>
            <Button type="submit" className="gradient-button border-0">Save Changes</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
