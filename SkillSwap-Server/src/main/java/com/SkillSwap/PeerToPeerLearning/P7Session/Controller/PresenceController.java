package com.SkillSwap.PeerToPeerLearning.P7Session.Controller;

import com.SkillSwap.PeerToPeerLearning.P7Session.Service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    /** Join the room */
    @PostMapping("/{sessionId}/room/join")
    public ResponseEntity<Map<String, Object>> join(@PathVariable Long sessionId, Authentication auth) {
        return ResponseEntity.ok(presenceService.joinRoom(auth.getName(), sessionId));
    }

    /** Heartbeat (keep alive) */
    @PostMapping("/{sessionId}/room/heartbeat")
    public ResponseEntity<Map<String, Object>> heartbeat(@PathVariable Long sessionId, Authentication auth) {
        return ResponseEntity.ok(presenceService.heartbeat(auth.getName(), sessionId));
    }

    /** Poll room state */
    @GetMapping("/{sessionId}/room/state")
    public ResponseEntity<Map<String, Object>> getState(@PathVariable Long sessionId, Authentication auth) {
        return ResponseEntity.ok(presenceService.getRoomState(auth.getName(), sessionId));
    }

    /** Request to leave (needs partner approval) */
    @PostMapping("/{sessionId}/room/leave-request")
    public ResponseEntity<Map<String, Object>> requestLeave(@PathVariable Long sessionId, Authentication auth) {
        return ResponseEntity.ok(presenceService.requestLeave(auth.getName(), sessionId));
    }

    /** Approve partner's leave request — both exit */
    @PostMapping("/{sessionId}/room/approve-leave")
    public ResponseEntity<Void> approveLeave(@PathVariable Long sessionId, Authentication auth) {
        presenceService.approveLeave(auth.getName(), sessionId);
        return ResponseEntity.ok().build();
    }

    /** Cancel your own leave request */
    @PostMapping("/{sessionId}/room/cancel-leave")
    public ResponseEntity<Map<String, Object>> cancelLeave(@PathVariable Long sessionId, Authentication auth) {
        return ResponseEntity.ok(presenceService.cancelLeave(auth.getName(), sessionId));
    }
}
