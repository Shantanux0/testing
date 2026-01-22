package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository;

import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserSkillLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillLevelRepository extends JpaRepository<UserSkillLevel, Long> {

    /**
     * Find all skill levels for a specific user
     */
    List<UserSkillLevel> findByUserId(Long userId);

    /**
     * Find a specific skill level for a user and skill combination
     */
    Optional<UserSkillLevel> findByUserIdAndSkillName(Long userId, String skillName);

    /**
     * Find all users who can teach a specific skill (willing to teach)
     */
    List<UserSkillLevel> findBySkillNameAndWillingToTeach(String skillName, Boolean willingToTeach);

    /**
     * Find all users at a specific proficiency level
     */
    List<UserSkillLevel> findByProficiencyLevel(String proficiencyLevel);
}
