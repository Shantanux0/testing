import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Mic, MicOff, Video, VideoOff,
    Monitor, PhoneOff, Eraser, Pencil, Minus, Square, UserX, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import AgendaPanel from "@/components/meeting/AgendaPanel";
import api from "@/lib/api";
import { Client } from "@stomp/stompjs";

const ControlBtn = ({ children, onClick, active, danger, className }: any) => (
    <button
        onClick={onClick}
        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all
      ${active ? "bg-white text-black shadow-xl" : "bg-white/5 text-gray-400 hover:text-white border border-white/5"}
      ${danger && !active ? "border-red-500/50 text-red-500 bg-red-500/5" : ""}
      ${className}`}
    >
        {children}
    </button>
);

interface WhiteboardProps { stompClient: Client | null; sessionId: number; role: string; }

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
        let clientX: number, clientY: number;
        if ("touches" in e) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
        else { clientX = (e as React.MouseEvent).clientX; clientY = (e as React.MouseEvent).clientY; }
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const sendDraw = (payload: object) => {
        if (stompClient?.connected) {
            stompClient.publish({ destination: `/app/room/${sessionId}/whiteboard`, body: JSON.stringify({ ...payload, sender: role }) });
        }
    };

    const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const ctx = getCtx(); if (!ctx) return;
        const pos = getPos(e); setStartPos(pos); setIsDrawing(true);
        snapshotRef.current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (tool === "pen" || tool === "eraser") { ctx.beginPath(); ctx.moveTo(pos.x, pos.y); }
    };

    const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const ctx = getCtx(); if (!ctx) return;
        const pos = getPos(e);
        ctx.lineWidth = tool === "eraser" ? 20 : 3;
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        if (tool === "pen" || tool === "eraser") {
            ctx.lineTo(pos.x, pos.y); ctx.stroke();
            sendDraw({ type: "line", x0: startPos.x, y0: startPos.y, x1: pos.x, y1: pos.y, color: ctx.strokeStyle, lineWidth: ctx.lineWidth });
            setStartPos(pos);
        } else if (snapshotRef.current) {
            ctx.putImageData(snapshotRef.current, 0, 0); ctx.beginPath();
            if (tool === "line") { ctx.moveTo(startPos.x, startPos.y); ctx.lineTo(pos.x, pos.y); ctx.stroke(); }
            else if (tool === "rect") ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
        }
    };

    const onMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return; setIsDrawing(false);
        const ctx = getCtx(); if (!ctx) return;
        const pos = getPos(e);
        if (tool === "line" || tool === "rect") {
            sendDraw({ type: tool, x0: startPos.x, y0: startPos.y, x1: pos.x, y1: pos.y, color: ctx.strokeStyle, lineWidth: ctx.lineWidth });
        }
    };

    useEffect(() => {
        if (!stompClient) return;
        const sub = stompClient.subscribe(`/topic/room/${sessionId}/whiteboard`, (msg) => {
            const data = JSON.parse(msg.body);
            if (data.sender === role) return;
            const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return;
            ctx.beginPath(); ctx.strokeStyle = data.color; ctx.lineWidth = data.lineWidth;
            ctx.lineCap = "round"; ctx.lineJoin = "round";
            if (data.type === "line") { ctx.moveTo(data.x0, data.y0); ctx.lineTo(data.x1, data.y1); ctx.stroke(); }
            else if (data.type === "rect") ctx.strokeRect(data.x0, data.y0, data.x1 - data.x0, data.y1 - data.y0);
        });
        return () => sub.unsubscribe();
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
                ref={canvasRef} width={1600} height={1000}
                onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
                onTouchStart={onMouseDown} onTouchMove={onMouseMove} onTouchEnd={onMouseUp}
                onMouseLeave={() => { if (isDrawing) setIsDrawing(false); }}
                className="w-full h-full cursor-crosshair bg-[#fefefe] touch-none"
            />
        </div>
    );
};

const TeachingRoom = () => {
    useAuth(); // Just to ensure protected route context is accessed
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = parseInt(searchParams.get("sessionId") || "0");
    const roleParam = (searchParams.get("role") || "LEARNER") as "TEACHER" | "LEARNER";
    const skillName = searchParams.get("skill") || "Skill";
    const partnerName = searchParams.get("partner") || "Partner";

    const [role] = useState<"TEACHER" | "LEARNER">(roleParam);
    const [tab, setTab] = useState<"whiteboard" | "agenda" | "screen">("whiteboard");
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [elapsed, setElapsed] = useState(0);
    const [completionPct, setCompletionPct] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [peerConnected, setPeerConnected] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [peerLeft, setPeerLeft] = useState(false);
    const [cameraPermissionError, setCameraPermissionError] = useState(false);
    const [permissionErrorType, setPermissionErrorType] = useState("");
    const [hasJoined, setHasJoined] = useState(false);

    const [localScreenStream, setLocalScreenStream] = useState<MediaStream | null>(null);
    const [remoteScreenStream, setRemoteScreenStream] = useState<MediaStream | null>(null);
    const [stompClient, setStompClient] = useState<Client | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localCameraStreamRef = useRef<MediaStream | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const iceQueue = useRef<RTCIceCandidateInit[]>([]);
    const screenSenderRef = useRef<RTCRtpSender | null>(null);
    const stompClientRef = useRef<Client | null>(null);
    const roleRef = useRef<"TEACHER" | "LEARNER">(roleParam);
    const peerWasConnectedRef = useRef(false);

    // Timer
    useEffect(() => {
        const t = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(t);
    }, []);

    // Toggles
    useEffect(() => {
        localCameraStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = micOn; });
    }, [micOn]);

    useEffect(() => {
        localCameraStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = videoOn; });
    }, [videoOn]);

    // Update status to IN_PROGRESS so backend knows
    useEffect(() => {
        if (sessionId !== 0) {
            api.put(`/sessions/${sessionId}/status?status=IN_PROGRESS`).catch(() => {});
        }
    }, [sessionId]);

    const startSetup = async () => {
        if (sessionId === 0) return;
        setCameraPermissionError(false);

        let cameraStream: MediaStream | null = null;
        let pc: RTCPeerConnection | null = null;
        let client: Client | null = null;
        let announceTimer: ReturnType<typeof setInterval> | null = null;

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("unsupported");
            }
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localCameraStreamRef.current = cameraStream;
            if (localVideoRef.current) localVideoRef.current.srcObject = cameraStream;
        } catch (err: any) {
            console.error("[Camera]", err);
            setCameraPermissionError(true);
            if (err.message === "unsupported") {
                setPermissionErrorType("unsupported");
            } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setPermissionErrorType("denied");
            } else {
                setPermissionErrorType("other");
            }
            toast.error("Could not access camera and microphone.");
            return; // Stop setup if no permissions
        }

        pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
            ],
        });
        pcRef.current = pc;

        cameraStream.getTracks().forEach(track => pc!.addTrack(track, cameraStream!));

        pc.onconnectionstatechange = () => {
            if (pc!.connectionState === "connected") {
                setPeerConnected(true); peerWasConnectedRef.current = true; setPeerLeft(false);
            }
            if ((pc!.connectionState === "disconnected" || pc!.connectionState === "failed") && peerWasConnectedRef.current) {
                setPeerConnected(false); setPeerLeft(true);
            }
        };

        pc.onicecandidate = (ev) => {
            if (ev.candidate && stompClientRef.current?.connected) {
                stompClientRef.current.publish({
                    destination: `/app/room/${sessionId}/signal`,
                    body: JSON.stringify({ type: "candidate", candidate: ev.candidate, sender: roleRef.current }),
                });
            }
        };

        // Track seen stream IDs so we perfectly distinguish Camera vs Screen
        const seenStreamIds = new Set<string>();

        pc.ontrack = (ev) => {
            const stream = ev.streams[0];
            if (!stream) return;
            
            if (ev.track.kind === "audio") {
                if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
                    (remoteVideoRef.current.srcObject as MediaStream).addTrack(ev.track);
                } else if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream;
                }
                return;
            }

            if (ev.track.kind === "video") {
                if (!seenStreamIds.has(stream.id)) {
                    if (seenStreamIds.size === 0) {
                        // First video stream = Camera
                        seenStreamIds.add(stream.id);
                        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
                    } else {
                        // Any subsequent new stream ID = Screen Share
                        seenStreamIds.add(stream.id);
                        setRemoteScreenStream(stream);
                        setTab("screen");
                    }
                }
            }
        };

        client = new Client({
            brokerURL: import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8080/ws-native`,
            reconnectDelay: 5000,
            onConnect: () => {
                if (!pc) return;

                pc.onnegotiationneeded = async () => {
                    try {
                        const offer = await pc!.createOffer();
                        await pc!.setLocalDescription(offer);
                        client!.publish({
                            destination: `/app/room/${sessionId}/signal`,
                            body: JSON.stringify({ type: "offer", offer, sender: roleRef.current }),
                        });
                    } catch (e) { console.error("[PC] negotiation:", e); }
                };

                client!.subscribe(`/topic/room/${sessionId}/signal`, async (msg) => {
                    const data = JSON.parse(msg.body);
                    if (data.sender === roleRef.current) return;
                    try {
                        if (data.type === "offer") {
                            await pc!.setRemoteDescription(new RTCSessionDescription(data.offer));
                            while (iceQueue.current.length) await pc!.addIceCandidate(new RTCIceCandidate(iceQueue.current.shift()!));
                            const answer = await pc!.createAnswer();
                            await pc!.setLocalDescription(answer);
                            client!.publish({
                                destination: `/app/room/${sessionId}/signal`,
                                body: JSON.stringify({ type: "answer", answer, sender: roleRef.current }),
                            });
                        } else if (data.type === "answer") {
                            await pc!.setRemoteDescription(new RTCSessionDescription(data.answer));
                            while (iceQueue.current.length) await pc!.addIceCandidate(new RTCIceCandidate(iceQueue.current.shift()!));
                        } else if (data.type === "candidate") {
                            if (pc!.remoteDescription) await pc!.addIceCandidate(new RTCIceCandidate(data.candidate));
                            else iceQueue.current.push(data.candidate);
                        } else if (data.type === "announce") {
                            if (roleRef.current === "TEACHER" && !pc!.remoteDescription) {
                                const offer = await pc!.createOffer();
                                await pc!.setLocalDescription(offer);
                                client!.publish({
                                    destination: `/app/room/${sessionId}/signal`,
                                    body: JSON.stringify({ type: "offer", offer, sender: roleRef.current }),
                                });
                            }
                        } else if (data.type === "SCREEN_OFF") {
                            setRemoteScreenStream(null);
                            setTab("whiteboard");
                        } else if (data.type === "PEER_LEFT") {
                            setPeerConnected(false);
                            setPeerLeft(true);
                        }
                    } catch (e) { console.error("[STOMP] signal:", e); }
                });

                announceTimer = setInterval(() => {
                    if (pc?.connectionState !== "connected" && client?.connected) {
                        client!.publish({
                            destination: `/app/room/${sessionId}/signal`,
                            body: JSON.stringify({ type: "announce", sender: roleRef.current }),
                        });
                    } else {
                        if (announceTimer) clearInterval(announceTimer);
                    }
                }, 2000);

                stompClientRef.current = client;
                setStompClient(client);
            },
            onDisconnect: () => { stompClientRef.current = null; setStompClient(null); },
        });

        client.activate();
    };

    useEffect(() => {
        // Cleanup function for when component unmounts
        return () => {
            if (stompClientRef.current?.connected) {
                try {
                    stompClientRef.current.publish({
                        destination: `/app/room/${sessionId}/signal`,
                        body: JSON.stringify({ type: "PEER_LEFT", sender: roleRef.current }),
                    });
                } catch { /* ignore */ }
            }
            localCameraStreamRef.current?.getTracks().forEach(t => t.stop());
            pcRef.current?.close();
            stompClientRef.current?.deactivate();
        };
    }, [sessionId]);

    const handleJoinRoom = () => {
        setHasJoined(true);
        startSetup();
    };

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
            stompClientRef.current?.publish({
                destination: `/app/room/${sessionId}/signal`,
                body: JSON.stringify({ type: "SCREEN_OFF", sender: roleRef.current }),
            });
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            const track = stream.getVideoTracks()[0];

            if (pcRef.current) screenSenderRef.current = pcRef.current.addTrack(track, stream);

            setLocalScreenStream(stream);
            setIsSharingScreen(true);
            setTab("screen");
            track.onended = () => handleScreenShare();
        } catch (err) {
            console.error("[ScreenShare]", err);
            toast.error("Could not start screen sharing.");
        }
    };

    const handleEndSession = async () => {
        if (window.confirm("Are you sure you want to end this session?")) {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.publish({
                    destination: `/app/room/${sessionId}/signal`,
                    body: JSON.stringify({ type: "PEER_LEFT", sender: roleRef.current }),
                });
            }
            try { await api.put(`/sessions/${sessionId}/status?status=COMPLETED`); } catch { /* silent */ }
            setShowFeedback(true);
        }
    };

    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    if (!hasJoined) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-sans overflow-hidden p-6 relative">
                {/* Subtle background glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-[40rem] h-[40rem] bg-blue-500/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="z-10 bg-white/5 border border-white/10 p-10 md:p-14 rounded-3xl flex flex-col items-center text-center max-w-lg shadow-2xl backdrop-blur-xl w-full">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/20">
                        <Video className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif italic mb-3 tracking-tight">Join Session</h1>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed px-4">
                        You are about to enter the room as <span className="text-white font-medium">{role}</span> with <span className="text-white font-medium">{partnerName}</span>. 
                        Your browser will ask for camera and microphone permissions when you click join.
                    </p>
                    <Button onClick={handleJoinRoom} className="w-full bg-white hover:bg-gray-200 text-black uppercase tracking-widest text-xs font-bold h-14 rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
                        Join Room
                    </Button>
                    <button onClick={() => navigate("/dashboard")} className="mt-6 text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a] text-white font-sans overflow-hidden">
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
                    <div className="hidden xs:block sm:hidden font-mono text-[10px] text-white/40 mr-1">{fmt(elapsed)}</div>
                    <button onClick={handleEndSession} className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-500 hover:text-red-500 font-bold transition-colors">
                        End
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
                <div className="flex-1 flex flex-col gap-2 md:gap-4 min-w-0">
                    <div className="flex-1 bg-black/40 rounded-xl md:rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm relative">
                        {tab === "whiteboard" && <Whiteboard stompClient={stompClient} sessionId={sessionId} role={role} />}

                        {tab === "agenda" && (
                            <div className="h-full flex items-center justify-center p-4 md:p-8 overflow-y-auto">
                                <AgendaPanel
                                    sessionId={sessionId} role={role} sessionStatus={"IN_PROGRESS"}
                                    onStatusChange={() => {}} onProgressChange={setCompletionPct} refreshTrigger={0}
                                />
                            </div>
                        )}

                        {tab === "screen" && (
                            <div className="h-full w-full bg-black flex items-center justify-center relative">
                                {isSharingScreen ? (
                                    <video autoPlay playsInline muted className="max-w-full max-h-full object-contain" ref={(el) => { if (el && localScreenStream) el.srcObject = localScreenStream; }} />
                                ) : (
                                    <video key={remoteScreenStream?.id ?? "no-screen"} autoPlay playsInline className="max-w-full max-h-full object-contain" ref={(el) => { if (el && remoteScreenStream) el.srcObject = remoteScreenStream; }} />
                                )}
                                {isSharingScreen && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">You are presenting</div>
                                )}
                            </div>
                        )}

                        <div className="absolute bottom-2 right-2 md:bottom-6 md:right-6 flex flex-row gap-2 z-30">
                            <div className="w-20 md:w-48 aspect-video bg-gray-900 rounded-lg md:rounded-xl border border-white/10 shadow-2xl overflow-hidden relative">
                                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                                {!videoOn && (
                                    <div className="absolute inset-0 bg-gray-950 flex items-center justify-center">
                                        <div className="w-8 md:w-12 h-8 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            <VideoOff className="w-3 md:w-5 h-3 md:h-5 text-gray-600" />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[6px] md:text-[8px] uppercase tracking-tighter">You</div>
                                {!micOn && (
                                    <div className="absolute top-1 right-1 p-0.5 md:p-1 bg-red-500/80 rounded-full">
                                        <MicOff className="w-2 md:w-3 h-2 md:h-3 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="w-20 md:w-48 aspect-video bg-gray-900 rounded-lg md:rounded-xl border border-white/10 shadow-2xl overflow-hidden relative">
                                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
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

                    <div className="h-16 md:h-20 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shrink-0">
                        <div className="flex items-center gap-2 md:gap-4">
                            <ControlBtn active={micOn} onClick={() => setMicOn(v => !v)} danger={!micOn} className="h-10 w-10 md:h-12 md:w-12">
                                {micOn ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
                            </ControlBtn>
                            <ControlBtn active={videoOn} onClick={() => setVideoOn(v => !v)} danger={!videoOn} className="h-10 w-10 md:h-12 md:w-12">
                                {videoOn ? <Video className="w-4 h-4 md:w-5 md:h-5" /> : <VideoOff className="w-4 h-4 md:w-5 md:h-5" />}
                            </ControlBtn>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2 p-1 bg-black/40 rounded-lg md:rounded-xl border border-white/5">
                            {(["whiteboard", "agenda"] as const).map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`px-3 md:px-6 py-2 md:py-2.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold uppercase tracking-widest transition-all ${tab === t ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-white"}`}>
                                    {t}
                                </button>
                            ))}
                            {tab === "screen" && (
                                <div className="px-3 md:px-6 py-2 md:py-2.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold uppercase tracking-widest bg-blue-500 text-white animate-pulse">
                                    Screen
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <ControlBtn onClick={handleScreenShare} active={isSharingScreen} className={`h-10 w-10 md:h-12 md:w-12 ${isSharingScreen ? "bg-blue-500/20 text-blue-500 border-blue-500/50" : ""}`}>
                                <Monitor className="w-4 h-4 md:w-5 md:h-5" />
                            </ControlBtn>
                            <ControlBtn onClick={handleEndSession} danger className="h-10 w-10 md:h-12 md:w-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20">
                                <PhoneOff className="w-4 h-4 md:w-5 md:h-5" />
                            </ControlBtn>
                        </div>
                    </div>
                </div>
            </main>

            {/* Permission Error Modal */}
            <AnimatePresence>
                {cameraPermissionError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 md:p-8 backdrop-blur-md">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6 md:mb-8">
                            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif italic mb-4 text-center leading-tight">Camera Permission Required</h2>
                        
                        {permissionErrorType === "unsupported" && (
                            <p className="text-gray-400 text-sm md:text-lg text-center max-w-lg font-light leading-relaxed mb-8">
                                Your browser is blocking access because the connection is not secure. <strong className="text-white">Browsers require HTTPS or 'localhost'</strong> to use the camera. If you are accessing via an IP address (like 192.168...), please use localhost instead.
                            </p>
                        )}
                        {permissionErrorType === "denied" && (
                            <div className="flex flex-col items-center mb-8">
                                <p className="text-gray-400 text-sm md:text-lg text-center max-w-lg font-light leading-relaxed mb-4">
                                    You have previously blocked camera access for this site. The browser will not ask again automatically.
                                </p>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-left max-w-md">
                                    <p className="text-white text-sm font-bold mb-2">How to fix this:</p>
                                    <ol className="text-gray-400 text-xs md:text-sm list-decimal list-inside space-y-2">
                                        <li>Click the <strong className="text-white">Lock icon (🔒)</strong> or Settings icon in your browser's address bar (top left).</li>
                                        <li>Find <strong className="text-white">Camera</strong> and <strong className="text-white">Microphone</strong>.</li>
                                        <li>Change the setting from "Block" to <strong className="text-white">"Allow"</strong>.</li>
                                        <li>Click the Retry button below.</li>
                                    </ol>
                                </div>
                            </div>
                        )}
                        {permissionErrorType === "other" && (
                            <p className="text-gray-400 text-sm md:text-lg text-center max-w-md font-light leading-relaxed mb-8">
                                We could not detect a camera or microphone. Please ensure your hardware is connected and try again.
                            </p>
                        )}

                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => navigate("/dashboard")} className="rounded-none border-white/20 text-[10px] px-8 uppercase tracking-widest h-12">
                                Back to Dashboard
                            </Button>
                            <Button onClick={startSetup} className="rounded-none bg-white text-black text-[10px] px-8 uppercase tracking-widest h-12">
                                Retry Permissions
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Peer left */}
            <AnimatePresence>
                {peerLeft && !showFeedback && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-lg">
                        <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }}
                            className="bg-[#111] border border-white/10 text-white w-full max-w-sm p-8 rounded-2xl flex flex-col items-center text-center shadow-2xl">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5">
                                <UserX className="w-8 h-8 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">{partnerName} has left</h2>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                Your session partner has disconnected. You can end the session or wait for them to reconnect.
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                                <Button onClick={handleEndSession} className="w-full bg-red-600 hover:bg-red-700 text-white uppercase tracking-widest text-[10px] h-12 rounded-xl">
                                    End Session
                                </Button>
                                <Button variant="outline" onClick={() => setPeerLeft(false)} className="w-full border-white/10 text-gray-400 hover:text-white uppercase tracking-widest text-[10px] h-12 rounded-xl">
                                    Wait for Reconnect
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Session ended */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-lg">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white text-black w-full max-w-md p-10 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-black" />
                            <h2 className="text-2xl font-serif italic mb-2 tracking-tight">Session Concluded</h2>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-10 font-bold">Feedback module coming soon</p>
                            <Button onClick={() => navigate("/dashboard")} className="w-full rounded-none bg-black text-white uppercase tracking-widest text-[10px] h-14">
                                Return to Dashboard
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeachingRoom;
