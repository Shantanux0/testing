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
  Sparkles,
  Plus
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

// Removed static activeSessions mock in favor of dynamic state

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<Session[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<Session[]>([]);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await sessionApi.getMySessions();
      const sessions = Array.isArray(data) ? data : [];
      const incoming = sessions.filter((s: Session) => s.status === 'REQUESTED' && s.role === 'TEACHER');
      const outgoing = sessions.filter((s: Session) => s.status === 'REQUESTED' && s.role === 'LEARNER');
      const accepted = sessions.filter((s: Session) => s.status === 'ACCEPTED');

      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
      setActiveSessions(accepted);
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
          <motion.div variants={itemVariants} className="space-y-2 border-b border-black/10 pb-6 md:pb-8">
            <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-400">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <span>Overview</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
              Welcome back, <span className="italic font-light text-gray-500">{profile?.firstName || "Learner"}</span>
            </h1>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
            <StatCard
              icon={Users}
              label="Total Swaps"
              value="24"
              trend="+3 wk"
            />
            <StatCard
              icon={Clock}
              label="Hours"
              value="48h"
              trend="+5h wk"
            />
            <StatCard
              icon={Star}
              label="Rating"
              value="4.9"
              trend="Top 5%"
            />
            <StatCard
              icon={Target}
              label="Skills"
              value="8"
              trend="+2 mo"
            />
          </motion.div>

          {/* Requests Section */}
          {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Incoming Requests (I am Teacher) */}
              {incomingRequests.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold flex items-center gap-3">
                      Received
                      <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-sans tracking-widest">{incomingRequests.length}</span>
                    </h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {incomingRequests.map((req) => (
                      <div key={req.sessionId} className="bg-white p-5 md:p-6 border border-gray-100 hover:border-black/20 shadow-sm transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black text-white flex items-center justify-center font-serif text-xs md:text-sm">
                              {(req.partnerName || "?").charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-sm md:text-base truncate">{req.partnerName}</h3>
                              <p className="text-[9px] md:text-xs uppercase tracking-widest text-gray-500">Wants to learn</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono opacity-50">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="mb-6">
                          <div className="text-xl md:text-2xl font-serif font-bold italic truncate">{req.skillName}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <Button
                            onClick={() => handleAction(req.sessionId, 'ACCEPTED')}
                            className="bg-black text-white hover:bg-gray-800 rounded-none text-[10px] uppercase tracking-widest h-9"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleAction(req.sessionId, 'REJECTED')}
                            variant="outline"
                            className="border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-none text-[10px] uppercase tracking-widest h-9"
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
                    <h2 className="font-serif text-2xl md:text-3xl font-bold flex items-center gap-3">
                      Sent
                      <span className="text-[10px] bg-gray-200 text-black px-2 py-0.5 rounded-full font-sans tracking-widest">{outgoingRequests.length}</span>
                    </h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {outgoingRequests.map((req) => (
                      <div key={req.sessionId} className="bg-gray-50 p-5 md:p-6 border border-gray-100 hover:border-black/20 transition-all group opacity-80 hover:opacity-100">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-serif text-xs md:text-sm">
                              {(req.partnerName || "?").charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-sm md:text-base truncate">{req.partnerName}</h3>
                              <p className="text-[9px] md:text-xs uppercase tracking-widest text-gray-500">You want to learn</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono opacity-50">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="mb-6">
                          <div className="text-xl md:text-2xl font-serif font-bold italic text-gray-600 truncate">{req.skillName}</div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            onClick={() => handleAction(req.sessionId, 'CANCELLED')}
                            variant="outline"
                            className="border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-none text-[10px] uppercase tracking-widest h-9"
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
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Recommended Swaps */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl md:text-3xl font-bold">Recommendations</h2>
                <Button variant="link" className="text-[10px] md:text-sm uppercase tracking-widest text-black hover:text-gray-500 p-0" onClick={() => navigate('/create-swap')}>
                  View All <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                </Button>
              </div>

              <div className="grid gap-4 md:gap-6">
                {recommendedSwaps.map((swap, index) => (
                  <motion.div
                    key={swap.name}
                    variants={itemVariants}
                    className="group relative bg-gray-50 p-6 md:p-8 hover:bg-black hover:text-white transition-all duration-500"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 text-black flex items-center justify-center font-serif text-base md:text-lg">
                          {swap.avatar}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg md:text-xl font-bold mb-1">{swap.name}</h3>
                          <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-60 leading-relaxed">
                            Teaches {swap.teaches} <br className="sm:hidden" />
                            <span className="hidden sm:inline"> • </span> Wants {swap.wants}
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                        <div className="flex items-center gap-1 sm:justify-end mb-1">
                          <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                          <span className="font-mono text-xs md:text-sm">{swap.rating}</span>
                        </div>
                        <div className="text-[10px] opacity-50">{swap.available}</div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-0 sm:absolute sm:bottom-8 sm:right-8 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 sm:translate-x-4 sm:group-hover:translate-x-0">
                      <Button className="w-full sm:w-auto bg-black text-white group-hover:bg-white group-hover:text-black hover:bg-gray-200 rounded-none px-6 h-10 text-[10px] uppercase tracking-widest">
                        Request Swap
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div variants={itemVariants} className="space-y-8 md:space-y-12">
              {/* Active Sessions */}
              <div className="space-y-6">
                <h2 className="font-serif text-xl md:text-2xl font-bold border-b border-black/10 pb-4 italic">In Progress</h2>
                <div className="space-y-6 px-1">
                  {activeSessions.length === 0 ? (
                    <div className="text-gray-400 text-xs border border-dashed border-gray-200 p-8 text-center italic leading-relaxed">
                      No active sessions yet. <br /> Accept a request to start!
                    </div>
                  ) : activeSessions.map((session) => (
                    <div key={session.sessionId} className="space-y-4 group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                            {session.role === 'TEACHER' ? 'Teaching' : 'Learning'}
                          </div>
                          <div className="font-serif text-lg font-bold truncate pr-4">{session.skillName}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-gray-500 mb-2 italic">with {session.partnerName}</div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const params = new URLSearchParams({
                                  sessionId: String(session.sessionId),
                                  role: session.role,
                                  skill: session.skillName,
                                  partner: session.partnerName,
                                });
                                window.open(`/teaching-room?${params}`, "_blank");
                              }}
                              className="h-8 md:h-7 text-[9px] md:text-[10px] uppercase tracking-[0.2em] rounded-none bg-green-600 text-white hover:bg-green-700 px-4"
                            >
                              Join Room
                            </Button>
                            <Button
                              onClick={() => navigate('/messages')}
                              className="h-8 md:h-7 text-[9px] md:text-[10px] uppercase tracking-[0.2em] rounded-none bg-black text-white hover:bg-gray-800 px-4"
                            >
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-[1px] mt-2"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h2 className="font-serif text-xl md:text-2xl font-bold border-b border-black/10 pb-4 italic tracking-tight">Quick Links</h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <Button
                    variant="outline"
                    className="h-28 md:h-32 flex flex-col items-center justify-center gap-3 border-gray-100 hover:border-black hover:bg-black hover:text-white transition-all rounded-none p-4"
                    onClick={() => navigate("/create-swap")}
                  >
                    <Plus className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-center leading-tight">Create <br /> Swap</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-28 md:h-32 flex flex-col items-center justify-center gap-3 border-gray-100 hover:border-black hover:bg-black hover:text-white transition-all rounded-none p-4"
                  >
                    <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-center leading-tight">Class <br /> Schedule</span>
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
