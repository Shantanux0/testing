package com.SkillSwap.PeerToPeerLearning.P7Session.Dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateAgendaRequest {
    private List<AgendaItemRequest> items;

    @Data
    public static class AgendaItemRequest {
        private String topic;
        private String description;
        private Integer orderIndex;
    }
}
