import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MeetingRoom from "./pages/MeetingRoom";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import TestPortal from "./pages/TestPortal";
import Sessions from "./pages/Sessions";

import OTP from "./pages/OTP";
import AboutUs from "./pages/AboutUs";
import CreateSwap from "./pages/CreateSwap";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify" element={<OTP />} />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/profile"
              element={(
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/resume"
              element={(
                <ProtectedRoute>
                  <Resume />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/test-portal"
              element={(
                <ProtectedRoute>
                  <TestPortal />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/sessions"
              element={(
                <ProtectedRoute>
                  <Sessions />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/meetings"
              element={(
                <ProtectedRoute>
                  <MeetingRoom />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/swaps"
              element={(
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              )}
            />

            <Route
              path="/create-swap"
              element={(
                <ProtectedRoute>
                  <CreateSwap />
                </ProtectedRoute>
              )}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
