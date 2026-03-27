package com.SkillSwap.PeerToPeerLearning.P7Session.Repository;

import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SessionFeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionFeedbackRepository extends JpaRepository<SessionFeedbackEntity, Long> {
    List<SessionFeedbackEntity> findBySessionId(Long sessionId);

    boolean existsBySessionIdAndGivenById(Long sessionId, Long givenById);

    Optional<SessionFeedbackEntity> findBySessionIdAndGivenById(Long sessionId, Long givenById);

    List<SessionFeedbackEntity> findByGivenToId(Long givenToId);
}
