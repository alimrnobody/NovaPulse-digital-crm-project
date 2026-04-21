import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Download, Trash2, FileText, Image, FileSpreadsheet, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Doc {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'Approved' | 'Pending' | 'Under Review';
}

const ALLOWED = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const MAX_SIZE = 10 * 1024 * 1024;

const initialDocs: Doc[] = [
  { id: '1', name: 'Brand_Guidelines.pdf', type: 'PDF', size: 2400000, uploadDate: '2024-01-15', status: 'Approved' },
  { id: '2', name: 'Logo_Pack.png', type: 'PNG', size: 850000, uploadDate: '2024-01-18', status: 'Approved' },
  { id: '3', name: 'SEO_Report.xlsx', type: 'XLSX', size: 1200000, uploadDate: '2024-01-20', status: 'Under Review' },
  { id: '4', name: 'Content_Strategy.docx', type: 'DOCX', size: 340000, uploadDate: '2024-01-22', status: 'Pending' },
];

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText, PNG: Image, JPG: Image, JPEG: Image, XLSX: FileSpreadsheet, XLS: FileSpreadsheet, DOCX: FileText, DOC: FileText,
};

const statusStyle: Record<string, string> = {
  Approved: 'bg-success/10 text-success border-0',
  Pending: 'bg-warning/10 text-warning border-0',
  'Under Review': 'bg-primary/10 text-primary border-0',
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const Documents = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>(initialDocs);

  const handleUpload = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach(f => {
      if (!ALLOWED.includes(f.type)) { toast.error(`${f.name}: Unsupported type`); return; }
      if (f.size > MAX_SIZE) { toast.error(`${f.name}: Too large (max 10MB)`); return; }
      const ext = f.name.split('.').pop()?.toUpperCase() || 'FILE';
      const newDoc: Doc = {
        id: crypto.randomUUID(),
        name: f.name,
        type: ext,
        size: f.size,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };
      setDocs(prev => [newDoc, ...prev]);
      toast.success(`${f.name} uploaded`);
      console.log('[Webhook] file_upload:', { email: user?.email, fileName: f.name, type: f.type, size: f.size });
    });
  };

  const deleteDoc = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    toast.success('File deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
            <p className="text-muted-foreground text-sm">Manage your project files</p>
          </div>
          <label>
            <input type="file" className="hidden" multiple accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx" onChange={e => handleUpload(e.target.files)} />
            <span className="inline-flex items-center gap-2 gradient-button px-4 py-2 rounded-lg text-sm cursor-pointer">
              <Upload className="h-4 w-4" /> Upload
            </span>
          </label>
        </div>

        <Card className="glass-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-5">File Name</div>
            <div className="col-span-1 hidden md:block">Type</div>
            <div className="col-span-1 hidden md:block">Size</div>
            <div className="col-span-2 hidden sm:block">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Actions</div>
          </div>

          {docs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No documents yet. Upload your first file!</p>
            </div>
          ) : (
            docs.map(doc => {
              const Icon = typeIcons[doc.type] || FileText;
              return (
                <div key={doc.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/30 items-center hover:bg-secondary/20 transition-colors">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground truncate">{doc.name}</span>
                  </div>
                  <div className="col-span-1 hidden md:block text-xs text-muted-foreground">{doc.type}</div>
                  <div className="col-span-1 hidden md:block text-xs text-muted-foreground">{formatSize(doc.size)}</div>
                  <div className="col-span-2 hidden sm:block text-xs text-muted-foreground">{doc.uploadDate}</div>
                  <div className="col-span-2">
                    <Badge className={`${statusStyle[doc.status]} text-xs`}>{doc.status}</Badge>
                  </div>
                  <div className="col-span-1 flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors" title="Download">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deleteDoc(doc.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
