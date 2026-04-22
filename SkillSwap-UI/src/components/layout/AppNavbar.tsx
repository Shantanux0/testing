import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Bell, CheckCircle2, Sparkles, Menu, X, LayoutDashboard, MessageSquare, FileText, BadgeCheck, Plus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { notificationApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Re-using common dropdown components
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const AppNavbar = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getMyNotifications();
            const notifications = Array.isArray(data) ? data : [];
            setNotifications(notifications);
            setUnreadCount(notifications.filter((n: any) => !n.read).length);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleMarkRead = async (id: number) => {
        try {
            await notificationApi.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) { }
    };

    const navLinks = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Create Swap", path: "/create-swap", icon: Plus },
        { name: "Messages", path: "/swaps", icon: MessageSquare },
        { name: "Resume", path: "/resume", icon: FileText },
        { name: "Tests", path: "/tests", icon: BadgeCheck },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 md:px-8 py-3 md:py-4 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-black/5" : "bg-white border-b border-black/5"}`}>
                <div className="flex items-center gap-12">
                    <Logo className="text-black" />
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link key={link.path} to={link.path} className={`text-xs uppercase tracking-widest transition-colors font-semibold ${location.pathname === link.path ? "text-black underline underline-offset-8 decoration-2" : "text-black/60 hover:text-black"}`}>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-6">
                    {/* Notifications */}
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative w-9 h-9 md:w-10 md:h-10 rounded-full p-0" onClick={fetchNotifications}>
                                    <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
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
                                    {(notifications || []).length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-xs">No notifications yet.</div>
                                    ) : (
                                        (notifications || []).map((n) => (
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
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/profile">
                            <Button variant="ghost" className="text-xs uppercase tracking-widest gap-2">
                                <User className="w-4 h-4" /> Profile
                            </Button>
                        </Link>
                        <Button
                            onClick={signOut}
                            variant="outline"
                            className="rounded-none border-black hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest px-6 h-9"
                        >
                            Log Out
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-black hover:bg-gray-50 transition-colors">
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[80] md:hidden shadow-2xl p-8 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <Logo className="text-black" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-50 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-2">
                                {navLinks.map(link => (
                                    <Link key={link.path} to={link.path} className={`flex items-center gap-4 py-4 px-4 rounded-xl transition-all ${location.pathname === link.path ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}>
                                        <link.icon className="w-5 h-5" />
                                        <span className="font-serif text-lg font-medium">{link.name}</span>
                                    </Link>
                                ))}
                                <Link to="/profile" className="flex items-center gap-4 py-4 px-4 rounded-xl text-gray-500 hover:bg-gray-50">
                                    <User className="w-5 h-5" />
                                    <span className="font-serif text-lg font-medium">Profile</span>
                                </Link>
                            </div>

                            <div className="pt-8 border-t border-gray-100 mt-auto">
                                <Button onClick={signOut} variant="outline" className="w-full rounded-none h-14 uppercase tracking-widest text-xs border-black hover:bg-black hover:text-white">
                                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default AppNavbar;
