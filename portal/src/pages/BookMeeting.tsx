import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Calendar, ExternalLink } from 'lucide-react';

const BookMeeting = () => (
  <DashboardLayout>
    <div className="space-y-6 fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Book a Meeting</h1>
        <p className="text-muted-foreground text-sm">Schedule time with your project manager.</p>
      </div>
      <Card className="glass-card p-12 text-center">
        <Calendar className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Schedule a Call</h2>
        <p className="text-muted-foreground mb-6">Pick a time that works for you.</p>
        <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 gradient-button px-6 py-3 rounded-lg">
          Open Calendar <ExternalLink className="h-4 w-4" />
        </a>
      </Card>
    </div>
  </DashboardLayout>
);

export default BookMeeting;
