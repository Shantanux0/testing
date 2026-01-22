import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock,
  Star,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const recommendedSwaps = [
  {
    name: "Sarah Chen",
    teaches: "React",
    wants: "Python",
    rating: 4.9,
    avatar: "SC",
    available: "Today",
  },
  {
    name: "Mike Johnson",
    teaches: "UI/UX Design",
    wants: "JavaScript",
    rating: 4.8,
    avatar: "MJ",
    available: "Tomorrow",
  },
  {
    name: "Emily Davis",
    teaches: "Data Science",
    wants: "Web Dev",
    rating: 5.0,
    avatar: "ED",
    available: "This Week",
  },
];

const activeSessions = [
  {
    skill: "Machine Learning",
    partner: "Alex Kim",
    progress: 65,
    nextSession: "Today, 3:00 PM",
  },
  {
    skill: "TypeScript",
    partner: "Jordan Lee",
    progress: 40,
    nextSession: "Thu, 2:00 PM",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{profile?.firstName || "Learner"}</span>
          </h1>
          <p className="text-muted-foreground">
            Ready to learn something new today?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Total Swaps"
            value="24"
            trend="+3 this week"
          />
          <StatCard
            icon={Clock}
            label="Learning Hours"
            value="48h"
            trend="+5h this week"
          />
          <StatCard
            icon={Star}
            label="Avg Rating"
            value="4.9"
            trend="Top 5%"
          />
          <StatCard
            icon={Target}
            label="Skills Learned"
            value="8"
            trend="+2 this month"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recommended Swaps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold">
                  Recommended Swaps
                </h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {recommendedSwaps.map((swap, index) => (
                  <motion.div
                    key={swap.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {swap.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{swap.name}</span>
                        <div className="flex items-center text-amber-400 text-sm">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="ml-1">{swap.rating}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Teaches <span className="text-primary">{swap.teaches}</span>
                        {" • "}
                        Wants <span className="text-foreground">{swap.wants}</span>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">Available</span>
                      <span className="text-sm text-primary">{swap.available}</span>
                    </div>

                    {/* Action */}
                    <Button size="sm" className="glow-button shrink-0">
                      Swap
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Active Learning
              </h2>

              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{session.skill}</span>
                      <span className="text-xs text-muted-foreground">
                        with {session.partner}
                      </span>
                    </div>
                    <Progress value={session.progress} className="h-2" />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{session.nextSession}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h2 className="font-display text-lg font-semibold mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => navigate("/find-swap")}
                >
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-xs">Find Partner</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                >
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-xs">Schedule</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-xs">Progress</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                >
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-xs">Reviews</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
}

const StatCard = ({ icon: Icon, label, value, trend }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card p-4"
  >
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-xs text-primary">{trend}</span>
    </div>
    <div className="text-2xl font-display font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
);

export default Dashboard;
