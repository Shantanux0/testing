import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import ChatSidebar from "@/components/messages/ChatSidebar";
import ChatWindow from "@/components/messages/ChatWindow";

export interface Contact {
  id: number;
  name: string;
  initials: string;
  skillTag: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  avatar?: string;
}

export interface Message {
  id: number;
  text: string;
  time: string;
  isOwn: boolean;
  isRead: boolean;
}

const contacts: Contact[] = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    skillTag: "React Mentor",
    lastMessage: "That useEffect example was really helpful!",
    time: "2m ago",
    unread: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "Mike Johnson",
    initials: "MJ",
    skillTag: "UI/UX Expert",
    lastMessage: "I'll send you the Figma link tomorrow",
    time: "15m ago",
    unread: 0,
    isOnline: true,
  },
  {
    id: 3,
    name: "Emily Davis",
    initials: "ED",
    skillTag: "Python Mentor",
    lastMessage: "Great progress on the ML project! 🎉",
    time: "1h ago",
    unread: 0,
    isOnline: false,
  },
  {
    id: 4,
    name: "Alex Kim",
    initials: "AK",
    skillTag: "TypeScript Pro",
    lastMessage: "The types are looking much cleaner now",
    time: "3h ago",
    unread: 5,
    isOnline: true,
  },
  {
    id: 5,
    name: "Jordan Lee",
    initials: "JL",
    skillTag: "Node.js Expert",
    lastMessage: "Check out this API pattern I mentioned",
    time: "Yesterday",
    unread: 0,
    isOnline: false,
  },
];

const messagesByContact: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hey! Are you ready for our React session?", time: "10:30 AM", isOwn: false, isRead: true },
    { id: 2, text: "Yes! I've been practicing hooks all week", time: "10:31 AM", isOwn: true, isRead: true },
    { id: 3, text: "Perfect! Let's start with useEffect. It's one of the most important hooks to master.", time: "10:32 AM", isOwn: false, isRead: true },
    { id: 4, text: "I always get confused with the dependency array 😅", time: "10:33 AM", isOwn: true, isRead: true },
    { id: 5, text: "That's super common! Think of it like this: the dependency array tells React 'only re-run this effect when these values change'", time: "10:34 AM", isOwn: false, isRead: true },
    { id: 6, text: "Oh that makes so much more sense!", time: "10:35 AM", isOwn: true, isRead: true },
    { id: 7, text: "That useEffect example was really helpful!", time: "10:36 AM", isOwn: false, isRead: true },
  ],
  2: [
    { id: 1, text: "The new dashboard design looks amazing!", time: "9:00 AM", isOwn: true, isRead: true },
    { id: 2, text: "Thanks! I spent a lot of time on the micro-interactions", time: "9:05 AM", isOwn: false, isRead: true },
    { id: 3, text: "Can you share the Figma file?", time: "9:10 AM", isOwn: true, isRead: true },
    { id: 4, text: "I'll send you the Figma link tomorrow", time: "9:15 AM", isOwn: false, isRead: true },
  ],
  3: [
    { id: 1, text: "How's the machine learning project going?", time: "2:00 PM", isOwn: false, isRead: true },
    { id: 2, text: "Making great progress! The model accuracy is up to 94%", time: "2:05 PM", isOwn: true, isRead: true },
    { id: 3, text: "Great progress on the ML project! 🎉", time: "2:10 PM", isOwn: false, isRead: true },
  ],
  4: [
    { id: 1, text: "I refactored the types like you suggested", time: "11:00 AM", isOwn: true, isRead: true },
    { id: 2, text: "The types are looking much cleaner now", time: "11:30 AM", isOwn: false, isRead: true },
  ],
  5: [
    { id: 1, text: "What's the best pattern for REST APIs?", time: "Yesterday", isOwn: true, isRead: true },
    { id: 2, text: "Check out this API pattern I mentioned", time: "Yesterday", isOwn: false, isRead: true },
  ],
};

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setMessages(messagesByContact[contact.id] || []);
  };

  const handleSendMessage = (text: string) => {
    if (!selectedContact) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      isRead: false,
    };
    
    setMessages([...messages, newMessage]);
  };

  const handleBack = () => {
    setSelectedContact(null);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.skillTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="h-[calc(100vh-5rem)] lg:h-screen flex">
        {/* Sidebar - Hidden on mobile when chat is open */}
        <div
          className={`w-full lg:w-96 shrink-0 border-r border-border ${
            selectedContact ? "hidden lg:block" : "block"
          }`}
        >
          <ChatSidebar
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Chat Window */}
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <motion.div
              key="chat"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="flex-1 lg:block"
            >
              <ChatWindow
                contact={selectedContact}
                messages={messages}
                onSendMessage={handleSendMessage}
                onBack={handleBack}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:flex flex-1 items-center justify-center"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default Messages;
