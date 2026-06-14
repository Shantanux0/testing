package com.SkillSwap.PeerToPeerLearning.P4testPortal.Repository;

import com.SkillSwap.PeerToPeerLearning.P4testPortal.Entity.SkillQuestionBankEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillQuestionBankRepository extends JpaRepository<SkillQuestionBankEntity, Long> {
    Optional<SkillQuestionBankEntity> findBySkillNameIgnoreCase(String skillName);
}
