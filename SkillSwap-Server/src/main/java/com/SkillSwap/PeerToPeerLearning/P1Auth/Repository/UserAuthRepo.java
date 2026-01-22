package com.SkillSwap.PeerToPeerLearning.P1Auth.Repository;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAuthRepo extends JpaRepository<UserAuthEntity,Long> {
    Optional<UserAuthEntity> findByEmail(String email);
    Boolean existsByEmail(String email);
}
