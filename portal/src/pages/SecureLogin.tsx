import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoMark from "@/components/LogoMark";
import { useAuth } from "@/contexts/AuthContext";

const SecureLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to NovaPulse.");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.28),_transparent_30%)]" />
      <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.12),_transparent_45%)] lg:block" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 lg:block">
          <div className="inline-flex items-center gap-3 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100">
            <Sparkles className="h-4 w-4" />
            Premium Digital Growth Portal
          </div>
          <h1 className="mt-8 max-w-xl text-4xl font-semibold leading-tight text-white">
            Client visibility, campaign momentum, and onboarding control in one modern slate workspace.
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-300">
            NovaPulse Digital gives clients a polished portal for onboarding, approvals, document sharing, and kickoff scheduling.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Secure credential-based access",
              "Onboarding progress that saves automatically",
              "Document uploads with webhook triggers",
              "Responsive dashboard for every device",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
          <Card className="glass-card border-white/10">
            <CardContent className="p-8 sm:p-10">
              <div className="mb-8">
                <div className="inline-flex items-center gap-3">
                  <LogoMark className="h-12 w-12" iconClassName="h-5 w-5" />
                  <div>
                    <p className="text-lg font-semibold text-white">NovaPulse Digital</p>
                    <p className="text-sm text-slate-400">Client Portal Sign In</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Work Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-indigo-300 transition hover:text-indigo-200">
                    Forgot password?
                  </Link>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Enter Portal
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Need an account?{" "}
                <Link to="/register" className="font-medium text-indigo-300 transition hover:text-indigo-200">
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SecureLogin;
