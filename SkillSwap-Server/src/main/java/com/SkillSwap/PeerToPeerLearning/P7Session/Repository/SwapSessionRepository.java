package com.SkillSwap.PeerToPeerLearning.P7Session.Repository;

import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SwapSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwapSessionRepository extends JpaRepository<SwapSessionEntity, Long> {

    @Query("SELECT s FROM SwapSessionEntity s " +
            "LEFT JOIN FETCH s.learner " +
            "LEFT JOIN FETCH s.teacher " +
            "WHERE s.learner.id = :userId OR s.teacher.id = :userId")
    List<SwapSessionEntity> findByLearnerIdOrTeacherId(@Param("userId") Long learnerId,
            @Param("userId") Long teacherId);

    // Check for duplicate pending requests
    boolean existsByLearnerIdAndTeacherIdAndSkillNameAndStatus(Long learnerId, Long teacherId, String skillName,
            String status);
}
