
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; // Renamed from Index
import DriverProfilesPage from "./pages/DriverProfilesPage";
import ReportIncidentPage from "./pages/ReportIncidentPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet /> {/* Nested routes will render here */}
    </main>
    {/* A simple footer could be added here if needed globally, or per page like in LandingPage */}
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
            <Route path="/auth" element={<AuthPage />} />
            {/* 
              Placeholder routes for privacy and terms, you can create these pages later 
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            */}
          </Route>
          {/* ADD ALL CUSTOM ROUTES INSIDE AppLayout or create new Layout routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

