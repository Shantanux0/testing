import { useState, useEffect, useRef } from "react";
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
import AgendaPanel from "@/components/meeting/AgendaPanel";
import api from "@/lib/api";
import { Client } from "@stomp/stompjs";

// ─── Control Button ─────────────────────────────────────────────────────────────
const ControlBtn = ({ children, onClick, active, danger, className }: any) => (
    <button onClick={onClick} className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${active ? "bg-white text-black shadow-xl" : "bg-white/5 text-gray-400 hover:text-white border border-white/5"} ${danger && !active ? "border-red-500/50 text-red-500 bg-red-500/5" : ""} ${className}`}>
        {children}
    </button>
);

// ─── Whiteboard Component ────────────────────────────────────────────────────────
interface WhiteboardProps {
    stompClient: Client | null;
    sessionId: number;
    role: string;
}

const Whiteboard = ({ stompClient, sessionId, role }: WhiteboardProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tool, setTool] = useState<"pen" | "eraser" | "line" | "rect">("pen");
    const [color, setColor] = useState("#000000");
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const snapshotRef = useRef<ImageData | null>(null);

    const getCtx = () => canvasRef.current?.getContext("2d") || null;
    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const scaleX = canvasRef.current!.width / rect.width;
        const scaleY = canvasRef.current!.height / rect.height;
        
        let clientX, clientY;
        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const sendDraw = (payload: object) => {
        if (stompClient?.connected) {
            stompClient.publish({
                destination: `/app/room/${sessionId}/whiteboard`,
                body: JSON.stringify({ ...payload, sender: role }),
            });
        }
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const ctx = getCtx(); if (!ctx) return;
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
        const ctx = getCtx(); if (!ctx) return;
        const pos = getPos(e);
        ctx.lineWidth = tool === "eraser" ? 20 : 3;
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (tool === "pen" || tool === "eraser") {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            sendDraw({ type: "line", x0: startPos.x, y0: startPos.y, x1: pos.x, y1: pos.y, color: ctx.strokeStyle, lineWidth: ctx.lineWidth });
            setStartPos(pos);
        } else if (snapshotRef.current) {
            ctx.putImageData(snapshotRef.current, 0, 0);
            ctx.beginPath();
            if (tool === "line") { ctx.moveTo(startPos.x, startPos.y); ctx.lineTo(pos.x, pos.y); ctx.stroke(); }
            else if (tool === "rect") ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
        }
    };

    const onMouseUp = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const ctx = getCtx(); if (!ctx) return;
        const pos = getPos(e);
        if (tool === "line" || tool === "rect") {
            sendDraw({ type: tool, x0: startPos.x, y0: startPos.y, x1: pos.x, y1: pos.y, color: ctx.strokeStyle, lineWidth: ctx.lineWidth });
        }
    };

    // Subscribe to incoming drawing events
    useEffect(() => {
        if (!stompClient) return;
        const subscription = stompClient.subscribe(`/topic/room/${sessionId}/whiteboard`, (msg) => {
            const data = JSON.parse(msg.body);
            if (data.sender === role) return; 
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            ctx.beginPath();
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.lineWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            if (data.type === "line") {
                ctx.moveTo(data.x0, data.y0);
                ctx.lineTo(data.x1, data.y1);
                ctx.stroke();
            } else if (data.type === "rect") {
                ctx.strokeRect(data.x0, data.y0, data.x1 - data.x0, data.y1 - data.y0);
            }
        });
        return () => subscription.unsubscribe();
    }, [stompClient, sessionId, role]);

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-wrap gap-1.5 md:gap-2 bg-gray-100 p-1.5 md:p-2 rounded-xl shadow-lg border border-black/5 max-w-[calc(100%-1rem)]">
                {(["pen", "eraser", "line", "rect"] as const).map(t => (
                    <Button key={t} size="sm" variant={tool === t ? "default" : "ghost"} onClick={() => setTool(t)} className="capitalize rounded-lg h-8 md:h-9 px-2 md:px-4 text-[10px] md:text-sm">
                        {t === "pen" && <Pencil className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />}
                        {t === "eraser" && <Eraser className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />}
                        {t === "line" && <Minus className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />}
                        {t === "rect" && <Square className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />}
                        <span className="hidden md:inline">{t}</span>
                    </Button>
                ))}
                <div className="w-[1px] h-8 md:h-9 bg-gray-200 mx-0.5 md:mx-1" />
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 md:w-9 md:h-9 rounded-lg cursor-pointer border-0 p-1 bg-white shadow-inner" title="Pick color" />
            </div>
            <canvas
                ref={canvasRef}
                width={1600}
                height={1000}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onTouchStart={onMouseDown}
                onTouchMove={onMouseMove}
                onTouchEnd={onMouseUp}
                onMouseLeave={() => { if(isDrawing) setIsDrawing(false); }}
                className="w-full h-full cursor-crosshair bg-[#fefefe] touch-none"
            />
        </div>
    );
};

// ─── Main TeachingRoom Component ─────────────────────────────────────────────────
const TeachingRoom = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = parseInt(searchParams.get("sessionId") || "0");
    const roleParam = (searchParams.get("role") || "LEARNER") as "TEACHER" | "LEARNER";
    const [role, setRole] = useState<"TEACHER" | "LEARNER">(roleParam);
    const skillName = searchParams.get("skill") || "Skill";
    const partnerName = searchParams.get("partner") || "Partner";

    // UI State
    const [tab, setTab] = useState<"whiteboard" | "agenda" | "screen">("whiteboard");
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [elapsed, setElapsed] = useState(0);
    const [sessionStatus, setSessionStatus] = useState(""); // empty until fetched from server
    const [completionPct, setCompletionPct] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showStartPopup, setShowStartPopup] = useState(false);
    const autoStartTriggered = useRef(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [peerConnected, setPeerConnected] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [agendaItems, setAgendaItems] = useState<any[]>([]);

    // Media refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const remoteScreenVideoRef = useRef<HTMLVideoElement>(null);
    
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [localScreenStream, setLocalScreenStream] = useState<MediaStream | null>(null);

    // WebRTC + STOMP refs
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const iceQueue = useRef<RTCIceCandidateInit[]>([]);
    const screenSenderRef = useRef<RTCRtpSender | null>(null);

    // ── Timer ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const timer = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    // Stable ref so polling closure always sees the latest interval ID
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const stopPoll = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    const fetchSessionStatus = async () => {
        try {
            const sResponse = await api.get("/sessions/my-sessions");
            const current = sResponse.data.find((s: any) => s.sessionId === sessionId);
            if (current) {
                if (current.role) setRole(current.role.toUpperCase() as any);
                setSessionStatus(current.status);
                // Stop polling once in progress
                if (current.status?.toUpperCase() === "IN_PROGRESS") {
                    stopPoll();
                }
            }
        } catch (err) {
            console.error("Failed to fetch session status", err);
        }
    };

    // ── Fetch Initial Status & Agenda ──────────────────────────────────────────
    useEffect(() => {
        if (sessionId === 0) return;
        
        const fetchInitialData = async () => {
            await fetchSessionStatus();
            try {
                const aResponse = await api.get(`/sessions/${sessionId}/agenda`);
                setAgendaItems(aResponse.data);
            } catch (err) {
                console.error("Failed to fetch agenda", err);
            }
        };
        
        fetchInitialData();
        // Always start polling for status updates (both teacher and learner benefit)
        pollIntervalRef.current = setInterval(fetchSessionStatus, 4000);
        return () => stopPoll();
    }, [sessionId]);

    // ── Auto Start for Teacher ──────────────────────────────────────────────
    // Only fires after a real status has been fetched (sessionStatus !== "")
    useEffect(() => {
        if (
            role?.toUpperCase() === "TEACHER" &&
            sessionStatus?.toUpperCase() === "ACCEPTED" &&
            !autoStartTriggered.current
        ) {
            autoStartTriggered.current = true;
            startClass();
        }
    }, [role, sessionStatus]);

    // ── Camera Access ──────────────────────────────────────────────────────────
    useEffect(() => {
        let activeStream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                activeStream = stream;
                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Camera access denied", err);
                toast.error("Could not access camera/microphone.");
            }
        };
        startCamera();
        return () => { activeStream?.getTracks().forEach(t => t.stop()); };
    }, []);

    // ── Mic/Video toggle ───────────────────────────────────────────────────────
    useEffect(() => {
        localStream?.getAudioTracks().forEach(t => { t.enabled = micOn; });
    }, [micOn, localStream]);

    useEffect(() => {
        localStream?.getVideoTracks().forEach(t => { t.enabled = videoOn; });
    }, [videoOn, localStream]);

    // ── WebRTC + STOMP Engine ──────────────────────────────────────────────────
    useEffect(() => {
        if (sessionId === 0) return;

        const client = new Client({
            brokerURL: `ws://${window.location.hostname}:8080/ws-native`,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("[WS] Connected for Multi-Stream — Role:", role);

                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
                });
                pcRef.current = pc;

                pc.onnegotiationneeded = async () => {
                    try {
                        console.log("[WebRTC] Negotiation needed, sending offer...");
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        client.publish({
                            destination: `/app/room/${sessionId}/signal`,
                            body: JSON.stringify({ type: "offer", offer, sender: role }),
                        });
                    } catch (err) { console.error("Negotiation Error:", err); }
                };

                pc.onconnectionstatechange = () => {
                    if (pc.connectionState === "connected") setPeerConnected(true);
                    if (pc.connectionState === "disconnected" || pc.connectionState === "failed") setPeerConnected(false);
                };

                pc.ontrack = (event) => {
                    console.log("[WebRTC] Inbound track received:", event.track.kind);
                    const stream = event.streams[0];
                    
                    // Logic: First video stream is camera, others are screen
                    // In a simple 1:1, we can check stream IDs or just order
                    const videoTracks = pc.getRemoteStreams().flatMap(s => s.getVideoTracks());
                    
                    if (videoTracks.length > 1 && event.track.kind === "video") {
                        console.log("[WebRTC] Inbound Screen Share detected");
                        if (remoteScreenVideoRef.current) remoteScreenVideoRef.current.srcObject = stream;
                        setTab("screen");
                    } else if (event.track.kind === "video") {
                        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
                    }
                };

                pc.onicecandidate = (event) => {
                    if (event.candidate && client.connected) {
                        client.publish({
                            destination: `/app/room/${sessionId}/signal`,
                            body: JSON.stringify({ type: "candidate", candidate: event.candidate, sender: role }),
                        });
                    }
                };

                // Normal camera & audio tracks
                if (localStream) {
                    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
                }

                client.subscribe(`/topic/room/${sessionId}/signal`, async (msg) => {
                    const data = JSON.parse(msg.body);
                    if (data.sender === role) return;

                    try {
                        if (data.type === "offer") {
                            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                            while (iceQueue.current.length) { await pc.addIceCandidate(new RTCIceCandidate(iceQueue.current.shift()!)); }
                            const answer = await pc.createAnswer();
                            await pc.setLocalDescription(answer);
                            client.publish({
                                destination: `/app/room/${sessionId}/signal`,
                                body: JSON.stringify({ type: "answer", answer, sender: role }),
                            });
                        } else if (data.type === "answer") {
                            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                            while (iceQueue.current.length) { await pc.addIceCandidate(new RTCIceCandidate(iceQueue.current.shift()!)); }
                        } else if (data.type === "candidate") {
                            if (pc.remoteDescription) { await pc.addIceCandidate(new RTCIceCandidate(data.candidate)); } 
                            else { iceQueue.current.push(data.candidate); }
                        } else if (data.type === "announce") {
                            if (role === "TEACHER" && !pc.remoteDescription) {
                                const offer = await pc.createOffer();
                                await pc.setLocalDescription(offer);
                                client.publish({
                                    destination: `/app/room/${sessionId}/signal`,
                                    body: JSON.stringify({ type: "offer", offer, sender: role }),
                                });
                            }
                        } else if (data.type === "SCREEN_OFF") {
                            setTab("whiteboard");
                        }
                    } catch (e) { console.error("[WebRTC] Signaling Error:", e); }
                });

                client.subscribe(`/topic/session/${sessionId}`, async (msg) => {
                    console.log("[WS] Session update received:", msg.body);
                    // Fetch latest sessions to find this one's status
                    try {
                        const response = await api.get("/sessions/my-sessions");
                        const sessions = response.data;
                        const current = sessions.find((s: any) => s.sessionId === sessionId);
                        if (current) {
                            setSessionStatus(current.status);
                            if (current.status === "IN_PROGRESS") {
                                toast.success("Class has started!");
                            }
                        }
                    } catch (err) {
                        console.error("Failed to sync status", err);
                    }
                });

                const announceInterval = setInterval(() => {
                    if (pc.connectionState !== "connected" && client.connected) {
                        client.publish({ destination: `/app/room/${sessionId}/signal`, body: JSON.stringify({ type: "announce", sender: role }) });
                    } else { clearInterval(announceInterval); }
                }, 2000);

                setStompClient(client);
            },
            onDisconnect: () => setStompClient(null)
        });

        client.activate();
        return () => { pcRef.current?.close(); client.deactivate(); };
    }, [sessionId, role, localStream]); // Added localStream to deps to add tracks when it becomes available

    // ── Screen Share Handler ──────────────────────────────────────────────────
    const handleScreenShare = async () => {
        if (isSharingScreen) {
            if (screenSenderRef.current && pcRef.current) {
                pcRef.current.removeTrack(screenSenderRef.current);
                screenSenderRef.current = null;
            }
            localScreenStream?.getTracks().forEach(t => t.stop());
            setLocalScreenStream(null);
            setIsSharingScreen(false);
            setTab("whiteboard");
            stompClient?.publish({ destination: `/app/room/${sessionId}/signal`, body: JSON.stringify({ type: "SCREEN_OFF", sender: role }) });
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            setLocalScreenStream(stream);
            setIsSharingScreen(true);
            setTab("screen");

            const track = stream.getVideoTracks()[0];
            if (pcRef.current) {
                screenSenderRef.current = pcRef.current.addTrack(track, stream);
            }

            track.onended = () => {
                handleScreenShare(); // Toggle off
            };
        } catch (err) {
            console.error("Screen share error:", err);
            toast.error("Could not start screen sharing.");
        }
    };

    // ── Helpers ────────────────────────────────────────────────────────────────
    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    const handleEndSession = async () => {
        if (window.confirm("Are you sure you want to end this session?")) {
            try { await api.put(`/sessions/${sessionId}/status?status=COMPLETED`); } catch { /* fail silent */ }
            setShowFeedback(true);
        }
    };

    const submitFeedback = () => { navigate("/dashboard"); };

    const startClass = async () => {
        try {
            await api.post(`/sessions/${sessionId}/agenda/start-class`, {});
            setSessionStatus("IN_PROGRESS");
            stopPoll(); // Stop polling — no longer needed
            setShowStartPopup(true);
            setTimeout(() => setShowStartPopup(false), 3000);
            toast.success("Class started!");
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || "Failed to start class";
            toast.error(`Could not start: ${msg}`);
            console.error("[startClass] error:", error?.response?.data);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a] text-white font-sans overflow-hidden">
            {/* Header */}
            <header className="h-14 bg-black border-b border-white/10 flex items-center justify-between px-3 md:px-6 shrink-0 z-50">
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                    <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-white transition-colors shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="truncate">
                        <div className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold flex items-center gap-1.5 md:gap-2">
                           <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${peerConnected ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-yellow-500 animate-pulse"}`} />
                           <span className="truncate">{role} · {skillName}</span>
                        </div>
                        <div className="font-serif text-[10px] md:text-sm italic tracking-wide truncate opacity-80">{partnerName}</div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                    <div className="flex items-center gap-2">
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Progress</div>
                        <div className="w-16 md:w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-white" animate={{ width: `${completionPct}%` }} />
                        </div>
                    </div>
                    <div className="w-[1px] h-3 bg-white/10 mx-2" />
                    <div className="font-mono text-xs text-white/80">{fmt(elapsed)}</div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {role?.toUpperCase() === "TEACHER" && (sessionStatus?.toUpperCase() === "ACCEPTED" || sessionStatus?.toUpperCase() === "AGENDA_PHASE") && (
                        <Button 
                            onClick={startClass}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white uppercase tracking-widest text-[9px] h-8 px-4"
                        >
                            Start Class
                        </Button>
                    )}
                    <div className="hidden xs:block sm:hidden font-mono text-[10px] text-white/40 mr-1">{fmt(elapsed)}</div>
                    <button onClick={handleEndSession} className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-500 hover:text-red-500 font-bold transition-colors">
                        End
                    </button>
                    <div className="flex items-center gap-1 md:gap-2 sm:hidden">
                        <div className="w-6 h-[1px] bg-white/20" />
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
                <div className="flex-1 flex flex-col gap-2 md:gap-4 min-w-0">
                    <div className="flex-1 bg-black/40 rounded-xl md:rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm relative">
                        {tab === "whiteboard" && <Whiteboard stompClient={stompClient} sessionId={sessionId} role={role} />}
                        {tab === "agenda" && (
                            <div className="h-full flex items-center justify-center p-4 md:p-8 overflow-y-auto">
                                <AgendaPanel
                                    sessionId={sessionId}
                                    role={role}
                                    sessionStatus={sessionStatus}
                                    onStatusChange={setSessionStatus}
                                    onProgressChange={setCompletionPct}
                                    refreshTrigger={0}
                                />
                            </div>
                        )}
                        {tab === "screen" && (
                            <div className="h-full w-full bg-black flex items-center justify-center relative">
                                <video ref={isSharingScreen ? null : remoteScreenVideoRef} autoPlay playsInline className="max-w-full max-h-full object-contain" srcObject={isSharingScreen ? localScreenStream : null} />
                                {isSharingScreen && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">You are presenting</div>}
                            </div>
                        )}

                        {/* Video Overlays */}
                        <div className="absolute bottom-2 right-2 md:bottom-6 md:right-6 flex flex-row gap-2 z-30">
                            {/* Local Video */}
                            <div className="w-20 md:w-48 aspect-video bg-gray-900 rounded-lg md:rounded-xl border border-white/10 shadow-2xl overflow-hidden relative">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover ${isSharingScreen ? "" : "scale-x-[-1]"}`}
                                />
                                {!videoOn && (
                                    <div className="absolute inset-0 bg-gray-950 flex items-center justify-center">
                                        <div className="w-8 md:w-12 h-8 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            <VideoOff className="w-3 md:w-5 h-3 md:h-5 text-gray-600" />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[6px] md:text-[8px] uppercase tracking-tighter">You</div>
                                {!micOn && (
                                    <div className="absolute top-1 right-1 p-0.5 md:p-1 bg-red-500/80 rounded-full border border-white/10">
                                        <MicOff className="w-2 md:w-3 h-2 md:h-3 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Remote Video */}
                            <div className="w-20 md:w-48 aspect-video bg-gray-900 rounded-lg md:rounded-xl border border-white/10 shadow-2xl overflow-hidden relative">
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <AnimatePresence>
                                    {!peerConnected && (
                                        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-1 md:gap-2 pointer-events-none">
                                            <div className="w-6 md:w-10 h-6 md:h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                                                <Monitor className="w-3 md:w-5 h-3 md:h-5 text-white/50" />
                                            </div>
                                            <span className="text-[6px] md:text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Sync…</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[6px] md:text-[8px] uppercase tracking-tighter">{partnerName}</div>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="h-16 md:h-20 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shrink-0">
                        <div className="flex items-center gap-2 md:gap-4">
                            <ControlBtn active={micOn} onClick={() => setMicOn(!micOn)} danger={!micOn} className="h-10 w-10 md:h-12 md:w-12">
                                {micOn ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
                            </ControlBtn>
                            <ControlBtn active={videoOn} onClick={() => setVideoOn(!videoOn)} danger={!videoOn} className="h-10 w-10 md:h-12 md:w-12">
                                {videoOn ? <Video className="w-4 h-4 md:w-5 md:h-5" /> : <VideoOff className="w-4 h-4 md:w-5 md:h-5" />}
                            </ControlBtn>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2 p-1 bg-black/40 rounded-lg md:rounded-xl border border-white/5">
                            {(["whiteboard", "agenda"] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`px-3 md:px-6 py-2 md:py-2.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold uppercase tracking-widest transition-all ${tab === t ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
                                >
                                    {t}
                                </button>
                            ))}
                            {tab === "screen" && <div className="px-3 md:px-6 py-2 md:py-2.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold uppercase tracking-widest bg-blue-500 text-white animate-pulse">Screen</div>}
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <ControlBtn
                                onClick={handleScreenShare}
                                active={isSharingScreen}
                                className={`h-10 w-10 md:h-12 md:w-12 ${isSharingScreen ? "bg-blue-500/20 text-blue-500 border-blue-500/50" : ""}`}
                            >
                                <Monitor className="w-4 h-4 md:w-5 md:h-5" />
                            </ControlBtn>
                            <ControlBtn
                                onClick={handleEndSession}
                                danger
                                className="h-10 w-10 md:h-12 md:w-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20"
                            >
                                <PhoneOff className="w-4 h-4 md:w-5 md:h-5" />
                            </ControlBtn>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {role?.toUpperCase() === "LEARNER" &&
                    sessionStatus !== "" &&
                    sessionStatus?.toUpperCase() !== "IN_PROGRESS" &&
                    sessionStatus?.toUpperCase() !== "COMPLETED" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 md:p-8 backdrop-blur-md">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 md:mb-8 border border-white/20"><Clock className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin-slow" /></div>
                        <h2 className="text-3xl md:text-5xl font-serif italic mb-4 text-center leading-tight">Waiting for the Lesson to Start</h2>
                        <p className="text-gray-400 text-sm md:text-lg text-center max-w-md font-light leading-relaxed mb-8">Your teacher, <span className="text-white font-medium">{partnerName}</span>, is preparing the agenda. You'll be admitted automatically.</p>
                        <Button variant="outline" onClick={() => navigate("/dashboard")} className="rounded-none border-white/20 text-[10px] px-8 uppercase tracking-widest h-12">Back to Dashboard</Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showStartPopup && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }} 
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-widest text-xs">Class Started · Agenda is Optional</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFeedback && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-lg">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white text-black w-full max-w-md p-10 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-black" />
                            <h2 className="text-2xl font-serif italic mb-2 tracking-tight">Session Concluded</h2>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-10 font-bold">Feedback module coming soon</p>
                            <Button onClick={submitFeedback} className="w-full rounded-none bg-black text-white uppercase tracking-widest text-[10px] h-14">Return to Dashboard</Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeachingRoom;
