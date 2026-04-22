package com.SkillSwap.PeerToPeerLearning.P7Session.Controller;

import com.SkillSwap.PeerToPeerLearning.P7Session.Dto.AgendaItemDto;
import com.SkillSwap.PeerToPeerLearning.P7Session.Dto.CreateAgendaRequest;
import com.SkillSwap.PeerToPeerLearning.P7Session.Dto.SessionFeedbackDto;
import com.SkillSwap.PeerToPeerLearning.P7Session.Service.AgendaService;
import com.SkillSwap.PeerToPeerLearning.P7Session.Service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class TeachingController {

    private final AgendaService agendaService;
    private final FeedbackService feedbackService;

    // ─── AGENDA ──────────────────────────────────────────────

    /**
     * POST /api/sessions/{sessionId}/agenda
     * Teacher creates/replaces agenda items for a session.
     */
    @PostMapping("/{sessionId}/agenda")
    public ResponseEntity<List<AgendaItemDto>> createAgenda(
            @PathVariable Long sessionId,
            @RequestBody CreateAgendaRequest request,
            Authentication auth) {
        return ResponseEntity.ok(agendaService.createAgenda(auth.getName(), sessionId, request));
    }

    /**
     * GET /api/sessions/{sessionId}/agenda
     * Both teacher and learner can view the agenda.
     */
    @GetMapping("/{sessionId}/agenda")
    public ResponseEntity<List<AgendaItemDto>> getAgenda(@PathVariable Long sessionId) {
        return ResponseEntity.ok(agendaService.getAgenda(sessionId));
    }

    /**
     * PATCH /api/sessions/agenda/{itemId}/complete?done=true|false
     * Learner marks or un-marks an agenda item.
     */
    @PatchMapping("/agenda/{itemId}/complete")
    public ResponseEntity<AgendaItemDto> markAgendaItem(
            @PathVariable Long itemId,
            @RequestParam(defaultValue = "true") boolean done,
            Authentication auth) {
        return ResponseEntity.ok(agendaService.markItem(auth.getName(), itemId, done));
    }

    /**
     * GET /api/sessions/{sessionId}/progress
     * Returns completion percentage of the agenda.
     */
    @GetMapping("/{sessionId}/progress")
    public ResponseEntity<Map<String, Object>> getProgress(@PathVariable Long sessionId) {
        double rate = agendaService.getCompletionRate(sessionId);
        return ResponseEntity.ok(Map.of("sessionId", sessionId, "completionPercent", rate));
    }

    /**
     * POST /api/sessions/{sessionId}/agenda/start-class
     * Teacher marks the agenda as set and starts the official session.
     */
    @PostMapping("/{sessionId}/agenda/start-class")
    public ResponseEntity<com.SkillSwap.PeerToPeerLearning.P7Session.Dto.SessionDto> startClass(
            @PathVariable Long sessionId,
            Authentication auth) {
        return ResponseEntity.ok(agendaService.startSession(auth.getName(), sessionId));
    }

    // ─── FEEDBACK ────────────────────────────────────────────

    /**
     * POST /api/sessions/{sessionId}/feedback
     * Submit star rating + comment after session completes.
     * Body: { "rating": 4, "comment": "Great teacher!" }
     */
    @PostMapping("/{sessionId}/feedback")
    public ResponseEntity<SessionFeedbackDto> submitFeedback(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Integer rating = (Integer) body.get("rating");
        String comment = (String) body.getOrDefault("comment", "");
        return ResponseEntity.ok(feedbackService.submitFeedback(auth.getName(), sessionId, rating, comment));
    }

    /**
     * GET /api/sessions/{sessionId}/feedback
     * Get all feedback entries for a session.
     */
    @GetMapping("/{sessionId}/feedback")
    public ResponseEntity<List<SessionFeedbackDto>> getSessionFeedback(@PathVariable Long sessionId) {
        return ResponseEntity.ok(feedbackService.getSessionFeedback(sessionId));
    }

    /**
     * GET /api/sessions/{sessionId}/feedback/submitted
     * Check if the current user has already submitted feedback.
     */
    @GetMapping("/{sessionId}/feedback/submitted")
    public ResponseEntity<Map<String, Boolean>> hasFeedback(
            @PathVariable Long sessionId,
            Authentication auth) {
        boolean submitted = feedbackService.hasSubmittedFeedback(auth.getName(), sessionId);
        return ResponseEntity.ok(Map.of("submitted", submitted));
    }

    /**
     * GET /api/sessions/feedback/my-stats
     * Get the current user's average star rating as a teacher.
     */
    @GetMapping("/feedback/my-stats")
    public ResponseEntity<Map<String, Object>> getMyTeachingStats(Authentication auth) {
        return ResponseEntity.ok(feedbackService.getTeacherStats(auth.getName()));
    }
}
