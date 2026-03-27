package com.SkillSwap.PeerToPeerLearning.P7Session.Repository;

import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SessionAgendaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionAgendaRepository extends JpaRepository<SessionAgendaEntity, Long> {
    List<SessionAgendaEntity> findBySessionIdOrderByOrderIndexAsc(Long sessionId);

    long countBySessionId(Long sessionId);

    long countBySessionIdAndIsCompleted(Long sessionId, Boolean isCompleted);
}
