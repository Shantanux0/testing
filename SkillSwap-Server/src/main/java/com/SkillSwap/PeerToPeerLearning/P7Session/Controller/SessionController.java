package com.SkillSwap.PeerToPeerLearning.P7Session.Controller;

import com.SkillSwap.PeerToPeerLearning.P7Session.Dto.SessionDto;
import com.SkillSwap.PeerToPeerLearning.P7Session.Service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor

public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/request")
    public ResponseEntity<SessionDto> requestSession(
            @RequestParam Long teacherId,
            @RequestParam String skill,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(sessionService.requestSession(email, teacherId, skill));
    }

    @PutMapping("/{sessionId}/status")
    public ResponseEntity<SessionDto> updateStatus(
            @PathVariable Long sessionId,
            @RequestParam String status,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(sessionService.updateSessionStatus(email, sessionId, status));
    }

    @GetMapping("/my-sessions")
    public ResponseEntity<List<SessionDto>> getMySessions(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(sessionService.getMySessions(email));
    }
}
