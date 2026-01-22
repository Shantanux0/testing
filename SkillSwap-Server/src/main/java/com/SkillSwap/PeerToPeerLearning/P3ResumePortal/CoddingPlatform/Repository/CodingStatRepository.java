package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.Repository;


import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.Entity.CodingStatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingStatRepository extends JpaRepository<CodingStatEntity, Long> {

    // Find all coding stats belonging to a specific user
    List<CodingStatEntity> findByUser_Id(Long userId);

    // Find a specific stat by its ID and ensure it belongs to the given user ID
    List<CodingStatEntity> findByIdAndUser_Id(Long id, Long userId);
}