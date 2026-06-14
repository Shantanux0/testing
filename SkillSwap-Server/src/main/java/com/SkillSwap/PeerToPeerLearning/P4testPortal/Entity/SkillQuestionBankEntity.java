package com.SkillSwap.PeerToPeerLearning.P4testPortal.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_question_bank")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillQuestionBankEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String skillName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionsJson;
}
