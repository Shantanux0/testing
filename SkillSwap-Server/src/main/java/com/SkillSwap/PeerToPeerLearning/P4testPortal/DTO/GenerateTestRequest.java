package com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GenerateTestRequest {

    @NotBlank(message = "Skill name is required")
    private String skillName; // e.g., "Java" or "Spring Boot"
}
