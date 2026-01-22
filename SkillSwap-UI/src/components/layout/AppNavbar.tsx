import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Bell, CheckCircle2, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { notificationApi } from "@/lib/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppNavbar = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getMyNotifications();
            setNotifications(data);
            setUnreadCount(data.filter((n: any) => !n.read).length);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 10 seconds for real-time feel
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id: number) => {
        try {
            await notificationApi.markRead(id);
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) { }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-black/5">
            <div className="flex items-center gap-12">
                <Logo className="text-black" />
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/dashboard" className="text-xs uppercase tracking-widest text-black/60 hover:text-black transition-colors font-semibold">Dashboard</Link>
                    <Link to="/create-swap" className="text-xs uppercase tracking-widest text-black/60 hover:text-black transition-colors font-semibold">Create Swap</Link>
                    <Link to="/sessions" className="text-xs uppercase tracking-widest text-black/60 hover:text-black transition-colors font-semibold">Sessions</Link>
                    <Link to="/tests" className="text-xs uppercase tracking-widest text-black/60 hover:text-black transition-colors font-semibold">Tests</Link>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative w-10 h-10 rounded-full p-0" onClick={fetchNotifications}>
                            <Bell className="w-5 h-5 text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-black/5">
                        <div className="p-4 border-b border-black/5 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif font-bold text-sm">Notifications</h3>
                                {unreadCount > 0 && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                            </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                            {notifications.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-xs">No notifications yet.</div>
                            ) : (
                                notifications.map((n) => (
                                    <DropdownMenuItem key={n.id} onClick={() => handleMarkRead(n.id)} className={`flex flex-col items-start gap-1 p-3 cursor-pointer rounded-lg ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                        <div className="flex items-center gap-2 w-full">
                                            <div className={`p-1.5 rounded-full ${n.type === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {n.type === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : n.type === 'WARNING' ? <Sparkles className="w-3 h-3 text-amber-600" /> : <Bell className="w-3 h-3" />}
                                            </div>
                                            <span className={`font-semibold text-xs ${!n.read ? 'text-black' : 'text-gray-500'}`}>
                                                {n.type === 'SUCCESS' ? 'Request Update' : 'New Notification'}
                                            </span>
                                            <span className="ml-auto text-[10px] text-gray-400">
                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 pl-8 leading-relaxed">
                                            {n.message}
                                        </p>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/profile">
                    <Button variant="ghost" className="text-xs uppercase tracking-widest gap-2">
                        <User className="w-4 h-4" /> Profile
                    </Button>
                </Link>
                <Button
                    onClick={signOut}
                    variant="outline"
                    className="rounded-none border-black hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest px-6"
                >
                    Log Out
                </Button>
            </div>
        </nav>
    );
}

export default AppNavbar;
