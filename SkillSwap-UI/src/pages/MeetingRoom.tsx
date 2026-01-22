import MainLayout from "@/components/layout/MainLayout";
import VideoGrid from "@/components/meeting/VideoGrid";
import ChatPanel from "@/components/meeting/ChatPanel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Layout } from "lucide-react";

const MeetingRoom = () => {
  const [showChat, setShowChat] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(true);

  return (
    <MainLayout>
      <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4 p-4 lg:p-6">
        <div className="flex items-center justify-between gap-3 mb-2 lg:mb-0 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTheaterMode((prev) => !prev)}
          >
            <Layout className="w-4 h-4 mr-2" />
            {isTheaterMode ? "Grid view" : "Theater view"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat((prev) => !prev)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {showChat ? "Hide chat" : "Show chat"}
          </Button>
        </div>

        <div className="flex-1 min-h-[260px]">
          <VideoGrid isTheaterMode={isTheaterMode} />
        </div>

        <div className="w-full lg:w-96 lg:h-full lg:max-h-[640px] lg:shrink-0">
          <div className={showChat ? "block h-full" : "hidden lg:block h-full"}>
            <ChatPanel onClose={() => setShowChat(false)} isMobile />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MeetingRoom;
