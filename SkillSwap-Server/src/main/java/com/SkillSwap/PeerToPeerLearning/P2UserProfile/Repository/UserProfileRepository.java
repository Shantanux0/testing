package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository;

import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserProfileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfileEntity, Long> {

    Optional<UserProfileEntity> findByUserId(Long userId);

    Optional<UserProfileEntity> findByUser_Email(String email);

    boolean existsByUserId(Long userId);

    @Query("SELECT p FROM UserProfileEntity p WHERE " +
            "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.skills) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<UserProfileEntity> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
