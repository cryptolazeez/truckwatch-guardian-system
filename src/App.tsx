
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DriverProfilesPage from "./pages/DriverProfilesPage";
import ReportIncidentPage from "./pages/ReportIncidentPage";
import ViewReportsPage from "./pages/ViewReportsPage";
import AuthPage from "./pages/AuthPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import ReportReviewPage from "./pages/ReportReviewPage";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";
import ModeratorLoginPage from "./pages/ModeratorLoginPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import ModeratorDashboardPage from "./pages/ModeratorDashboardPage";
import ModeratorGuard from "./components/moderator/ModeratorGuard";

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/drivers" element={<DriverProfilesPage />} />
            <Route path="/report-incident" element={<ReportIncidentPage />} />
            <Route path="/view-reports" element={<ViewReportsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/moderator-login" element={<ModeratorLoginPage />} />
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />
            
            {/* Protected Moderator Routes */}
            <Route element={<ModeratorGuard />}>
              <Route path="/moderator-dashboard" element={<ModeratorDashboardPage />} />
              <Route path="/reports/:id" element={<ReportDetailPage />} />
              <Route path="/moderator/review/:id" element={<ReportReviewPage />} />
            </Route>

          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
