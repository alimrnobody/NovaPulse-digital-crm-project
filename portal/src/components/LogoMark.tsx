import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  iconClassName?: string;
}

const LogoMark = ({ className, iconClassName }: LogoMarkProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.04, rotate: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/15",
        "bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.34),transparent_30%),linear-gradient(135deg,rgba(129,140,248,0.95),rgba(56,189,248,0.85)_45%,rgba(244,114,182,0.88)_100%)]",
        "shadow-[0_14px_40px_rgba(56,189,248,0.18),0_10px_26px_rgba(129,140,248,0.24)]",
        className,
      )}
    >
      <div className="absolute inset-[1px] rounded-[1.2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_35%),linear-gradient(145deg,rgba(15,23,42,0.2),rgba(15,23,42,0.55))]" />
      <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-fuchsia-300/70 blur-md" />
      <div className="absolute -bottom-2 -left-2 h-5 w-5 rounded-full bg-sky-300/70 blur-md" />
      <Sparkles className={cn("relative z-10 h-5 w-5 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]", iconClassName)} />
    </motion.div>
  );
};

export default LogoMark;
