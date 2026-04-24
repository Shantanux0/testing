import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Play, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";

interface AgendaItem {
  id: number;
  topic: string;
  description: string;
  isCompleted: boolean;
  orderIndex: number;
}

interface AgendaPanelProps {
  sessionId: number;
  role: "TEACHER" | "LEARNER";
  sessionStatus: string;
  onStatusChange: (newStatus: string) => void;
  onProgressChange?: (pct: number) => void;
  refreshTrigger: number;
}

const AgendaPanel = ({
  sessionId,
  role,
  sessionStatus,
  onStatusChange,
  onProgressChange,
  refreshTrigger,
}: AgendaPanelProps) => {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAgenda = async () => {
    try {
      const response = await api.get(`/sessions/${sessionId}/agenda`);
      const agendaItems = response.data;
      setItems(agendaItems);
      
      if (onProgressChange) {
        const total = agendaItems.length;
        const done = agendaItems.filter((i: any) => i.isCompleted).length;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        onProgressChange(pct);
      }
    } catch (error) {
      console.error("Failed to fetch agenda", error);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, [sessionId, refreshTrigger]);

  const addItem = async () => {
    if (!newTopic.trim()) return;
    setIsLoading(true);
    try {
      // Backend replaces the whole list, so we must send everything
      const updatedItems = [
        ...items.map(it => ({ topic: it.topic, description: it.description, orderIndex: it.orderIndex })),
        { topic: newTopic, description: "", orderIndex: items.length + 1 }
      ];
      await api.post(`/sessions/${sessionId}/agenda`, { items: updatedItems });
      setNewTopic("");
      fetchAgenda();
      toast.success("Agenda item added");
    } catch (error) {
      toast.error("Failed to add agenda item");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      // Note: Backend might need a specific endpoint or just re-sending the whole list.
      // Based on my previous AgendaService.java, it replaces the whole list on POST.
      // For now, I'll filter out the item and re-send the list to be safe.
      const updatedItems = items.filter(i => i.id !== id).map((it, idx) => ({
        topic: it.topic,
        description: it.description,
        orderIndex: idx + 1
      }));
      await api.post(`/sessions/${sessionId}/agenda`, { items: updatedItems });
      fetchAgenda();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const toggleItem = async (id: number, currentStatus: boolean) => {
    try {
      // PATCH /api/sessions/agenda/{itemId}/complete?done=true|false
      await api.patch(`/sessions/agenda/${id}/complete?done=${!currentStatus}`);
      fetchAgenda();
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const startClass = async () => {
    // No longer mandatory to have agenda items to start
    try {
      await api.post(`/sessions/${sessionId}/agenda/start-class`, {});
      onStatusChange("IN_PROGRESS");
      toast.success("Class started!");
    } catch (error) {
      toast.error("Failed to start class");
    }
  };

  const isAgendaPhase = sessionStatus?.toUpperCase() === "ACCEPTED" || sessionStatus?.toUpperCase() === "AGENDA_PHASE";
  const isInProgress = sessionStatus?.toUpperCase() === "IN_PROGRESS";

  return (
    <Card className="h-full border-none shadow-none bg-background/50 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-display">Lesson Agenda</CardTitle>
            <CardDescription>
              {isAgendaPhase
                ? "Set the topics for today's session"
                : "Tracking progress of the session"}
            </CardDescription>
          </div>
          {role?.toUpperCase() === "TEACHER" && isAgendaPhase && (
            <Button size="sm" onClick={startClass} className="bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              Start Class
            </Button>
          )}
          {isInProgress && (
             <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
               <CheckCircle2 className="w-4 h-4" />
               In Progress
             </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {role?.toUpperCase() === "TEACHER" && isAgendaPhase && (
          <div className="flex gap-2">
            <Input
              placeholder="Add a topic..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
            />
            <Button size="icon" onClick={addItem} disabled={isLoading}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={item.isCompleted}
                      onCheckedChange={() => toggleItem(item.id, item.isCompleted)}
                      disabled={!isInProgress || role?.toUpperCase() !== "LEARNER"}
                      className="border-primary/50 data-[state=checked]:bg-primary"
                    />
                    <span
                      className={`text-sm font-medium transition-all ${
                        item.isCompleted ? "line-through text-muted-foreground opacity-50" : ""
                      }`}
                    >
                      {item.topic}
                    </span>
                  </div>
                  {role?.toUpperCase() === "TEACHER" && isAgendaPhase && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                   <Plus className="w-6 h-6 opacity-20" />
                </div>
                <p className="text-sm">No agenda items set yet.</p>
                {role?.toUpperCase() === "LEARNER" && (
                  <p className="text-xs mt-1 italic">Waiting for teacher to define the plan...</p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AgendaPanel;
