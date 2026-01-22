package com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Controller;

import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Dto.SwapMatchDto;
import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Service.SkillMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final SkillMatchService skillMatchService;

    /**
     * NEW ENDPOINT: Find bidirectional skill swap matches
     * Example: GET /api/matches/swap?skillToLearn=Java&skillToTeach=Spring%20Boot
     */
    @GetMapping("/swap")
    public ResponseEntity<List<SwapMatchDto>> findSwapMatches(
            @RequestParam String skillToLearn,
            @RequestParam String skillToTeach,
            Authentication authentication) {

        String email = authentication.getName();
        List<SwapMatchDto> matches = skillMatchService.findSwapMatches(email, skillToLearn, skillToTeach);
        return ResponseEntity.ok(matches);
    }
}
