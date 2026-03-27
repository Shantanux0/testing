package com.SkillSwap.PeerToPeerLearning.P7Session.Repository;

import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SessionPresenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionPresenceRepository extends JpaRepository<SessionPresenceEntity, Long> {

    Optional<SessionPresenceEntity> findBySessionIdAndUserId(Long sessionId, Long userId);

    List<SessionPresenceEntity> findBySessionId(Long sessionId);

    // Count active (heartbeat within 30 seconds)
    @Query("SELECT COUNT(p) FROM SessionPresenceEntity p WHERE p.session.id = :sessionId AND p.active = true AND p.lastSeen > :since")
    long countActivePresences(Long sessionId, LocalDateTime since);

    // Any leave request from anyone in this session
    @Query("SELECT COUNT(p) FROM SessionPresenceEntity p WHERE p.session.id = :sessionId AND p.leaveRequested = true")
    long countLeaveRequests(Long sessionId);
}
