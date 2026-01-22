package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.Repository;


import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.Entity.CertificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<CertificationEntity, Long> {

    // Find all certifications belonging to a specific user (via their UserAuthEntity ID)
    List<CertificationEntity> findByUser_Id(Long userId);

    // Find a specific certification by its ID and ensure it belongs to the given user ID
    List<CertificationEntity> findByIdAndUser_Id(Long id, Long userId);

    // Delete all certifications for a specific user
    void deleteByUser_Id(Long userId);
}