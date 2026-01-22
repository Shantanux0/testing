import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, X, Smile, Paperclip, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatPanelProps {
  onClose: () => void;
  isMobile?: boolean;
}

const initialMessages = [
  {
    id: 1,
    sender: "Sarah Chen",
    initials: "SC",
    message: "Hey! Ready to dive into React hooks?",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    initials: "AL",
    message: "Yes! I've been struggling with useEffect dependencies",
    time: "10:31 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Chen",
    initials: "SC",
    message: "Perfect, let's start with that. I'll share some code examples in the editor.",
    time: "10:31 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "Sarah Chen",
    initials: "SC",
    message: "The key thing to remember is that useEffect runs after every render by default 🔄",
    time: "10:32 AM",
    isOwn: false,
  },
  {
    id: 5,
    sender: "You",
    initials: "AL",
    message: "Oh that makes sense! So the dependency array controls when it re-runs?",
    time: "10:33 AM",
    isOwn: true,
  },
];

const ChatPanel = ({ onClose, isMobile }: ChatPanelProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: "You",
      initials: "AL",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`h-full flex flex-col glass-card ${
        isMobile ? "rounded-t-2xl" : "rounded-2xl"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display font-semibold">Chat</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.isOwn ? "bg-primary/20" : "bg-secondary"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    msg.isOwn ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {msg.initials}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] ${
                  msg.isOwn ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-2xl ${
                    msg.isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Smile className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="h-9 w-9 shrink-0 glow-button rounded-lg"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
