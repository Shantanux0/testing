package com.SkillSwap.PeerToPeerLearning.P4testPortal.Repository;


import com.SkillSwap.PeerToPeerLearning.P4testPortal.Entity.UserSkillTestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillTestRepository extends JpaRepository<UserSkillTestEntity, Long> {

    // Find all tests for a specific user
    List<UserSkillTestEntity> findByUser_IdOrderByCreatedAtDesc(Long userId);

    // Find a specific test by ID and user ID (for authorization)
    Optional<UserSkillTestEntity> findByIdAndUser_Id(Long testId, Long userId);

    // Find all passed tests for a user and skill
    List<UserSkillTestEntity> findByUser_IdAndSkillNameAndIsPassed(Long userId, String skillName, Boolean isPassed);

    // Find pending/in-progress tests for a user
    List<UserSkillTestEntity> findByUser_IdAndTestStatusIn(Long userId, List<String> statuses);

    // Check if user has already passed a test for a skill
    boolean existsByUser_IdAndSkillNameAndIsPassed(Long userId, String skillName, Boolean isPassed);
}