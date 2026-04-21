import type { ReactNode } from "react";

import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const initials = user?.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_34%),linear-gradient(180deg,_rgba(15,23,42,0.95),_rgba(2,6,23,1))]" />
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white" />
              <div>
                <p className="text-sm font-medium text-white">NovaPulse Digital</p>
                <p className="text-xs text-slate-400">Client delivery workspace</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-100">{user?.companyName}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <Avatar className="h-9 w-9 border border-indigo-400/30">
                <AvatarFallback className="bg-indigo-500/20 text-xs font-semibold text-indigo-100">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="w-full">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
