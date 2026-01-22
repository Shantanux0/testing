import { motion } from "framer-motion";
import { Mic, MicOff, MoreVertical, Pin } from "lucide-react";

interface VideoGridProps {
  isTheaterMode: boolean;
}

const participants = [
  {
    id: 1,
    name: "You",
    initials: "AL",
    isSpeaking: false,
    isMuted: false,
    isPinned: true,
  },
  {
    id: 2,
    name: "Sarah Chen",
    initials: "SC",
    isSpeaking: true,
    isMuted: false,
    isPinned: false,
  },
];

const VideoGrid = ({ isTheaterMode }: VideoGridProps) => {
  const mainParticipant = participants.find((p) => p.isPinned) || participants[0];
  const otherParticipants = participants.filter((p) => p.id !== mainParticipant.id);

  return (
    <div className="w-full h-full p-4">
      {isTheaterMode ? (
        // Theater Mode: One large video with small thumbnails
        <div className="relative w-full h-full">
          {/* Main Video */}
          <VideoTile participant={mainParticipant} isMain />

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {otherParticipants.map((participant) => (
              <motion.div
                key={participant.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-24 rounded-xl overflow-hidden"
              >
                <VideoTile participant={participant} isSmall />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        // Grid Mode: Equal sized videos
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
          {participants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl overflow-hidden h-full min-h-[200px]"
            >
              <VideoTile participant={participant} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Participant {
  id: number;
  name: string;
  initials: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isPinned: boolean;
}

interface VideoTileProps {
  participant: Participant;
  isMain?: boolean;
  isSmall?: boolean;
}

const VideoTile = ({ participant, isMain, isSmall }: VideoTileProps) => (
  <div
    className={`relative w-full h-full bg-gradient-to-br from-secondary to-background flex items-center justify-center group ${
      participant.isSpeaking ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
    }`}
  >
    {/* Avatar Placeholder */}
    <div
      className={`rounded-full bg-primary/20 flex items-center justify-center ${
        isSmall ? "w-12 h-12" : isMain ? "w-32 h-32" : "w-24 h-24"
      }`}
    >
      <span
        className={`font-display font-bold text-primary ${
          isSmall ? "text-lg" : isMain ? "text-4xl" : "text-2xl"
        }`}
      >
        {participant.initials}
      </span>
    </div>

    {/* Speaking Indicator */}
    {participant.isSpeaking && (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border-2 border-primary/50 rounded-xl animate-pulse" />
      </div>
    )}

    {/* Bottom Bar */}
    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isSmall ? "text-xs" : "text-sm"}`}>
            {participant.name}
          </span>
          {participant.isPinned && !isSmall && (
            <Pin className="w-3 h-3 text-primary" />
          )}
        </div>
        {!isSmall && (
          <div className="flex items-center gap-2">
            {participant.isMuted ? (
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <MicOff className="w-3 h-3 text-red-400" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="w-3 h-3 text-primary" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Hover Actions */}
    {!isSmall && (
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-8 h-8 rounded-lg bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-background/70">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);

export default VideoGrid;
