import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // Define routes where incomplete profile users are allowed to go
  const isProfileRoute = location.pathname.startsWith("/profile");
  const isResumeRoute = location.pathname.startsWith("/resume");

  if (!isProfileRoute && !isResumeRoute) {
    const { profile: hasProfile, hasResume } = useAuth();

    // 1. Check Profile Completion
    const isProfileComplete = hasProfile &&
      hasProfile.firstName &&
      hasProfile.skills &&
      hasProfile.skillsToLearn;

    if (!isProfileComplete) {
      // Redirect to profile to force them to complete onboarding
      return <Navigate to="/profile" replace state={{ alert: "Please complete your profile first." }} />;
    }

    // 2. Check Resume Completion
    if (!hasResume) {
      // Redirect to resume if they haven't added any experience
      return <Navigate to="/resume" replace state={{ alert: "Please add your Experience to your Resume." }} />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
