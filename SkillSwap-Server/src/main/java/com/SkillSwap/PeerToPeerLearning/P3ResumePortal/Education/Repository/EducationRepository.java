package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.Repository;

import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.Entity.EducationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<EducationEntity, Long> {

    // Find all education entries belonging to a specific user
    List<EducationEntity> findByUser_Id(Long userId);

    // Find a specific education entry by its ID and ensure it belongs to the given user ID
    List<EducationEntity> findByIdAndUser_Id(Long id, Long userId);
}