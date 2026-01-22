package com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestQuestion {
    private Integer questionNumber;
    private String question;
    private List<String> options; // 4 options
    private String correctAnswer; // Hidden from client
}