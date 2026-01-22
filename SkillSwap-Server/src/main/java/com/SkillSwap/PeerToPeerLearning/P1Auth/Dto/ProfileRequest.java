package com.SkillSwap.PeerToPeerLearning.P1Auth.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest {
    private String name ;
    private String email ;
    private String password ;

}
