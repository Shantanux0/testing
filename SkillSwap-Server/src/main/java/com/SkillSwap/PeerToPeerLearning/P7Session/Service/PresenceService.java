package com.SkillSwap.PeerToPeerLearning.P7Session.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SessionPresenceEntity;
import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SwapSessionEntity;
import com.SkillSwap.PeerToPeerLearning.P7Session.Repository.SessionPresenceRepository;
import com.SkillSwap.PeerToPeerLearning.P7Session.Repository.SwapSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PresenceService {

    private final SessionPresenceRepository presenceRepository;
    private final SwapSessionRepository sessionRepository;
    private final UserAuthRepo userAuthRepo;

    private static final int HEARTBEAT_TIMEOUT_SECONDS = 30;

    /** Called when user enters the room — upserts their presence record */
    public Map<String, Object> joinRoom(String email, Long sessionId) {
        UserAuthEntity user = findByEmail(email);
        SwapSessionEntity session = findSession(sessionId);
        validateParticipant(session, user);

        SessionPresenceEntity presence = presenceRepository.findBySessionIdAndUserId(sessionId, user.getId())
                .orElse(SessionPresenceEntity.builder()
                        .session(session)
                        .user(user)
                        .build());

        presence.setActive(true);
        presence.setLeaveRequested(false);
        presenceRepository.save(presence);

        return buildRoomState(sessionId, user.getId());
    }

    /** Heartbeat — keeps the user "alive" in the room (call every 10s) */
    public Map<String, Object> heartbeat(String email, Long sessionId) {
        UserAuthEntity user = findByEmail(email);
        SessionPresenceEntity presence = presenceRepository.findBySessionIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not in room — call join first"));

        // Touch lastSeen via @UpdateTimestamp — just save
        presenceRepository.save(presence);

        return buildRoomState(sessionId, user.getId());
    }

    /** User requests to leave — sets flag, partner must approve */
    public Map<String, Object> requestLeave(String email, Long sessionId) {
        UserAuthEntity user = findByEmail(email);
        SessionPresenceEntity presence = presenceRepository.findBySessionIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not in room"));

        presence.setLeaveRequested(true);
        presenceRepository.save(presence);
        return buildRoomState(sessionId, user.getId());
    }

    /** Partner approves the leave — both are removed from the room */
    public void approveLeave(String email, Long sessionId) {
        UserAuthEntity user = findByEmail(email);
        SwapSessionEntity session = findSession(sessionId);
        validateParticipant(session, user);

        // Mark everyone in this session as inactive
        List<SessionPresenceEntity> all = presenceRepository.findBySessionId(sessionId);
        all.forEach(p -> {
            p.setActive(false);
            p.setLeaveRequested(false);
        });
        presenceRepository.saveAll(all);
    }

    /** User cancels their own leave request */
    public Map<String, Object> cancelLeave(String email, Long sessionId) {
        UserAuthEntity user = findByEmail(email);
        SessionPresenceEntity presence = presenceRepository.findBySessionIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not in room"));

        presence.setLeaveRequested(false);
        presenceRepository.save(presence);
        return buildRoomState(sessionId, user.getId());
    }

    /** Build the room state snapshot returned to the client */
    @Transactional(readOnly = true)
    public Map<String, Object> getRoomState(String email, Long sessionId) {
        UserAuthEntity user = findByEmail(email);
        return buildRoomState(sessionId, user.getId());
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private Map<String, Object> buildRoomState(Long sessionId, Long currentUserId) {
        LocalDateTime since = LocalDateTime.now().minusSeconds(HEARTBEAT_TIMEOUT_SECONDS);
        List<SessionPresenceEntity> records = presenceRepository.findBySessionId(sessionId);

        List<Map<String, Object>> participants = records.stream()
                .filter(p -> p.getActive() && p.getLastSeen() != null && p.getLastSeen().isAfter(since))
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("userId", p.getUser().getId());
                    m.put("name", p.getUser().getName());
                    m.put("isCurrentUser", p.getUser().getId().equals(currentUserId));
                    m.put("leaveRequested", p.getLeaveRequested());
                    return m;
                })
                .collect(Collectors.toList());

        boolean partnerPresent = participants.stream().anyMatch(p -> !(Boolean) p.get("isCurrentUser"));
        boolean leaveRequestedByPartner = records.stream()
                .anyMatch(p -> !p.getUser().getId().equals(currentUserId) && p.getLeaveRequested());
        boolean leaveRequestedBySelf = records.stream()
                .anyMatch(p -> p.getUser().getId().equals(currentUserId) && p.getLeaveRequested());

        Map<String, Object> state = new HashMap<>();
        state.put("participants", participants);
        state.put("partnerPresent", partnerPresent);
        state.put("leaveRequestedByPartner", leaveRequestedByPartner);
        state.put("leaveRequestedBySelf", leaveRequestedBySelf);
        state.put("totalActive", participants.size());
        return state;
    }

    private UserAuthEntity findByEmail(String email) {
        return userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private SwapSessionEntity findSession(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    }

    private void validateParticipant(SwapSessionEntity session, UserAuthEntity user) {
        boolean isParticipant = session.getTeacher().getId().equals(user.getId())
                || session.getLearner().getId().equals(user.getId());
        if (!isParticipant)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a participant of this session");
    }
}
