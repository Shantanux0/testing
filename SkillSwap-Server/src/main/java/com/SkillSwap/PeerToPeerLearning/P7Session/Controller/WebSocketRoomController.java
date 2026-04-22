package com.SkillSwap.PeerToPeerLearning.P7Session.Controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import lombok.RequiredArgsConstructor;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class WebSocketRoomController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * WebRTC Signaling (Offers, Answers, ICE Candidates)
     * Client sends payload to /app/room/{sessionId}/signal
     * Server relays to /topic/room/{sessionId}/signal
     */
    @MessageMapping("/room/{sessionId}/signal")
    public void handleSignaling(@DestinationVariable Long sessionId, @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/room/" + sessionId + "/signal", payload);
    }

    /**
     * Whiteboard Drawing Sync
     * Client sends payload to /app/room/{sessionId}/whiteboard
     * Server relays to /topic/room/{sessionId}/whiteboard
     */
    @MessageMapping("/room/{sessionId}/whiteboard")
    public void handleWhiteboard(@DestinationVariable Long sessionId, @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/room/" + sessionId + "/whiteboard", payload);
    }
}
