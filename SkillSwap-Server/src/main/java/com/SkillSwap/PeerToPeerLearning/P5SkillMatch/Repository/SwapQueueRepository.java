package com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Repository;

import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Entity.SwapQueueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwapQueueRepository extends JpaRepository<SwapQueueEntity, Long> {
    List<SwapQueueEntity> findByUserIdAndStatus(Long userId, String status);
    List<SwapQueueEntity> findByStatus(String status);
}
