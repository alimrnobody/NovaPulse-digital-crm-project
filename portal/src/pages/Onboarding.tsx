import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Zap, ArrowLeft, ArrowRight, Check, Upload, X, Calendar } from 'lucide-react';

const STEPS = ['Company Info', 'Services', 'Documents', 'Goals & Timeline', 'Kickoff Call'];

const SERVICES = ['SEO', 'PPC', 'Social Media', 'Web Design', 'Branding', 'Content Marketing'];
const INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Real Estate', 'Other'];
const TEAM_SIZES = ['1–5', '6–20', '21–50', '50+'];
const TIMELINES = ['1 month', '3 months', '6 months', 'Ongoing'];
const BUDGETS = ['$1K–$3K', '$3K–$5K', '$5K–$10K', '$10K+'];

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

interface OnboardingData {
  websiteUrl: string;
  industry: string;
  teamSize: string;
  description: string;
  services: string[];
  files: File[];
  goals: string;
  timeline: string;
  budget: string;
}

const Onboarding = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(user?.onboardingStep || 0);
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('novapulse_onboarding');
    return saved ? { ...JSON.parse(saved), files: [] } : {
      websiteUrl: '', industry: '', teamSize: '', description: '',
      services: [], files: [], goals: '', timeline: '', budget: '',
    };
  });

  const save = useCallback((d: OnboardingData) => {
    const { files, ...rest } = d;
    localStorage.setItem('novapulse_onboarding', JSON.stringify(rest));
  }, []);

  const update = (field: string, value: OnboardingData[keyof OnboardingData]) => {
    const next = { ...data, [field]: value };
    setData(next);
    save(next);
  };

  const triggerStepWebhook = (stepNum: number) => {
    console.log(`[Webhook] onboarding_step:`, {
      email: user?.email,
      step: stepNum + 1,
      data: { ...data, files: data.files.map(f => f.name) },
    });
  };

  const next = () => {
    if (step === 0 && (!data.industry || !data.teamSize)) {
      toast.error('Please fill in required fields');
      return;
    }
    if (step === 1 && data.services.length === 0) {
      toast.error('Please select at least one service');
      return;
    }
    triggerStepWebhook(step);
    const nextStep = step + 1;
    setStep(nextStep);
    updateUser({ onboardingStep: nextStep });
  };

  const prev = () => setStep(s => Math.max(0, s - 1));

  const finish = () => {
    triggerStepWebhook(4);
    updateUser({ onboardingComplete: true, onboardingStep: 5 });
    localStorage.removeItem('novapulse_onboarding');
    toast.success('Onboarding complete! 🎉');
    navigate('/dashboard');
  };

  const toggleService = (s: string) => {
    const next = data.services.includes(s)
      ? data.services.filter(x => x !== s)
      : [...data.services, s];
    update('services', next);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    if (data.files.length + newFiles.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }
    for (const f of newFiles) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        toast.error(`${f.name}: Unsupported file type`);
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`${f.name}: File too large (max 10MB)`);
        return;
      }
    }
    update('files', [...data.files, ...newFiles]);
    // Webhook per file
    newFiles.forEach(f => {
      console.log(`[Webhook] file_upload:`, {
        email: user?.email, fileName: f.name, type: f.type, size: f.size,
      });
    });
  };

  const removeFile = (i: number) => update('files', data.files.filter((_, idx) => idx !== i));

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">NovaPulse</span>
          </div>
          <p className="text-muted-foreground text-sm">Let's get you set up — Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-2 px-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div className={`h-2 w-full rounded-full ${i <= step ? 'bg-primary' : 'bg-secondary'} transition-colors`} />
              <span className={`text-[10px] mt-1 ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 mt-4">
          {/* Step 0: Company Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-foreground">Company Information</h2>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Website URL</Label>
                <Input value={data.websiteUrl} onChange={e => update('websiteUrl', e.target.value)} placeholder="https://yourcompany.com" className="bg-secondary/50 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Industry *</Label>
                <Select value={data.industry} onValueChange={v => update('industry', v)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>{INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Team Size *</Label>
                <Select value={data.teamSize} onValueChange={v => update('teamSize', v)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue placeholder="Select size" /></SelectTrigger>
                  <SelectContent>{TEAM_SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Business Description</Label>
                <Textarea value={data.description} onChange={e => update('description', e.target.value)} placeholder="Tell us about your business..." className="bg-secondary/50 border-border/50 min-h-[100px]" />
              </div>
            </div>
          )}

          {/* Step 1: Services */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-foreground">Select Services</h2>
              <p className="text-sm text-muted-foreground">Choose the services you're interested in.</p>
              <div className="grid grid-cols-2 gap-3">
                {SERVICES.map(s => (
                  <label
                    key={s}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      data.services.includes(s) ? 'border-primary bg-primary/5' : 'border-border/50 bg-secondary/30 hover:border-border'
                    }`}
                  >
                    <Checkbox checked={data.services.includes(s)} onCheckedChange={() => toggleService(s)} />
                    <span className="text-sm text-foreground">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-foreground">Upload Documents</h2>
              <p className="text-sm text-muted-foreground">Share relevant files (PDF, PNG, JPG, DOCX, XLSX — max 10MB each, up to 5 files).</p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl p-8 cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload or drag & drop</span>
                <input type="file" className="hidden" multiple accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx" onChange={e => handleFiles(e.target.files)} />
              </label>
              {data.files.length > 0 && (
                <div className="space-y-2">
                  {data.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-2">
                      <span className="text-sm text-foreground truncate">{f.name}</span>
                      <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-foreground">Goals & Timeline</h2>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Goals</Label>
                <Textarea value={data.goals} onChange={e => update('goals', e.target.value)} placeholder="What do you want to achieve?" className="bg-secondary/50 border-border/50 min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Timeline</Label>
                <Select value={data.timeline} onValueChange={v => update('timeline', v)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue placeholder="Select timeline" /></SelectTrigger>
                  <SelectContent>{TIMELINES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Budget Range</Label>
                <Select value={data.budget} onValueChange={v => update('budget', v)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue placeholder="Select budget" /></SelectTrigger>
                  <SelectContent>{BUDGETS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Kickoff */}
          {step === 4 && (
            <div className="space-y-5 text-center">
              <h2 className="text-xl font-semibold text-foreground">Book Your Kickoff Call</h2>
              <div className="bg-secondary/30 rounded-xl p-8 border border-border/50">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Schedule a kickoff meeting with your project manager.</p>
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 gradient-button px-6 py-2.5 rounded-lg text-sm"
                >
                  Open Calendar <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
            <Button variant="ghost" onClick={prev} disabled={step === 0} className="text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} className="gradient-button border-0">
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={finish} className="gradient-button border-0">
                <Check className="h-4 w-4 mr-2" /> Complete Setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
