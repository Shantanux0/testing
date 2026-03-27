import { useState, useEffect, useRef, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2, Circle, Clock, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    BookOpen, GraduationCap, Send, ArrowLeft, Mic, MicOff, Video, VideoOff,
    Monitor, PhoneOff, Eraser, Pencil, Type, Minus, Square, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useSearchParams } from "react-router-dom";

// ─── API helpers ───────────────────────────────────────────────────────────────
const API = () => `http://${window.location.hostname}:8080/api`;
const tok = () => localStorage.getItem("token");
const jsonH = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${tok()}` });

const teachingApi = {
    getAgenda: (sid: number) => fetch(`${API()}/sessions/${sid}/agenda`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    createAgenda: (sid: number, items: any[]) =>
        fetch(`${API()}/sessions/${sid}/agenda`, { method: "POST", headers: jsonH(), body: JSON.stringify({ items }) })
            .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); }),
    markItem: (id: number, done: boolean) =>
        fetch(`${API()}/sessions/agenda/${id}/complete?done=${done}`, { method: "PATCH", headers: { Authorization: `Bearer ${tok()}` } })
            .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); }),
    getProgress: (sid: number) => fetch(`${API()}/sessions/${sid}/progress`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    submitFeedback: (sid: number, rating: number, comment: string) =>
        fetch(`${API()}/sessions/${sid}/feedback`, { method: "POST", headers: jsonH(), body: JSON.stringify({ rating, comment }) })
            .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); }),
    hasSubmittedFeedback: (sid: number) => fetch(`${API()}/sessions/${sid}/feedback/submitted`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
};

const presenceApi = {
    join: (sid: number) =>
        fetch(`${API()}/sessions/${sid}/room/join`, { method: "POST", headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    heartbeat: (sid: number) =>
        fetch(`${API()}/sessions/${sid}/room/heartbeat`, { method: "POST", headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    getState: (sid: number) =>
        fetch(`${API()}/sessions/${sid}/room/state`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    requestLeave: (sid: number) =>
        fetch(`${API()}/sessions/${sid}/room/leave-request`, { method: "POST", headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    approveLeave: (sid: number) =>
        fetch(`${API()}/sessions/${sid}/room/approve-leave`, { method: "POST", headers: { Authorization: `Bearer ${tok()}` } }),
    cancelLeave: (sid: number) =>
        fetch(`${API()}/sessions/${sid}/room/cancel-leave`, { method: "POST", headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
};

interface RoomState {
    partnerPresent: boolean;
    leaveRequestedByPartner: boolean;
    leaveRequestedBySelf: boolean;
    totalActive: number;
    participants: { userId: number; name: string; isCurrentUser: boolean }[];
}

interface AgendaItem { id: number; topic: string; description?: string; orderIndex: number; isCompleted: boolean; }

type DrawTool = "pen" | "eraser" | "line" | "rect" | "text";

// ─── Whiteboard Component ─────────────────────────────────────────────────────
const Whiteboard = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tool, setTool] = useState<DrawTool>("pen");
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(2);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const snapshotRef = useRef<ImageData | null>(null);

    const getCtx = () => {
        const canvas = canvasRef.current;
        return canvas?.getContext("2d") || null;
    };

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height),
        };
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const ctx = getCtx();
        if (!ctx) return;
        const pos = getPos(e);
        setStartPos(pos);
        setIsDrawing(true);
        snapshotRef.current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (tool === "pen" || tool === "eraser") {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const ctx = getCtx();
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineWidth = tool === "eraser" ? lineWidth * 6 : lineWidth;
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (tool === "pen" || tool === "eraser") {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else if (snapshotRef.current) {
            ctx.putImageData(snapshotRef.current, 0, 0);
            ctx.beginPath();
            if (tool === "line") {
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            } else if (tool === "rect") {
                ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
            }
        }
    };

    const onMouseUp = () => setIsDrawing(false);

    const clearCanvas = () => {
        const ctx = getCtx();
        if (!ctx) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    const COLORS = ["#000000", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#ffffff"];
    const TOOLS: { id: DrawTool; icon: any; label: string }[] = [
        { id: "pen", icon: Pencil, label: "Pen" },
        { id: "eraser", icon: Eraser, label: "Eraser" },
        { id: "line", icon: Minus, label: "Line" },
        { id: "rect", icon: Square, label: "Rect" },
    ];

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 bg-gray-50 flex-wrap">
                {TOOLS.map(t => (
                    <button key={t.id} title={t.label} onClick={() => setTool(t.id)}
                        className={`p-2 rounded transition-colors ${tool === t.id ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>
                        <t.icon className="w-4 h-4" />
                    </button>
                ))}
                <div className="h-5 w-px bg-gray-200 mx-1" />
                {COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? "border-black scale-110" : "border-gray-300"}`}
                        style={{ backgroundColor: c }} />
                ))}
                <div className="h-5 w-px bg-gray-200 mx-1" />
                <input type="range" min={1} max={10} value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))}
                    className="w-20" title="Brush size" />
                <button onClick={clearCanvas}
                    className="ml-auto text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors font-semibold">
                    Clear Board
                </button>
            </div>
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={1400}
                height={800}
                className="flex-1 cursor-crosshair w-full h-full"
                style={{ touchAction: "none" }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            />
        </div>
    );
};

// ─── Main TeachingRoom ────────────────────────────────────────────────────────
const TeachingRoom = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = parseInt(searchParams.get("sessionId") || "0");
    const role = searchParams.get("role") || "LEARNER";
    const skillName = searchParams.get("skill") || "Skill";
    const partnerName = searchParams.get("partner") || "Partner";

    const [tab, setTab] = useState<"whiteboard" | "agenda">("whiteboard");
    const [agenda, setAgenda] = useState<AgendaItem[]>([]);
    const [completionPct, setCompletionPct] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [alreadyRated, setAlreadyRated] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [comment, setComment] = useState("");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [newTopics, setNewTopics] = useState(["", "", ""]);
    const [showAgendaBuilder, setShowAgendaBuilder] = useState(false);
    const [savingAgenda, setSavingAgenda] = useState(false);

    // Presence / waiting room state
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const roomStateRef = useRef<RoomState | null>(null);
    const [joined, setJoined] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false); // for leaving user

    // Zoom-like controls state
    const [micOn, setMicOn] = useState(false);
    const [camOn, setCamOn] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Join the room and start all polling ──────────────────────────────────
    useEffect(() => {
        if (!sessionId) return;

        const init = async () => {
            try {
                const state = await presenceApi.join(sessionId);
                setRoomState(state);
                roomStateRef.current = state;
                setJoined(true);
            } catch { toast.error("Failed to join room"); }
        };
        init();

        // Heartbeat every 10 seconds
        heartbeatRef.current = setInterval(async () => {
            try { await presenceApi.heartbeat(sessionId); } catch { }
        }, 10000);

        // Poll room state every 5 seconds
        pollRef.current = setInterval(async () => {
            try {
                const state = await presenceApi.getState(sessionId);
                setRoomState(state);
                roomStateRef.current = state;
            } catch { }
        }, 5000);

        loadAgenda();
        checkFeedback();
        timerRef.current = setInterval(() => {
            if (roomStateRef.current?.partnerPresent) {
                setElapsed(s => s + 1);
            }
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [sessionId]);


    const loadAgenda = async () => {
        try {
            const data = await teachingApi.getAgenda(sessionId);
            setAgenda(Array.isArray(data) ? data : []);
            const prog = await teachingApi.getProgress(sessionId);
            setCompletionPct(prog.completionPercent || 0);
        } catch { }
    };

    const checkFeedback = async () => {
        try {
            const res = await teachingApi.hasSubmittedFeedback(sessionId);
            setAlreadyRated(res.submitted);
        } catch { }
    };

    const handleMarkItem = async (item: AgendaItem) => {
        if (role !== "LEARNER") { toast.info("Only the learner marks agenda items"); return; }
        try {
            await teachingApi.markItem(item.id, !item.isCompleted);
            await loadAgenda();
        } catch { toast.error("Failed to update"); }
    };

    const handleSaveAgenda = async () => {
        const topics = newTopics.filter(t => t.trim());
        if (!topics.length) { toast.error("Add at least one topic"); return; }
        setSavingAgenda(true);
        try {
            await teachingApi.createAgenda(sessionId, topics.map((topic, i) => ({ topic, orderIndex: i + 1 })));
            await loadAgenda();
            setShowAgendaBuilder(false);
            toast.success("Agenda saved!");
        } catch { toast.error("Failed to save agenda"); }
        finally { setSavingAgenda(false); }
    };

    const handleSubmitFeedback = async () => {
        if (!rating) { toast.error("Please select a rating"); return; }
        setSubmittingFeedback(true);
        try {
            await teachingApi.submitFeedback(sessionId, rating, comment);
            setAlreadyRated(true);
            setShowFeedback(false);
            toast.success("Feedback submitted! ⭐");
        } catch (e: any) { toast.error(e.message || "Failed to submit"); }
        finally { setSubmittingFeedback(false); }
    };

    const handleScreenShare = async () => {
        if (sharing) { setSharing(false); toast.info("Screen sharing stopped"); return; }
        try {
            await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
            setSharing(true);
            toast.success("Screen sharing started");
        } catch { toast.info("Screen share cancelled"); }
    };

    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white font-sans overflow-hidden">

            {/* ─── TOP BAR ────────────────────────────────────────────────── */}
            <div className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/sessions")} className="text-gray-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1">
                            {role === "TEACHER" ? <GraduationCap className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                            {role === "TEACHER" ? "Teaching" : "Learning"} · {skillName}
                        </div>
                        <div className="font-bold text-sm">{partnerName}</div>
                    </div>
                </div>

                {/* Timer + tabs */}
                <div className="flex items-center gap-4">
                    <div className="font-mono text-sm bg-gray-800 px-3 py-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" /> {fmt(elapsed)}
                    </div>
                    <div className="flex border border-gray-700 overflow-hidden">
                        {(["whiteboard", "agenda"] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-4 py-1.5 text-xs uppercase tracking-widest font-semibold transition-colors
                  ${tab === t ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    {/* Progress badge */}
                    <div className={`text-xs font-bold px-2 py-1 ${completionPct === 100 ? "bg-green-500" : "bg-gray-700"}`}>
                        {completionPct}%
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!alreadyRated && (
                        <button onClick={() => setShowFeedback(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-widest transition-colors">
                            <Star className="w-3 h-3" /> Rate
                        </button>
                    )}
                </div>
            </div>

            {/* ─── MAIN CONTENT ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-hidden relative">
                {!roomState?.partnerPresent ? (
                    <div className="absolute inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin mb-8"></div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500 mb-2">
                            Waiting for {partnerName}
                        </h2>
                        <p className="text-gray-500 text-sm">You are the only one in the room.</p>
                        <p className="text-gray-500 text-sm mt-1">The session will unlock when both users join.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {tab === "whiteboard" ? (
                            <motion.div key="wb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <Whiteboard />
                            </motion.div>
                        ) : (
                            <motion.div key="ag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full overflow-y-auto bg-white text-black p-8 max-w-3xl mx-auto">

                                {/* Progress bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
                                        <span className="text-gray-500">Session Progress</span>
                                        <span className={completionPct === 100 ? "text-green-500" : ""}>{completionPct}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100">
                                        <motion.div className="h-full bg-black" initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 0.5 }} />
                                    </div>
                                    {completionPct === 100 && <p className="text-green-500 text-xs mt-2 font-semibold">✓ All topics completed!</p>}
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Session Agenda</h2>
                                    {role === "TEACHER" && (
                                        <button onClick={() => setShowAgendaBuilder(v => !v)}
                                            className="text-sm text-gray-400 hover:text-black font-semibold flex items-center gap-1 uppercase tracking-widest">
                                            {showAgendaBuilder ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            {agenda.length ? "Edit" : "Create"} Agenda
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {showAgendaBuilder && role === "TEACHER" && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
                                            <div className="border border-black p-6 space-y-3 bg-gray-50">
                                                {newTopics.map((t, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                                                        <input value={t} onChange={e => { const n = [...newTopics]; n[i] = e.target.value; setNewTopics(n); }}
                                                            placeholder={`Topic ${i + 1}`}
                                                            className="flex-1 border-0 border-b border-gray-200 bg-transparent focus:outline-none focus:border-black text-sm py-1" />
                                                    </div>
                                                ))}
                                                <div className="flex gap-3 pt-2">
                                                    <button onClick={() => setNewTopics(p => [...p, ""])} className="text-xs text-gray-400 hover:text-black uppercase tracking-widest">+ Add Topic</button>
                                                    <Button onClick={handleSaveAgenda} disabled={savingAgenda} className="rounded-none bg-black text-white text-xs uppercase tracking-widest h-8 px-5">
                                                        {savingAgenda ? "Saving..." : "Save Agenda"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-3">
                                    {agenda.length === 0 ? (
                                        <div className="border border-dashed border-gray-200 py-16 text-center text-gray-400">
                                            {role === "TEACHER" ? "Create agenda topics above" : "Waiting for teacher to create agenda…"}
                                        </div>
                                    ) : agenda.map((item, i) => (
                                        <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                            onClick={() => handleMarkItem(item)}
                                            className={`flex items-center gap-4 p-4 border cursor-pointer group transition-all
                      ${item.isCompleted ? "border-green-200 bg-green-50" : "border-gray-100 hover:border-black"}`}>
                                            <div className={item.isCompleted ? "text-green-500" : "text-gray-300 group-hover:text-gray-600"}>
                                                {item.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                            </div>
                                            <span className={`font-medium ${item.isCompleted ? "line-through text-gray-400" : ""}`}>{item.topic}</span>
                                            {item.isCompleted && <span className="ml-auto text-xs text-green-500 font-bold uppercase tracking-widest">Done</span>}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* ─── ZOOM-LIKE BOTTOM CONTROL BAR ────────────────────────────── */}
            <div className="h-16 bg-gray-900 border-t border-gray-700 flex items-center justify-center gap-4 shrink-0">
                {/* Mic */}
                <ControlBtn active={micOn} onClick={() => setMicOn(v => !v)} danger={!micOn}>
                    {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    <span>{micOn ? "Mute" : "Unmute"}</span>
                </ControlBtn>

                {/* Camera */}
                <ControlBtn active={camOn} onClick={() => setCamOn(v => !v)} danger={!camOn}>
                    {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    <span>{camOn ? "Stop Video" : "Start Video"}</span>
                </ControlBtn>

                {/* Share Screen */}
                <ControlBtn active={sharing} onClick={handleScreenShare} accent>
                    <Monitor className="w-5 h-5" />
                    <span>{sharing ? "Stop Share" : "Share Screen"}</span>
                </ControlBtn>

                {/* Whiteboard shortcut */}
                <ControlBtn active={tab === "whiteboard"} onClick={() => setTab("whiteboard")}>
                    <Pencil className="w-5 h-5" />
                    <span>Whiteboard</span>
                </ControlBtn>

                {/* Agenda shortcut */}
                <ControlBtn active={tab === "agenda"} onClick={() => setTab("agenda")}>
                    <BookOpen className="w-5 h-5" />
                    <span>Agenda</span>
                </ControlBtn>

                {/* Leave / End */}
                <ControlBtn onClick={() => navigate("/dashboard")} danger className="bg-red-600 hover:bg-red-500 !text-white">
                    <LogOut className="w-5 h-5" />
                    <span>Leave</span>
                </ControlBtn>
            </div>

            {/* ─── FEEDBACK MODAL ─────────────────────────────────────────── */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
                        onClick={e => e.target === e.currentTarget && setShowFeedback(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-white text-black w-full max-w-md p-10">
                            <h2 className="text-2xl font-bold mb-2">Rate this Session</h2>
                            <p className="text-gray-500 text-sm mb-8">How was <strong>{partnerName}</strong>'s {role === "LEARNER" ? "teaching" : "participation"}?</p>
                            <div className="flex gap-3 mb-4">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setRating(s)}>
                                        <Star className={`w-10 h-10 transition-colors ${s <= (hoveredStar || rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mb-6">{["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating] || "Select a rating"}</p>
                            <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional comment..." maxLength={500}
                                className="rounded-none border-gray-200 focus:border-black resize-none mb-6 h-24" />
                            <div className="flex gap-3">
                                <Button onClick={handleSubmitFeedback} disabled={submittingFeedback || !rating}
                                    className="flex-1 rounded-none bg-black text-white uppercase tracking-widest text-xs h-12">
                                    <Send className="w-4 h-4 mr-2" /> {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                                </Button>
                                <Button variant="outline" onClick={() => setShowFeedback(false)}
                                    className="rounded-none border-gray-200 text-xs uppercase tracking-widest h-12 px-6">Later</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Control Button ────────────────────────────────────────────────────────────
const ControlBtn = ({ children, onClick, active, danger, accent, className: cls }: {
    children: React.ReactNode; onClick?: () => void; active?: boolean;
    danger?: boolean; accent?: boolean; className?: string;
}) => (
    <button onClick={onClick}
        className={`flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all rounded
      ${active ? "bg-white text-black" : "text-gray-400 hover:text-white"}
      ${danger && !active ? "hover:bg-red-900/30" : ""}
      ${accent && active ? "bg-green-500 text-white" : ""}
      ${cls || ""}`}>
        {children}
    </button>
);

export default TeachingRoom;
