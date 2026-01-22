package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.Repository;


import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.Entity.ExperienceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<ExperienceEntity, Long> {

    // Find all experience entries belonging to a specific user
    List<ExperienceEntity> findByUser_Id(Long userId);

    // Find a specific experience entry by its ID and ensure it belongs to the given user ID
    List<ExperienceEntity> findByIdAndUser_Id(Long id, Long userId);
}