import { LayoutDashboard, LogOut, Settings } from "lucide-react";

import { NavLink } from "@/components/NavLink";
import LogoMark from "@/components/LogoMark";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Account Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl"
    >
      <SidebarHeader className="border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <LogoMark className="h-10 w-10 shrink-0" iconClassName="h-5 w-5 shrink-0" />
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">NovaPulse</p>
              <p className="text-xs text-slate-400">Digital client portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-slate-300 transition-all hover:border-white/10 hover:bg-white/5 hover:text-white"
                      activeClassName="border-indigo-400/20 bg-indigo-500/15 text-white shadow-[0_0_20px_rgba(99,102,241,0.18)]"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-slate-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
