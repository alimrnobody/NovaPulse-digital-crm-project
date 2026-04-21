import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { HelpCircle, Mail, MessageSquare } from 'lucide-react';

const Support = () => (
  <DashboardLayout>
    <div className="space-y-6 fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support</h1>
        <p className="text-muted-foreground text-sm">Need help? We're here for you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="glass-card p-6 text-center">
          <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
          <p className="text-sm text-muted-foreground">support@novapulse.com</p>
        </Card>
        <Card className="glass-card p-6 text-center">
          <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Live Chat</h3>
          <p className="text-sm text-muted-foreground">Available Mon–Fri, 9am–6pm</p>
        </Card>
      </div>

      <Card className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Send a Message</h2>
        <form onSubmit={e => { e.preventDefault(); toast.success('Message sent!'); }} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Subject</Label>
            <Input placeholder="How can we help?" className="bg-secondary/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Message</Label>
            <Textarea placeholder="Describe your issue..." className="bg-secondary/50 border-border/50 min-h-[120px]" />
          </div>
          <Button type="submit" className="gradient-button border-0">Send Message</Button>
        </form>
      </Card>
    </div>
  </DashboardLayout>
);

export default Support;
