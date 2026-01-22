package com.SkillSwap.PeerToPeerLearning.P4testPortal.Controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class QualificationStatusResponse {
    private String skillName;
    private Boolean isQualified;
}

