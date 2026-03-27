import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Send, Search, ArrowLeft, Video, ChevronRight,
  MessageCircle, Clock, Circle
} from "lucide-react";

// ─── API ─────────────────────────────────────────────────────────────────────
const API = () => `http://${window.location.hostname}:8080/api`;
const tok = () => localStorage.getItem("token");
const jsonH = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${tok()}` });

const msgApi = {
  getConversations: () =>
    fetch(`${API()}/messages/conversations`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
  getConversation: (partnerId: number) =>
    fetch(`${API()}/messages/conversation/${partnerId}`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
  sendMessage: (receiverId: number, content: string, sessionId?: number) =>
    fetch(`${API()}/messages/send`, {
      method: "POST", headers: jsonH(),
      body: JSON.stringify({ receiverId, content, sessionId: sessionId ?? null }),
    }).then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); }),
};

interface Conversation {
  partnerId: number;
  partnerName: string;
  partnerEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  sessionId?: number;
}

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
  isOwn: boolean;
  isRead: boolean;
  sessionId?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const timeAgo = (iso: string) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const initials = (name: string) => name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "??";

// ─── Main Component ───────────────────────────────────────────────────────────
const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selected) {
      loadMessages(selected.partnerId);
      // Poll every 3 seconds for new messages
      pollRef.current = setInterval(() => loadMessages(selected.partnerId), 3000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selected?.partnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await msgApi.getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load conversations"); }
    finally { setLoading(false); }
  };

  const loadMessages = async (partnerId: number) => {
    try {
      const data = await msgApi.getConversation(partnerId);
      setMessages(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
  };

  const handleSend = async () => {
    if (!input.trim() || !selected) return;
    setSending(true);
    try {
      const msg = await msgApi.sendMessage(selected.partnerId, input.trim(), selected.sessionId);
      setMessages(prev => [...prev, msg]);
      setInput("");
      loadConversations(); // refresh unread counts
    } catch (e: any) {
      toast.error(e.message || "Failed to send");
    } finally { setSending(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const goToRoom = async (conv: Conversation) => {
    if (!conv.sessionId) { toast.info("No active session linked to this conversation"); return; }

    // Instead of opening room immediately, send a trigger message
    try {
      setSending(true);
      await msgApi.sendMessage(conv.partnerId, "[SYSTEM:MEETING_START_REQUEST]", conv.sessionId);
      loadMessages(conv.partnerId);
      loadConversations();
    } catch {
      toast.error("Failed to start meeting request");
    } finally {
      setSending(false);
    }
  };

  const joinMeeting = async (conv: Conversation) => {
    if (!conv.sessionId) return;
    try {
      setSending(true);
      await msgApi.sendMessage(conv.partnerId, "[SYSTEM:MEETING_JOINED]", conv.sessionId);

      const params = new URLSearchParams({
        sessionId: String(conv.sessionId),
        role: "LEARNER",
        skill: "Skill Swap",
        partner: conv.partnerName,
      });
      window.open(`/teaching-room?${params}`, "_blank");

      loadMessages(conv.partnerId);
      loadConversations();
    } catch {
      toast.error("Failed to join meeting");
    } finally {
      setSending(false);
    }
  };

  const enterRoom = (conv: Conversation) => {
    if (!conv.sessionId) return;
    const params = new URLSearchParams({
      sessionId: String(conv.sessionId),
      role: "TEACHER",
      skill: "Skill Swap",
      partner: conv.partnerName,
    });
    window.open(`/teaching-room?${params}`, "_blank");
  };

  const filtered = conversations.filter(c =>
    c.partnerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.partnerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const renderMessageContent = (msg: Message) => {
    if (msg.content === "[SYSTEM:MEETING_START_REQUEST]") {
      if (msg.isOwn) {
        return (
          <div className="flex flex-col items-center gap-2 p-2">
            <Video className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">You started a video call</span>
            <span className="text-xs text-gray-500">Waiting for {selected?.partnerName} to join...</span>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center gap-3 p-2">
            <div className="bg-black text-white p-3 rounded-full animate-bounce">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">Incoming Video Call</span>
            <button
              onClick={() => selected && joinMeeting(selected)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full text-sm uppercase tracking-widest transition-transform hover:scale-105"
            >
              Join Meeting
            </button>
          </div>
        );
      }
    }

    if (msg.content === "[SYSTEM:MEETING_JOINED]") {
      return (
        <div className="flex flex-col items-center gap-2 p-2 w-full">
          <span className="text-sm font-bold text-green-600">Meeting Started!</span>
          <button
            onClick={() => selected && enterRoom(selected)}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-full text-xs uppercase tracking-widest"
          >
            Enter Room
          </button>
        </div>
      );
    }

    return <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>;
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-5rem)] flex bg-white font-sans">

        {/* ─── SIDEBAR ──────────────────────────────────────────────── */}
        <div className={`w-full lg:w-80 xl:w-96 border-r border-gray-100 flex flex-col ${selected ? "hidden lg:flex" : "flex"}`}>
          {/* Search */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tight mb-4">
              <MessageCircle className="w-6 h-6" /> Messages
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black rounded-none"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                <MessageCircle className="w-10 h-10 opacity-20" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs text-gray-300">Start by matching with someone!</p>
              </div>
            ) : (
              filtered.map(conv => (
                <button
                  key={conv.partnerId}
                  onClick={() => setSelected(conv)}
                  className={`w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left
                    ${selected?.partnerId === conv.partnerId ? "bg-black text-white" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                    ${selected?.partnerId === conv.partnerId ? "bg-white text-black" : "bg-gray-100 text-gray-700"}`}>
                    {initials(conv.partnerName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm truncate">{conv.partnerName}</span>
                      <span className={`text-xs shrink-0 ml-2 ${selected?.partnerId === conv.partnerId ? "text-gray-300" : "text-gray-400"}`}>
                        {timeAgo(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${selected?.partnerId === conv.partnerId ? "text-gray-300" : "text-gray-500"}`}>
                      {conv.lastMessage || "Start a conversation"}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 font-bold">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* ─── CHAT WINDOW ──────────────────────────────────────────── */}
        {selected ? (
          <div className="flex-1 flex flex-col bg-[#f0f2f5]">
            {/* Header */}
            <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelected(null)} className="lg:hidden text-gray-500 hover:text-black">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm text-gray-700">
                  {initials(selected.partnerName)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base text-gray-900 leading-tight">{selected.partnerName}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                  </span>
                </div>
              </div>
              {selected.sessionId && (
                <button
                  onClick={() => goToRoom(selected)}
                  title="Go to Teaching Room"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Video className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3" style={{ backgroundImage: "var(--chat-bg, none)" }}>
              <AnimatePresence>
                {messages.map((msg, i) => {
                  const isSystem = msg.content.startsWith("[SYSTEM:");

                  if (isSystem) {
                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center my-6 w-full"
                      >
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 shadow-sm w-full max-w-sm text-center">
                          {renderMessageContent(msg)}
                          <span className="text-[10px] text-gray-400 mt-2 block">{timeAgo(msg.createdAt)}</span>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] lg:max-w-md xl:max-w-lg relative group ${msg.isOwn ? 'pl-10' : 'pr-10'}`}>
                        <div className={`px-4 py-2 text-[15px] shadow-sm
                          ${msg.isOwn
                            ? "bg-[#dcf8c6] text-black rounded-lg rounded-tr-none" // WhatsApp sent bubble color
                            : "bg-white text-black rounded-lg rounded-tl-none"     // WhatsApp received bubble color
                          }`}>
                          {renderMessageContent(msg)}
                          <div className={`text-[11px] text-gray-500 mt-1 flex items-center gap-1 justify-end`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                  <p className="text-sm">No messages yet. Say hello! 👋</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-3 bg-[#f0f2f5] shrink-0">
              <div className="flex items-end gap-3 bg-white px-4 py-2 rounded-xl shadow-sm">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message"
                  rows={1}
                  className="flex-1 resize-none bg-transparent border-0 focus:outline-none focus:ring-0 text-[15px] pt-1.5 leading-relaxed"
                  style={{ maxHeight: 120, overflowY: "auto" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00a884] text-white hover:bg-[#008f6f] disabled:opacity-50 disabled:bg-gray-400 transition-colors shrink-0 mb-0.5"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-black flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Your Messages</h3>
              <p className="text-gray-400 text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Messages;
