import { useState, useEffect } from "react";
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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sessionApi, Session } from "@/lib/api";
import { toast } from "sonner";

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
  const [incomingRequests, setIncomingRequests] = useState<Session[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<Session[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await sessionApi.getMySessions();

      const incoming = data.filter((s: Session) => s.status === 'REQUESTED' && s.role === 'TEACHER');
      const outgoing = data.filter((s: Session) => s.status === 'REQUESTED' && s.role === 'LEARNER');

      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (sessionId: number, status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED') => {
    try {
      await sessionApi.updateSessionStatus(sessionId, status);
      toast.success(`Request ${status.toLowerCase()}`);
      fetchSessions(); // Refresh
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white text-black p-6 lg:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2 border-b border-black/10 pb-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>Overview</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Welcome back, <span className="italic font-light text-gray-500">{profile?.firstName || "Learner"}</span>
            </h1>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
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
          </motion.div>

          {/* Requests Section */}
          {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Incoming Requests (I am Teacher) */}
              {incomingRequests.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <h2 className="font-serif text-3xl font-bold flex items-center gap-3">
                      Received Requests
                      <span className="text-xs bg-black text-white px-3 py-1 rounded-full font-sans tracking-widest">{incomingRequests.length}</span>
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {incomingRequests.map((req) => (
                      <div key={req.sessionId} className="bg-white p-6 border border-gray-100 hover:border-black/20 shadow-sm transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif text-sm">
                              {req.partnerName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{req.partnerName}</h3>
                              <p className="text-xs uppercase tracking-widest text-gray-500">Wants to learn</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono opacity-50">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="mb-6">
                          <div className="text-2xl font-serif font-bold italic">{req.skillName}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={() => handleAction(req.sessionId, 'ACCEPTED')}
                            className="bg-black text-white hover:bg-gray-800 rounded-none text-xs uppercase tracking-widest"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleAction(req.sessionId, 'REJECTED')}
                            variant="outline"
                            className="border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-none text-xs uppercase tracking-widest"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outgoing Requests (I am Learner) */}
              {outgoingRequests.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <h2 className="font-serif text-3xl font-bold flex items-center gap-3">
                      Sent Requests
                      <span className="text-xs bg-gray-200 text-black px-3 py-1 rounded-full font-sans tracking-widest">{outgoingRequests.length}</span>
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {outgoingRequests.map((req) => (
                      <div key={req.sessionId} className="bg-gray-50 p-6 border border-gray-100 hover:border-black/20 transition-all group opacity-80 hover:opacity-100">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-serif text-sm">
                              {req.partnerName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{req.partnerName}</h3>
                              <p className="text-xs uppercase tracking-widest text-gray-500">You want to learn</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono opacity-50">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="mb-6">
                          <div className="text-2xl font-serif font-bold italic text-gray-600">{req.skillName}</div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <Button
                            onClick={() => handleAction(req.sessionId, 'CANCELLED')}
                            variant="outline"
                            className="border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-none text-xs uppercase tracking-widest"
                          >
                            Cancel Request
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Recommended Swaps */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-3xl font-bold">Recommended Matches</h2>
                <Button variant="link" className="text-sm uppercase tracking-widest text-black hover:text-gray-500" onClick={() => navigate('/create-swap')}>
                  View All <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="grid gap-6">
                {recommendedSwaps.map((swap, index) => (
                  <motion.div
                    key={swap.name}
                    variants={itemVariants}
                    className="group relative bg-gray-50 p-8 hover:bg-black hover:text-white transition-all duration-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 text-black flex items-center justify-center font-serif text-lg">
                          {swap.avatar}
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-bold mb-1">{swap.name}</h3>
                          <div className="text-xs uppercase tracking-widest opacity-60">
                            Teaches {swap.teaches} • Wants {swap.wants}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-mono">{swap.rating}</span>
                        </div>
                        <div className="text-xs opacity-50">{swap.available}</div>
                      </div>
                    </div>

                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                      <Button className="bg-white text-black hover:bg-gray-200 rounded-none px-6">
                        Request Swap
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div variants={itemVariants} className="space-y-12">
              {/* Active Sessions */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold border-b border-black/10 pb-4">In Progress</h2>
                <div className="space-y-6">
                  {activeSessions.map((session) => (
                    <div key={session.skill} className="space-y-2 group cursor-pointer">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Target</div>
                          <div className="font-serif text-lg font-bold">{session.skill}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">with {session.partner}</div>
                        </div>
                      </div>
                      <Progress value={session.progress} className="h-1 bg-gray-100" />
                      <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.nextSession}</span>
                        <span>{session.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold border-b border-black/10 pb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center gap-4 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all rounded-none"
                    onClick={() => navigate("/create-swap")}
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-xs uppercase tracking-widest">Create Swap</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center gap-4 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all rounded-none"
                  >
                    <Calendar className="w-6 h-6" />
                    <span className="text-xs uppercase tracking-widest">Schedule</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
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
  <div className="bg-white p-8 hover:bg-black hover:text-white transition-colors duration-500 group">
    <div className="flex items-start justify-between mb-8">
      <Icon className="w-6 h-6 opacity-50 group-hover:opacity-100" />
      <span className="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100">{trend}</span>
    </div>
    <div>
      <div className="font-serif text-4xl font-bold mb-1">{value}</div>
      <div className="text-xs uppercase tracking-widest opacity-50">{label}</div>
    </div>
  </div>
);

export default Dashboard;
