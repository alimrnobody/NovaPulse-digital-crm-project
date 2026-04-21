import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Lock, Mail, Phone, Sparkles, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoMark from "@/components/LogoMark";
import { useAuth } from "@/contexts/AuthContext";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const SecureRegister = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { fullName, email, companyName, phone, password, confirmPassword } = form;

    if (!fullName || !email || !companyName || !phone || !password) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be 8+ characters with an uppercase letter, number, and symbol.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({ fullName, email, companyName, phone, password });
      toast.success("Account created. Let's start onboarding.");
      navigate("/onboarding");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "fullName", label: "Full Name", icon: UserRound, type: "text", placeholder: "Amna Ali" },
    { id: "email", label: "Work Email", icon: Mail, type: "email", placeholder: "you@company.com" },
    { id: "companyName", label: "Company", icon: Building2, type: "text", placeholder: "NovaPulse Client" },
    { id: "phone", label: "Phone", icon: Phone, type: "tel", placeholder: "+1 (555) 123-4567" },
    { id: "password", label: "Password", icon: Lock, type: "password", placeholder: "Create a strong password" },
    { id: "confirmPassword", label: "Confirm Password", icon: Lock, type: "password", placeholder: "Repeat your password" },
  ] as const;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.28),_transparent_30%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-2xl"
      >
        <Card className="glass-card border-white/10">
          <CardContent className="p-8 sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <LogoMark className="h-12 w-12" iconClassName="h-5 w-5" />
              <div>
                <p className="text-lg font-semibold text-white">Create Your Client Portal</p>
                <p className="text-sm text-slate-400">Set up secure access for NovaPulse Digital</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              {fields.map(({ id, label, icon: Icon, type, placeholder }) => (
                <div key={id} className={id.includes("password") ? "sm:col-span-2" : ""}>
                  <Label htmlFor={id} className="mb-2 block text-slate-300">
                    {label}
                  </Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id={id}
                      type={type}
                      placeholder={placeholder}
                      value={form[id]}
                      onChange={(event) => updateField(id, event.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              ))}

              <div className="sm:col-span-2">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating account..." : "Create Account"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </motion.div>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have access?{" "}
              <Link to="/login" className="font-medium text-indigo-300 transition hover:text-indigo-200">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SecureRegister;
