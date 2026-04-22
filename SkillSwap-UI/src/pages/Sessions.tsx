import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { sessionApi, profileApi, Session, UserProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Calendar, User, BookOpen, CheckCircle2, XCircle, Clock, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    loadSessions();
    loadProfiles();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await sessionApi.getMySessions();
      setSessions(data);
    } catch (error) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const loadProfiles = async () => {
    try {
      if (searchKeyword.trim()) {
        const result = await profileApi.searchProfiles(searchKeyword.trim(), 0, 20);
        setProfiles(result.content);
      }
    } catch (error) {
      toast.error("Failed to search profiles");
    }
  };

  const handleRequestSession = async () => {
    if (!selectedTeacherId || !selectedSkill.trim()) {
      toast.error("Please select a teacher and enter a skill");
      return;
    }

    setRequesting(true);
    try {
      await sessionApi.requestSession(selectedTeacherId, selectedSkill.trim());
      await loadSessions();
      setRequestDialogOpen(false);
      setSelectedTeacherId(null);
      setSelectedSkill("");
      toast.success("Session requested successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to request session");
    } finally {
      setRequesting(false);
    }
  };

  const handleUpdateStatus = async (sessionId: number, status: string) => {
    try {
      await sessionApi.updateSessionStatus(sessionId, status);
      await loadSessions();
      toast.success("Session status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update session status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive"; icon: any }> = {
      REQUESTED: { variant: "secondary", icon: Clock },
      ACCEPTED: { variant: "default", icon: CheckCircle2 },
      REJECTED: { variant: "destructive", icon: XCircle },
      COMPLETED: { variant: "default", icon: CheckCircle2 },
      CANCELLED: { variant: "destructive", icon: XCircle },
    };

    const config = statusConfig[status] || { variant: "secondary", icon: Clock };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const pendingSessions = sessions.filter((s) => s.status === "REQUESTED");
  const activeSessions = sessions.filter((s) => s.status === "ACCEPTED");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");
  const otherSessions = sessions.filter(
    (s) => !["REQUESTED", "ACCEPTED", "COMPLETED"].includes(s.status)
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="text-center">Loading sessions...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tighter">Sessions</h1>
          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto rounded-none bg-black text-white uppercase tracking-widest text-xs h-12 px-8">
                <Plus className="w-4 h-4 mr-2" />
                Request Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request a Learning Session</DialogTitle>
                <DialogDescription>
                  Find a teacher and request a session to learn a skill
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search for Teachers</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Search by name, skill, or email..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          loadProfiles();
                        }
                      }}
                    />
                    <Button type="button" onClick={loadProfiles} variant="outline">
                      Search
                    </Button>
                  </div>
                </div>

                {profiles.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Select Teacher</Label>
                    <Select
                      value={selectedTeacherId?.toString() || ""}
                      onValueChange={(value) => setSelectedTeacherId(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id?.toString() || ""}>
                            {profile.firstName} {profile.lastName} ({profile.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="skill">Skill to Learn</Label>
                  <Input
                    id="skill"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    placeholder="e.g., React, Python, Machine Learning"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleRequestSession} disabled={requesting}>
                    {requesting ? "Requesting..." : "Request Session"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRequestDialogOpen(false);
                      setSelectedTeacherId(null);
                      setSelectedSkill("");
                      setSearchKeyword("");
                      setProfiles([]);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="bg-transparent border-b border-gray-100 rounded-none w-full justify-start h-auto p-0 mb-8 overflow-x-auto overflow-y-hidden flex-nowrap shrink-0 pb-1">
            <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent uppercase tracking-widest text-[10px] pb-4 px-6 md:px-8">All</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent uppercase tracking-widest text-[10px] pb-4 px-6 md:px-8">
              Pending ({pendingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent uppercase tracking-widest text-[10px] pb-4 px-6 md:px-8">
              Active ({activeSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent uppercase tracking-widest text-[10px] pb-4 px-6 md:px-8">
              Completed ({completedSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <SessionList
              sessions={sessions}
              getStatusBadge={getStatusBadge}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>

          <TabsContent value="pending">
            <SessionList
              sessions={pendingSessions}
              getStatusBadge={getStatusBadge}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>

          <TabsContent value="active">
            <SessionList
              sessions={activeSessions}
              getStatusBadge={getStatusBadge}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>

          <TabsContent value="completed">
            <SessionList
              sessions={completedSessions}
              getStatusBadge={getStatusBadge}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

interface SessionListProps {
  sessions: Session[];
  getStatusBadge: (status: string) => React.ReactNode;
  onUpdateStatus: (sessionId: number, status: string) => void;
}

const SessionList = ({ sessions, getStatusBadge, onUpdateStatus }: SessionListProps) => {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No sessions found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <Card key={session.sessionId} className="rounded-none border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 md:p-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <BookOpen className="w-5 h-5 text-black" />
                  <h3 className="font-serif text-xl md:text-2xl font-bold tracking-tight">{session.skillName}</h3>
                  {getStatusBadge(session.status)}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                      Partner: {session.partnerName} ({session.role})
                    </span>
                  </div>
                  {session.scheduledTime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Scheduled: {new Date(session.scheduledTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Created: {new Date(session.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                {session.status === "REQUESTED" && session.role === "TEACHER" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(session.sessionId, "ACCEPTED")}
                      className="flex-1 md:flex-none h-10 md:h-12 bg-black text-white uppercase tracking-widest text-[10px] rounded-none px-6"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(session.sessionId, "REJECTED")}
                      className="flex-1 md:flex-none h-10 md:h-12 border-gray-200 text-gray-500 uppercase tracking-widest text-[10px] rounded-none px-6"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {session.status === "ACCEPTED" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        const params = new URLSearchParams({
                          sessionId: String(session.sessionId),
                          role: session.role,
                          skill: session.skillName,
                          partner: session.partnerName,
                        });
                        window.open(`/teaching-room?${params}`, "_blank");
                      }}
                      className="flex-1 md:flex-none h-10 md:h-12 bg-black text-white uppercase tracking-widest text-[10px] rounded-none px-6"
                    >
                      Enter Room
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(session.sessionId, "COMPLETED")}
                      className="flex-1 md:flex-none h-10 md:h-12 border-gray-200 text-gray-500 uppercase tracking-widest text-[10px] rounded-none px-6"
                    >
                      Complete
                    </Button>
                  </>
                )}
                {session.status === "REQUESTED" && session.role === "LEARNER" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUpdateStatus(session.sessionId, "CANCELLED")}
                    className="flex-1 md:flex-none h-10 md:h-12 uppercase tracking-widest text-[10px] rounded-none px-6"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Sessions;

