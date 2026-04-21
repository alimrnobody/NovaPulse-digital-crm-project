import { motion } from "framer-motion";
import { FileText, Trash2, Upload } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortalData } from "@/contexts/PortalDataContext";

const PortalDocumentsPage = () => {
  const { documents, uploadDocuments, removeDocument } = usePortalData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Document Management</h1>
            <p className="mt-2 text-slate-400">Upload campaign files, briefs, reports, and client assets.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/20">
            <Upload className="h-4 w-4" />
            Upload Files
            <input
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
              onChange={(event) => {
                void uploadDocuments(event.target.files, "documents");
              }}
            />
          </label>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl text-white">Portal Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center">
                <FileText className="mx-auto h-10 w-10 text-slate-500" />
                <p className="mt-4 text-lg font-medium text-white">No documents uploaded yet.</p>
                <p className="mt-2 text-sm text-slate-400">Use the upload button to add files to this client workspace.</p>
              </div>
            ) : (
              documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-100">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{document.name}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {document.type} · Uploaded {document.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="border-0 bg-white/10 text-slate-200">{document.status}</Badge>
                    <button
                      type="button"
                      onClick={() => removeDocument(document.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PortalDocumentsPage;
