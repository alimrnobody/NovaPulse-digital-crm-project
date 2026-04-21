import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoMark from "@/components/LogoMark";

const ResetAccess = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      toast.error("Enter your work email to continue.");
      return;
    }

    setSent(true);
    toast.success("Reset instructions prepared.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="glass-card border-white/10">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <LogoMark className="h-12 w-12" iconClassName="h-5 w-5" />
              <div>
                <p className="text-lg font-semibold text-white">Reset Access</p>
                <p className="text-sm text-slate-400">Password reset UI is ready for backend integration</p>
              </div>
            </div>

            {sent ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-200">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="text-slate-200">Reset instructions are ready for {email}.</p>
                <p className="text-sm text-slate-400">
                  Connect this screen to your real password reset service or auth provider.
                </p>
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200">
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Prepare Reset Instructions
                </Button>
                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-200">
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetAccess;
