package com.SkillSwap.PeerToPeerLearning.P6Feedback.Repository;

import com.SkillSwap.PeerToPeerLearning.P6Feedback.Entity.FeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackEntity, Long> {

    List<FeedbackEntity> findByRevieweeId(Long revieweeId);

    @Query("SELECT AVG(f.rating) FROM FeedbackEntity f WHERE f.reviewee.id = :revieweeId")
    Double getAverageRatingForUser(@Param("revieweeId") Long revieweeId);
}
