import { Search, Plus, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Contact } from "@/pages/Messages";

interface ChatSidebarProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ChatSidebar = ({
  contacts,
  selectedContact,
  onSelectContact,
  searchQuery,
  onSearchChange,
}: ChatSidebarProps) => {
  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">AL</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar" />
            </div>
            <div>
              <h2 className="font-display font-semibold">Messages</h2>
              <p className="text-xs text-muted-foreground">5 conversations</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                selectedContact?.id === contact.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-secondary/50"
              }`}
            >
              {/* Avatar with Online Status */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-semibold text-foreground">
                    {contact.initials}
                  </span>
                </div>
                {contact.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-sidebar">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate">{contact.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {contact.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="skill-tag text-xs py-0.5 px-2">
                    {contact.skillTag}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {contact.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {contact.unread > 0 && (
                <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-foreground">
                    {contact.unread}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
