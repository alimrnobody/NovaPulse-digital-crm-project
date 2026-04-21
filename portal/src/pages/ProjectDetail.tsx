import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, FileText, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

const milestones = [
  { name: 'Strategy', done: true },
  { name: 'Design', done: true },
  { name: 'Development', done: false, current: true },
  { name: 'Review', done: false },
  { name: 'Launch', done: false },
];

const files = [
  { name: 'Wireframes_v2.pdf', date: 'Jan 20' },
  { name: 'Color_Palette.png', date: 'Jan 22' },
  { name: 'Content_Draft.docx', date: 'Jan 25' },
];

const comments = [
  { author: 'Project Manager', text: 'Design phase complete. Moving to development!', time: '2 days ago' },
  { author: 'You', text: 'Looks great, approved the wireframes.', time: '3 days ago' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState('');

  return (
    <DashboardLayout>
      <div className="space-y-8 fade-in max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Website Redesign</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge className="status-on-track text-xs border-0">On Track</Badge>
            <span className="text-sm text-muted-foreground">Project #{id}</span>
          </div>
        </div>

        {/* Milestone Timeline */}
        <Card className="glass-card p-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Project Timeline</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/50" />
            {milestones.map((m, i) => (
              <div key={m.name} className="relative flex flex-col items-center z-10">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  m.done ? 'bg-success text-success-foreground' : m.current ? 'bg-primary text-primary-foreground animate-pulse-glow' : 'bg-secondary text-muted-foreground'
                }`}>
                  {m.done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </div>
                <span className={`text-xs mt-2 ${m.current ? 'text-primary font-semibold' : m.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Files */}
          <Card className="glass-card p-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Shared Files</h2>
            <div className="space-y-3">
              {files.map(f => (
                <div key={f.name} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Comments */}
          <Card className="glass-card p-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Notes & Comments</h2>
            <div className="space-y-3 mb-4">
              {comments.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-foreground">{c.author}</span>
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." className="bg-secondary/50 border-border/50 min-h-[60px] text-sm" />
              <Button size="icon" className="gradient-button border-0 shrink-0 self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
