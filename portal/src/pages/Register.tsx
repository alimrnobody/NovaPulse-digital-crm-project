import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Lock, Mail, Phone, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import LogoMark from "@/components/LogoMark";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, companyName, phone } = form;

    // Validations
    if (!fullName || !email || !password || !companyName || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 🚀 STEP 1: Send Data to n8n Webhook
      const WEBHOOK_URL = "https://sizable2098.app.n8n.cloud/webhook-test/e37c6d2d-39b2-4902-a866-46d8b132aac1";
      
      const payload = {
        full_name: fullName,
        email: email,
        company_name: companyName,
        phone: phone,
        signup_date: new Date().toISOString(),
        source: "Client Portal Signup"
      };

      console.log("Sending to n8n:", payload);

      // Webhook call (Background)
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      .then(res => console.log("n8n Response Received:", res.status))
      .catch(err => console.error("n8n Webhook Error:", err));

      // 🚀 STEP 2: Local Auth Registration
      await register({ fullName, email, password, companyName, phone });
      
      toast.success("Account created. Welcome to NovaPulse Digital.");
      navigate("/dashboard");

    } catch (error) {
      console.error("Signup process error:", error);
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "fullName", label: "Full Name", type: "text", icon: User, placeholder: "John Doe" },
    { key: "email", label: "Work Email", type: "email", icon: Mail, placeholder: "you@company.com" },
    { key: "companyName", label: "Company Name", type: "text", icon: Building2, placeholder: "Acme Inc." },
    { key: "phone", label: "Phone Number", type: "tel", icon: Phone, placeholder: "+1 (555) 000-0000" },
    { key: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: '••••••••' },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: Lock, placeholder: '••••••••' },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_34%),linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,1))]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl"
      >
        <Card className="glass-card border-white/10">
          <CardContent className="p-8 sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <LogoMark className="h-12 w-12" iconClassName="h-5 w-5" />
              <div>
                <p className="text-lg font-semibold text-white">Create Your Client Portal</p>
                <p className="text-sm text-slate-400">NovaPulse Digital onboarding access</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              {fields.map(({ key, label, type, icon: Icon, placeholder }) => (
                <div key={key} className={key.includes("password") ? "sm:col-span-2" : ""}>
                  <Label htmlFor={key} className="mb-2 block text-slate-300">{label}</Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id={key}
                      type={type}
                      placeholder={
                        key === "password"
                          ? "Create a strong password"
                          : key === "confirmPassword"
                            ? "Repeat your password"
                            : placeholder
                      }
                      value={form[key as keyof typeof form]}
                      onChange={(event) => update(key, event.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              ))}

              <div className="sm:col-span-2">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-300 transition hover:text-indigo-200">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;