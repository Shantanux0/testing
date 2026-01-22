package com.SkillSwap.PeerToPeerLearning.P7Session.Repository;

import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SwapSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwapSessionRepository extends JpaRepository<SwapSessionEntity, Long> {

    List<SwapSessionEntity> findByLearnerIdOrTeacherId(Long learnerId, Long teacherId);

    // Check for duplicate pending requests
    boolean existsByLearnerIdAndTeacherIdAndSkillNameAndStatus(Long learnerId, Long teacherId, String skillName,
            String status);
}
