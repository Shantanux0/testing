package com.SkillSwap.PeerToPeerLearning.P7Session.Listener;

import com.SkillSwap.PeerToPeerLearning.P7Session.Service.SessionPresenceService;
import com.SkillSwap.PeerToPeerLearning.P7Session.Service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SessionPresenceService presenceService;
    private final SessionService sessionService;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private static final Pattern SESSION_PATTERN = Pattern.compile("/topic/room/(\\d+)/.*");

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();
        String email = accessor.getUser() != null ? accessor.getUser().getName() : null;

        if (destination != null && email != null) {
            Matcher matcher = SESSION_PATTERN.matcher(destination);
            if (matcher.find()) {
                Long sessionId = Long.parseLong(matcher.group(1));
                presenceService.addUser(sessionId, email);
                log.info("User {} joined session room {}", email, sessionId);
                
                // Store sessionId in session attributes for disconnect handling
                if (accessor.getSessionAttributes() != null) {
                    accessor.getSessionAttributes().put("sessionId", sessionId);
                    accessor.getSessionAttributes().put("userEmail", email);
                }
            }
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (accessor.getSessionAttributes() == null) return;

        Long sessionId = (Long) accessor.getSessionAttributes().get("sessionId");
        String email = (String) accessor.getSessionAttributes().get("userEmail");

        if (sessionId != null && email != null) {
            presenceService.removeUser(sessionId, email);
            log.info("User {} disconnected from session room {}", email, sessionId);

            // Check if room is empty and trigger delayed cleanup
            if (presenceService.isRoomEmpty(sessionId)) {
                log.info("Session room {} is empty. Scheduling auto-termination in 15 seconds.", sessionId);
                scheduler.schedule(() -> {
                    if (presenceService.isRoomEmpty(sessionId)) {
                        log.info("Auto-terminating session {} as it remains empty.", sessionId);
                        sessionService.concludeSessionInternal(sessionId);
                    }
                }, 15, TimeUnit.SECONDS);
            }
        }
    }
}
