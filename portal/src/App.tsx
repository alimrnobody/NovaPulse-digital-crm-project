import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { PortalDataProvider } from "@/contexts/PortalDataContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SecureLogin from "./pages/SecureLogin";
import Register from "./pages/Register";
import ResetAccess from "./pages/ResetAccess";
import Dashboard from "./pages/Dashboard";
import OnboardingWizard from "./pages/OnboardingWizard";
import PortalDocumentsPage from "./pages/PortalDocumentsPage";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import PortalBookMeeting from "./pages/PortalBookMeeting";
import PortalSupport from "./pages/PortalSupport";
import PortalSettings from "./pages/PortalSettings";
import PortalNotFound from "./pages/PortalNotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <PortalDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<SecureLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ResetAccess />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><PortalDocumentsPage /></ProtectedRoute>} />
              <Route path="/project/:id" element={<ProtectedRoute><ProjectWorkspace /></ProtectedRoute>} />
              <Route path="/book-meeting" element={<ProtectedRoute><PortalBookMeeting /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><PortalSupport /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><PortalSettings /></ProtectedRoute>} />
              <Route path="*" element={<PortalNotFound />} />
            </Routes>
          </BrowserRouter>
        </PortalDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
